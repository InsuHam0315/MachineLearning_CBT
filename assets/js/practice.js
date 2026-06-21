/* =========================================================================
   practice.js — 서술형·계산형 풀이 엔진
   calculation / descriptive / mock-01 / mock-02 페이지 공용.
   문제 표시 · 답안 작성 · 모범답안/풀이/채점기준 공개 · 오답노트 저장 · 자가점검
   ========================================================================= */
(function () {
  "use strict";
  var ML = window.ML || (window.ML = {});

  /* ---- 학습 기록 이벤트 적재 ---- */
  function logEvent(ev) {
    var rec = ML.store.get(ML.KEYS.records, { events: [] });
    if (!rec || typeof rec !== "object") rec = { events: [] };
    if (!rec.events) rec.events = [];
    rec.events.push(ev);
    if (rec.events.length > 800) rec.events = rec.events.slice(rec.events.length - 800);
    ML.store.set(ML.KEYS.records, rec);
  }

  /* ---- 연습 상태(답안/자가점검) 저장·복원 ---- */
  function getState(pageKey) {
    var all = ML.store.get(ML.KEYS.practice, {});
    if (!all || typeof all !== "object") all = {};
    if (!all[pageKey]) all[pageKey] = {};
    return all;
  }
  function saveState(all) { ML.store.set(ML.KEYS.practice, all); }

  /* ---- 오답노트 저장 ---- */
  function saveWrong(p, userAnswer, pageKey) {
    var list = ML.store.get(ML.KEYS.wrong, []);
    if (!Array.isArray(list)) list = [];
    // 같은 id 있으면 갱신
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === p.id) { idx = i; break; }
    var entry = {
      id: p.id,
      sourceLecture: p.sourceLecture || p.chapterId || "",
      chapterTitle: ML.chapterTitle(p.sourceLecture || p.chapterId || ""),
      topic: p.topic || "",
      type: p.type || "",
      difficulty: p.difficulty || "",
      problem: p.problem || "",
      answerFormat: p.answerFormat || "",
      keyFormula: p.keyFormula || "",
      userAnswer: userAnswer || "",
      modelAnswer: p.modelAnswer || "",
      solutionSteps: p.solutionSteps || [],
      scoringRubric: p.scoringRubric || [],
      commonMistakes: p.commonMistakes || [],
      answerStructure: p.answerStructure || [],
      tags: p.tags || [],
      page: pageKey,
      savedAt: Date.now()
    };
    if (idx >= 0) list[idx] = entry; else list.push(entry);
    ML.store.set(ML.KEYS.wrong, list);
    return idx < 0; // true=새로 추가
  }
  function isInWrong(id) {
    var list = ML.store.get(ML.KEYS.wrong, []);
    if (!Array.isArray(list)) return false;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return true;
    return false;
  }

  /* ---- 문제 카드 렌더 ---- */
  function renderCard(p, idx, pageKey, saved) {
    var st = (saved && saved[p.id]) || {};
    var chTitle = ML.chapterTitle(p.sourceLecture || p.chapterId || "");
    var isDescriptive = (p.answerStructure && p.answerStructure.length) ||
      p.type === "서술형" || p.type === "비교형" || p.type === "공식해석";

    var html = "";
    html += '<article class="card prob-card" id="prob-' + ML.esc(p.id) + '" data-id="' + ML.esc(p.id) + '">';

    // 헤더
    html += '<div class="prob-head">';
    html += '<span class="prob-id">' + ML.esc(p.id) + "</span>";
    html += '<span class="prob-topic">Q' + (idx + 1) + ". " + ML.esc(p.topic || "문제") + "</span>";
    if (p.type) html += '<span class="badge badge--blue">' + ML.esc(p.type) + "</span>";
    if (p.difficulty) html += ML.diffDot(p.difficulty);
    if (chTitle) html += '<span class="badge badge--violet">' + ML.esc(chTitle) + "</span>";
    html += "</div>";

    // 본문
    html += '<div class="prob-body">';
    html += '<div class="prob-statement">' + ML.prose(p.problem) + "</div>";

    if (p.answerFormat) {
      html += '<div class="callout"><div class="co-head">📝 답안 형식</div><p class="prose">' + ML.prose(p.answerFormat) + "</p></div>";
    }
    if (p.keyFormula) {
      html += '<div class="field-mini-label">핵심 공식</div>' + ML.formula(p.keyFormula);
    }

    // 답안 + 스크래치
    html += '<div class="field-mini-label">내 답안</div>';
    html += '<textarea class="answer-area" data-role="answer" placeholder="여기에 답안을 작성하세요. 계산형은 풀이 과정을, 서술형은 핵심 정의→비교 기준→예시→결론 순서로...">' + ML.esc(st.answer || "") + "</textarea>";
    html += '<div class="field-mini-label">계산 메모 (스크래치패드)</div>';
    html += '<textarea class="scratch-area" data-role="scratch" placeholder="자유롭게 계산·메모. 채점에는 포함되지 않습니다.">' + ML.esc(st.scratch || "") + "</textarea>";

    // 액션 버튼
    html += '<div class="btn-row" style="margin-top:14px">';
    html += '<button class="btn btn--accent btn--sm" data-action="reveal" data-target="answer">모범답안 보기</button>';
    html += '<button class="btn btn--sm" data-action="reveal" data-target="steps">풀이 과정 보기</button>';
    html += '<button class="btn btn--violet btn--sm" data-action="reveal" data-target="rubric">채점 기준 보기</button>';
    html += '<button class="btn btn--ghost btn--sm" data-action="wrong">' + (isInWrong(p.id) ? "✔ 오답노트 저장됨" : "오답노트에 저장") + "</button>";
    html += '<span class="save-flash" data-role="flash"></span>';
    html += "</div>";

    // 공개 영역: 모범답안
    html += '<div class="reveal reveal--answer" data-reveal="answer" hidden>';
    html += '<div class="reveal-head">✓ 모범답안</div><div class="reveal-body">';
    if (isDescriptive && p.answerStructure && p.answerStructure.length) {
      html += '<div class="answer-template"><div class="co-head" style="color:var(--blue);margin-bottom:6px">서술형 답안 구조</div>';
      p.answerStructure.forEach(function (s) {
        html += '<div class="at-step"><b>' + ML.esc(s) + "</b></div>";
      });
      html += "</div>";
    }
    html += '<div class="prose">' + ML.prose(p.modelAnswer) + "</div>";
    html += "</div></div>";

    // 공개 영역: 풀이 과정 + 자주하는 실수
    html += '<div class="reveal reveal--steps" data-reveal="steps" hidden>';
    html += '<div class="reveal-head">↳ 풀이 과정</div><div class="reveal-body">';
    html += ML.steps(p.solutionSteps);
    if (p.commonMistakes && p.commonMistakes.length) {
      html += '<div class="callout callout--warn" style="margin-top:12px"><div class="co-head">⚠ 자주 하는 실수</div>' + ML.list(p.commonMistakes) + "</div>";
    }
    html += "</div></div>";

    // 공개 영역: 채점 기준
    html += '<div class="reveal reveal--rubric" data-reveal="rubric" hidden>';
    html += '<div class="reveal-head">⚖ 채점 기준</div><div class="reveal-body">' + ML.rubric(p.scoringRubric) + "</div></div>";

    // 자가 점검
    html += '<div class="selfcheck">';
    html += '<span class="sc-label">자가 점검:</span>';
    html += '<button class="sc-btn" data-sc="good">잘 풀었음</button>';
    html += '<button class="sc-btn" data-sc="meh">애매함</button>';
    html += '<button class="sc-btn" data-sc="bad">틀림</button>';
    html += "</div>";

    if (p.tags && p.tags.length) html += '<div style="margin-top:12px">' + ML.tags(p.tags, "cyan") + "</div>";

    html += "</div></article>";
    return html;
  }

  /* ---- 자가점검 표시 갱신 ---- */
  function paintSelfcheck(card, sc) {
    card.querySelectorAll(".sc-btn").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-sc") === sc);
    });
  }

  /* ---- 진행률 ---- */
  function updateProgress(opts, data, saved) {
    var bar = document.getElementById(opts.progressId);
    var lbl = document.getElementById(opts.progressLabelId);
    if (!bar && !lbl) return;
    var done = 0;
    data.forEach(function (p) { if (saved[p.id] && saved[p.id].sc) done++; });
    var pct = data.length ? Math.round((done / data.length) * 100) : 0;
    if (bar) bar.style.width = pct + "%";
    if (lbl) lbl.textContent = done + " / " + data.length + " 문항 점검 (" + pct + "%)";
  }

  /* ---- 메인 마운트 ---- */
  ML.practice = {
    mount: function (opts) {
      var mount = document.getElementById(opts.mountId);
      if (!mount) return;
      var data = (opts.data || []).slice();

      // 유형 필터(페이지별)
      if (opts.filterTypes && opts.filterTypes.length) {
        data = data.filter(function (p) { return opts.filterTypes.indexOf(p.type) >= 0; });
      }
      if (!data.length) {
        mount.innerHTML = '<div class="empty-state"><div class="es-ico">🗂️</div><p>표시할 문제가 없습니다. 데이터 파일을 확인하세요.</p></div>';
        return;
      }

      var pageKey = opts.pageKey;
      var stateAll = getState(pageKey);
      var saved = stateAll[pageKey];

      // 필터 상태
      var filter = { q: "", topic: "", type: "", diff: "" };

      function visible() {
        return data.filter(function (p) {
          if (filter.topic && p.topic !== filter.topic) return false;
          if (filter.type && p.type !== filter.type) return false;
          if (filter.diff && p.difficulty !== filter.diff) return false;
          if (filter.q) {
            var hay = (p.problem + " " + p.topic + " " + (p.tags || []).join(" ") + " " + ML.chapterTitle(p.sourceLecture)).toLowerCase();
            if (hay.indexOf(filter.q.toLowerCase()) < 0) return false;
          }
          return true;
        });
      }

      function renderList() {
        var vis = visible();
        if (!vis.length) {
          mount.innerHTML = '<div class="empty-state"><div class="es-ico">🔍</div><p>조건에 맞는 문제가 없습니다.</p></div>';
          return;
        }
        mount.innerHTML = vis.map(function (p, i) { return renderCard(p, data.indexOf(p), pageKey, saved); }).join("");
        // 자가점검 상태 칠하기
        vis.forEach(function (p) {
          var card = document.getElementById("prob-" + p.id);
          if (card && saved[p.id] && saved[p.id].sc) paintSelfcheck(card, saved[p.id].sc);
        });
        updateProgress(opts, data, saved);
      }

      // 툴바(검색 + 필터칩)
      if (opts.toolbarId) {
        var tb = document.getElementById(opts.toolbarId);
        if (tb) {
          var topics = ML.unique(data.map(function (p) { return p.topic; }));
          var types = ML.unique(data.map(function (p) { return p.type; }));
          var h = "";
          h += '<input class="search-input" id="' + pageKey + '-search" placeholder="🔍 문제·토픽·태그 검색" />';
          h += '<select class="select" id="' + pageKey + '-type"><option value="">유형 전체</option>' +
            types.map(function (t) { return '<option value="' + ML.esc(t) + '">' + ML.esc(t) + "</option>"; }).join("") + "</select>";
          h += '<select class="select" id="' + pageKey + '-diff"><option value="">난이도 전체</option><option>기본</option><option>표준</option><option>심화</option></select>';
          tb.innerHTML = h;
          var topicWrap = document.getElementById(opts.topicChipsId);
          if (topicWrap) {
            topicWrap.innerHTML = '<button class="chip is-active" data-topic="">전체 토픽</button>' +
              topics.map(function (t) { return '<button class="chip" data-topic="' + ML.esc(t) + '">' + ML.esc(t) + "</button>"; }).join("");
            topicWrap.addEventListener("click", function (e) {
              var b = e.target.closest(".chip"); if (!b) return;
              filter.topic = b.getAttribute("data-topic");
              topicWrap.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c === b); });
              renderList();
            });
          }
          var si = document.getElementById(pageKey + "-search");
          if (si) si.addEventListener("input", ML.debounce(function () { filter.q = si.value; renderList(); }, 160));
          var ty = document.getElementById(pageKey + "-type");
          if (ty) ty.addEventListener("change", function () { filter.type = ty.value; renderList(); });
          var df = document.getElementById(pageKey + "-diff");
          if (df) df.addEventListener("change", function () { filter.diff = df.value; renderList(); });
        }
      }

      // 이벤트 위임
      mount.addEventListener("click", function (e) {
        var card = e.target.closest(".prob-card");
        if (!card) return;
        var id = card.getAttribute("data-id");
        var p = null;
        for (var i = 0; i < data.length; i++) if (data[i].id === id) { p = data[i]; break; }
        if (!p) return;

        var revealBtn = e.target.closest('[data-action="reveal"]');
        if (revealBtn) {
          var target = revealBtn.getAttribute("data-target");
          var box = card.querySelector('[data-reveal="' + target + '"]');
          if (box) {
            var nowHidden = box.hasAttribute("hidden");
            if (nowHidden) box.removeAttribute("hidden"); else box.setAttribute("hidden", "");
            revealBtn.classList.toggle("is-on", nowHidden);
          }
          return;
        }

        var wrongBtn = e.target.closest('[data-action="wrong"]');
        if (wrongBtn) {
          var ans = card.querySelector('[data-role="answer"]');
          var added = saveWrong(p, ans ? ans.value : "", pageKey);
          wrongBtn.textContent = "✔ 오답노트 저장됨";
          flash(card, added ? "오답노트에 저장했습니다" : "오답노트를 갱신했습니다");
          return;
        }

        var scBtn = e.target.closest(".sc-btn");
        if (scBtn) {
          var sc = scBtn.getAttribute("data-sc");
          var ansEl = card.querySelector('[data-role="answer"]');
          var scrEl = card.querySelector('[data-role="scratch"]');
          saved[p.id] = saved[p.id] || {};
          saved[p.id].sc = sc;
          saved[p.id].answer = ansEl ? ansEl.value : "";
          saved[p.id].scratch = scrEl ? scrEl.value : "";
          saved[p.id].ts = Date.now();
          saveState(stateAll);
          paintSelfcheck(card, sc);
          logEvent({
            page: pageKey, id: p.id, topic: p.topic || "", type: p.type || "",
            sourceLecture: p.sourceLecture || p.chapterId || "", sc: sc, ts: Date.now()
          });
          // 틀림/애매함이면 오답노트 자동 보강 저장
          if (sc === "bad") {
            saveWrong(p, ansEl ? ansEl.value : "", pageKey);
            var wb = card.querySelector('[data-action="wrong"]');
            if (wb) wb.textContent = "✔ 오답노트 저장됨";
          }
          flash(card, "기록되었습니다 · 학습기록에 반영");
          updateProgress(opts, data, saved);
          return;
        }
      });

      // 답안 입력 자동 저장(디바운스)
      mount.addEventListener("input", ML.debounce(function (e) {
        var role = e.target.getAttribute && e.target.getAttribute("data-role");
        if (role !== "answer" && role !== "scratch") return;
        var card = e.target.closest(".prob-card"); if (!card) return;
        var id = card.getAttribute("data-id");
        saved[id] = saved[id] || {};
        var ansEl = card.querySelector('[data-role="answer"]');
        var scrEl = card.querySelector('[data-role="scratch"]');
        saved[id].answer = ansEl ? ansEl.value : "";
        saved[id].scratch = scrEl ? scrEl.value : "";
        saveState(stateAll);
      }, 400));

      function flash(card, msg) {
        var f = card.querySelector('[data-role="flash"]');
        if (!f) return;
        f.textContent = msg; f.classList.add("show");
        setTimeout(function () { f.classList.remove("show"); }, 1800);
      }

      renderList();
    }
  };
})();
