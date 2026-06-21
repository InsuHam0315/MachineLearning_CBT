/* =========================================================================
   common.js — 공통 유틸/스토리지/헤더·푸터 주입/렌더 헬퍼
   모든 페이지에서 가장 먼저 로드. 전역 네임스페이스: window.ML
   ========================================================================= */
(function () {
  "use strict";
  var ML = (window.ML = window.ML || {});

  /* ---- localStorage 키 (요구 스펙) ---- */
  ML.KEYS = {
    user: "mlCurrentUser",
    wrong: "mlWrongNotes",
    records: "mlStudyRecords",
    practice: "mlPracticeState"
  };

  /* ---- 안전한 JSON 스토리지 ---- */
  ML.store = {
    get: function (key, fallback) {
      try {
        var v = localStorage.getItem(key);
        if (v === null || v === undefined) return fallback === undefined ? null : fallback;
        return JSON.parse(v);
      } catch (e) {
        return fallback === undefined ? null : fallback;
      }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
    },
    remove: function (key) { try { localStorage.removeItem(key); } catch (e) {} }
  };

  /* ---- 사용자 ---- */
  ML.getUser = function () { return ML.store.get(ML.KEYS.user, null); };
  ML.setUser = function (u) { ML.store.set(ML.KEYS.user, u); };
  ML.logout = function () { ML.store.remove(ML.KEYS.user); };
  ML.userName = function () { var u = ML.getUser(); return u && u.name ? u.name : null; };

  /* ---- 경로 베이스 (서브폴더 페이지는 body[data-base=".."]) ---- */
  ML.base = function () {
    var b = document.body && document.body.getAttribute("data-base");
    return b || ".";
  };
  ML.url = function (path) {
    var b = ML.base();
    return (b === "." ? "" : b + "/") + path;
  };

  /* ---- HTML 이스케이프 ---- */
  ML.esc = function (s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /* ---- 줄바꿈 보존 텍스트 (CSS white-space:pre-line 과 함께) ---- */
  ML.prose = function (s) { return ML.esc(s); };

  /* ---- 태그 배지 ---- */
  ML.tags = function (arr, variant) {
    if (!arr || !arr.length) return "";
    var cls = "badge" + (variant ? " badge--" + variant : "");
    return '<span class="tag-row">' + arr.map(function (t) {
      return '<span class="' + cls + '">#' + ML.esc(t) + "</span>";
    }).join("") + "</span>";
  };

  /* ---- 기호 설명 표 [{sym,desc}] ---- */
  ML.symbols = function (arr) {
    if (!arr || !arr.length) return "";
    var rows = arr.map(function (o) {
      return "<tr><td>" + ML.esc(o.sym) + "</td><td>" + ML.esc(o.desc) + "</td></tr>";
    }).join("");
    return '<table class="symbol-table"><tbody>' + rows + "</tbody></table>";
  };

  /* ---- 일반 리스트 ---- */
  ML.list = function (arr, cls) {
    if (!arr || !arr.length) return "";
    return '<ul class="' + (cls || "") + '">' + arr.map(function (x) {
      return '<li class="prose">' + ML.prose(x) + "</li>";
    }).join("") + "</ul>";
  };

  /* ---- 풀이 단계 (번호 매김) ---- */
  ML.steps = function (arr) {
    if (!arr || !arr.length) return "";
    return '<ol class="solution-steps">' + arr.map(function (x) {
      return "<li>" + ML.prose(x) + "</li>";
    }).join("") + "</ol>";
  };

  /* ---- 채점 기준 (끝의 (N점) 추출) ---- */
  ML.rubric = function (arr) {
    if (!arr || !arr.length) return "";
    return '<ul class="rubric">' + arr.map(function (x) {
      var m = String(x).match(/[\(\[]\s*([0-9]+\s*점|배점[^\)\]]*)\s*[\)\]]\s*$/);
      var pts = "", text = String(x);
      if (m) { pts = m[1].replace(/\s+/g, ""); text = text.slice(0, m.index).trim(); }
      return '<li><span class="check-ico">✔</span><span class="prose">' + ML.prose(text) + "</span>" +
        (pts ? '<span class="pts">' + ML.esc(pts) + "</span>" : "") + "</li>";
    }).join("") + "</ul>";
  };

  /* ---- 공식 블록 ---- */
  ML.formula = function (s) {
    if (!s) return "";
    return '<div class="formula-block">' + ML.prose(s) + "</div>";
  };

  /* ---- 난이도 점 ---- */
  ML.diffDot = function (d) {
    if (!d) return "";
    return '<span class="badge"><span class="dot-diff diff-' + ML.esc(d) + '"></span>' + ML.esc(d) + "</span>";
  };

  /* ---- 헤더/푸터 주입 ---- */
  var NAV = [
    { label: "홈", path: "index.html", key: "home" },
    { label: "개념", path: "notes/index.html", key: "notes" },
    { label: "공식", path: "notes/index.html#sec-formulas", key: "formulas" },
    { label: "계산형", path: "practice/calculation.html", key: "calc" },
    { label: "서술형", path: "practice/descriptive.html", key: "desc" },
    { label: "모의1", path: "practice/mock-01.html", key: "mock1" },
    { label: "모의2", path: "practice/mock-02.html", key: "mock2" },
    { label: "오답", path: "review/wrong-notes.html", key: "wrong" },
    { label: "기록", path: "stats/study-record.html", key: "records" }
  ];

  ML.injectChrome = function () {
    var active = document.body.getAttribute("data-page") || "";
    var headerEl = document.getElementById("app-header");
    if (headerEl) {
      var navHtml = NAV.map(function (n) {
        var cls = n.key === active ? "is-active" : "";
        return '<a class="' + cls + '" href="' + ML.url(n.path) + '">' + ML.esc(n.label) + "</a>";
      }).join("");

      var uname = ML.userName();
      var chip = uname
        ? '<a class="user-chip" href="' + ML.url("stats/study-record.html") + '" title="학습기록 보기"><span class="dot"></span>' + ML.esc(uname) + "</a>"
        : '<a class="user-chip is-guest" href="' + ML.url("login.html") + '"><span class="dot"></span>게스트 · 로그인</a>';

      headerEl.innerHTML =
        '<div class="site-header__inner">' +
          '<a class="brand" href="' + ML.url("index.html") + '">' +
            '<span class="brand__logo">ML</span>' +
            '<span>머신러닝 기말 대비<small>서술형·계산형 풀이 트레이너</small></span>' +
          "</a>" +
          '<button class="nav-toggle" aria-label="메뉴" id="navToggle">☰</button>' +
          '<nav class="nav" id="mainNav">' + navHtml + "</nav>" +
          '<div class="header-right">' + chip + "</div>" +
        "</div>";

      var toggle = document.getElementById("navToggle");
      var nav = document.getElementById("mainNav");
      if (toggle && nav) {
        toggle.addEventListener("click", function () { nav.classList.toggle("is-open"); });
      }
    }

    var footEl = document.getElementById("app-footer");
    if (footEl) {
      footEl.innerHTML =
        '<div class="container">' +
          "<span>머신러닝 기말고사 서술형·계산형 대비 · 로컬 학습용 정적 사이트</span>" +
          '<span class="muted">데이터는 브라우저 localStorage에만 저장됩니다 · 서버 전송 없음</span>' +
        "</div>";
    }
  };

  /* ---- 토픽/유형 고유값 추출 ---- */
  ML.unique = function (arr) {
    var seen = {}, out = [];
    (arr || []).forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  };

  /* ---- 챕터 제목 조회 ---- */
  ML.chapterTitle = function (id) {
    var list = window.ML_COVERAGE || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i].title;
    return id || "";
  };

  /* ---- 간단 디바운스 ---- */
  ML.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 180); };
  };

  document.addEventListener("DOMContentLoaded", function () {
    try { ML.injectChrome(); } catch (e) { if (window.console) console.warn("chrome inject 실패", e); }
  });
})();
