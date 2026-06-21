"use client";
import { useEffect, useMemo, useState } from "react";
import { KEYS, getItem, setItem, logEvent, chapterTitle, unique } from "@/lib/storage";
import { FormulaBlock, Prose, Steps, Rubric, ProseList, Tags, DiffDot, MathText } from "@/components/ui";

function loadState(pageKey: string): Record<string, any> {
  const all = getItem<Record<string, any>>(KEYS.practice, {});
  return all[pageKey] || {};
}
function saveProblemState(pageKey: string, id: string, patch: any) {
  const all = getItem<Record<string, any>>(KEYS.practice, {});
  all[pageKey] = all[pageKey] || {};
  all[pageKey][id] = { ...(all[pageKey][id] || {}), ...patch };
  setItem(KEYS.practice, all);
}
function isInWrong(id: string): boolean {
  const l = getItem<any[]>(KEYS.wrong, []);
  return Array.isArray(l) && l.some((w) => w.id === id);
}
function saveWrong(p: any, userAnswer: string, pageKey: string): boolean {
  let list = getItem<any[]>(KEYS.wrong, []);
  if (!Array.isArray(list)) list = [];
  const idx = list.findIndex((w) => w.id === p.id);
  const entry = {
    id: p.id, sourceLecture: p.sourceLecture || p.chapterId || "",
    chapterTitle: chapterTitle(p.sourceLecture || p.chapterId || ""),
    topic: p.topic || "", type: p.type || "", difficulty: p.difficulty || "",
    problem: p.problem || "", answerFormat: p.answerFormat || "", keyFormula: p.keyFormula || "",
    userAnswer: userAnswer || "", modelAnswer: p.modelAnswer || "",
    solutionSteps: p.solutionSteps || [], scoringRubric: p.scoringRubric || [],
    commonMistakes: p.commonMistakes || [], answerStructure: p.answerStructure || [],
    tags: p.tags || [], page: pageKey, savedAt: Date.now(),
  };
  if (idx >= 0) list[idx] = entry; else list.push(entry);
  setItem(KEYS.wrong, list);
  return idx < 0;
}

