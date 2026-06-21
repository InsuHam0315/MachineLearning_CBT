/* =========================================================================
   notes.js — 개념노트 페이지 (notes/index.html)
   개념노트(ML_NOTES) + 공식노트(ML_FORMULAS) + 계산예제(ML_EXAMPLES)
   좌측 챕터 네비/검색/필터 + 우측 sticky TOC + 펼침/접기 + 스크롤스파이
   ========================================================================= */
(function () {
  "use strict";
  var ML = window.ML || (window.ML = {});

  function field(label, color, inner) {
    if (!inner) return "";
    return '<div class="field"><span class="field-label"' + (color ? ' style="color:' + color + '"' : "") + ">" + ML.esc(label) + "</span>" + inner + "</div>";
  }

  // 연습 링크를 실제 존재하는 페이지로 정규화 (notes/ 기준 상대경로)
  function safeHref(href) {
    var s = (href || "").toLowerCase();
    if (s.indexOf("descriptive") >= 0) return "../practice/descriptive.html";
    if (s.indexOf("mock-02") >= 0 || s.indexOf("mock_02") >= 0 || s.indexOf("mock2") >= 0) return "../practice/mock-02.html";
    if (s.indexOf("mock") >= 0) return "../practice/mock-01.html";
    if (s.indexOf("wrong") >= 0 || s.indexOf("review") >= 0) return "../review/wrong-notes.html";
    if (s.indexOf("record") >= 0 || s.indexOf("stats") >= 0) return "../stats/study-record.html";
    return "../practice/calculation.html";
  }

  function renderNote(n) {
    var imp = n.importance === "high"
      ? '<span class="badge badge--red">핵심</span>'
      : '<span class="badge badge--blue">보충</span>';
    var h = "";
    h += '<details class="card note-card" data-search="' + ML.esc(((n.title || "") + " " + (n.tags || []).join(" ") + " " + (n.beginnerExplanation || "")).toLowerCase()) + '">';
    h += '<summary><span class="nc-title">' + ML.esc(n.title) + "</span>" + imp;
    if (n.examPoint) h += '<span class="badge badge--violet">시험출제</span>';
    h += '<span class="nc-chev">▸</span></summary>';
    h += '<div class="note-body">';

    if (n.visual) {
      h += '<div class="field"><img src="' + ML.esc(n.visual) + '" alt="' + ML.esc(n.title) + ' 다이어그램" loading="lazy" style="width:100%;max-width:560px;border-radius:12px;border:1px solid var(--border);background:#0a1322"/></div>';
    }

    h += field("초보자를 위한 설명", "var(--cyan)", '<p class="prose">' + ML.prose(n.beginnerExplanation) + "</p>");
    h += field("직관적으로 이해하기", "var(--cyan)", n.intuition ? '<p class="prose">' + ML.prose(n.intuition) + "</p>" : "");
    h += field("형식적 정의", "var(--blue)", n.formalDefinition ? '<p class="prose">' + ML.prose(n.formalDefinition) + "</p>" : "");
    h += field("핵심 공식", "var(--cyan)", n.formulaSummary ? ML.formula(n.formulaSummary) : "");
    h += field("기호 설명", "var(--cyan)", ML.symbols(n.symbolExplanation));
    h += field("논리 전개 (단계별)", "var(--blue)", n.stepByStepLogic && n.stepByStepLogic.length ? ML.steps(n.stepByStepLogic) : "");
    h += field("구체적 예시", "var(--green)", n.concreteExample ? '<p class="prose">' + ML.prose(n.concreteExample) + "</p>" : "");
    h += field("풀이 예시", "var(--green)", n.solvedExample ? '<div class="callout"><p class="prose">' + ML.prose(n.solvedExample) + "</p></div>" : "");

    if (n.descriptiveAnswerTemplate) {
      h += field("서술형 답안 작성 틀", "var(--blue)", '<div class="answer-template"><p class="prose">' + ML.prose(n.descriptiveAnswerTemplate) + "</p></div>");
    }
    if (n.examPoint) {
      h += '<div class="callout callout--exam"><div class="co-head">🎯 시험 출제 포인트</div><p class="prose">' + ML.prose(n.examPoint) + "</p></div>";
    }
    if (n.commonMistakes && n.commonMistakes.length) {
      h += '<div class="callout callout--warn"><div class="co-head">⚠ 자주 하는 실수</div>' + ML.list(n.commonMistakes) + "</div>";
    }
    if (n.quickMemoryTip) {
      h += '<div class="callout callout--tip"><div class="co-head">💡 암기 팁</div><p class="prose">' + ML.prose(n.quickMemoryTip) + "</p></div>";
    }
    if (n.relatedConcepts && n.relatedConcepts.length) {
      h += field("관련 개념", "var(--violet)", ML.tags(n.relatedConcepts, "violet"));
    }

    // 연습 링크 (존재하는 페이지로만 정규화 — 깨진 링크 방지)
    var links = (n.practiceLinks || []).map(function (l) {
      var href = safeHref(l.href || "");
      return '<a class="btn btn--sm btn--accent" href="' + ML.esc(href) + '">' + ML.esc(l.label || "연습하기") + "</a>";
    }).join("");
    if (links) h += '<div class="btn-row" style="margin-top:12px">' + links + "</div>";

    if (n.tags && n.tags.length) h += '<div style="margin-top:12px">' + ML.tags(n.tags, "cyan") + "</div>";
    h += "</div></details>";
    return h;
  }

  function renderFormula(f) {
    var h = "";
    h += '<details class="card note-card" data-search="' + ML.esc(((f.title || "") + " " + (f.tags || []).join(" ")).toLowerCase()) + '">';
    h += '<summary><span class="nc-title">∑ ' + ML.esc(f.title) + '</span><span class="badge badge--violet">' + ML.esc(ML.chapterTitle(f.chapterId)) + '</span><span class="nc-chev">▸</span></summary>';
    h += '<div class="note-body">';
    if (f.original) h += field("원래 식", "var(--text-mut)", ML.formula(f.original));
    h += field("최종적으로 기억할 형태", "var(--cyan)", ML.formula(f.memorize || f.original));
    h += field("기호 설명", "var(--cyan)", ML.symbols(f.symbols));
    h += field("의미", "var(--blue)", f.meaning ? '<p class="prose">' + ML.prose(f.meaning) + "</p>" : "");
    h += field("언제 쓰는가", "var(--green)", f.whenToUse ? '<p class="prose">' + ML.prose(f.whenToUse) + "</p>" : "");
    if (f.numericExample) h += field("짧은 숫자 예", "var(--green)", '<div class="callout"><p class="prose">' + ML.prose(f.numericExample) + "</p></div>");
    if (f.derivation) h += '<details class="callout"><summary class="co-head" style="cursor:pointer;color:var(--text-mut)">필요한 만큼만 보는 전개</summary><p class="prose" style="margin-top:8px">' + ML.prose(f.derivation) + "</p></details>";
    if (f.tags && f.tags.length) h += '<div style="margin-top:12px">' + ML.tags(f.tags, "violet") + "</div>";
    h += "</div></details>";
    return h;
  }

  function renderExample(ex) {
    var h = "";
    h += '<details class="card note-card" data-search="' + ML.esc(((ex.title || "") + " " + (ex.topic || "") + " " + (ex.tags || []).join(" ")).toLowerCase()) + '">';
    h += '<summary><span class="nc-title">✎ ' + ML.esc(ex.title) + '</span>';
    h += '<span class="badge badge--cyan">' + ML.esc(ex.topic || "예제") + '</span>';
    h += '<span class="badge badge--violet">' + ML.esc(ML.chapterTitle(ex.chapterId)) + '</span><span class="nc-chev">▸</span></summary>';
    h += '<div class="note-body">';
    h += field("문제", "var(--blue)", '<p class="prose">' + ML.prose(ex.problem) + "</p>");
    if (ex.given) h += field("주어진 값", "var(--text-mut)", '<div class="formula-block">' + ML.prose(ex.given) + "</div>");
    h += field("풀이", "var(--cyan)", ML.steps(ex.steps));
    if (ex.answer) h += '<div class="callout callout--tip"><div class="co-head">✓ 최종 답</div><p class="prose">' + ML.prose(ex.answer) + "</p></div>";
    if (ex.takeaway) h += '<div class="callout callout--exam"><div class="co-head">🎯 핵심 포인트</div><p class="prose">' + ML.prose(ex.takeaway) + "</p></div>";
    if (ex.tags && ex.tags.length) h += '<div style="margin-top:12px">' + ML.tags(ex.tags, "cyan") + "</div>";
    h += "</div></details>";
    return h;
  }

  function init() {
    var content = document.getElementById("notesContent");
    var tocEl = document.getElementById("notesToc");
    var chipsEl = document.getElementById("chapterChips");
    var searchEl = document.getElementById("notesSearch");
    if (!content) return;

    var notes = window.ML_NOTES || [];
    var formulas = window.ML_FORMULAS || [];
    var examples = window.ML_EXAMPLES || [];
    var chapters = window.ML_COVERAGE || [];
    var state = { q: "", chapter: "" };

    // 챕터 필터 칩
    if (chipsEl) {
      chipsEl.innerHTML = '<button class="chip is-active" data-ch="">전체</button>' +
        chapters.map(function (c) { return '<button class="chip" data-ch="' + c.id + '">' + ML.esc(c.title) + "</button>"; }).join("");
      chipsEl.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        state.chapter = b.getAttribute("data-ch");
        chipsEl.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c === b); });
        render();
      });
    }
    if (searchEl) searchEl.addEventListener("input", ML.debounce(function () { state.q = searchEl.value.trim().toLowerCase(); render(); }, 160));

    function match(searchStr) { return !state.q || (searchStr || "").indexOf(state.q) >= 0; }

    function render() {
      var h = "";
      // 챕터별 개념노트
      chapters.forEach(function (c) {
        if (state.chapter && state.chapter !== c.id) return;
        var chNotes = notes.filter(function (n) { return n.chapterId === c.id; })
          .filter(function (n) { return match(((n.title || "") + " " + (n.tags || []).join(" ") + " " + (n.beginnerExplanation || "")).toLowerCase()); });
        if (!chNotes.length) return;
        var num = c.id.replace("lecture-", "");
        h += '<section id="sec-' + c.id + '" class="notes-section">';
        h += '<div class="chapter-head"><span class="ch-num">' + ML.esc(num) + '</span><h2>' + ML.esc(c.title) + "</h2></div>";
        h += chNotes.map(renderNote).join("");
        h += "</section>";
      });

      // 공식 모음
      var fList = formulas.filter(function (f) { return (!state.chapter || f.chapterId === state.chapter); })
        .filter(function (f) { return match(((f.title || "") + " " + (f.tags || []).join(" ")).toLowerCase()); });
      if (fList.length) {
        h += '<section id="sec-formulas" class="notes-section">';
        h += '<div class="chapter-head"><span class="ch-num">∑</span><h2>공식 모음 (Formula Notes)</h2></div>';
        h += '<p class="muted" style="margin:-6px 0 12px">원래 식 → 기억할 형태 → 기호 → 의미 → 활용 → 숫자 예 순서로 정리했습니다.</p>';
        h += fList.map(renderFormula).join("");
        h += "</section>";
      }

      // 예제 모음
      var eList = examples.filter(function (ex) { return (!state.chapter || ex.chapterId === state.chapter); })
        .filter(function (ex) { return match(((ex.title || "") + " " + (ex.topic || "") + " " + (ex.tags || []).join(" ")).toLowerCase()); });
      if (eList.length) {
        h += '<section id="sec-examples" class="notes-section">';
        h += '<div class="chapter-head"><span class="ch-num">✎</span><h2>계산 예제 (Solved Examples)</h2></div>';
        h += eList.map(renderExample).join("");
        h += "</section>";
      }

      if (!h) h = '<div class="empty-state"><div class="es-ico">🔍</div><p>검색 결과가 없습니다.</p></div>';
      content.innerHTML = h;
      buildToc();
    }

    function buildToc() {
      if (!tocEl) return;
      var items = [];
      chapters.forEach(function (c) {
        if (document.getElementById("sec-" + c.id)) items.push({ id: "sec-" + c.id, label: c.title });
      });
      if (document.getElementById("sec-formulas")) items.push({ id: "sec-formulas", label: "공식 모음" });
      if (document.getElementById("sec-examples")) items.push({ id: "sec-examples", label: "계산 예제" });
      tocEl.innerHTML = "<h4>목차</h4>" + items.map(function (it) {
        return '<a href="#' + it.id + '" data-toc="' + it.id + '">' + ML.esc(it.label) + "</a>";
      }).join("");
    }

    // 스크롤스파이
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return; ticking = true;
      window.requestAnimationFrame(function () {
        var links = tocEl ? tocEl.querySelectorAll("[data-toc]") : [];
        var pos = window.scrollY + 120; var current = null;
        links.forEach(function (a) {
          var sec = document.getElementById(a.getAttribute("data-toc"));
          if (sec && sec.offsetTop <= pos) current = a.getAttribute("data-toc");
        });
        links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("data-toc") === current); });
        ticking = false;
      });
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "notes") init();
  });
})();
