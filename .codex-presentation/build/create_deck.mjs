import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const workspaceDir = "/Users/elnrsahar/Desktop/music_website";
const SKILL_DIR = "/Users/elnrsahar/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const TMP_DIR = path.join(workspaceDir, ".codex-presentation", "build");
const FINAL_PPTX = path.join(workspaceDir, "presentation", "Babalar_uni_sait_tanystyrylymy.pptx");
const RUNTIME_PYTHON = "/Users/elnrsahar/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
process.env.RUNTIME_NODE_MODULES = "/Users/elnrsahar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";

const { resolvePresentationFont, finalizePresentation } = await import(
  pathToFileURL(path.join(SKILL_DIR, "container_tools", "artifact_tool_utils.mjs")).href,
);

await fs.mkdir(TMP_DIR, { recursive: true });
await fs.mkdir(path.dirname(FINAL_PPTX), { recursive: true });

const fontFamily = resolvePresentationFont({ fontFamily: "Arial" });
const W = 1280;
const H = 720;
const C = {
  bg: "#FAF7F2",
  bgAlt: "#F4EEE5",
  surface: "#FFFFFF",
  ink: "#1E2A2D",
  soft: "#526267",
  muted: "#78888C",
  line: "#E3D8C9",
  accent: "#B4552D",
  accentSoft: "#F7E7DE",
  teal: "#1F6F6B",
  tealDark: "#155450",
  tealSoft: "#E2F0EE",
  gold: "#C89A3C",
  goldSoft: "#F8EFDC",
};

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

const p = (...parts) => path.join(workspaceDir, ...parts);
const files = {
  logo: p("public", "site-icon.svg"),
  hero: p("public", "img", "hero.jpg"),
  dombyra: p("public", "img", "dombyra.jpg"),
  kobyz: p("public", "img", "kobyz.jpg"),
  zhetigen: p("public", "img", "zhetigen.jpg"),
  home: p(".codex-presentation", "assets", "screens", "home.png"),
  instruments: p(".codex-presentation", "assets", "screens", "instruments.png"),
  legends: p(".codex-presentation", "assets", "screens", "legends.png"),
  history: p(".codex-presentation", "assets", "screens", "history.png"),
  games: p(".codex-presentation", "assets", "screens", "games.png"),
  glossary: p(".codex-presentation", "assets", "screens", "glossary.png"),
  authors: p(".codex-presentation", "assets", "screens", "authors.png"),
};

const bytes = {};
for (const [key, file] of Object.entries(files)) bytes[key] = await fs.readFile(file);

