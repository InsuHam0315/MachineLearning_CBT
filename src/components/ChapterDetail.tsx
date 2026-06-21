"use client";
import Link from "next/link";
import { useState } from "react";
import { asset } from "@/lib/config";
import { FormulaBlock, Prose, SymbolTable, Steps, ProseList, Tags } from "@/components/ui";
import ZoomImage from "@/components/ZoomImage";

const CH_SVG: Record<string, string> = {
  "lecture-01": "/assets/img/supervised-learning.svg",
  "lecture-02": "/assets/img/linear-regression.svg",
  "lecture-03": "/assets/img/logistic-regression.svg",
  "lecture-04": "/assets/img/svm-margin.svg",
  "lecture-05": "/assets/img/decision-tree.svg",
  "lecture-06": "/assets/img/naive-bayes.svg",
  "lecture-07": "/assets/img/model-evaluation.svg",
};

function safeHref(href: string): string {
  const s = (href || "").toLowerCase();
  if (s.includes("descriptive")) return "/practice/descriptive";
  if (s.includes("mock-02") || s.includes("mock2")) return "/practice/mock-02";
  if (s.includes("mock")) return "/practice/mock-01";
  if (s.includes("wrong") || s.includes("review")) return "/review/wrong-notes";
  if (s.includes("record") || s.includes("stats")) return "/stats/study-record";
  return "/practice/calculation";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return <div className="field"><span className="field-label">{label}</span>{children}</div>;
}

function NoteSection({ n }: { n: any }) {
  return (
    <section className="note-section" id={n.id}>
      <h3>{n.title} {n.importance === "high" ? <span className="badge" style={{ verticalAlign: "middle" }}>핵심</span> : null}</h3>
      {n.beginnerExplanation ? <Field label="초보자를 위한 설명"><Prose value={n.beginnerExplanation} /></Field> : null}
      {n.intuition ? <Field label="직관적으로 이해하기"><Prose value={n.intuition} /></Field> : null}
      {n.formalDefinition ? <Field label="형식적 정의"><Prose value={n.formalDefinition} /></Field> : null}
      {n.formulaSummary ? <Field label="핵심 공식"><FormulaBlock value={n.formulaSummary} /></Field> : null}
      {n.symbolExplanation && n.symbolExplanation.length ? <Field label="기호 설명"><SymbolTable items={n.symbolExplanation} /></Field> : null}
      {n.stepByStepLogic && n.stepByStepLogic.length ? <Field label="단계별 논리"><Steps items={n.stepByStepLogic} /></Field> : null}
      {n.concreteExample ? <Field label="구체적 예시"><Prose value={n.concreteExample} /></Field> : null}
      {n.solvedExample ? <div className="callout"><div className="co-head">풀이 예시</div><Prose value={n.solvedExample} /></div> : null}
      {n.descriptiveAnswerTemplate ? <Field label="시험에서 이렇게 쓰기"><div className="answer-template"><Prose value={n.descriptiveAnswerTemplate} /></div></Field> : null}
      {n.examPoint ? <div className="callout callout--exam"><div className="co-head">시험 출제 포인트</div><Prose value={n.examPoint} /></div> : null}
      {n.commonMistakes && n.commonMistakes.length ? <div className="callout callout--warn"><div className="co-head">자주 하는 실수</div><ProseList items={n.commonMistakes} /></div> : null}
      {n.quickMemoryTip ? <div className="callout callout--tip"><div className="co-head">암기 팁</div><Prose value={n.quickMemoryTip} /></div> : null}
      {n.relatedConcepts && n.relatedConcepts.length ? <Field label="관련 개념"><Tags items={n.relatedConcepts} /></Field> : null}
      {n.practiceLinks && n.practiceLinks.length ? (
        <div className="btn-row" style={{ marginTop: 12 }}>
          {n.practiceLinks.map((l: any, i: number) => <Link key={i} className="btn btn--sm" href={safeHref(l.href)}>{l.label || "연습하기"} →</Link>)}
        </div>
      ) : null}
    </section>
  );
}

function FormulaItem({ f }: { f: any }) {
  return (
    <details className="card note-card">
      <summary><span className="nc-title">{f.title}</span><span className="nc-chev">›</span></summary>
      <div className="note-body">
        {f.original ? <Field label="원래 식"><FormulaBlock value={f.original} /></Field> : null}
        <Field label="기억할 형태"><FormulaBlock value={f.memorize || f.original} /></Field>
        {f.symbols && f.symbols.length ? <Field label="기호"><SymbolTable items={f.symbols} /></Field> : null}
        {f.meaning ? <Field label="의미"><Prose value={f.meaning} /></Field> : null}
        {f.whenToUse ? <Field label="언제 쓰는가"><Prose value={f.whenToUse} /></Field> : null}
        {f.numericExample ? <div className="callout"><div className="co-head">숫자 예</div><Prose value={f.numericExample} /></div> : null}
      </div>
    </details>
  );
}

