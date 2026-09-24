/* ==========================================================================
   games.js — оқушыға арналған интерактивті ойындар
   1) Викторина (сұрақ-жауап)   2) Жұп тап (жады ойыны)   3) Флеш-карталар
   ========================================================================== */

var KZ = (window.KZ = window.KZ || {});

KZ.initGames = function () {
  const U = KZ.util, $ = U.$, $$ = U.$$;

  /* =========================================================== 1. ВИКТОРИНА */
  const QUIZ_LEN = 10;
  const quizBox = $("#quizBox");
  if (quizBox) {
    let qs = [], n = 0, score = 0, mistakes = [], answered = false;

    function start() {
      qs = U.shuffle(KZ.quiz).slice(0, QUIZ_LEN);
      n = 0; score = 0; mistakes = [];
      renderQuestion();
    }

    function renderQuestion() {
      answered = false;
      const q = qs[n];
      const pct = Math.round((n / qs.length) * 100);
      quizBox.innerHTML =
        '<div class="quiz-top">' +
          '<span style="font-weight:700">Сұрақ ' + (n + 1) + ' / ' + qs.length + '</span>' +
          '<span class="tag tag-teal">Ұпай: ' + score + '</span>' +
        '</div>' +
        '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
        '<p class="question">' + U.esc(q.q) + '</p>' +
        '<div class="options" id="quizOptions">' +
          q.options.map(function (o, k) {
            return '<button class="option" data-k="' + k + '">' +
              '<span class="opt-key">' + "АӘБВ".charAt(k) + '</span><span>' + U.esc(o) + '</span></button>';
          }).join("") +
        '</div>' +
        '<div id="quizFeedback"></div>';

      $$(".option", quizBox).forEach(function (b) {
        b.addEventListener("click", function () { answer(parseInt(b.dataset.k, 10)); });
      });
    }

    function answer(k) {
      if (answered) return;
      answered = true;
      const q = qs[n];
      const opts = $$(".option", quizBox);
      opts.forEach(function (b, idx) {
        b.disabled = true;
        if (idx === q.answer) b.classList.add("correct");
        if (idx === k && k !== q.answer) b.classList.add("wrong");
      });

      const ok = k === q.answer;
      if (ok) score++;
      else mistakes.push({ q: q.q, right: q.options[q.answer], why: q.why });

      const fb = $("#quizFeedback", quizBox);
      fb.innerHTML =
        '<div class="feedback ' + (ok ? "ok" : "no") + '">' +
          '<strong>' + (ok ? "✅ Дұрыс! Жарайсың!" : "❌ Дұрыс емес.") + '</strong>' +
          '<p style="margin:0">' + U.esc(q.why) + '</p>' +
        '</div>' +
        '<div class="row" style="margin-top:1rem">' +
          '<button class="btn" id="nextQ">' + (n + 1 < qs.length ? "Келесі сұрақ →" : "Нәтижені көрсету 🏁") + '</button>' +
          (KZ.Synth.supported() ? '<button class="btn btn-ghost" id="hearQuiz" data-group="string">🔈 Дыбысты есту</button>' : '') +
        '</div>';

      const nb = $("#nextQ", quizBox);
      nb.addEventListener("click", function () {
        if (n + 1 < qs.length) { n++; renderQuestion(); }
        else finish();
      });
      nb.focus();

      const hb = $("#hearQuiz", quizBox);
      if (hb) hb.addEventListener("click", function () { KZ.Synth.playGroup("string"); });
    }

    function finish() {
      const pct = Math.round((score / qs.length) * 100);
      let medal = "📘", title = "Жақсы бастама!", msg = "Мәтінді тағы оқып, қайта көріңіз — білім жинала береді.";
      if (pct >= 90) { medal = "🥇"; title = "Керемет! Сіз нағыз білгір!"; msg = "Қазақтың аспаптарын жақсы білесіз екенсіз. Енді достарыңызға да үйретіңіз!"; }
      else if (pct >= 70) { medal = "🥈"; title = "Өте жақсы!"; msg = "Тағы біраз жаттығып, 100%-ға жетуге болады."; }
      else if (pct >= 50) { medal = "🥉"; title = "Жаман емес!"; msg = "Аспап беттерін қайта оқып, викторинаны тағы бір рет көріңіз."; }

      quizBox.innerHTML =
        '<div class="result-hero">' +
          '<div class="medal" aria-hidden="true">' + medal + '</div>' +
          '<div class="result-score">' + score + ' / ' + qs.length + '</div>' +
          '<h3>' + title + '</h3>' +
          '<p class="lede" style="max-width:520px;margin-inline:auto">' + msg + '</p>' +
        '</div>' +
        (mistakes.length ?
          '<div style="margin-top:1.5rem"><h3>📝 Қайталауға керек сұрақтар</h3>' +
          '<ul class="fact-list">' + mistakes.map(function (m) {
            return '<li><span class="fl-num">!</span><span><strong>' + U.esc(m.q) + '</strong>' +
              '<span>Дұрыс жауап: <b>' + U.esc(m.right) + '</b>. ' + U.esc(m.why) + '</span></span></li>';
          }).join("") + '</ul></div>' : '<p class="center" style="margin-top:1rem">🎉 Бірде-бір қате жоқ — тамаша!</p>') +
        '<div class="row" style="margin-top:1.5rem;justify-content:center">' +
          '<button class="btn btn-lg" id="quizRestart">🔄 Қайта бастау</button>' +
          '<a class="btn btn-lg btn-ghost" href="aspaptar.html">📚 Аспаптарды қайталау</a>' +
        '</div>';

      $("#quizRestart").addEventListener("click", start);

      /* Нәтижені есте сақтау */
      const best = U.store("kz_best") || 0;
      if (score > best) { U.store("kz_best", score); KZ.toast("Жаңа рекорд: " + score + " ұпай! 🏆"); }
    }

    start();
    const bestEl = $("#bestScore");
    if (bestEl) {
      const best = U.store("kz_best") || 0;
      bestEl.textContent = best > 0 ? "Сіздің рекордыңыз: " + best + " ұпай" : "Әзірге рекорд жоқ — бастап көріңіз!";
    }
  }

  /* =========================================================== 2. ЖҰП ТАП */
  const memBox = $("#memoryBox");
  if (memBox) {
    let first = null, lock = false, moves = 0, matched = 0, total = 0, timer = null, sec = 0;

    function build() {
      const picks = U.shuffle(KZ.instruments).slice(0, 6);
      const cards = [];
      picks.forEach(function (i) {
        cards.push({ id: i.id, face: '<span class="mf-emoji">' + i.emoji + '</span>', kind: "emoji" });
        cards.push({ id: i.id, face: i.name, kind: "name" });
      });
      return U.shuffle(cards);
    }

    function start() {
      first = null; lock = false; moves = 0; matched = 0; sec = 0;
      const cards = build();
      total = cards.length / 2;

      memBox.innerHTML =
        '<div class="row-between" style="margin-bottom:1rem">' +
          '<span><b>Жұп:</b> <span id="memPairs">0 / ' + total + '</span></span>' +
          '<span><b>Жүріс:</b> <span id="memMoves">0</span></span>' +
          '<span><b>Уақыт:</b> <span id="memTime">0 с</span></span>' +
          '<button class="btn btn-sm btn-ghost" id="memRestart">🔄 Қайта бастау</button>' +
        '</div>' +
        '<div class="memory-grid" id="memGrid">' +
          cards.map(function (c, k) {
            return '<button class="mcard" data-id="' + c.id + '" data-k="' + k + '" aria-label="Жабық карточка">' +
              '<span class="mcard-inner">' +
                '<span class="mcard-face mcard-back" aria-hidden="true">🎵</span>' +
                '<span class="mcard-face mcard-front">' + c.face + '</span>' +
              '</span></button>';
          }).join("") +
        '</div>';

      $("#memRestart").addEventListener("click", start);
      clearInterval(timer);
      timer = setInterval(function () {
        sec++;
        const t = $("#memTime");
        if (t) t.textContent = sec + " с";
        else clearInterval(timer);
      }, 1000);

      $$(".mcard", memBox).forEach(function (c) {
        c.addEventListener("click", function () { flip(c); });
      });
    }

    function flip(card) {
      if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
      card.classList.add("flipped");
      if (!first) { first = card; return; }

      moves++;
      const mv = $("#memMoves"); if (mv) mv.textContent = moves;

      if (first.dataset.id === card.dataset.id && first.dataset.k !== card.dataset.k) {
        first.classList.add("matched"); card.classList.add("matched");
        first.classList.remove("flipped"); card.classList.remove("flipped");
        first = null; matched++;
        const mp = $("#memPairs"); if (mp) mp.textContent = matched + " / " + total;
        if (KZ.Synth.supported()) KZ.Synth.playNote("string", matched * 2, 0.5);
        if (matched === total) done();
      } else {
        lock = true;
        const a = first, b = card;
        setTimeout(function () {
          a.classList.remove("flipped"); b.classList.remove("flipped");
          first = null; lock = false;
        }, 750);
      }
    }

    function done() {
      clearInterval(timer);
      setTimeout(function () {
        memBox.insertAdjacentHTML("afterbegin",
          '<div class="feedback ok" style="margin-bottom:1rem"><strong>🎉 Барлық жұп табылды!</strong>' +
          '<p style="margin:0">Жүріс саны: ' + moves + ' · Уақыт: ' + sec + ' секунд. Барабарсыз!</p></div>');
        KZ.toast("Жарайсыз! Ойын аяқталды 🎉");
      }, 300);
    }

    start();
  }

  /* =========================================================== 3. ФЛЕШ-КАРТАЛАР */
  const flashBox = $("#flashBox");
  if (flashBox) {
    let list = [], idx = 0;

    function start() {
      list = U.shuffle(KZ.instruments);
      idx = 0;
      render();
    }

    function render() {
      const i = list[idx];
      const g = U.groupById(i.group);
      flashBox.innerHTML =
        '<button class="flash" id="flashCard" aria-label="Карточканы аудару">' +
          '<span class="flash-inner">' +
            '<span class="flash-face flash-front">' +
              '<span class="ff-emoji">' + i.emoji + '</span>' +
              '<strong>' + U.esc(i.name) + '</strong>' +
              '<span class="tag ' + g.tag + '">' + g.name + '</span>' +
              '<span class="ic-desc" style="font-size:.82rem">Аудару үшін басыңыз 👆</span>' +
            '</span>' +
            '<span class="flash-face flash-back">' +
              '<strong>' + U.esc(i.name) + '</strong>' +
              '<span>' + U.esc(i.fact) + '</span>' +
              '<span style="font-size:.85rem">' + U.esc(i.short) + '</span>' +
            '</span>' +
          '</span>' +
        '</button>' +
        '<div class="row-between" style="margin-top:1rem">' +
          '<button class="btn btn-ghost btn-sm" id="flashPrev">← Артқа</button>' +
          '<span><b>' + (idx + 1) + '</b> / ' + list.length + '</span>' +
          '<button class="btn btn-ghost btn-sm" id="flashNext">Алға →</button>' +
        '</div>' +
        '<div class="row" style="margin-top:1rem;justify-content:center">' +
          '<button class="btn btn-sm btn-ghost" id="flashShuffle">🔀 Араластыру</button>' +
          (KZ.Synth.supported() ? '<button class="btn btn-sm" id="flashSound">🔊 Үнін тыңдау</button>' : '') +
          '<a class="btn btn-sm btn-ghost" href="aspap.html?id=' + i.id + '">📖 Толық оқу</a>' +
        '</div>';

      $("#flashCard").addEventListener("click", function () {
        this.classList.toggle("flipped");
      });
      $("#flashPrev").addEventListener("click", function () { idx = (idx - 1 + list.length) % list.length; render(); });
      $("#flashNext").addEventListener("click", function () { idx = (idx + 1) % list.length; render(); });
      $("#flashShuffle").addEventListener("click", start);
      const fs = $("#flashSound");
      if (fs) fs.addEventListener("click", function () { KZ.Synth.playGroup(i.group, i.id); });
    }

    start();
  }

  /* =========================================================== 4. ЫРҒАҚ ЖАТТЫҒУЫ */
  const rhythmBox = $("#rhythmBox");
  if (rhythmBox) {
    const patterns = [
      { name: "Дауылпаз ырғағы", steps: [1, 0, 0, 1, 0, 0, 1, 0], group: "perc", id: "dauylpaz" },
      { name: "Той ырғағы", steps: [1, 0, 1, 0, 1, 1, 0, 0], group: "perc", id: "dangyra" },
      { name: "Жорық дабылы", steps: [1, 1, 0, 1, 0, 1, 1, 0], group: "perc", id: "shyndauyl" }
    ];
    rhythmBox.innerHTML =
      '<div class="row" style="margin-bottom:1rem">' +
        patterns.map(function (p, k) {
          return '<button class="chip" data-pat="' + k + '">' + p.name + '</button>';
        }).join("") +
      '</div>' +
      '<div class="row" style="margin-bottom:1rem">' +
        '<button class="btn btn-sm" id="playPattern" disabled>▶️ Ырғақты тыңдау</button>' +
        '<button class="btn btn-sm btn-ghost" id="stopPattern" disabled>⏹ Тоқтату</button>' +
        '<span class="count-badge" id="rhythmInfo">Алдымен жоғарыдан ырғақ таңдаңыз</span>' +
      '</div>' +
      '<div class="row" id="rhythmDots">' +
        new Array(8).fill(0).map(function (_, k) { return '<span class="tag" data-dot="' + k + '">•</span>'; }).join("") +
      '</div>';

    let current = null, loopId = null, step = 0;
    const chips = $$("#rhythmBox .chip", rhythmBox);
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (o) { o.classList.remove("active"); });
        c.classList.add("active");
        current = patterns[parseInt(c.dataset.pat, 10)];
        $("#playPattern").disabled = false;
        $("#rhythmInfo").textContent = current.name + " таңдалды — «Ырғақты тыңдау» батырмасын басыңыз";
      });
    });

    $("#playPattern").addEventListener("click", function () {
      if (!current || !KZ.Synth.supported()) return;
      KZ.Synth.ensure();
      $("#stopPattern").disabled = false;
      step = 0;
      if (loopId) clearInterval(loopId);
      loopId = setInterval(function () {
        const dots = $$("#rhythmDots .tag");
        dots.forEach(function (d) { d.classList.remove("tag-accent"); });
        if (current.steps[step] === 1) {
          KZ.Synth.playGroup(current.group, current.id);
          if (dots[step]) dots[step].classList.add("tag-accent");
        }
        step = (step + 1) % current.steps.length;
      }, 520);
    });
    $("#stopPattern").addEventListener("click", function () {
      clearInterval(loopId); loopId = null;
      this.disabled = true;
    });
  }
};