function ProblemCard({ p, idx, pageKey, onChange }: { p: any; idx: number; pageKey: string; onChange: () => void }) {
  const [answer, setAnswer] = useState("");
  const [scratch, setScratch] = useState("");
  const [sc, setSc] = useState("");
  const [reveal, setReveal] = useState<{ answer: boolean; steps: boolean; rubric: boolean }>({ answer: false, steps: false, rubric: false });
  const [inWrong, setInWrong] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const st = loadState(pageKey)[p.id] || {};
    setAnswer(st.answer || ""); setScratch(st.scratch || ""); setSc(st.sc || "");
    setInWrong(isInWrong(p.id));
  }, [p.id, pageKey]);

  useEffect(() => {
    const t = setTimeout(() => saveProblemState(pageKey, p.id, { answer, scratch }), 400);
    return () => clearTimeout(t);
  }, [answer, scratch, pageKey, p.id]);

  function flashMsg(m: string) { setFlash(m); setTimeout(() => setFlash(""), 1800); }
  function doSelfcheck(v: string) {
    setSc(v);
    saveProblemState(pageKey, p.id, { sc: v, answer, scratch, ts: Date.now() });
    logEvent({ page: pageKey, id: p.id, topic: p.topic || "", type: p.type || "", sourceLecture: p.sourceLecture || p.chapterId || "", sc: v, ts: Date.now() });
    if (v === "bad") { saveWrong(p, answer, pageKey); setInWrong(true); }
    flashMsg("기록되었습니다 · 학습기록 반영");
    onChange();
  }
  function doSaveWrong() { const added = saveWrong(p, answer, pageKey); setInWrong(true); flashMsg(added ? "오답노트에 저장했습니다" : "오답노트를 갱신했습니다"); }

  const isDescriptive = (p.answerStructure && p.answerStructure.length) || ["서술형", "비교형", "공식해석"].includes(p.type);
  const chTitle = chapterTitle(p.sourceLecture || p.chapterId || "");

  return (
    <article className="card prob-card" id={"prob-" + p.id}>
      <div className="prob-head">
        <span className="prob-id">{p.id}</span>
        <span className="prob-topic">Q{idx + 1}. {p.topic || "문제"}</span>
        {p.type ? <span className="badge badge--blue">{p.type}</span> : null}
        {p.difficulty ? <DiffDot d={p.difficulty} /> : null}
        {chTitle ? <span className="badge badge--violet">{chTitle}</span> : null}
      </div>
      <div className="prob-body">
        <div className="prob-statement"><Prose value={p.problem} /></div>

        {p.answerFormat ? (
          <div className="callout"><div className="co-head">📝 답안 형식</div><p className="prose">{p.answerFormat}</p></div>
        ) : null}
        {p.keyFormula ? (<><div className="field-mini-label">핵심 공식</div><FormulaBlock value={p.keyFormula} /></>) : null}

        <div className="field-mini-label">내 답안</div>
        <textarea className="answer-area" value={answer} onChange={(e) => setAnswer(e.target.value)}
          placeholder="여기에 답안을 작성하세요. 계산형은 풀이 과정을, 서술형은 핵심 정의→비교 기준→예시→결론 순서로..." />
        <div className="field-mini-label">계산 메모 (스크래치패드)</div>
        <textarea className="scratch-area" value={scratch} onChange={(e) => setScratch(e.target.value)}
          placeholder="자유롭게 계산·메모. 채점에는 포함되지 않습니다." />

        <div className="btn-row" style={{ marginTop: 14 }}>
          <button className={"btn btn--accent btn--sm" + (reveal.answer ? " is-on" : "")} onClick={() => setReveal((r) => ({ ...r, answer: !r.answer }))}>모범답안 보기</button>
          <button className={"btn btn--sm" + (reveal.steps ? " is-on" : "")} onClick={() => setReveal((r) => ({ ...r, steps: !r.steps }))}>풀이 과정 보기</button>
          <button className={"btn btn--violet btn--sm" + (reveal.rubric ? " is-on" : "")} onClick={() => setReveal((r) => ({ ...r, rubric: !r.rubric }))}>채점 기준 보기</button>
          <button className="btn btn--ghost btn--sm" onClick={doSaveWrong}>{inWrong ? "✔ 오답노트 저장됨" : "오답노트에 저장"}</button>
          <span className={"save-flash" + (flash ? " show" : "")}>{flash}</span>
        </div>

        {reveal.answer ? (
          <div className="reveal reveal--answer">
            <div className="reveal-head">✓ 모범답안</div>
            <div className="reveal-body">
              {isDescriptive && p.answerStructure && p.answerStructure.length ? (
                <div className="answer-template">
                  <div className="co-head" style={{ color: "var(--blue)", marginBottom: 6 }}>서술형 답안 구조</div>
                  {p.answerStructure.map((s: string, i: number) => <div className="at-step" key={i}><b>{s}</b></div>)}
                </div>
              ) : null}
              <div className="prose">{p.modelAnswer}</div>
            </div>
          </div>
        ) : null}

        {reveal.steps ? (
          <div className="reveal reveal--steps">
            <div className="reveal-head">↳ 풀이 과정</div>
            <div className="reveal-body">
              <Steps items={p.solutionSteps} />
              {p.commonMistakes && p.commonMistakes.length ? (
                <div className="callout callout--warn" style={{ marginTop: 12 }}>
                  <div className="co-head">⚠ 자주 하는 실수</div><ProseList items={p.commonMistakes} />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {reveal.rubric ? (
          <div className="reveal reveal--rubric">
            <div className="reveal-head">⚖ 채점 기준</div>
            <div className="reveal-body"><Rubric items={p.scoringRubric} /></div>
          </div>
        ) : null}

        <div className="selfcheck">
          <span className="sc-label">자가 점검:</span>
          <button className={"sc-btn" + (sc === "good" ? " is-on" : "")} data-sc="good" onClick={() => doSelfcheck("good")}>잘 풀었음</button>
          <button className={"sc-btn" + (sc === "meh" ? " is-on" : "")} data-sc="meh" onClick={() => doSelfcheck("meh")}>애매함</button>
          <button className={"sc-btn" + (sc === "bad" ? " is-on" : "")} data-sc="bad" onClick={() => doSelfcheck("bad")}>틀림</button>
        </div>

        {p.tags && p.tags.length ? <div style={{ marginTop: 12 }}><Tags items={p.tags} variant="cyan" /></div> : null}
      </div>
    </article>
  );
}

export default function PracticeList({ data, pageKey, filterTypes, showToolbar = true, progress = true }:
  { data: any[]; pageKey: string; filterTypes?: string[]; showToolbar?: boolean; progress?: boolean }) {
  const base = useMemo(() => (filterTypes && filterTypes.length ? data.filter((p) => filterTypes.includes(p.type)) : data), [data, filterTypes]);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");
  const [diff, setDiff] = useState("");
  const [tick, setTick] = useState(0);

  const topics = useMemo(() => unique(base.map((p) => p.topic)), [base]);
  const types = useMemo(() => unique(base.map((p) => p.type)), [base]);

  const visible = base.filter((p) => {
    if (topic && p.topic !== topic) return false;
    if (type && p.type !== type) return false;
    if (diff && p.difficulty !== diff) return false;
    if (q) {
      const hay = (p.problem + " " + p.topic + " " + (p.tags || []).join(" ") + " " + chapterTitle(p.sourceLecture)).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const [done, setDone] = useState(0);
  useEffect(() => {
    const st = loadState(pageKey);
    setDone(base.filter((p) => st[p.id] && st[p.id].sc).length);
  }, [pageKey, base, tick]);
  const pct = base.length ? Math.round((done / base.length) * 100) : 0;

  if (!base.length) {
    return <div className="empty-state"><div className="es-ico">🗂️</div><p>표시할 문제가 없습니다.</p></div>;
  }

  return (
    <div>
      {progress ? (
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="progress-label"><span>풀이 진행률</span><span>{done} / {base.length} 문항 점검 ({pct}%)</span></div>
          <div className="progress"><div className="progress__bar" style={{ width: pct + "%" }}></div></div>
        </div>
      ) : null}

      {showToolbar ? (
        <>
          <div className="toolbar">
            <input className="search-input" placeholder="🔍 문제·토픽·태그 검색" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">유형 전체</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="select" value={diff} onChange={(e) => setDiff(e.target.value)}>
              <option value="">난이도 전체</option><option>기본</option><option>표준</option><option>심화</option>
            </select>
          </div>
          <div className="filter-chips" style={{ marginBottom: 20 }}>
            <button className={"chip" + (topic === "" ? " is-active" : "")} onClick={() => setTopic("")}>전체 토픽</button>
            {topics.map((t) => <button key={t} className={"chip" + (topic === t ? " is-active" : "")} onClick={() => setTopic(t)}>{t}</button>)}
          </div>
        </>
      ) : null}

      {visible.length ? (
        visible.map((p) => <ProblemCard key={p.id} p={p} idx={base.indexOf(p)} pageKey={pageKey} onChange={() => setTick((t) => t + 1)} />)
      ) : (
        <div className="empty-state"><div className="es-ico">🔍</div><p>조건에 맞는 문제가 없습니다.</p></div>
      )}
    </div>
  );
}
