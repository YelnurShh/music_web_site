#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Сайт беттерін бірдей қалыппен (хидер/футер/скрипттер) жасап шығаратын көмекші құрал."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

HEAD = """<!DOCTYPE html>
<html lang="kk" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<meta name="description" content="__DESC__">
<meta name="theme-color" content="#b4552d">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎶</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles/main.css">
<script>
  /* Түс режимі мен қаріп өлшемін бет ашылғанша тез орнату */
  (function () {
    try {
      var t = JSON.parse(localStorage.getItem("kz_theme") || '"light"');
      document.documentElement.setAttribute("data-theme", t === "dark" ? "dark" : "light");
      var s = JSON.parse(localStorage.getItem("kz_scale") || "1");
      if (s && s !== 1) document.documentElement.style.setProperty("--ui-scale", s);
    } catch (e) {}
  })();
</script>
</head>
<body data-page="__PAGE__">

<a class="skip-link" href="#main">Негізгі мазмұнға өту</a>
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<header class="site-header" id="siteHeader"></header>

<main id="main">
"""

FOOT = """
</main>

<footer class="site-footer" id="siteFooter"></footer>
<button class="to-top" id="toTop" aria-label="Беттің басына қайту">↑</button>
<div class="toast-wrap" id="toastWrap" aria-live="polite"></div>

<div class="modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal">
    <div class="modal-head">
      <h2 id="modalTitle" style="margin:0">Ақпарат</h2>
      <button class="modal-close" id="modalClose" aria-label="Терезені жабу">✕</button>
    </div>
    <div id="modalBody"></div>
  </div>
</div>

<noscript>
  <div class="container" style="padding:2rem 0">
    <div class="callout callout-accent">
      <h3>JavaScript өшірулі</h3>
      <p>Сайттың толық жұмыс істеуі үшін браузерде JavaScript қосулы болуы керек.</p>
    </div>
  </div>
</noscript>

<script src="scripts/data.js"></script>
<script src="scripts/synth.js"></script>
<script src="scripts/app.js"></script>
<script src="scripts/games.js"></script>
</body>
</html>
"""

CHIPS = """          <button class="chip" data-group="all">Барлығы (14)</button>
          <button class="chip" data-group="string">🪕 Ішекті-шертпелі</button>
          <button class="chip" data-group="bow">🎻 Ыспалы</button>
          <button class="chip" data-group="wind">🎺 Үрмелі</button>
          <button class="chip" data-group="perc">🥁 Соқпалы-ұрмалы</button>
          <button class="chip" data-group="noise">🔔 Шулы және тілшекті</button>"""

PAGES = {}