function contentType(file) {
  if (file.endsWith(".png")) return "image/png";
  if (file.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
}

function addShape(slide, geometry, position, fill, line = { fill: "none", width: 0 }, extra = {}) {
  return slide.shapes.add({ geometry, position, fill, line, ...extra });
}

function addText(slide, text, position, opts = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position,
    fill: "none",
    line: { fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    typeface: fontFamily,
    fontSize: opts.fontSize ?? 24,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
    autoFit: opts.autoFit ?? "shrinkText",
    lineSpacing: opts.lineSpacing ?? 1.12,
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  };
  return shape;
}

function addImage(slide, key, position, opts = {}) {
  return slide.images.add({
    blob: bytes[key],
    contentType: contentType(files[key]),
    alt: opts.alt ?? "",
    fit: opts.fit ?? "cover",
    position,
    ...(opts.crop ? { crop: opts.crop } : {}),
    ...(opts.geometry ? { geometry: opts.geometry } : {}),
    ...(opts.borderRadius ? { borderRadius: opts.borderRadius } : {}),
  });
}

function addFooter(slide, number) {
  addShape(slide, "line", { left: 58, top: 681, width: 1164, height: 0 }, "none", {
    style: "solid", fill: C.line, width: 1,
  });
  addText(slide, "Бабалар үні", { left: 58, top: 690, width: 190, height: 18 }, {
    fontSize: 13, bold: true, color: C.muted,
  });
  addText(slide, String(number).padStart(2, "0"), { left: 1168, top: 688, width: 54, height: 20 }, {
    fontSize: 14, bold: true, color: C.accent, align: "right",
  });
}

function addHeader(slide, number, title, eyebrow) {
  slide.background.fill = C.bg;
  addImage(slide, "logo", { left: 58, top: 30, width: 34, height: 34 }, {
    fit: "contain", alt: "Бабалар үні белгісі",
  });
  addText(slide, "БАБАЛАР ҮНІ", { left: 104, top: 35, width: 240, height: 24 }, {
    fontSize: 14, bold: true, color: C.teal,
  });
  if (eyebrow) {
    addText(slide, eyebrow.toUpperCase(), { left: 930, top: 36, width: 292, height: 20 }, {
      fontSize: 13, bold: true, color: C.accent, align: "right",
    });
  }
  addShape(slide, "line", { left: 58, top: 78, width: 1164, height: 0 }, "none", {
    style: "solid", fill: C.line, width: 1,
  });
  addText(slide, title, { left: 58, top: 96, width: 1164, height: 58 }, {
    fontSize: 42, bold: true, color: C.ink,
  });
  addFooter(slide, number);
}

function addBulletList(slide, items, x, y, width, fontSize = 23, gap = 58, color = C.ink) {
  items.forEach((item, i) => {
    const yy = y + i * gap;
    addShape(slide, "ellipse", { left: x, top: yy + 8, width: 12, height: 12 }, C.accent, { fill: "none", width: 0 });
    addText(slide, item, { left: x + 26, top: yy, width: width - 26, height: gap - 4 }, {
      fontSize, color, lineSpacing: 1.08,
    });
  });
}

function addScreenshotFrame(slide, key, position, alt) {
  addShape(slide, "roundRect", {
    left: position.left - 8,
    top: position.top - 8,
    width: position.width + 16,
    height: position.height + 16,
  }, C.surface, { style: "solid", fill: C.line, width: 1 }, {
    borderRadius: 20,
    shadow: "shadow-md",
  });
  addImage(slide, key, position, {
    fit: "cover",
    geometry: "roundRect",
    borderRadius: 14,
    alt,
  });
}

function addMetric(slide, value, label, x, y, width, color = C.accent) {
  addText(slide, value, { left: x, top: y, width, height: 52 }, {
    fontSize: 42, bold: true, color, align: "center",
  });
  addText(slide, label, { left: x, top: y + 54, width, height: 48 }, {
    fontSize: 17, color: C.soft, align: "center", lineSpacing: 1.05,
  });
}

// 1. Мұқаба
{
  const slide = presentation.slides.add();
  slide.background.fill = C.bg;
  addImage(slide, "hero", { left: 812, top: 0, width: 468, height: 720 }, {
    fit: "cover", alt: "Қазақ даласындағы домбыра бейнесі",
  });
  addShape(slide, "rect", { left: 790, top: 0, width: 34, height: 720 }, C.teal, { fill: "none", width: 0 });
  addImage(slide, "logo", { left: 72, top: 66, width: 64, height: 64 }, {
    fit: "contain", alt: "Бабалар үні белгісі",
  });
  addText(slide, "ҒЫЛЫМИ ЖОБА ПРЕЗЕНТАЦИЯСЫ", { left: 156, top: 85, width: 540, height: 26 }, {
    fontSize: 16, bold: true, color: C.accent,
  });
  addText(slide, "Бабалар үні\nцифрлық әлемде", { left: 72, top: 170, width: 650, height: 150 }, {
    fontSize: 58, bold: true, color: C.ink, lineSpacing: 0.95,
  });
  addText(slide, "Қазақтың ұлттық музыкалық аспаптарының\nинтерактивті онлайн энциклопедиясы", { left: 76, top: 342, width: 630, height: 82 }, {
    fontSize: 27, color: C.soft, lineSpacing: 1.15,
  });
  addShape(slide, "line", { left: 76, top: 468, width: 110, height: 0 }, "none", {
    style: "solid", fill: C.gold, width: 4,
  });
  addText(slide, "Жоба авторы  Дөңесова Асылай Кайсарқызы\nҒылыми жетекші  Демеуова Тогжан Абдимуратовна", { left: 76, top: 490, width: 640, height: 72 }, {
    fontSize: 20, color: C.ink, lineSpacing: 1.3,
  });
  addText(slide, "2026", { left: 76, top: 644, width: 160, height: 28 }, {
    fontSize: 18, bold: true, color: C.teal,
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: жоба сайты және жоба материалдары. Мұқаба суреті сайттың public/img/hero.jpg файлынан алынды.");
}

// 2. Жоба мақсаты
{
  const slide = presentation.slides.add();
  addHeader(slide, 2, "Жобаның мақсаты мен аудиториясы", "жоба туралы");
  addText(slide, "Негізгі мақсат", { left: 58, top: 182, width: 390, height: 34 }, {
    fontSize: 24, bold: true, color: C.accent,
  });
  addText(slide, "Ұлттық аспаптарды оқушыға қарапайым тілмен таныстыру және мәдени мұраны цифрлық ортада қолжетімді ету.", { left: 58, top: 224, width: 400, height: 120 }, {
    fontSize: 25, color: C.ink, lineSpacing: 1.18,
  });
  addText(slide, "Кімге арналған", { left: 58, top: 374, width: 390, height: 34 }, {
    fontSize: 24, bold: true, color: C.teal,
  });
  addBulletList(slide, [
    "1–6 сынып оқушыларына",
    "Музыка және тарих сабақтарына",
    "Өздігінен ізденетін пайдаланушыға",
  ], 58, 420, 400, 21, 54);
  addScreenshotFrame(slide, "home", { left: 500, top: 180, width: 722, height: 408 }, "Сайттың басты беті");
  addText(slide, "Басты бет жобаның идеясын, авторларын және негізгі мүмкіндіктерін бірден көрсетеді.", { left: 500, top: 612, width: 722, height: 46 }, {
    fontSize: 18, color: C.soft, align: "center",
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған басты бет скриншоты және жоба құжаттамасы.");
}

// 3. Сайт құрылымы
{
  const slide = presentation.slides.add();
  addHeader(slide, 3, "Сайттың құрылымы", "навигация");
  addText(slide, "Барлық бөлім бір мәзір арқылы байланысқан. Оқушы ақпараттан тапсырмаға, одан ойын мен сөздікке еркін өте алады.", { left: 58, top: 166, width: 1164, height: 54 }, {
    fontSize: 22, color: C.soft, align: "center",
  });
  const nodes = [
    ["Аспаптар", "12 аспап, 5 топ", C.accent],
    ["Аңыздар", "6 халық аңызы", C.gold],
    ["Тарих", "8 тарихи кезең", C.teal],
    ["Ойындар", "4 оқу ойыны", C.accent],
    ["Сөздік", "31 түсінік", C.gold],
    ["Жоба туралы", "мақсат пен авторлар", C.teal],
  ];
  const positions = [
    [78, 292], [472, 292], [866, 292],
    [78, 472], [472, 472], [866, 472],
  ];
  nodes.forEach(([name, desc, color], i) => {
    const [x, y] = positions[i];
    addText(slide, String(i + 1).padStart(2, "0"), { left: x, top: y, width: 54, height: 42 }, {
      fontSize: 30, bold: true, color,
    });
    addShape(slide, "line", { left: x + 62, top: y + 22, width: 30, height: 0 }, "none", {
      style: "solid", fill: color, width: 3,
    });
    addText(slide, name, { left: x + 108, top: y - 2, width: 250, height: 38 }, {
      fontSize: 27, bold: true, color: C.ink,
    });
    addText(slide, desc, { left: x + 108, top: y + 42, width: 250, height: 40 }, {
      fontSize: 18, color: C.muted,
    });
  });
  addShape(slide, "line", { left: 58, top: 432, width: 1164, height: 0 }, "none", {
    style: "solid", fill: C.line, width: 1,
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: сайттың негізгі навигациясы мен бөлімдеріндегі нақты мазмұн саны.");
}

// 4. Аспаптар каталоги
{
  const slide = presentation.slides.add();
  addHeader(slide, 4, "Аспаптар каталогы", "негізгі бөлім");
  addScreenshotFrame(slide, "instruments", { left: 58, top: 176, width: 746, height: 421 }, "Ұлттық аспаптар каталогы");
  addText(slide, "Каталог мүмкіндіктері", { left: 858, top: 186, width: 320, height: 36 }, {
    fontSize: 25, bold: true, color: C.accent,
  });
  addBulletList(slide, [
    "Аспаптарды бес топ бойынша сүзу",
    "Атауы бойынша жылдам іздеу",
    "Таңдаулы аспаптарды сақтау",
    "Екі немесе үш аспапты салыстыру",
  ], 858, 248, 330, 21, 72);
  addText(slide, "Әр карточкадан аспаптың жеке бетіне өтуге болады.", { left: 858, top: 566, width: 330, height: 62 }, {
    fontSize: 19, bold: true, color: C.teal, lineSpacing: 1.12,
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Аспаптар» бетінің скриншоты.");
}

// 5. Аспап беті және тыңдалым
{
  const slide = presentation.slides.add();
  addHeader(slide, 5, "Аспапты танып, үнін тыңдау", "интерактивті оқу");
  addText(slide, "Әр аспаптың бетінде қысқаша сипаттама, жасалу материалы, тарихы және қолданылуы беріледі. «Үнін тыңдау» батырмасы нақты орындауды бейне арқылы ашады.", { left: 58, top: 168, width: 540, height: 135 }, {
    fontSize: 24, color: C.ink, lineSpacing: 1.18,
  });
  addText(slide, "Тыңдалым жүктелген кезде айналу индикаторы көрсетіледі. Бейне ашық түсті ортада көрінеді.", { left: 58, top: 340, width: 500, height: 96 }, {
    fontSize: 21, color: C.teal, bold: true, lineSpacing: 1.18,
  });
  addImage(slide, "dombyra", { left: 648, top: 174, width: 188, height: 432 }, {
    fit: "cover", geometry: "roundRect", borderRadius: 18, alt: "Домбыра",
  });
  addImage(slide, "kobyz", { left: 864, top: 174, width: 188, height: 432 }, {
    fit: "cover", geometry: "roundRect", borderRadius: 18, alt: "Қобыз",
  });
  addImage(slide, "zhetigen", { left: 1080, top: 174, width: 142, height: 432 }, {
    fit: "cover", geometry: "roundRect", borderRadius: 18, alt: "Жетіген",
  });
  addText(slide, "Домбыра", { left: 648, top: 620, width: 188, height: 28 }, { fontSize: 18, bold: true, align: "center" });
  addText(slide, "Қобыз", { left: 864, top: 620, width: 188, height: 28 }, { fontSize: 18, bold: true, align: "center" });
  addText(slide, "Жетіген", { left: 1080, top: 620, width: 142, height: 28 }, { fontSize: 18, bold: true, align: "center" });
  slide.speakerNotes.textFrame.setText("Дереккөз: сайттың аспап беттері, AUDIO_SOURCES.md және public/img ішіндегі аспап суреттері.");
}

// 6. Аңыздар
{
  const slide = presentation.slides.add();
  addHeader(slide, 6, "Аспаптар туралы халық аңыздары", "мәдени мұра");
  addScreenshotFrame(slide, "legends", { left: 58, top: 176, width: 746, height: 421 }, "Халық аңыздары бөлімі");
  addText(slide, "6 аңыз", { left: 858, top: 186, width: 320, height: 48 }, {
    fontSize: 36, bold: true, color: C.accent,
  });
  addText(slide, "Аңыздар аспаптың пайда болуын, халық жадындағы орнын және өнердің тәрбиелік мәнін түсіндіреді.", { left: 858, top: 248, width: 330, height: 110 }, {
    fontSize: 22, color: C.ink, lineSpacing: 1.16,
  });
  addBulletList(slide, [
    "Қорқыт ата және қобыз",
    "Жетігеннің жеті күйі",
    "Ақсақ құлан күйінің аңызы",
    "Садақтың әні",
  ], 858, 390, 330, 19, 54, C.soft);
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Аңыздар» бетінің скриншоты және src/data/legends.ts.");
}

// 7. Тарих
{
  const slide = presentation.slides.add();
  addHeader(slide, 7, "Дала үнінің ғасырлар жолы", "тарих");
  addScreenshotFrame(slide, "history", { left: 58, top: 176, width: 746, height: 421 }, "Аспаптар тарихы бөлімі");
  addText(slide, "8 тарихи кезең", { left: 858, top: 186, width: 330, height: 48 }, {
    fontSize: 34, bold: true, color: C.teal,
  });
  addText(slide, "Хронология ұлттық аспаптардың аңшылық құралдарынан оркестр мен цифрлық кеңістікке дейінгі дамуын көрсетеді.", { left: 858, top: 252, width: 330, height: 120 }, {
    fontSize: 22, color: C.ink, lineSpacing: 1.17,
  });
  addText(slide, "Б.з.б. І мыңжылдық", { left: 858, top: 414, width: 330, height: 30 }, {
    fontSize: 19, bold: true, color: C.accent,
  });
  addShape(slide, "line", { left: 872, top: 464, width: 0, height: 84 }, "none", {
    style: "solid", fill: C.gold, width: 3,
  });
  addText(slide, "аңшылар дәуірінен", { left: 892, top: 454, width: 270, height: 28 }, {
    fontSize: 18, color: C.soft,
  });
  addText(slide, "XXI ғасырдағы цифрлық жаңғыруға дейін", { left: 892, top: 506, width: 285, height: 52 }, {
    fontSize: 18, color: C.soft,
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Тарих» бетінің скриншоты және src/data/timeline.ts.");
}

// 8. Ойындар
{
  const slide = presentation.slides.add();
  addHeader(slide, 8, "Ойнап жүріп үйрену", "білімді бекіту");
  addScreenshotFrame(slide, "games", { left: 58, top: 176, width: 746, height: 421 }, "Ойындар және викторина бөлімі");
  addText(slide, "4 оқу ойыны", { left: 858, top: 186, width: 330, height: 48 }, {
    fontSize: 34, bold: true, color: C.accent,
  });
  const games = [
    ["Викторина", "әр айналымда 10 сұрақ"],
    ["Жұп тап", "есте сақтауды жаттықтырады"],
    ["Тобына бөл", "аспаптарды жіктеуді үйретеді"],
    ["Сөз құрастыр", "аспап атауларын бекітеді"],
  ];
  games.forEach(([name, desc], i) => {
    const yy = 262 + i * 82;
    addText(slide, name, { left: 858, top: yy, width: 310, height: 30 }, {
      fontSize: 21, bold: true, color: i % 2 ? C.teal : C.ink,
    });
    addText(slide, desc, { left: 858, top: yy + 34, width: 330, height: 34 }, {
      fontSize: 17, color: C.muted,
    });
  });
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Ойындар» бетінің скриншоты және src/components/GamesTabs.tsx.");
}

// 9. Сөздік
{
  const slide = presentation.slides.add();
  addHeader(slide, 9, "Түсініктер сөздігі", "анықтамалар");
  addScreenshotFrame(slide, "glossary", { left: 58, top: 176, width: 746, height: 421 }, "Түсініктер сөздігі бөлімі");
  addText(slide, "31 музыкалық түсінік", { left: 858, top: 186, width: 340, height: 78 }, {
    fontSize: 34, bold: true, color: C.teal,
  });
  addText(slide, "Сөздік күрделі ұғымдарды оқушыға қысқа әрі түсінікті тілмен береді.", { left: 858, top: 280, width: 330, height: 88 }, {
    fontSize: 22, color: C.ink, lineSpacing: 1.16,
  });
  addBulletList(slide, [
    "Сөз бойынша іздеу",
    "Әліпби арқылы жылдам өту",
    "Басып шығаруға ыңғайлы нұсқа",
  ], 858, 406, 330, 20, 65);
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Сөздік» бетінің скриншоты және src/data/glossary.ts.");
}

// 10. Авторлар және жасалу үдерісі
{
  const slide = presentation.slides.add();
  addHeader(slide, 10, "Жоба авторлары және жұмыс үдерісі", "ғылыми жоба");
  addText(slide, "Жоба авторы", { left: 58, top: 184, width: 340, height: 34 }, {
    fontSize: 21, bold: true, color: C.accent,
  });
  addText(slide, "Дөңесова Асылай\nКайсарқызы", { left: 58, top: 226, width: 350, height: 74 }, {
    fontSize: 28, bold: true, color: C.ink, lineSpacing: 1.05,
  });
  addText(slide, "Ғылыми жетекші", { left: 58, top: 342, width: 340, height: 34 }, {
    fontSize: 21, bold: true, color: C.gold,
  });
  addText(slide, "Демеуова Тогжан\nАбдимуратовна", { left: 58, top: 384, width: 360, height: 74 }, {
    fontSize: 28, bold: true, color: C.ink, lineSpacing: 1.05,
  });
  addText(slide, "Сайт ЖИ көмегімен жасалды. Мазмұнды таңдау мен тексеруді жоба авторы және ғылыми жетекші жүргізді.", { left: 58, top: 506, width: 370, height: 108 }, {
    fontSize: 20, color: C.teal, bold: true, lineSpacing: 1.16,
  });
  addScreenshotFrame(slide, "authors", { left: 474, top: 176, width: 748, height: 421 }, "Жоба авторлары туралы бет");
  slide.speakerNotes.textFrame.setText("Дереккөз: пайдаланушы ұсынған «Жоба туралы» бетінің скриншоты және src/data/authors.ts.");
}

// 11. Қорытынды
{
  const slide = presentation.slides.add();
  slide.background.fill = C.tealDark;
  addImage(slide, "logo", { left: 608, top: 48, width: 64, height: 64 }, {
    fit: "contain", alt: "Бабалар үні белгісі",
  });
  addText(slide, "Жобаның нәтижесі", { left: 80, top: 140, width: 1120, height: 58 }, {
    fontSize: 44, bold: true, color: C.surface, align: "center",
  });
  addText(slide, "Ұлттық музыкалық мұраны оқуға, тыңдауға және ойын арқылы бекітуге арналған біртұтас білім беру ортасы жасалды.", { left: 190, top: 216, width: 900, height: 72 }, {
    fontSize: 24, color: "#E9F5F3", align: "center", lineSpacing: 1.18,
  });
  const metrics = [
    ["12", "ұлттық аспап"],
    ["5", "аспап тобы"],
    ["6", "халық аңызы"],
    ["8", "тарихи кезең"],
    ["4", "оқу ойыны"],
    ["31", "түсінік"],
  ];
  metrics.forEach(([value, label], i) => {
    const x = 72 + i * 190;
    addText(slide, value, { left: x, top: 346, width: 176, height: 60 }, {
      fontSize: 46, bold: true, color: i % 2 ? "#FFE2A0" : "#F7B390", align: "center",
    });
    addText(slide, label, { left: x, top: 416, width: 176, height: 40 }, {
      fontSize: 18, color: C.surface, align: "center",
    });
    if (i < metrics.length - 1) {
      addShape(slide, "line", { left: x + 182, top: 350, width: 0, height: 94 }, "none", {
        style: "solid", fill: "#3B827E", width: 1,
      });
    }
  });
  addShape(slide, "line", { left: 456, top: 536, width: 368, height: 0 }, "none", {
    style: "solid", fill: C.gold, width: 2,
  });
  addText(slide, "Назарларыңызға рақмет", { left: 290, top: 566, width: 700, height: 56 }, {
    fontSize: 34, bold: true, color: C.surface, align: "center",
  });
  addText(slide, "«Бабалар үні»", { left: 490, top: 646, width: 300, height: 30 }, {
    fontSize: 17, bold: true, color: "#BFDAD7", align: "center",
  });
  slide.speakerNotes.textFrame.setText("Қорытынды көрсеткіштер сайттағы нақты бөлімдер мен мазмұн санынан алынған.");
}

const candidatePath = path.join(TMP_DIR, "candidate.pptx");
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);

const montage = await presentation.export({ format: "webp", montage: true, scale: 0.6 });
await fs.writeFile(path.join(TMP_DIR, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));

for (let i = 0; i < presentation.slides.items.length; i++) {
  const slide = presentation.slides.items[i];
  const preview = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(TMP_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`), new Uint8Array(await preview.arrayBuffer()));
}

const requirements = {
  explicitTotalSlideCount: 11,
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
};
const fontPolicy = { basis: "design", families: [fontFamily] };
const stagingDir = path.join(workspaceDir, ".codex-finalizer");
await fs.mkdir(stagingDir, { recursive: true });

await finalizePresentation({
  ...requirements,
  workspaceDir,
  candidatePath,
  finalPath: FINAL_PPTX,
  pythonExecutable: RUNTIME_PYTHON,
  integrityValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_package_integrity.py"),
  layoutValidatorPath: path.join(SKILL_DIR, "container_tools", "inspect_presentation_layout_geometry.py"),
  layoutArgs: [
    "--expected-slide-size-emu", "12192000,6858000",
    "--validate-bullet-geometry",
    "--validate-heading-fit",
  ],
  requiredNativeTableOwnerSlides: [],
  requiredNativeChartOwnerSlides: [],
  fontPolicy,
  verifyArtifactToolImport: true,
  receiptPath: path.join(stagingDir, "Babalar_uni_sait_tanystyrylymy.validation.json"),
});

console.log(FINAL_PPTX);
