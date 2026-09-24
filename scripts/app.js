/* ==========================================================================
   app.js — сайттың негізгі логикасы
   Хидер, футер, іздеу, тақырып (ашық/қараңғы), қаріп өлшемі,
   аспаптар каталогы, аспап беті, аңыздар, тарих, сөздік, «Жоба туралы».
   ========================================================================== */

var KZ = (window.KZ = window.KZ || {});

/* ------------------------------------------------------------------ 1. Көмекші құралдар */
KZ.util = (function () {
  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function store(key, val) {
    try {
      if (val === undefined) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    } catch (e) { return null; }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* Сурет әлі дайын болмаса — әдемі уақытша сурет (SVG) қояды */
  function placeholder(name, emoji) {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">' +
      '<rect width="800" height="800" fill="#f4eee5"/>' +
      '<circle cx="400" cy="360" r="180" fill="#ffffff" opacity="0.85"/>' +
      '<text x="400" y="420" font-size="180" text-anchor="middle">' + (emoji || "🎵") + '</text>' +
      '<text x="400" y="620" font-size="52" font-family="Segoe UI, sans-serif" fill="#b4552d" text-anchor="middle">' + name + '</text>' +
      '<text x="400" y="680" font-size="30" font-family="Segoe UI, sans-serif" fill="#6b7a7e" text-anchor="middle">сурет дайындалып жатыр</text>' +
      '</svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function groupById(id) {
    return KZ.groups.filter(function (g) { return g.id === id; })[0] || KZ.groups[0];
  }
  function instrumentById(id) {
    return KZ.instruments.filter(function (i) { return i.id === id; })[0] || null;
  }

  /* Беттің «жолын» анықтайды (қай бет ашық) */
  function currentPage() {
    const p = location.pathname.split("/").pop() || "index.html";
    return p.replace(/\.html$/, "");
  }

  return { $: $, $$: $$, esc: esc, store: store, shuffle: shuffle, placeholder: placeholder,
           groupById: groupById, instrumentById: instrumentById, currentPage: currentPage };
})();

(function () {
  const U = KZ.util, $ = U.$, $$ = U.$$;

  /* ---------------------------------------------------------------- 2. Хабарлама (toast) */
  function toast(msg) {
    const wrap = $("#toastWrap");
    if (!wrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(function () { el.style.opacity = "0"; }, 2200);
    setTimeout(function () { el.remove(); }, 2600);
  }
  KZ.toast = toast;

  /* ---------------------------------------------------------------- 3. Терезе (модаль) */
  function openModal(title, html) {
    const bd = $("#modalBackdrop");
    if (!bd) return;
    $("#modalTitle").textContent = title;
    $("#modalBody").innerHTML = html;
    bd.classList.add("open");
    document.body.style.overflow = "hidden";
    const c = $("#modalClose");
    if (c) c.focus();
  }
  function closeModal() {
    const bd = $("#modalBackdrop");
    if (!bd) return;
    bd.classList.remove("open");
    document.body.style.overflow = "";
  }
  KZ.openModal = openModal;
  KZ.closeModal = closeModal;

  /* ---------------------------------------------------------------- 4. Хидер мен футер */
  const NAV = [
    { href: "index.html", label: "Басты бет", key: "index" },
    { href: "aspaptar.html", label: "Аспаптар", key: "aspaptar" },
    { href: "anyzdar.html", label: "Аңыздар", key: "anyzdar" },
    { href: "tarih.html", label: "Тарих", key: "tarih" },
    { href: "oiyn.html", label: "Ойындар", key: "oiyn" },
    { href: "sozdik.html", label: "Сөздік", key: "sozdik" },
    { href: "about.html", label: "Жоба туралы", key: "about" }
  ];

  function renderHeader() {
    const host = $("#siteHeader");
    if (!host) return;
    const cur = U.currentPage();
    const navHtml = NAV.map(function (n) {
      const active = (n.key === cur) ? ' class="nav-link active" aria-current="page"' : ' class="nav-link"';
      return '<a href="' + n.href + '"' + active + '>' + n.label + '</a>';
    }).join("");

    host.innerHTML =
      '<div class="utility-bar">' +
        '<div class="container utility-inner">' +
          '<span class="utility-note">🎵 1–6 сынып оқушыларына арналған оқу-білім сайты</span>' +
          '<div class="utility-actions">' +
            '<div class="search" id="siteSearch">' +
              '<span class="search-icon" aria-hidden="true">🔍</span>' +
              '<label class="sr-only" for="searchInput">Сайттан іздеу</label>' +
              '<input id="searchInput" type="search" placeholder="Аспап не сөз іздеу..." autocomplete="off" ' +
                     'role="combobox" aria-expanded="false" aria-controls="searchResults">' +
              '<div class="search-results" id="searchResults" role="listbox"></div>' +
            '</div>' +
            '<div class="row" style="gap:.25rem" role="group" aria-label="Қаріп өлшемі">' +
              '<button class="ubtn" id="fontDown" title="Қаріпті кішірейту" aria-label="Қаріпті кішірейту">A−</button>' +
              '<button class="ubtn" id="fontReset" title="Қалыпты өлшем" aria-label="Қаріпті қалыпты өлшемге келтіру">A</button>' +
              '<button class="ubtn" id="fontUp" title="Қаріпті үлкейту" aria-label="Қаріпті үлкейту">A+</button>' +
            '</div>' +
            '<button class="ubtn" id="themeToggle" title="Ашық/қараңғы түс" aria-label="Түс режимін ауыстыру">🌙</button>' +
            '<button class="ubtn" id="soundToggle" title="Дыбысты қосу/өшіру" aria-label="Дыбысты қосу немесе өшіру">🔊</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="nav-bar">' +
        '<div class="container nav-inner">' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-mark" aria-hidden="true">🎶</span>' +
            '<span class="brand-text">' +
              '<span class="brand-title">Бабалар үні</span>' +
              '<span class="brand-sub">Ұлттық аспаптар энциклопедиясы</span>' +
            '</span>' +
          '</a>' +
          '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="mainNav">☰ Мәзір</button>' +
          '<nav class="main-nav" id="mainNav" aria-label="Негізгі мәзір">' + navHtml + '</nav>' +
        '</div>' +
      '</div>';
    host.setAttribute("data-ready", "1");
  }

  function renderFooter() {
    const host = $("#siteFooter");
    if (!host) return;
    const year = new Date().getFullYear();
    host.innerHTML =
      '<div class="container footer-main">' +
        '<div class="footer-brand">' +
          '<a class="brand" href="index.html">' +
            '<span class="brand-mark" aria-hidden="true">🎶</span>' +
            '<span class="brand-text"><span class="brand-title">Бабалар үні</span>' +
            '<span class="brand-sub">цифрлық әлемде</span></span>' +
          '</a>' +
          '<p style="margin-top:.9rem">Қазақтың ұлттық музыкалық аспаптарының интерактивті онлайн-энциклопедиясы. ' +
          'Сайт 1–6 сынып оқушыларына, мұғалімдерге және үлкен кісілерге арналған — қарапайым тілмен, түсінікті етіп жасалды.</p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Беттер</h4>' +
          '<ul>' + NAV.map(function (n) { return '<li><a href="' + n.href + '">' + n.label + '</a></li>'; }).join("") + '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Аспап топтары</h4>' +
          '<ul>' + KZ.groups.map(function (g) {
            return '<li><a href="aspaptar.html?top=' + g.id + '">' + g.icon + " " + g.name + '</a></li>';
          }).join("") + '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Көмек</h4>' +
          '<div class="footer-help">' +
            '<p style="margin-bottom:.6rem">Сайтта оңай жүру үшін:</p>' +
            '<ul style="padding-left:1.1rem;margin-bottom:.8rem">' +
              '<li><kbd>/</kbd> — іздеу терезесін ашады</li>' +
              '<li><kbd>T</kbd> — ашық/қараңғы түс</li>' +
              '<li><kbd>+</kbd> / <kbd>−</kbd> — қаріп өлшемі</li>' +
            '</ul>' +
            '<p style="margin:0">Барлық мәтін қазақ тілінде, қарапайым сөздермен жазылған.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="container footer-bottom">' +
        '<span>© ' + year + ' «Бабалар үні – цифрлық әлемде» оқу жобасы</span>' +
        '<span>Білім мақсатында жасалған · Мұғалімге де, оқушыға да ашық</span>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- 5. Түс пен қаріп */
  function initTheme() {
    const saved = U.store("kz_theme") || "light";
    document.documentElement.setAttribute("data-theme", saved);
    const scale = U.store("kz_scale") || 1;
    document.documentElement.style.setProperty("--ui-scale", scale);
  }
  function applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    U.store("kz_theme", mode);
    const btn = $("#themeToggle");
    if (btn) btn.textContent = mode === "dark" ? "☀️" : "🌙";
  }
  function applyScale(v) {
    const s = Math.min(1.5, Math.max(0.85, Math.round(v * 100) / 100));
    document.documentElement.style.setProperty("--ui-scale", s);
    U.store("kz_scale", s);
    return s;
  }

  /* ---------------------------------------------------------------- 6. Іздеу */
  let SEARCH_INDEX = [];
  function buildIndex() {
    const idx = [];
    KZ.instruments.forEach(function (i) {
      idx.push({ type: "Аспап", emoji: i.emoji, title: i.name, sub: U.groupById(i.group).name + " · " + i.fact, url: "aspap.html?id=" + i.id, text: (i.name + " " + i.latin + " " + i.short + " " + i.desc + " " + i.usage).toLowerCase() });
    });
    KZ.legends.forEach(function (l) {
      idx.push({ type: "Аңыз", emoji: "📖", title: l.title, sub: "Аспап: " + l.instrument, url: "anyzdar.html#" + l.id, text: (l.title + " " + l.paras.join(" ")).toLowerCase() });
    });
    KZ.glossary.forEach(function (g) {
      idx.push({ type: "Сөздік", emoji: "📘", title: g.term, sub: g.def.slice(0, 70) + "…", url: "sozdik.html?h=" + encodeURIComponent(g.term.charAt(0)), text: (g.term + " " + g.def).toLowerCase() });
    });
    KZ.groups.forEach(function (g) {
      idx.push({ type: "Топ", emoji: g.icon, title: g.name, sub: g.short, url: "aspaptar.html?top=" + g.id, text: (g.name + " " + g.desc).toLowerCase() });
    });
    NAV.forEach(function (n) {
      idx.push({ type: "Бет", emoji: "🔗", title: n.label, sub: "Сайт беті", url: n.href, text: (n.label + " бет").toLowerCase() });
    });
    SEARCH_INDEX = idx;
  }

  function search(q) {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const words = s.split(/\s+/);
    return SEARCH_INDEX
      .map(function (item) {
        let score = 0;
        words.forEach(function (w) {
          if (item.title.toLowerCase().indexOf(w) === 0) score += 6;
          else if (item.title.toLowerCase().indexOf(w) > -1) score += 4;
          if (item.text.indexOf(w) > -1) score += 2;
        });
        return { item: item, score: score };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8)
      .map(function (r) { return r.item; });
  }

  function initSearch() {
    const input = $("#searchInput"), box = $("#searchResults");
    if (!input || !box) return;
    let items = [], cursor = -1;

    function close() { box.classList.remove("open"); input.setAttribute("aria-expanded", "false"); cursor = -1; }

    function render(res) {
      items = res;
      if (!res.length) {
        box.innerHTML = '<div class="search-empty">Ештеңе табылмады. Басқа сөзбен іздеп көріңіз (мысалы: <b>домбыра</b>, <b>қобыз</b>, <b>аңыз</b>).</div>';
      } else {
        box.innerHTML = res.map(function (r, i) {
          return '<button class="search-result" data-url="' + r.url + '" data-i="' + i + '" role="option">' +
            '<span class="sr-emoji" aria-hidden="true">' + r.emoji + '</span>' +
            '<span><span class="sr-title">' + U.esc(r.title) + '</span><br>' +
            '<span class="sr-sub">' + U.esc(r.type) + ' · ' + U.esc(r.sub) + '</span></span></button>';
        }).join("");
      }
      box.classList.add("open");
      input.setAttribute("aria-expanded", "true");
      $$(".search-result", box).forEach(function (b) {
        b.addEventListener("click", function () { location.href = b.dataset.url; });
      });
    }

    input.addEventListener("input", function () { render(search(input.value)); });
    input.addEventListener("focus", function () { if (input.value.trim()) render(search(input.value)); });
    input.addEventListener("keydown", function (e) {
      const list = $$(".search-result", box);
      if (e.key === "ArrowDown" && list.length) { e.preventDefault(); cursor = (cursor + 1) % list.length; list[cursor].classList.add("active"); list[cursor].focus(); }
      else if (e.key === "ArrowUp" && list.length) { e.preventDefault(); cursor = (cursor - 1 + list.length) % list.length; list[cursor].classList.add("active"); list[cursor].focus(); }
      else if (e.key === "Enter" && list.length) { e.preventDefault(); (list[Math.max(0, cursor)] || list[0]).click(); }
      else if (e.key === "Escape") { close(); input.blur(); }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest("#siteSearch")) close();
    });
  }

  /* ---------------------------------------------------------------- 7. Таңдаулылар */
  function favs() { return U.store("kz_fav") || []; }
  function isFav(id) { return favs().indexOf(id) > -1; }
  function toggleFav(id) {
    const list = favs();
    const i = list.indexOf(id);
    if (i > -1) { list.splice(i, 1); toast("Таңдаулылардан алынды"); }
    else { list.push(id); toast("Таңдаулыларға қосылды ⭐"); }
    U.store("kz_fav", list);
    document.dispatchEvent(new CustomEvent("kz:fav"));
    return list.indexOf(id) > -1;
  }
  KZ.favs = favs; KZ.isFav = isFav; KZ.toggleFav = toggleFav;

  /* ---------------------------------------------------------------- 8. Карточкалар */
  function instrumentCard(i, opts) {
    opts = opts || {};
    const g = U.groupById(i.group);
    return '<article class="instrument-card card-hover reveal" data-id="' + i.id + '" data-group="' + i.group + '">' +
      (opts.compare ? '<label class="tag" style="position:absolute;left:.8rem;bottom:.8rem;z-index:2;background:rgba(255,255,255,.92);cursor:pointer">' +
        '<input type="checkbox" class="cmp-box" value="' + i.id + '" style="accent-color:#b4552d"> Салыстыру</label>' : '') +
      '<button class="fav-btn" data-fav="' + i.id + '" aria-pressed="' + (isFav(i.id) ? "true" : "false") + '" ' +
        'aria-label="' + U.esc(i.name) + ' аспабын таңдаулыларға қосу" title="Таңдаулыға қосу">' +
        (isFav(i.id) ? "⭐" : "☆") + '</button>' +
      '<a class="ic-media" href="aspap.html?id=' + i.id + '" aria-label="' + U.esc(i.name) + ' туралы толық оқу">' +
        '<img src="' + i.img + '" alt="' + U.esc(i.name) + ' аспабы" loading="lazy" ' +
          'onerror="this.onerror=null;this.src=KZ.util.placeholder(\'' + U.esc(i.name) + '\',\'' + i.emoji + '\')">' +
        '<span class="ic-emoji" aria-hidden="true">' + i.emoji + '</span>' +
      '</a>' +
      '<div class="ic-body">' +
        '<span class="tag ' + g.tag + '" style="align-self:flex-start">' + g.icon + " " + g.name + '</span>' +
        '<h3 class="ic-title"><a href="aspap.html?id=' + i.id + '">' + U.esc(i.name) + '</a></h3>' +
        '<span class="ic-latin">' + U.esc(i.latin) + '</span>' +
        '<p class="ic-desc">' + U.esc(i.short) + '</p>' +
        '<div class="ic-foot">' +
          '<button class="btn btn-sm btn-ghost sound-btn" data-sound="' + i.id + '" data-group="' + i.group + '">🔈 Үнін тыңдау</button>' +
          '<a class="btn btn-sm" href="aspap.html?id=' + i.id + '">Толық оқу →</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  KZ.instrumentCard = instrumentCard;

  function bindSoundButtons(root) {
    $$(".sound-btn", root).forEach(function (b) {
      b.addEventListener("click", function () {
        if (!KZ.Synth.supported()) { toast("Браузер дыбысты қолдамайды"); return; }
        KZ.Synth.playGroup(b.dataset.group, b.dataset.sound);
        b.textContent = "🔊 Ойналып жатыр...";
        setTimeout(function () { b.textContent = "🔈 Үнін тыңдау"; }, 2600);
      });
    });
  }
  KZ.bindSoundButtons = bindSoundButtons;

  function bindFavButtons(root) {
    $$(".fav-btn", root).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        const on = toggleFav(b.dataset.fav);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.textContent = on ? "⭐" : "☆";
      });
    });
  }
  KZ.bindFavButtons = bindFavButtons;

  /* ---------------------------------------------------------------- 9. Анимация мен скролл */
  function initScrollUI() {
    const progress = $("#scrollProgress");
    const toTop = $("#toTop");
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (progress) progress.style.width = p + "%";
      if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("visible"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }
  KZ.initReveal = initReveal;

  /* ---------------------------------------------------------------- 10. Басты бет */
  function initHome() {
    /* Топ карточкалары */
    const groupsBox = $("#groupsBox");
    if (groupsBox) {
      groupsBox.innerHTML = KZ.groups.map(function (g) {
        const count = KZ.instruments.filter(function (i) { return i.group === g.id; }).length;
        return '<a class="card card-hover reveal" href="aspaptar.html?top=' + g.id + '">' +
          '<span class="card-icon" aria-hidden="true">' + g.icon + '</span>' +
          '<h3>' + g.name + '</h3>' +
          '<p class="ic-desc">' + g.desc + '</p>' +
          '<span class="tag ' + g.tag + '" style="align-self:flex-start">' + count + ' аспап</span>' +
        '</a>';
      }).join("");
    }

    /* Танымал аспаптар */
    const popBox = $("#popularBox");
    if (popBox) {
      const popular = KZ.instruments.filter(function (i) { return i.popular; });
      popBox.innerHTML = popular.map(function (i) { return instrumentCard(i); }).join("");
      bindSoundButtons(popBox); bindFavButtons(popBox);
    }

    /* «Білдіңіз бе?» кездейсоқ дерек */
    const factBox = $("#factBox"), factBtn = $("#newFact");
    const facts = [];
    KZ.instruments.forEach(function (i) {
      facts.push({ text: i.fun, src: i.name, url: "aspap.html?id=" + i.id });
      facts.push({ text: i.fact + " — " + i.name, src: i.name, url: "aspap.html?id=" + i.id });
    });
    function showFact() {
      const f = facts[Math.floor(Math.random() * facts.length)];
      if (factBox) {
        factBox.innerHTML = '<p style="font-size:1.05rem;margin-bottom:.5rem">' + U.esc(f.text) + '</p>' +
          '<a class="link-arrow" href="' + f.url + '">' + U.esc(f.src) + ' туралы толық оқу →</a>';
      }
    }
    if (factBtn) factBtn.addEventListener("click", showFact);
    if (factBox) showFact();

    /* Таңдаулылар */
    const favWrap = $("#favWrap"), favBox = $("#favBox");
    function renderFavs() {
      const ids = favs();
      if (favWrap) favWrap.style.display = ids.length ? "" : "none";
      if (favBox) {
        favBox.innerHTML = ids.map(function (id) {
          const i = U.instrumentById(id);
          return i ? instrumentCard(i) : "";
        }).join("");
        bindFavButtons(favBox); bindSoundButtons(favBox);
      }
    }
    renderFavs();
    document.addEventListener("kz:fav", renderFavs);

    /* Сандар */
    $$("[data-count]").forEach(function (el) {
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur;
      }, 30);
    });

    initReveal();
  }

  /* ---------------------------------------------------------------- 11. Каталог */
  function initCatalog() {
    const box = $("#catalogBox");
    if (!box) return;

    const params = new URLSearchParams(location.search);
    let state = {
      group: params.get("top") || "all",
      q: params.get("q") || "",
      sort: "name",
      favOnly: false
    };
    const searchEl = $("#catSearch");
    const sortEl = $("#catSort");
    const countEl = $("#catCount");
    const chips = $$("#catFilters .chip");
    const favOnlyBtn = $("#favOnly");
    const favOnlyInput = $("#favOnlyInput");

    if (searchEl && state.q) searchEl.value = state.q;

    function render() {
      let list = KZ.instruments.slice();
      if (state.group !== "all") list = list.filter(function (i) { return i.group === state.group; });
      if (state.favOnly) list = list.filter(function (i) { return isFav(i.id); });
      if (state.q.trim()) {
        const s = state.q.trim().toLowerCase();
        list = list.filter(function (i) {
          return (i.name + " " + i.latin + " " + i.short + " " + i.desc + " " + i.usage + " " + i.fact).toLowerCase().indexOf(s) > -1;
        });
      }
      if (state.sort === "name") list.sort(function (a, b) { return a.name.localeCompare(b.name, "kk"); });
      if (state.sort === "latin") list.sort(function (a, b) { return a.latin.localeCompare(b.latin); });
      if (state.sort === "group") list.sort(function (a, b) { return a.group.localeCompare(b.group); });
      if (state.sort === "rev") list.reverse();

      if (!list.length) {
        box.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><p>Ештеңе табылмады 🤔</p>' +
          '<p>Сүзгіні өзгертіп немесе іздеу сөзін өшіріп көріңіз.</p></div>';
      } else {
        box.innerHTML = list.map(function (i) { return instrumentCard(i, { compare: true }); }).join("");
        bindSoundButtons(box); bindFavButtons(box);
      }
      if (countEl) countEl.textContent = "Табылған аспап: " + list.length + " / " + KZ.instruments.length;
      initReveal();
    }

    chips.forEach(function (c) {
      if (c.dataset.group === state.group) c.classList.add("active");
      else c.classList.remove("active");
      c.addEventListener("click", function () {
        state.group = c.dataset.group;
        chips.forEach(function (o) { o.classList.remove("active"); });
        c.classList.add("active");
        render();
      });
    });

    if (searchEl) searchEl.addEventListener("input", function () { state.q = searchEl.value; render(); });
    if (sortEl) sortEl.addEventListener("change", function () { state.sort = sortEl.value; render(); });
    if (favOnlyInput) {
      favOnlyInput.addEventListener("change", function () {
        state.favOnly = favOnlyInput.checked;
        render();
      });
    }
    if (favOnlyBtn) {
      favOnlyBtn.addEventListener("click", function () {
        state.favOnly = true;
        if (favOnlyInput) favOnlyInput.checked = true;
        render();
      });
    }

    /* Салыстыру */
    const cmpBtn = $("#compareBtn");
    function selected() { return $$(".cmp-box:checked").map(function (c) { return c.value; }); }
    document.addEventListener("change", function (e) {
      if (!e.target.classList || !e.target.classList.contains("cmp-box")) return;
      const sel = selected();
      if (sel.length > 3) {
        e.target.checked = false;
        toast("Ең көбі 3 аспапты салыстыруға болады");
        return;
      }
      if (cmpBtn) {
        cmpBtn.textContent = "⚖️ Салыстыру (" + sel.length + ")";
        cmpBtn.disabled = sel.length < 2;
      }
    });

    if (cmpBtn) {
      cmpBtn.disabled = true;
      cmpBtn.addEventListener("click", function () {
        const ids = selected();
        if (ids.length < 2) { toast("Кемінде 2 аспапты таңдаңыз"); return; }
        const picked = ids.map(U.instrumentById).filter(Boolean);
        const rows = [
          { t: "Тобы", f: function (i) { return U.groupById(i.group).icon + " " + U.groupById(i.group).name; } },
          { t: "Латынша", f: function (i) { return i.latin; } },
          { t: "Қалай ойналады", f: function (i) { return i.fact; } },
          { t: "Үні", f: function (i) { return i.sound; } },
          { t: "Қысқаша", f: function (i) { return i.short; } },
          { t: "Қолданылуы", f: function (i) { return i.usage; } }
        ];
        let html = '<div class="table-wrap"><table><thead><tr><th>Белгі</th>' +
          picked.map(function (i) { return "<th>" + i.emoji + " " + U.esc(i.name) + "</th>"; }).join("") +
          '</tr></thead><tbody>' +
          rows.map(function (r) {
            return "<tr><th>" + r.t + "</th>" + picked.map(function (i) { return "<td>" + U.esc(r.f(i)) + "</td>"; }).join("") + "</tr>";
          }).join("") +
          '</tbody></table></div>';
        openModal("Аспаптарды салыстыру", html);
      });
    }

    render();
  }

  /* ---------------------------------------------------------------- 12. Аспап беті */
  function initDetail() {
    const box = $("#detailBox");
    if (!box) return;
    const id = new URLSearchParams(location.search).get("id") || "dombyra";
    const inst = U.instrumentById(id);
    if (!inst) {
      box.innerHTML = '<div class="empty-state"><p>Мұндай аспап табылмады.</p>' +
        '<p><a class="btn" href="aspaptar.html">Барлық аспаптарға өту</a></p></div>';
      return;
    }
    const g = U.groupById(inst.group);
    document.title = inst.name + " — Бабалар үні";

    const others = KZ.instruments.filter(function (i) { return i.group === inst.group && i.id !== inst.id; }).slice(0, 3);

    box.innerHTML =
      '<nav class="breadcrumbs" aria-label="Бет навигациясы">' +
        '<a href="index.html">Басты бет</a><span class="crumbs-sep">›</span>' +
        '<a href="aspaptar.html">Аспаптар</a><span class="crumbs-sep">›</span>' +
        '<a href="aspaptar.html?top=' + g.id + '">' + g.name + '</a><span class="crumbs-sep">›</span>' +
        '<span>' + U.esc(inst.name) + '</span>' +
      '</nav>' +
      '<div class="detail-grid">' +
        '<div>' +
          '<div class="detail-media">' +
            '<img src="' + inst.img + '" alt="' + U.esc(inst.name) + ' аспабы" ' +
              'onerror="this.onerror=null;this.src=KZ.util.placeholder(\'' + U.esc(inst.name) + '\',\'' + inst.emoji + '\')">' +
            '<div class="dm-foot">' +
              '<div class="row-between">' +
                '<span class="tag ' + g.tag + '">' + g.icon + " " + g.name + '</span>' +
                '<button class="btn btn-sm btn-ghost" data-fav="' + inst.id + '" id="detailFav">' +
                  (isFav(inst.id) ? "⭐ Таңдаулыда" : "☆ Таңдаулыға қосу") + '</button>' +
              '</div>' +
              '<div class="row" style="margin-top:.9rem">' +
                '<button class="btn btn-sm" id="playMelody">🔊 Әуенін тыңдау</button>' +
                '<span class="count-badge">Бұл — компьютер жасаған жуық үн</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="card" style="margin-top:1.25rem">' +
            '<h3>🎹 Дыбыс пернелері</h3>' +
            '<p class="ic-desc">Төмендегі батырмаларды басып, аспаптың ' + g.name.toLowerCase() + ' дыбысын өзіңіз шығарып көріңіз.</p>' +
            '<div class="row" id="keyboard">' +
              ["до", "ре", "ми", "соль", "ля", "до¹"].map(function (n, k) {
                const steps = [0, 2, 4, 7, 9, 12];
                return '<button class="btn btn-ghost btn-sm note-btn" data-semi="' + steps[k] + '">🎵 ' + n + '</button>';
              }).join("") +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div>' +
          '<span class="tag ' + g.tag + '">' + g.icon + " " + g.name + '</span>' +
          '<h1 style="margin:.6rem 0 .2rem">' + U.esc(inst.name) + '</h1>' +
          '<p class="ic-latin">' + U.esc(inst.latin) + '</p>' +
          '<p class="lede">' + U.esc(inst.tagline) + '</p>' +
          '<p>' + U.esc(inst.desc) + '</p>' +

          '<h2 style="margin-top:2rem">🔧 Бөлшектері</h2>' +
          '<ul class="fact-list">' + inst.parts.map(function (p, n) {
            return '<li><span class="fl-num">' + (n + 1) + '</span><span><strong>' + U.esc(p.t) + '</strong>' +
              '<span>' + U.esc(p.d) + '</span></span></li>';
          }).join("") + '</ul>' +

          '<div class="grid grid-2" style="margin-top:2rem">' +
            '<div class="card card-plain"><h3>🔊 Үні қандай?</h3><p class="ic-desc">' + U.esc(inst.sound) + '</p></div>' +
            '<div class="card card-plain"><h3>🎯 Қайда қолданылады?</h3><p class="ic-desc">' + U.esc(inst.usage) + '</p></div>' +
          '</div>' +

          (inst.history ? '<div class="callout" style="margin-top:1.5rem"><h3>📜 Тарихынан</h3><p>' + U.esc(inst.history) + '</p></div>' : '') +

          (inst.legend ? '<div class="legend-box" style="margin-top:1.5rem"><h3>📖 Аңыз: ' + U.esc(inst.legend.title) + '</h3>' +
            '<p>' + U.esc(inst.legend.text) + '</p>' +
            '<button class="btn btn-sm btn-teal" data-read="' + U.esc(inst.legend.title + ". " + inst.legend.text) + '">🔊 Дыбыстап оқу</button>' +
            '</div>' : '') +

          '<div class="callout callout-gold" style="margin-top:1.5rem"><h3>💡 Қызықты дерек</h3><p>' + U.esc(inst.fun) + '</p></div>' +
        '</div>' +
      '</div>' +

      '<section class="section">' +
        '<div class="section-head"><h2>Осы топтағы басқа аспаптар</h2>' +
        '<p class="lede">' + g.icon + " " + g.name + ' — ' + g.desc + '</p></div>' +
        '<div class="grid grid-3">' +
          (others.length ? others.map(function (i) { return instrumentCard(i); }).join("") :
            '<p class="empty-state" style="grid-column:1/-1">Бұл топта басқа аспап жоқ. <a class="link-arrow" href="aspaptar.html">Барлық аспаптарды көру →</a></p>') +
        '</div>' +
      '</section>';

    /* Батырмалар */
    const favBtn = $("#detailFav");
    if (favBtn) {
      favBtn.addEventListener("click", function () {
        const on = toggleFav(inst.id);
        favBtn.textContent = on ? "⭐ Таңдаулыда" : "☆ Таңдаулыға қосу";
      });
    }
    const play = $("#playMelody");
    if (play) {
      play.addEventListener("click", function () {
        if (!KZ.Synth.supported()) { toast("Браузер дыбысты қолдамайды"); return; }
        KZ.Synth.playGroup(inst.group, inst.id);
      });
    }
    $$(".note-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        KZ.Synth.playNote(inst.group, parseInt(b.dataset.semi, 10), 0.9);
      });
    });
    $$("[data-read]").forEach(function (b) {
      b.addEventListener("click", function () { KZ.readAloud(b.dataset.read); });
    });
    bindSoundButtons(box); bindFavButtons(box);
    initReveal();
  }

  /* ---------------------------------------------------------------- 13. Дыбыстап оқу */
  function readAloud(text) {
    if (!("speechSynthesis" in window)) { toast("Бұл браузер дауыстап оқуды қолдамайды"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices() || [];
    const kk = voices.filter(function (v) { return (v.lang || "").toLowerCase().indexOf("kk") === 0; })[0];
    const ru = voices.filter(function (v) { return (v.lang || "").toLowerCase().indexOf("ru") === 0; })[0];
    u.voice = kk || ru || null;
    u.lang = kk ? "kk-KZ" : (ru ? "ru-RU" : "kk-KZ");
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
    toast("Дауыстап оқылуда... 🔉");
  }
  KZ.readAloud = readAloud;

  /* ---------------------------------------------------------------- 14. Аңыздар */
  function initLegends() {
    const box = $("#legendsBox");
    if (!box) return;
    box.innerHTML = KZ.legends.map(function (l, n) {
      return '<article class="legend-card reveal" id="' + l.id + '">' +
        '<button class="legend-head" aria-expanded="false" aria-controls="lb-' + l.id + '">' +
          '<span>' +
            '<span class="lh-sub">' + (n + 1) + '-аңыз · Аспап: ' + U.esc(l.instrument) + '</span>' +
            '<span class="lh-title">📖 ' + U.esc(l.title) + '</span>' +
          '</span>' +
          '<span class="lh-caret" aria-hidden="true">▾</span>' +
        '</button>' +
        '<div class="legend-body" id="lb-' + l.id + '">' +
          l.paras.map(function (p) { return "<p>" + U.esc(p) + "</p>"; }).join("") +
          '<div class="legend-moral">💭 ' + U.esc(l.moral) + '</div>' +
          '<div class="row" style="margin-top:1rem">' +
            '<button class="btn btn-sm btn-teal" data-read="' + U.esc(l.title + ". " + l.paras.join(" ")) + '">🔊 Дыбыстап оқу</button>' +
            '<a class="btn btn-sm btn-ghost" href="aspaptar.html?q=' + encodeURIComponent(l.instrument) + '">🎵 ' + U.esc(l.instrument) + ' туралы оқу</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");

    $$(".legend-head", box).forEach(function (h) {
      h.addEventListener("click", function () {
        const card = h.closest(".legend-card");
        const open = card.classList.toggle("open");
        h.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    $$("[data-read]", box).forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); KZ.readAloud(b.dataset.read); });
    });

    /* Сілтеме арқылы келсе — сол аңызды ашады */
    const hash = location.hash.replace("#", "");
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.classList.add("open");
        const h = $(".legend-head", el);
        if (h) h.setAttribute("aria-expanded", "true");
        setTimeout(function () { el.scrollIntoView({ block: "center" }); }, 200);
      }
    }
    initReveal();
  }

  /* ---------------------------------------------------------------- 15. Тарих беті */
  function initHistory() {
    const tl = $("#timelineBox");
    if (tl) {
      tl.innerHTML = KZ.timeline.map(function (t) {
        return '<li class="reveal"><span class="tl-era">' + U.esc(t.era) + '</span>' +
          '<h3>' + U.esc(t.title) + '</h3><p>' + U.esc(t.text) + '</p></li>';
      }).join("");
    }
    const tb = $("#historyTable");
    if (tb) {
      tb.innerHTML = KZ.groups.map(function (g) {
        const list = KZ.instruments.filter(function (i) { return i.group === g.id; });
        return "<tr><th>" + g.icon + " " + g.name + "</th>" +
          "<td>" + g.desc + "</td>" +
          "<td>" + list.map(function (i) { return '<a class="link-arrow" href="aspap.html?id=' + i.id + '">' + i.name + "</a>"; }).join(", ") + "</td></tr>";
      }).join("");
    }
    initReveal();
  }

  /* ---------------------------------------------------------------- 16. Сөздік */
  function initGlossary() {
    const box = $("#glossaryBox");
    if (!box) return;
    const letters = {};
    KZ.glossary.forEach(function (g) {
      const ch = g.term.charAt(0).toUpperCase();
      (letters[ch] = letters[ch] || []).push(g);
    });
    const keys = Object.keys(letters).sort(function (a, b) { return a.localeCompare(b, "kk"); });

    const nav = $("#letterNav");
    if (nav) {
      nav.innerHTML = keys.map(function (k) {
        return '<button data-letter="' + k + '" aria-label="' + k + ' әрпіне өту">' + k + '</button>';
      }).join("");
      $$("button", nav).forEach(function (b) {
        b.addEventListener("click", function () {
          const el = document.getElementById("letter-" + b.dataset.letter);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    function render(filter) {
      const f = (filter || "").trim().toLowerCase();
      box.innerHTML = keys.map(function (k) {
        const list = letters[k].filter(function (g) {
          return !f || (g.term + " " + g.def).toLowerCase().indexOf(f) > -1;
        });
        if (!list.length) return "";
        return '<section class="glossary-group" id="letter-' + k + '">' +
          '<h3>' + k + '</h3>' +
          '<dl style="margin:0">' + list.map(function (g) {
            return '<div class="term"><dt>' + U.esc(g.term) + '</dt><dd>' + U.esc(g.def) + '</dd></div>';
          }).join("") + '</dl></section>';
      }).join("") || '<div class="empty-state">Сөз табылмады 🤔</div>';
    }

    const searchEl = $("#glossarySearch");
    if (searchEl) searchEl.addEventListener("input", function () { render(searchEl.value); });
    render("");

    const h = new URLSearchParams(location.search).get("h");
    if (h) {
      const el = document.getElementById("letter-" + h.toUpperCase());
      if (el) setTimeout(function () { el.scrollIntoView({ block: "start" }); }, 250);
    }
    const printBtn = $("#printGlossary");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });
  }

  /* ---------------------------------------------------------------- 17. Жоба туралы */
  function initAbout() {
    const tb = $("#aboutTable");
    if (tb) {
      tb.innerHTML = KZ.groups.map(function (g) {
        const c = KZ.instruments.filter(function (i) { return i.group === g.id; }).length;
        return "<tr><th>" + g.icon + " " + g.name + "</th><td>" + g.short + "</td><td>" + c + "</td></tr>";
      }).join("");
    }
    const st = $("#statInstr"); if (st) st.textContent = KZ.instruments.length;
    const sg = $("#statGroups"); if (sg) sg.textContent = KZ.groups.length;
    const sz = $("#statLegend"); if (sz) sz.textContent = KZ.legends.length;
    const sq = $("#statQuiz"); if (sq) sq.textContent = KZ.quiz.length;
  }

  /* ---------------------------------------------------------------- 18. Жалпы түймелер */
  function initGlobal() {
    renderHeader();
    renderFooter();
    buildIndex();
    initTheme(); initSearch(); initScrollUI();

    const themeBtn = $("#themeToggle");
    if (themeBtn) {
      themeBtn.textContent = (document.documentElement.getAttribute("data-theme") === "dark") ? "☀️" : "🌙";
      themeBtn.addEventListener("click", function () {
        const now = document.documentElement.getAttribute("data-theme");
        applyTheme(now === "dark" ? "light" : "dark");
      });
    }

    const soundBtn = $("#soundToggle");
    if (soundBtn) {
      const off = U.store("kz_muted") || false;
      KZ.Synth.setMuted(off);
      soundBtn.textContent = off ? "🔇" : "🔊";
      soundBtn.setAttribute("aria-pressed", off ? "true" : "false");
      soundBtn.addEventListener("click", function () {
        const now = !KZ.Synth.isMuted();
        KZ.Synth.setMuted(now);
        U.store("kz_muted", now);
        soundBtn.textContent = now ? "🔇" : "🔊";
        soundBtn.setAttribute("aria-pressed", now ? "true" : "false");
        toast(now ? "Дыбыс өшірілді" : "Дыбыс қосылды");
      });
    }

    const cur = function () { return parseFloat(U.store("kz_scale") || 1); };
    const fd = $("#fontDown"), fu = $("#fontUp"), fr = $("#fontReset");
    if (fd) fd.addEventListener("click", function () { applyScale(cur() - 0.1); });
    if (fu) fu.addEventListener("click", function () { applyScale(cur() + 0.1); });
    if (fr) fr.addEventListener("click", function () { applyScale(1); toast("Қаріп қалыпты өлшемге келді"); });

    const navToggle = $("#navToggle"), mainNav = $("#mainNav");
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", function () {
        const open = mainNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        navToggle.textContent = open ? "✕ Жабу" : "☰ Мәзір";
      });
    }

    /* Модаль жабу */
    const bd = $("#modalBackdrop");
    if (bd) {
      bd.addEventListener("click", function (e) { if (e.target === bd) closeModal(); });
      const c = $("#modalClose");
      if (c) c.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", function (e) {
      const tag = (e.target.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || tag === "select";
      if (e.key === "Escape") closeModal();
      if (typing) return;
      if (e.key === "/") { e.preventDefault(); const i = $("#searchInput"); if (i) i.focus(); }
      if (e.key === "t" || e.key === "T" || e.key === "е") {
        const now = document.documentElement.getAttribute("data-theme");
        applyTheme(now === "dark" ? "light" : "dark");
      }
      if (e.key === "+" || e.key === "=") applyScale(cur() + 0.1);
      if (e.key === "-" || e.key === "_") applyScale(cur() - 0.1);
    });

    /* Табтар (Ойындар беті) */
    function initTabs() {
      const host = $("[data-tabs]");
      if (!host) return;
      const tabs = $$(".tab", host);
      function activate(name) {
        tabs.forEach(function (t) {
          const on = t.dataset.tab === name;
          t.classList.toggle("active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        $$(".tab-panel", host).forEach(function (p) { p.classList.toggle("active", p.id === "panel-" + name); });
      }
      tabs.forEach(function (t) {
        t.addEventListener("click", function () {
          activate(t.dataset.tab);
          history.replaceState(null, "", "#" + t.dataset.tab);
        });
      });
      const hash = (location.hash || "").replace("#", "");
      if (hash && tabs.some(function (t) { return t.dataset.tab === hash; })) activate(hash);
    }
    initTabs();

    /* Аңыздар беті: барлығын ашу */
    const expandAll = $("#expandAllLegend");
    if (expandAll) {
      expandAll.addEventListener("click", function () {
        const cards = $$(".legend-card");
        const anyClosed = cards.some(function (c) { return !c.classList.contains("open"); });
        cards.forEach(function (c) {
          c.classList.toggle("open", anyClosed);
          const h = $(".legend-head", c);
          if (h) h.setAttribute("aria-expanded", anyClosed ? "true" : "false");
        });
        expandAll.textContent = anyClosed ? "📕 Барлығын жабу" : "📖 Барлығын ашу";
      });
    }

    /* Тарих беті: басып шығару */
    const printHistory = $("#printHistory");
    if (printHistory) printHistory.addEventListener("click", function () { window.print(); });

    /* Бетке қарай жүктеу */
    const page = document.body.dataset.page;
    if (page === "index") initHome();
    if (page === "aspaptar") initCatalog();
    if (page === "aspap") initDetail();
    if (page === "anyzdar") initLegends();
    if (page === "tarih") initHistory();
    if (page === "sozdik") initGlossary();
    if (page === "about") initAbout();
    if (page === "oiyn" && KZ.initGames) KZ.initGames();

    initReveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGlobal);
  else initGlobal();
})();