# ---------------------------------------------------------------- Аспаптар каталогы
PAGES["aspaptar"] = dict(
    title="Аспаптар — Бабалар үні",
    desc="Қазақтың 14 ұлттық музыкалық аспабы: домбыра, қобыз, жетіген, сыбызғы, дауылпаз және басқалары. Топ бойынша сүзгі, іздеу және салыстыру мүмкіндігі бар.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Аспаптар</span>
      </nav>
      <h1>Қазақтың ұлттық аспаптары</h1>
      <p class="lede">Осы бетте 14 аспап жинақталған. Топ бойынша сүзгілеп, аты бойынша іздеп,
        қалаған аспапты таңдаулыға қосып, тіпті екі-үш аспапты бір-бірімен салыстыра аласыз.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="toolbar">
        <div class="filters" id="catFilters" role="group" aria-label="Аспап топтары бойынша сүзгі">
""" + CHIPS + """
        </div>

        <div class="field">
          <label for="catSearch">🔍 Іздеу:</label>
          <input id="catSearch" type="search" placeholder="аспап атын жазыңыз...">
        </div>

        <div class="field">
          <label for="catSort">Реттеу:</label>
          <select id="catSort">
            <option value="name">Аты бойынша (әліпби)</option>
            <option value="group">Тобы бойынша</option>
            <option value="latin">Латын әліпбиімен</option>
            <option value="rev">Кері ретпен</option>
          </select>
        </div>

        <label class="field" style="cursor:pointer">
          <input type="checkbox" id="favOnlyInput"> ⭐ Тек таңдаулылар
        </label>

        <button class="btn btn-sm btn-ghost" id="compareBtn" disabled>⚖️ Салыстыру (0)</button>
      </div>

      <p class="count-badge" id="catCount" aria-live="polite"></p>
      <div class="grid grid-3" id="catalogBox" style="margin-top:1rem"></div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="grid grid-3">
        <div class="card card-plain reveal">
          <span class="card-icon" aria-hidden="true">⚖️</span>
          <h3>Салыстыру деген не?</h3>
          <p class="ic-desc">Карточкадағы «Салыстыру» белгісін қойып, 2–3 аспапты таңдаңыз. Содан кейін
            «⚖️ Салыстыру» батырмасын бассаңыз — олардың айырмашылығы кесте түрінде көрсетіледі.</p>
        </div>
        <div class="card card-plain reveal">
          <span class="card-icon" aria-hidden="true">⭐</span>
          <h3>Таңдаулылар</h3>
          <p class="ic-desc">Ұнаған аспапты «☆» белгісімен таңдаулыға қосыңыз. Ол басты бетте де,
            осы бетте де «Тек таңдаулылар» сүзгісінде сақталады.</p>
        </div>
        <div class="card card-plain reveal">
          <span class="card-icon" aria-hidden="true">🔈</span>
          <h3>Үнін тыңдау</h3>
          <p class="ic-desc">Әр карточкада «Үнін тыңдау» батырмасы бар. Үн компьютерде жасалған жуық үлгі —
            ол аспаптың реңін (жіңішке, қоңыр, ырғақты) сезінуге көмектеседі.</p>
        </div>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Аспап беті
PAGES["aspap"] = dict(
    title="Аспап туралы — Бабалар үні",
    desc="Қазақтың ұлттық музыкалық аспабы туралы толық ақпарат: бөлшектері, үні, тарихы, аңызы және дыбыс пернелері.",
    body="""
  <section class="section">
    <div class="container" id="detailBox">
      <div class="empty-state">Аспап туралы ақпарат жүктеліп жатыр...</div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="callout callout-gold">
        <h3>💡 Оқушыға кеңес</h3>
        <p>Бетті жоғарыдан төмен қарай ретімен оқыңыз: алдымен аспаптың суреті мен жалпы сипаты,
          содан кейін бөлшектері, үні, қолданылуы және аңызы. Соңында дыбыс пернелерін басып көріңіз —
          осылайша есте жақсы сақталады.</p>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Аңыздар
PAGES["anyzdar"] = dict(
    title="Халық аңыздары — Бабалар үні",
    desc="Қазақтың музыкалық аспаптары туралы 6 халық аңызы: Қорқыт ата, жетігеннің жеті күйі, Ақсақ құлан, шертер, адырна және дауылпаз.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Аңыздар</span>
      </nav>
      <h1>Аспаптар туралы халық аңыздары</h1>
      <p class="lede">Аңыз — халық ауызша айтып жеткізген әңгіме. Оның ішінде шын тарих та,
        қиял да болады. Төмендегі аңыздың атын бассаңыз, мәтіні ашылады. «🔊 Дыбыстап оқу»
        батырмасымен аңызды дауыстап тыңдауға болады.</p>
      <div class="row" style="margin-top:1rem">
        <button class="btn btn-sm btn-ghost" id="expandAllLegend">📖 Барлығын ашу</button>
        <a class="btn btn-sm btn-ghost" href="oiyn.html#quiz">🎯 Аңыздар бойынша сұрақтар</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="stack" id="legendsBox"></div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="grid grid-2">
        <div class="card card-plain">
          <h3>📌 Аңызды оқығанда не істеу керек?</h3>
          <ol style="margin:0;padding-left:1.2rem">
            <li>Аңызды түгел оқып шығыңыз.</li>
            <li>Қай аспап туралы екенін анықтаңыз.</li>
            <li>Осы беттегі аспап туралы бөлімді ашып, қосымша мәлімет оқыңыз.</li>
            <li>Аңыздың соңындағы «💭 Ой» бөлігін бірге талқылаңыз.</li>
          </ol>
        </div>
        <div class="card card-plain">
          <h3>🗣️ Сыныпта талқылауға арналған сұрақтар</h3>
          <ul style="margin:0;padding-left:1.2rem">
            <li>Аңыздағы басты кейіпкер неге осы аспапты таңдады?</li>
            <li>Аспаптың үні адамның көңіл-күйін қалай жеткізеді?</li>
            <li>Бүгінгі күнмен салыстырғанда қандай айырмашылық бар?</li>
            <li>Сіз қай аспап туралы өз аңызыңызды жазар едіңіз?</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Тарих
PAGES["tarih"] = dict(
    title="Аспаптар тарихы — Бабалар үні",
    desc="Қазақтың музыкалық аспаптарының тарихы: ежелгі дәуірден бүгінгі цифрлық әлемге дейінгі кезеңдер және аспап топтарының кестесі.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Тарих</span>
      </nav>
      <h1>Аспаптар тарихы: садақтан оркестрге</h1>
      <p class="lede">Музыкалық аспаптар бір күнде пайда болған жоқ. Олар мыңдаған жыл бойы халықтың
        тұрмысымен бірге өзгеріп, дамып отырды. Төмендегі кезеңдерді ретімен оқып шығыңыз.</p>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <ol class="timeline" id="timelineBox"></ol>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Кесте</span>
        <h2>Аспап топтары және олардың қолданылуы</h2>
        <p class="lede">Топ атауын білу маңызды: егер үрмелі аспаптың аты аталса, онда ол ауа үрлеп
          ойналатынын бірден білесіз.</p>
      </div>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Аспап топтары, сипаттамасы және құрамы</caption>
          <thead>
            <tr><th>Топ</th><th>Топтың сипаттамасы</th><th>Қандай аспаптар кіреді</th></tr>
          </thead>
          <tbody id="historyTable"></tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid-2">
        <div class="card">
          <span class="card-icon" aria-hidden="true">🏛️</span>
          <h3>Оркестр тарихы</h3>
          <p>1934 жылы Құрманғазы атындағы Қазақ ұлттық халық аспаптар оркестрі құрылды.
            Осы кезеңнен бастап көне аспаптар қайта жаңғыртылып, нотаға түсірілді. Домбыра,
            қобыз, жетіген, сыбызғы сияқты аспаптар үлкен сахнаға шықты.</p>
        </div>
        <div class="card">
          <span class="card-icon" aria-hidden="true">🎓</span>
          <h3>Зерттеуші ғалымдар</h3>
          <p>Аспаптардың тарихын ғалымдар зерттеген. Мысалы, Болат Сарыбаев кернейдің қазақта
            болғанын ғылыми жолмен дәлелдеп, жетігеннің ноталық жүйесін анықтады.</p>
        </div>
        <div class="card">
          <span class="card-icon" aria-hidden="true">🌍</span>
          <h3>Бүгінгі күн</h3>
          <p>Қазір қазақтың ұлттық аспаптары тек Қазақстанда емес, шетелдерде де танымал.
            Шаңқобыз бен жетіген әлемдік фестивальдерде ойналады, ал ұлттық аспап үлгілері
            электронды музыкада қолданылады.</p>
        </div>
        <div class="card">
          <span class="card-icon" aria-hidden="true">🖨️</span>
          <h3>Сабаққа дайын материал</h3>
          <p>Бұл бетті басып шығарып, сабақта үлестірме материал ретінде қолдануға болады.
            «Басып шығару» батырмасын бассаңыз, бет мәзірсіз, таза күйінде шығады.</p>
          <button class="btn btn-sm" id="printHistory">🖨️ Басып шығару</button>
        </div>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Ойындар
PAGES["oiyn"] = dict(
    title="Ойындар мен викторина — Бабалар үні",
    desc="Қазақтың ұлттық аспаптары туралы интерактивті ойындар: викторина, «Жұп тап» жады ойыны, флеш-карталар және ырғақ жаттығуы.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Ойындар</span>
      </nav>
      <h1>Ойнап жүріп үйрену</h1>
      <p class="lede">Төрт ойын бар: білімді тексеретін викторина, есте сақтауды жаттықтыратын
        «Жұп тап», аспаптарды қайталауға арналған флеш-карталар және ырғақ жаттығуы.
        Барлығы тегін, тіркелудің қажеті жоқ.</p>
    </div>
  </section>

  <section class="section" data-tabs>
    <div class="container">
      <div class="tabs" role="tablist" aria-label="Ойын түрлері" style="margin-bottom:1.5rem">
        <button class="tab active" role="tab" data-tab="quiz" aria-selected="true">🎯 Викторина</button>
        <button class="tab" role="tab" data-tab="memory" aria-selected="false">🧠 Жұп тап</button>
        <button class="tab" role="tab" data-tab="flash" aria-selected="false">🗂️ Флеш-карталар</button>
        <button class="tab" role="tab" data-tab="rhythm" aria-selected="false">🥁 Ырғақ</button>
      </div>

      <div class="tab-panel active" id="panel-quiz" role="tabpanel" aria-label="Викторина">
        <div class="quiz-shell">
          <div class="row-between" style="margin-bottom:1rem">
            <div>
              <h2 style="margin-bottom:.2rem">🎯 Викторина: аспаптарды қаншалықты білесіз?</h2>
              <p class="ic-desc" style="margin:0">10 сұрақ · әр сұрақта бір дұрыс жауап · жауаптан кейін түсіндірме шығады</p>
            </div>
            <span class="tag tag-gold" id="bestScore"></span>
          </div>
          <div id="quizBox"></div>
        </div>
      </div>

      <div class="tab-panel" id="panel-memory" role="tabpanel" aria-label="Жұп тап ойыны">
        <div class="quiz-shell">
          <h2>🧠 «Жұп тап» ойыны</h2>
          <p class="ic-desc">12 карточка ашылады. Бір аспаптың суреті мен атауын жұптастырып табыңыз.
            Карточканы бассаңыз — аударылады. Екі карточка сәйкес келсе, олар ашық қалады.</p>
          <div id="memoryBox" style="margin-top:1rem"></div>
        </div>
      </div>

      <div class="tab-panel" id="panel-flash" role="tabpanel" aria-label="Флеш-карталар">
        <div class="quiz-shell">
          <h2>🗂️ Флеш-карталар</h2>
          <p class="ic-desc">Карточканы басып аударыңыз: алдында аспаптың аты, артында — қысқаша сипаты.
            Осылайша сөз бен ұғымды тез жаттауға болады.</p>
          <div style="max-width:420px;margin:1.5rem auto 0" id="flashBox"></div>
        </div>
      </div>

      <div class="tab-panel" id="panel-rhythm" role="tabpanel" aria-label="Ырғақ жаттығуы">
        <div class="quiz-shell">
          <h2>🥁 Ырғақ жаттығуы</h2>
          <p class="ic-desc">Ұрмалы аспаптардың ырғағын таңдап тыңдаңыз. Дауылпаз, даңғыра және
            шыңдауыл әртүрлі ырғақта соғылады — қайсысы тойға, қайсысы жорыққа арналғанын салыстырыңыз.</p>
          <div id="rhythmBox" style="margin-top:1rem"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container">
      <div class="callout callout-accent">
        <h3>👩‍🏫 Мұғалімге арналған ескерту</h3>
        <p>Викторинаны сыныпта үш топқа бөліп ұйымдастыруға болады: әр топ сұраққа кезекпен жауап береді.
          Ойын нәтижесі баға ретінде емес, қайталау құралы ретінде қолданылғаны дұрыс.</p>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Сөздік
PAGES["sozdik"] = dict(
    title="Сөздік — Бабалар үні",
    desc="Қазақтың музыкалық аспаптарына қатысты 32 түсінік: шанақ, тиек, перне, күй, асық, бақсы және басқалары қарапайым тілмен түсіндірілген.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Сөздік</span>
      </nav>
      <h1>Түсініктер сөздігі</h1>
      <p class="lede">Мұнда музыкаға қатысты 32 сөз қарапайым тілмен түсіндірілген. Мәтінді оқығанда
        бейтаныс сөз кездессе, осы беттен іздеп көріңіз. Басып шығарып, дәптерге қысқаша көшіріп алуға да болады.</p>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="toolbar">
        <div class="field" style="flex:1">
          <label for="glossarySearch">🔍 Сөз іздеу:</label>
          <input id="glossarySearch" type="search" placeholder="мысалы: шанақ, күй, перне..." style="flex:1">
        </div>
        <button class="btn btn-sm btn-ghost" id="printGlossary">🖨️ Басып шығару</button>
      </div>

      <div class="letter-nav" id="letterNav" role="group" aria-label="Әліпби бойынша өту"></div>
      <div id="glossaryBox"></div>
    </div>
  </section>

  <section class="section-tight">
    <div class="container-narrow">
      <div class="callout">
        <h3>📖 Сөзді қалай оқу керек?</h3>
        <p>Сөздің мағынасын бірден жаттап алудың қажеті жоқ. Ең бастысы — түсіну. Мысалы, «тиек» деген
          сөзді білсеңіз, домбыраның ішегі неге дыбыс шығаратынын да түсінесіз.</p>
      </div>
    </div>
  </section>
""")

# ---------------------------------------------------------------- Жоба туралы
PAGES["about"] = dict(
    title="Жоба туралы — Бабалар үні",
    desc="«Бабалар үні – цифрлық әлемде» оқу сайты туралы: мақсаты, құрылымы, мұғалім мен оқушыға арналған нұсқаулық және қолжетімділік мүмкіндіктері.",
    body="""
  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Бет навигациясы">
        <a href="index.html">Басты бет</a><span class="crumbs-sep">›</span><span>Жоба туралы</span>
      </nav>
      <h1>Жоба туралы</h1>
      <p class="lede"><b>«Бабалар үні – цифрлық әлемде: Қазақтың ұлттық музыкалық аспаптарының
        интерактивті онлайн-энциклопедиясы»</b> — 1–6 сынып оқушыларына арналған оқу-білім сайты.
        Сайт мұғалімге де, ата-анаға да, оқушыға да бірдей түсінікті болуы үшін қарапайым тілмен жасалды.</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid-2">
        <div class="card">
          <span class="card-icon" aria-hidden="true">🎯</span>
          <h3>Жобаның мақсаты</h3>
          <ul style="margin:0;padding-left:1.2rem">
            <li>Оқушыларға қазақтың ұлттық музыкалық аспаптарын таныстыру.</li>
            <li>Тек мәтін емес — тыңдау, ойнау, салыстыру арқылы үйрету.</li>
            <li>Ұлттық мұраны цифрлық әлемде сақтау және тарату.</li>
            <li>Мұғалімге сабақ материалын тез табуға көмектесу.</li>
          </ul>
        </div>
        <div class="card">
          <span class="card-icon" aria-hidden="true">📊</span>
          <h3>Сайттың мазмұны</h3>
          <ul style="margin:0;padding-left:1.2rem">
            <li><b><span id="statInstr">14</span> аспап</b> — толық сипаттамасымен.</li>
            <li><b><span id="statGroups">5</span> аспап тобы</b> — дыбыс шығару тәсіліне қарай.</li>
            <li><b><span id="statLegend">6</span> халық аңызы</b> — қарапайым тілмен баяндалған.</li>
            <li><b><span id="statQuiz">16</span> викторина сұрағы</b> және 3 ойын.</li>
            <li><b>32 сөздік түсінігі</b> және 8 кезеңнен тұратын тарихи жол.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Нұсқаулық</span>
        <h2>Сайтты қалай пайдалану керек?</h2>
        <p class="lede">Үлкен кісілерге де, кіші оқушыларға да оңай болуы үшін қарапайым ретпен жазылды.</p>
      </div>
      <ul class="fact-list">
        <li><span class="fl-num">1</span><span><strong>Хидерден керек бетті таңдаңыз</strong>
          <span>Жоғарғы жақта «Басты бет», «Аспаптар», «Аңыздар», «Тарих», «Ойындар», «Сөздік» беттері тұр.</span></span></li>
        <li><span class="fl-num">2</span><span><strong>Іздеуді қолданыңыз</strong>
          <span>Жоғарғы сол жақтағы «🔍 Аспап не сөз іздеу...» терезесіне сөз жазыңыз. Пернетақтадағы <b>/</b> белгісін бассаңыз, іздеу терезесі бірден ашылады.</span></span></li>
        <li><span class="fl-num">3</span><span><strong>Мәтінді үлкейтіңіз</strong>
          <span>Жоғарғы оң жақтағы <b>A−</b>, <b>A</b>, <b>A+</b> батырмалары қаріп өлшемін өзгертеді. Қария адамдарға бұл өте қолайлы.</span></span></li>
        <li><span class="fl-num">4</span><span><strong>Түсті ауыстырыңыз</strong>
          <span>🌙 белгісін бассаңыз, сайт қараңғы түске өтеді — кешке көзге жеңіл болады. <b>T</b> пернесі де осы әрекетті істейді.</span></span></li>
        <li><span class="fl-num">5</span><span><strong>Дыбысты басқарыңыз</strong>
          <span>🔊 белгісі — дыбысты қосады немесе толық өшіреді. Аспап үні компьютерде жасалған жуық үлгі екенін есте сақтаңыз.</span></span></li>
        <li><span class="fl-num">6</span><span><strong>Аңызды дауыстап тыңдаңыз</strong>
          <span>«🔊 Дыбыстап оқу» батырмасы мәтінді дауыстап оқып береді. Ол оқуға қиналатын оқушыға көмектеседі.</span></span></li>
        <li><span class="fl-num">7</span><span><strong>Басып шығарыңыз</strong>
          <span>Сөздік пен тарих беттерінде «🖨️ Басып шығару» батырмасы бар. Бет мәзірсіз, таза күйінде шығады.</span></span></li>
      </ul>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Аспап топтарының құрылымы</h2>
      <div class="table-wrap">
        <table>
          <caption class="sr-only">Аспап топтары және олардың саны</caption>
          <thead><tr><th>Топ</th><th>Дыбыс шығару тәсілі</th><th>Аспап саны</th></tr></thead>
          <tbody id="aboutTable"></tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="grid grid-3">
        <div class="card card-plain">
          <span class="card-icon" aria-hidden="true">♿</span>
          <h3>Қолжетімділік</h3>
          <p class="ic-desc">Үлкен қаріп, ашық/қараңғы түс, пернетақтамен жүру, дауыстап оқу және
            экранды оқу құралдарына арналған белгілер қарастырылған.</p>
        </div>
        <div class="card card-plain">
          <span class="card-icon" aria-hidden="true">📱</span>
          <h3>Кез келген құрылғыда</h3>
          <p class="ic-desc">Сайт телефонда, планшетте және компьютерде бірдей жұмыс істейді.
            Интернет қажет емес бөлімдер де бар — мәтіндер беттің ішінде.</p>
        </div>
        <div class="card card-plain">
          <span class="card-icon" aria-hidden="true">🔒</span>
          <h3>Қауіпсіз және жарнамасыз</h3>
          <p class="ic-desc">Сайтта жарнама жоқ, тіркелу жоқ, жеке деректер сұралмайды.
            Таңдаулылар мен баптаулар тек сіздің браузеріңізде сақталады.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="callout callout-gold">
        <h3>📚 Дереккөздер туралы</h3>
        <p>Сайттағы мәтіндер қазақ халқының музыкалық аспаптары туралы ашық білім көздері мен
          оқулықтар негізінде, оқушыға түсінікті тілмен қайта жазылды. Аңыздар — халық ауыз әдебиетінің
          үлгісі, олар ғылыми дерек ретінде емес, мәдени мұра ретінде берілген. Аспап үндері
          компьютерлік үлгімен жасалған.</p>
      </div>
      <div class="center" style="margin-top:2rem">
        <a class="btn btn-lg" href="aspaptar.html">🎼 Аспаптарды оқуды бастау</a>
      </div>
    </div>
  </section>
""")

for name, cfg in PAGES.items():
    head = HEAD.replace("__TITLE__", cfg["title"]).replace("__DESC__", cfg["desc"]).replace("__PAGE__", name)
    html = head + cfg["body"] + FOOT
    (ROOT / (name + ".html")).write_text(html, encoding="utf-8")
    print("жазылды:", name + ".html")
