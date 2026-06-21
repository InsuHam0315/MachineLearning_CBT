"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { KEYS, getItem, setItem, unique } from "@/lib/storage";
import { FormulaBlock, Prose, Steps, Rubric, ProseList, Tags, DiffDot } from "@/components/ui";

const PAGE_URL: Record<string, string> = {
  "calculation": "/practice/calculation",
  "descriptive": "/practice/descriptive",
  "mock-01": "/practice/mock-01",
  "mock-02": "/practice/mock-02",
};

function fmt(ts: number) {
  try { const d = new Date(ts); return (d.getMonth() + 1) + "/" + d.getDate() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  catch { return ""; }
}

export default function WrongNotesView() {
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");

  useEffect(() => { const l = getItem<any[]>(KEYS.wrong, []); setList(Array.isArray(l) ? l : []); }, []);
  function persist(next: any[]) { setList(next); setItem(KEYS.wrong, next); }
  function del(id: string) { persist(list.filter((w) => w.id !== id)); }
  function clearAll() { if (confirm("오답노트를 모두 비울까요? 되돌릴 수 없습니다.")) persist([]); }

  const topics = useMemo(() => unique(list.map((w) => w.topic)), [list]);
  const types = useMemo(() => unique(list.map((w) => w.type)), [list]);

  const visible = list.filter((w) => {
    if (topic && w.topic !== topic) return false;
    if (type && w.type !== type) return false;
    if (q) { const hay = (w.problem + " " + w.topic + " " + (w.tags || []).join(" ")).toLowerCase(); if (!hay.includes(q.toLowerCase())) return false; }
    return true;
  });

  return (
    <>
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">🗒️ 오답노트</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>오답노트 · 약점 복습 <span className="badge badge--amber">{list.length}</span></h1>
        <p className="muted">연습·모의고사에서 <b>오답노트에 저장</b>을 누르거나 <b>틀림</b>으로 점검한 문제가 모입니다.</p>
      </section>

      {list.length ? (
        <div className="toolbar">
          <input className="search-input" placeholder="🔍 오답 검색" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)}><option value="">토픽 전체</option>{topics.map((t) => <option key={t}>{t}</option>)}</select>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}><option value="">유형 전체</option>{types.map((t) => <option key={t}>{t}</option>)}</select>
          <button className="btn btn--ghost btn--sm" style={{ marginLeft: "auto" }} onClick={clearAll}>전체 비우기</button>
        </div>
      ) : null}

      {!list.length ? (
        <div className="empty-state"><div className="es-ico">🗒️</div>
          <p>저장된 오답이 없습니다.<br />연습·모의고사에서 “오답노트에 저장”을 누르거나 “틀림”으로 점검하면 자동으로 모입니다.</p>
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 14 }}>
            <Link className="btn btn--primary" href="/practice/calculation">계산형 연습 시작</Link>
            <Link className="btn" href="/practice/descriptive">서술형 연습 시작</Link>
          </div>
        </div>
      ) : !visible.length ? (
        <div className="empty-state"><div className="es-ico">🔍</div><p>조건에 맞는 오답이 없습니다.</p></div>
      ) : (
        visible.map((w) => {
          const retry = PAGE_URL[w.page] ? PAGE_URL[w.page] + "#prob-" + w.id : "";
          return (
            <article className="card prob-card" key={w.id}>
              <div className="prob-head">
                <span className="prob-id">{w.id}</span>
                <span className="prob-topic">{w.topic || "문제"}</span>
                {w.type ? <span className="badge">{w.type}</span> : null}
                {w.difficulty ? <DiffDot d={w.difficulty} /> : null}
                {w.chapterTitle ? <span className="badge">{w.chapterTitle}</span> : null}
                <span className="muted" style={{ marginLeft: "auto", fontSize: ".74rem" }}>저장 {fmt(w.savedAt)}</span>
              </div>
              <div className="prob-body">
                <div className="prob-statement"><Prose value={w.problem} /></div>
                {w.keyFormula ? <><div className="field-mini-label">핵심 공식</div><FormulaBlock value={w.keyFormula} /></> : null}
                {w.userAnswer ? <><div className="field-mini-label">내가 작성한 답안</div><div className="callout"><Prose value={w.userAnswer} /></div></>
                  : <div className="callout callout--warn"><p>작성한 답안이 없습니다. 다시 풀어보며 답안을 작성해 보세요.</p></div>}

                <details className="reveal reveal--answer" style={{ marginTop: 12 }}>
                  <summary className="reveal-head" style={{ cursor: "pointer" }}>✓ 모범답안 보기</summary>
                  <div className="reveal-body">
                    {w.answerStructure && w.answerStructure.length ? <div className="answer-template">{w.answerStructure.map((s: string, i: number) => <div className="at-step" key={i}><b>{s}</b></div>)}</div> : null}
                    <Prose value={w.modelAnswer} />
                  </div>
                </details>
                <details className="reveal reveal--steps" style={{ marginTop: 10 }}>
                  <summary className="reveal-head" style={{ cursor: "pointer" }}>↳ 풀이 과정 보기</summary>
                  <div className="reveal-body"><Steps items={w.solutionSteps} />
                    {w.commonMistakes && w.commonMistakes.length ? <div className="callout callout--warn" style={{ marginTop: 10 }}><div className="co-head">⚠ 자주 하는 실수</div><ProseList items={w.commonMistakes} /></div> : null}
                  </div>
                </details>
                <details className="reveal reveal--rubric" style={{ marginTop: 10 }}>
                  <summary className="reveal-head" style={{ cursor: "pointer" }}>⚖ 채점 기준 보기</summary>
                  <div className="reveal-body"><Rubric items={w.scoringRubric} /></div>
                </details>

                <div className="btn-row" style={{ marginTop: 14 }}>
                  {retry ? <Link className="btn btn--primary btn--sm" href={retry}>다시 풀기 →</Link> : null}
                  <button className="btn btn--ghost btn--sm" onClick={() => del(w.id)}>이 항목 삭제</button>
                </div>
                {w.tags && w.tags.length ? <div style={{ marginTop: 12 }}><Tags items={w.tags} variant="cyan" /></div> : null}
              </div>
            </article>
          );
        })
      )}
    </>
  );
}