function ExampleItem({ ex }: { ex: any }) {
  return (
    <details className="card note-card">
      <summary><span className="nc-title">{ex.title}</span><span className="badge">{ex.topic || "예제"}</span><span className="nc-chev">›</span></summary>
      <div className="note-body">
        <Field label="문제"><Prose value={ex.problem} /></Field>
        {ex.given ? <Field label="주어진 값"><FormulaBlock value={ex.given} /></Field> : null}
        <Field label="풀이"><Steps items={ex.steps} /></Field>
        {ex.answer ? <div className="callout callout--tip"><div className="co-head">최종 답</div><Prose value={ex.answer} /></div> : null}
        {ex.takeaway ? <div className="callout callout--exam"><div className="co-head">핵심 포인트</div><Prose value={ex.takeaway} /></div> : null}
      </div>
    </details>
  );
}

export default function ChapterDetail({ chapter, notes, formulas, examples }:
  { chapter: any; notes: any[]; formulas: any[]; examples: any[] }) {
  const num = chapter.id.replace("lecture-", "");
  const [tocOpen, setTocOpen] = useState(false);
  const toc: { id: string; label: string }[] = [
    ...notes.map((n) => ({ id: n.id, label: n.title })),
    ...(formulas.length ? [{ id: "sec-formulas", label: "공식 모음" }] : []),
    ...(examples.length ? [{ id: "sec-examples", label: "계산 예제" }] : []),
  ];

  return (
    <div className="container">
      <Link className="back-link" href="/notes">← 챕터 목록</Link>
      <div className="page-kicker">CHAPTER {num} · 개념 정리</div>
      <h1 style={{ fontSize: "2rem", margin: "6px 0 8px" }}>{chapter.title}</h1>
      <p className="muted" style={{ maxWidth: "60ch" }}>{(chapter.majorTopics || []).slice(0, 4).join(" · ")}</p>
      <div className="callout" style={{ marginTop: 14 }}>
        <span className="mono" style={{ fontSize: ".8rem", color: "var(--muted)" }}>출처</span>{" "}
        {chapter.fileName}{chapter.slideCount ? " · 슬라이드 " + chapter.slideCount + "쪽" : ""}
      </div>

      <div style={{ marginTop: 24 }}>
        {CH_SVG[chapter.id] ? (
          <figure className="card" style={{ margin: "0 0 8px", textAlign: "center" }}>
            <ZoomImage src={asset(CH_SVG[chapter.id])} alt={chapter.title + " 개념도"} maxWidth={560} />
            <figcaption className="muted" style={{ fontSize: ".76rem", marginTop: 8 }}>클릭하면 크게 볼 수 있습니다</figcaption>
          </figure>
        ) : null}

        {notes.length ? notes.map((n) => <NoteSection key={n.id} n={n} />) : <p className="muted">이 챕터의 개념노트를 준비 중입니다.</p>}

        {formulas.length ? (
          <section className="note-section" id="sec-formulas">
            <h3>공식 모음</h3>
            <p className="muted" style={{ fontSize: ".9rem" }}>원래 식 → 기억할 형태 → 기호 → 의미 → 활용 → 숫자 예. 수식은 KaTeX로 조판됩니다.</p>
            {formulas.map((f) => <FormulaItem key={f.id} f={f} />)}
          </section>
        ) : null}

        {examples.length ? (
          <section className="note-section" id="sec-examples">
            <h3>계산 예제</h3>
            {examples.map((ex) => <ExampleItem key={ex.id} ex={ex} />)}
          </section>
        ) : null}

        <div className="btn-row" style={{ marginTop: 28 }}>
          <Link className="btn btn--primary" href="/practice/calculation">관련 문제 풀기</Link>
          <Link className="btn" href="/notes">다른 챕터 보기</Link>
        </div>
      </div>

      {toc.length ? (
        <>
          <button className="toc-fab" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen} aria-label="목차 열기/닫기">
            {tocOpen ? "✕ 목차" : "☰ 목차"}
          </button>
          {tocOpen ? (
            <>
              <div className="toc-backdrop" onClick={() => setTocOpen(false)} />
              <nav className="toc-panel" aria-label="목차">
                <div className="toc-panel-head"><span>목차</span><button onClick={() => setTocOpen(false)} aria-label="닫기">✕</button></div>
                {toc.map((it) => <a key={it.id} href={"#" + it.id} onClick={() => setTocOpen(false)}>{it.label}</a>)}
              </nav>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
