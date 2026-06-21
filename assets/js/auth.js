/* =========================================================================
   auth.js — 로컬 로그인/로그아웃 (서버 인증 없음, localStorage 전용)
   login.html 에서 사용. mlCurrentUser = { name, sid, since }
   ========================================================================= */
(function () {
  "use strict";
  var ML = window.ML || {};

  function fmtDate(ts) {
    try {
      var d = new Date(ts);
      return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
    } catch (e) { return ""; }
  }

  ML.auth = {
    login: function (name, sid) {
      name = (name || "").trim();
      if (!name) return { ok: false, msg: "이름(또는 닉네임)을 입력해 주세요." };
      var prev = ML.getUser();
      var user = {
        name: name,
        sid: (sid || "").trim(),
        since: prev && prev.since ? prev.since : Date.now()
      };
      ML.setUser(user);
      return { ok: true, user: user };
    },
    logout: function () { ML.logout(); }
  };

  /* ---- login.html 폼 바인딩 ---- */
  function initLoginPage() {
    var form = document.getElementById("loginForm");
    var statusBox = document.getElementById("authStatus");
    var current = ML.getUser();

    function renderStatus() {
      current = ML.getUser();
      if (!statusBox) return;
      if (current) {
        statusBox.innerHTML =
          '<div class="callout callout--tip"><div class="co-head">✔ 로그인 상태</div>' +
          "<p><b>" + ML.esc(current.name) + "</b>" +
          (current.sid ? " · " + ML.esc(current.sid) : "") +
          " 님으로 로그인되어 있습니다. (시작일 " + fmtDate(current.since) + ")</p></div>" +
          '<div class="btn-row" style="margin-top:12px">' +
          '<a class="btn btn--primary" href="' + ML.url("index.html") + '">대시보드로 이동 →</a>' +
          '<button type="button" class="btn btn--ghost" id="logoutBtn">로그아웃</button></div>';
        var lo = document.getElementById("logoutBtn");
        if (lo) lo.addEventListener("click", function () {
          ML.auth.logout();
          var f = document.getElementById("loginForm");
          if (f) f.reset();
          renderStatus();
          renderFormVisibility();
        });
      } else {
        statusBox.innerHTML =
          '<div class="callout callout--warn"><div class="co-head">로그인되지 않음</div>' +
          "<p>이름만 입력하면 바로 시작할 수 있습니다. 모든 기록은 이 브라우저에만 저장됩니다.</p></div>";
      }
    }

    function renderFormVisibility() {
      current = ML.getUser();
      if (form) form.style.display = current ? "none" : "block";
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var name = document.getElementById("nameInput").value;
        var sid = document.getElementById("sidInput") ? document.getElementById("sidInput").value : "";
        var res = ML.auth.login(name, sid);
        var err = document.getElementById("loginError");
        if (!res.ok) { if (err) { err.textContent = res.msg; err.style.display = "block"; } return; }
        if (err) err.style.display = "none";
        // 로그인 후 대시보드로
        window.location.href = ML.url("index.html");
      });
    }

    renderStatus();
    renderFormVisibility();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "login") initLoginPage();
  });

  window.ML = ML;
})();
