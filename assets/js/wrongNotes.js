/* =========================================================================
   wrongNotes.js — 오답노트 페이지 (review/wrong-notes.html)
   저장된 오답/약점 문제: 내 답안·모범답안·풀이·채점기준 표시, 필터/검색/삭제/다시풀기
   ========================================================================= */
(function () {
  "use strict";
  var ML = window.ML || (window.ML = {});

  var PAGE_URL = {
    "calculation": "practice/calculation.html",
    "descriptive": "practice/descriptive.html",
    "mock-01": "practice/mock-01.html",
    "mock-02": "practice/mock-02.html"
  };

  function load() {
    var list = ML.store.get(ML.KEYS.wrong, []);
    return Array.isArray(list) ? list : [];
  }
  function save(list) { ML.store.set(ML.KEYS.wrong, list); }

  function fmt(ts) {
    try { var d = new Date(ts); return (d.getMonth() + 1) + "/" + d.getDate() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
    catch (e) { return ""; }
  }

  function card(w) {
    var retry = PAGE_URL[w.page] ? ML.url(PAGE_URL[w.page]) + "#prob-" + encodeURIComponent(w.id) : "";
    var h = "";
    h += '<article class="card prob-card" data-id="' + ML.esc(w.id) + '">';
    h += '<div class="prob-head">';
    h += '<span class="prob-id">' + ML.esc(w.id) + "</span>";
    h += '<span class="prob-topic">' + ML.esc(w.topic || "문제") + "</span>";
    if (w.type) h += '<span class="badge badge--blue">' + ML.esc(w.type) + "</span>";
    if (w.difficulty) h += ML.diffDot(w.difficulty);
    if (w.chapterTitle) h += '<span class="badge badge--violet">' + ML.esc(w.chapterTitle) + "</span>";
    h += '<span class="muted" style="margin-left:auto;font-size:.74rem">저장 ' + fmt(w.savedAt) + "</span>";
    h += "</div>";

    h += '<div class="prob-body">';
    h += '<div class="prob-statement">' + ML.prose(w.problem) + "</div>";
    if (w.keyFormula) h += '<div class="field-mini-label">핵심 공식</div>' + ML.formula(w.keyFormula);

    if (w.userAnswer) {
      h += '<div class="field-mini-label">내가 작성한 답안</div>';
      h += '<div class="callout"><p class="prose">' + ML.prose(w.userAnswer) + "</p></div>";
    } else {
      h += '<div class="callout callout--warn"><p>작성한 답안이 없습니다. 다시 풀어보며 답안을 작성해 보세요.</p></div>';
    }

    h += '<details class="reveal reveal--answer" style="margin-top:12px"><summary class="reveal-head" style="cursor:pointer">✓ 모범답안 보기</summary><div class="reveal-body">';
    if (w.answerStructure && w.answerStructure.length) {
      h += '<div class="answer-template">';
      w.answerStructure.forEach(function (s) { h += '<div class="at-step"><b>' + ML.esc(s) + "</b></div>"; });
      h += "</div>";
    }
    h += '<div class="prose">' + ML.prose(w.modelAnswer) + "</div></div></details>";

    h += '<details class="reveal reveal--steps" style="margin-top:10px"><summary class="reveal-head" style="cursor:pointer">↳ 풀이 과정 보기</summary><div class="reveal-body">' + ML.steps(w.solutionSteps);
    if (w.commonMistakes && w.commonMistakes.length) h += '<div class="callout callout--warn" style="margin-top:10px"><div class="co-head">⚠ 자주 하는 실수</div>' + ML.list(w.commonMistakes) + "</div>";
    h += "</div></details>";

    h += '<details class="reveal reveal--rubric" style="margin-top:10px"><summary class="reveal-head" style="cursor:pointer">⚖ 채점 기준 보기</summary><div class="reveal-body">' + ML.rubric(w.scoringRubric) + "</div></details>";

    h += '<div class="btn-row" style="margin-top:14px">';
    if (retry) h += '<a class="btn btn--primary btn--sm" href="' + retry + '">다시 풀기 →</a>';
    h += '<button class="btn btn--ghost btn--sm" data-action="del" data-id="' + ML.esc(w.id) + '">이 항목 삭제</button>';
    h += "</div>";

    if (w.tags && w.tags.length) h += '<div style="margin-top:12px">' + ML.tags(w.tags, "cyan") + "</div>";
    h += "</div></article>";
    return h;
  }

  function init() {
    var mount = document.getElementById("wrongList");
    if (!mount) return;
    var filter = { q: "", topic: "", type: "" };

    function visible() {
      var list = load();
      return list.filter(function (w) {
        if (filter.topic && w.topic !== filter.topic) return false;
        if (filter.type && w.type !== filter.type) return false;
        if (filter.q) {
          var hay = (w.problem + " " + w.topic + " " + (w.tags || []).join(" ")).toLowerCase();
          if (hay.indexOf(filter.q.toLowerCase()) < 0) return false;
        }
        return true;
      });
    }

    function buildFilters() {
      var list = load();
      var topics = ML.unique(list.map(function (w) { return w.topic; }));
      var types = ML.unique(list.map(function (w) { return w.type; }));
      var tb = document.getElementById("wrongToolbar");
      if (tb) {
        tb.innerHTML =
          '<input class="search-input" id="wrongSearch" placeholder="🔍 오답 검색" />' +
          '<select class="select" id="wrongTopic"><option value="">토픽 전체</option>' + topics.map(function (t) { return "<option>" + ML.esc(t) + "</option>"; }).join("") + "</select>" +
          '<select class="select" id="wrongType"><option value="">유형 전체</option>' + types.map(function (t) { return "<option>" + ML.esc(t) + "</option>"; }).join("") + "</select>" +
          '<button class="btn btn--ghost btn--sm" id="clearAll" style="margin-left:auto">전체 비우기</button>';
        var s = document.getElementById("wrongSearch");
        if (s) s.addEventListener("input", ML.debounce(function () { filter.q = s.value; render(); }, 160));
        var tp = document.getElementById("wrongTopic");
        if (tp) tp.addEventListener("change", function () { filter.topic = tp.value; render(); });
        var ty = document.getElementById("wrongType");
        if (ty) ty.addEventListener("change", function () { filter.type = ty.value; render(); });
        var ca = document.getElementById("clearAll");
        if (ca) ca.addEventListener("click", function () {
          if (confirm("오답노트를 모두 비울까요? 되돌릴 수 없습니다.")) { save([]); buildFilters(); render(); }
        });
      }
    }

    function render() {
      var list = load();
      var countEl = document.getElementById("wrongCount");
      if (countEl) countEl.textContent = list.length;
      var vis = visible();
      if (!list.length) {
        mount.innerHTML = '<div class="empty-state"><div class="es-ico">🗒️</div><p>저장된 오답이 없습니다.<br>연습·모의고사에서 “오답노트에 저장”을 누르거나 “틀림”으로 점검하면 자동으로 모입니다.</p>' +
          '<div class="btn-row" style="justify-content:center;margin-top:14px"><a class="btn btn--primary" href="' + ML.url("practice/calculation.html") + '">계산형 연습 시작</a><a class="btn" href="' + ML.url("practice/descriptive.html") + '">서술형 연습 시작</a></div></div>';
        return;
      }
      if (!vis.length) { mount.innerHTML = '<div class="empty-state"><div class="es-ico">🔍</div><p>조건에 맞는 오답이 없습니다.</p></div>'; return; }
      mount.innerHTML = vis.map(card).join("");
    }

    mount.addEventListener("click", function (e) {
      var del = e.target.closest('[data-action="del"]');
      if (del) {
        var id = del.getAttribute("data-id");
        var list = load().filter(function (w) { return w.id !== id; });
        save(list); buildFilters(); render();
      }
    });

    buildFilters();
    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "wrong") init();
  });
})();
