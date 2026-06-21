/* =========================================================================
   records.js — 학습기록 집계 (stats/study-record.html) + 대시보드 요약 공용
   mlStudyRecords.events / mlPracticeState / mlWrongNotes 를 분석
   ========================================================================= */
(function () {
  "use strict";
  var ML = window.ML || (window.ML = {});

  var SC_LABEL = { good: "잘 풀었음", meh: "애매함", bad: "틀림" };
  var SC_VARIANT = { good: "green", meh: "amber", bad: "red" };

  function fmt(ts) {
    try { var d = new Date(ts); return (d.getMonth() + 1) + "/" + d.getDate() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
    catch (e) { return ""; }
  }

  ML.records = {
    /* 순수 집계(DOM 없음) — index/stats 공용 */
    compute: function () {
      var rec = ML.store.get(ML.KEYS.records, { events: [] });
      var events = (rec && rec.events) || [];
      var wrong = ML.store.get(ML.KEYS.wrong, []);
      if (!Array.isArray(wrong)) wrong = [];

      var scDist = { good: 0, meh: 0, bad: 0 };
      var byTopic = {}, byType = {}, byProblem = {};

      events.forEach(function (e) {
        if (scDist[e.sc] !== undefined) scDist[e.sc]++;
        var w = e.sc === "bad" ? 2 : (e.sc === "meh" ? 1 : 0);
        if (e.topic) {
          byTopic[e.topic] = byTopic[e.topic] || { topic: e.topic, score: 0, bad: 0, meh: 0, good: 0, n: 0, lecture: e.sourceLecture };
          byTopic[e.topic].score += w; byTopic[e.topic][e.sc] = (byTopic[e.topic][e.sc] || 0) + 1; byTopic[e.topic].n++;
        }
        if (e.type) {
          byType[e.type] = byType[e.type] || { type: e.type, score: 0, bad: 0, meh: 0, good: 0, n: 0 };
          byType[e.type].score += w; byType[e.type][e.sc] = (byType[e.type][e.sc] || 0) + 1; byType[e.type].n++;
        }
        byProblem[e.id] = e;
      });

      function topList(map, key) {
        return Object.keys(map).map(function (k) { return map[k]; })
          .filter(function (o) { return o.score > 0; })
          .sort(function (a, b) { return b.score - a.score || b.n - a.n; });
      }

      var recent = events.slice().sort(function (a, b) { return b.ts - a.ts; }).slice(0, 14);

      return {
        user: ML.getUser(),
        totalChecks: events.length,
        uniqueCount: Object.keys(byProblem).length,
        scDist: scDist,
        weakTopics: topList(byTopic).slice(0, 8),
        weakTypes: topList(byType).slice(0, 6),
        recent: recent,
        wrongCount: wrong.length
      };
    },

    /* 대시보드(index)용 요약 HTML 조각 */
    summaryCards: function () {
      var s = ML.records.compute();
      var html = "";
      // 최근 기록 요약
      html += '<div class="card"><div class="field-label" style="color:var(--cyan)">📈 최근 학습 요약</div>';
      if (!s.totalChecks) {
        html += '<p class="muted">아직 학습 기록이 없습니다. 연습 문제를 풀고 자가 점검을 눌러보세요.</p>';
      } else {
        html += '<div class="stat-row" style="margin-top:6px">';
        html += '<div class="stat"><div class="num">' + s.totalChecks + '</div><div class="lbl">자가점검 횟수</div></div>';
        html += '<div class="stat"><div class="num">' + s.uniqueCount + '</div><div class="lbl">푼 문항 수</div></div>';
        html += '<div class="stat"><div class="num">' + s.scDist.good + '</div><div class="lbl">잘 풀었음</div></div>';
        html += '<div class="stat"><div class="num">' + s.wrongCount + '</div><div class="lbl">오답노트</div></div>';
        html += "</div>";
      }
      html += '<div class="btn-row" style="margin-top:14px"><a class="btn btn--sm" href="' + ML.url("stats/study-record.html") + '">학습기록 상세 →</a></div>';
      html += "</div>";

      // 약점 토픽 요약
      html += '<div class="card"><div class="field-label" style="color:var(--amber)">🎯 약점 토픽</div>';
      if (!s.weakTopics.length) {
        html += '<p class="muted">약점으로 표시된 토픽이 없습니다. “애매함/틀림”으로 점검하면 여기에 모입니다.</p>';
      } else {
        html += '<div class="tag-row" style="margin-top:4px">';
        s.weakTopics.slice(0, 6).forEach(function (t) {
          html += '<span class="badge badge--amber">' + ML.esc(t.topic) + " · " + (t.bad + t.meh) + "회</span>";
        });
        html += "</div>";
        html += '<div class="btn-row" style="margin-top:14px"><a class="btn btn--sm btn--accent" href="' + ML.url("review/wrong-notes.html") + '">오답노트로 복습 →</a></div>';
      }
      html += "</div>";
      return html;
    },

    /* stats 페이지 렌더 */
    renderStatsPage: function () {
      var mount = document.getElementById("statsRoot");
      if (!mount) return;
      var s = ML.records.compute();
      var h = "";

      // 사용자 + 개요
      var uname = s.user && s.user.name ? s.user.name : "게스트";
      h += '<div class="card" style="margin-bottom:18px"><div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">';
      h += '<div class="brand__logo" style="width:48px;height:48px;font-size:1.1rem">' + ML.esc(uname.slice(0, 2)) + "</div>";
      h += '<div><div style="font-weight:800;font-size:1.15rem">' + ML.esc(uname) + " 님의 학습 현황</div>";
      h += '<div class="muted" style="font-size:.85rem">' + (s.user ? "로컬 로그인 됨" : '게스트 모드 · <a href="' + ML.url("login.html") + '">로그인</a>하면 이름으로 기록됩니다') + "</div></div>";
      h += '<a class="btn btn--ghost btn--sm" href="' + ML.url("login.html") + '" style="margin-left:auto">계정</a>';
      h += "</div></div>";

      // 통계 4칸
      h += '<div class="grid grid--4" style="margin-bottom:18px">';
      h += statCard(s.totalChecks, "총 자가점검", "blue");
      h += statCard(s.uniqueCount, "푼 문항 수", "cyan");
      h += statCard(s.scDist.good, "잘 풀었음", "green");
      h += statCard(s.wrongCount, "오답노트 항목", "amber");
      h += "</div>";

      // 자가점검 분포
      h += '<div class="card" style="margin-bottom:18px"><div class="field-label">자가 점검 분포</div>';
      var tot = s.scDist.good + s.scDist.meh + s.scDist.bad || 1;
      ["good", "meh", "bad"].forEach(function (k) {
        var pct = Math.round((s.scDist[k] / tot) * 100);
        h += '<div class="progress-label"><span>' + SC_LABEL[k] + "</span><span>" + s.scDist[k] + "회 (" + pct + "%)</span></div>";
        h += '<div class="progress" style="margin-bottom:12px"><div class="progress__bar" style="width:' + pct + "%;background:var(--" + SC_VARIANT[k] + ')"></div></div>';
      });
      h += "</div>";

      // 약점 토픽 + 자주 틀리는 유형
      h += '<div class="grid grid--2" style="margin-bottom:18px">';
      h += '<div class="card"><div class="field-label" style="color:var(--amber)">🎯 약점 토픽 Top</div>';
      if (!s.weakTopics.length) h += '<p class="muted">데이터가 쌓이면 약점 토픽이 표시됩니다.</p>';
      else {
        h += '<table class="data-table"><thead><tr><th>토픽</th><th>틀림</th><th>애매</th><th>강도</th></tr></thead><tbody>';
        s.weakTopics.forEach(function (t) {
          h += "<tr><td>" + ML.esc(t.topic) + '</td><td>' + (t.bad || 0) + "</td><td>" + (t.meh || 0) + '</td><td><span class="badge badge--red">' + t.score + "</span></td></tr>";
        });
        h += "</tbody></table>";
      }
      h += "</div>";

      h += '<div class="card"><div class="field-label" style="color:var(--violet)">🔁 자주 틀리는 유형</div>';
      if (!s.weakTypes.length) h += '<p class="muted">데이터가 쌓이면 유형별 약점이 표시됩니다.</p>';
      else {
        h += '<table class="data-table"><thead><tr><th>유형</th><th>틀림</th><th>애매</th><th>강도</th></tr></thead><tbody>';
        s.weakTypes.forEach(function (t) {
          h += "<tr><td>" + ML.esc(t.type) + '</td><td>' + (t.bad || 0) + "</td><td>" + (t.meh || 0) + '</td><td><span class="badge badge--violet">' + t.score + "</span></td></tr>";
        });
        h += "</tbody></table>";
      }
      h += "</div></div>";

      // 최근 기록
      h += '<div class="card" style="margin-bottom:18px"><div class="field-label">🕘 최근 학습 기록</div>';
      if (!s.recent.length) h += '<p class="muted">최근 기록이 없습니다.</p>';
      else {
        h += '<table class="data-table"><thead><tr><th>시각</th><th>토픽</th><th>유형</th><th>결과</th></tr></thead><tbody>';
        s.recent.forEach(function (e) {
          h += "<tr><td class='muted'>" + fmt(e.ts) + "</td><td>" + ML.esc(e.topic || "-") + "</td><td>" + ML.esc(e.type || "-") +
            '</td><td><span class="badge badge--' + (SC_VARIANT[e.sc] || "blue") + '">' + (SC_LABEL[e.sc] || e.sc) + "</span></td></tr>";
        });
        h += "</tbody></table>";
      }
      h += "</div>";

      // 약점 복습 링크 + 초기화
      h += '<div class="btn-row">';
      h += '<a class="btn btn--primary" href="' + ML.url("review/wrong-notes.html") + '">약점 문제 복습하기 →</a>';
      h += '<a class="btn" href="' + ML.url("practice/calculation.html") + '">계산형 더 풀기</a>';
      h += '<a class="btn" href="' + ML.url("practice/descriptive.html") + '">서술형 더 풀기</a>';
      h += '<button class="btn btn--ghost" id="resetRecords" style="margin-left:auto">학습기록 초기화</button>';
      h += "</div>";

      mount.innerHTML = h;

      var reset = document.getElementById("resetRecords");
      if (reset) reset.addEventListener("click", function () {
        if (confirm("학습기록(자가점검 이력)을 초기화할까요? 오답노트는 유지됩니다.")) {
          ML.store.set(ML.KEYS.records, { events: [] });
          ML.records.renderStatsPage();
        }
      });
    }
  };

  function statCard(num, label, variant) {
    return '<div class="card center"><div class="num" style="font-size:2rem;font-weight:900;color:var(--' + variant + ')">' + num + '</div><div class="lbl muted" style="font-weight:600;font-size:.82rem">' + ML.esc(label) + "</div></div>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.body.getAttribute("data-page") === "records") ML.records.renderStatsPage();
  });
})();
