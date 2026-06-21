"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { asset } from "@/lib/config";
import { chapterTitle } from "@/lib/storage";
import { FormulaBlock, Prose, SymbolTable, Steps, ProseList, Tags, MathText } from "@/components/ui";

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

function Field({ label, color, children }: { label: string; color?: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="field">
      <span className="field-label" style={color ? { color } : undefined}>{label}</span>
      {children}
    </div>
  );
}

function NoteCard({ n }: { n: any }) {
  return (
    <details className="card note-card">
      <summary>
        <span className="nc-title">{n.title}</span>
        {n.importance === "high" ? <span className="badge badge--red">핵심</span> : <span className="badge badge--blue">보충</span>}
        {n.examPoint ? <span className="badge badge--violet">시험출제</span> : null}
        <span className="nc-chev">▸</span>
      </summary>
      <div className="note-body">
        {n.beginnerExplanation ? <Field label="초보자를 위한 설명" color="var(--cyan)"><p className="prose">{n.beginnerExplanation}</p></Field> : null}
        {n.intuition ? <Field label="직관적으로 이해하기" color="var(--cyan)"><p className="prose">{n.intuition}</p></Field> : null}
        {n.formalDefinition ? <Field label="형식적 정의" color="var(--blue)"><p className="prose">{n.formalDefinition}</p></Field> : null}
        {n.formulaSummary ? <Field label="핵심 공식" color="var(--cyan)"><FormulaBlock value={n.formulaSummary} /></Field> : null}
        {n.symbolExplanation && n.symbolExplanation.length ? <Field label="기호 설명" color="var(--cyan)"><SymbolTable items={n.symbolExplanation} /></Field> : null}
        {n.stepByStepLogic && n.stepByStepLogic.length ? <Field label="논리 전개 (단계별)" color="var(--blue)"><Steps items={n.stepByStepLogic} /></Field> : null}
        {n.concreteExample ? <Field label="구체적 예시" color="var(--green)"><p className="prose">{n.concreteExample}</p></Field> : null}
        {n.solvedExample ? <Field label="풀이 예시" color="var(--green)"><div className="callout"><p className="prose">{n.solvedExample}</p></div></Field> : null}
        {n.descriptiveAnswerTemplate ? <Field label="서술형 답안 작성 틀" color="var(--blue)"><div className="answer-template"><p className="prose">{n.descriptiveAnswerTemplate}</p></div></Field> : null}
        {n.examPoint ? <div className="callout callout--exam"><div className="co-head">🎯 시험 출제 포인트</div><p className="prose">{n.examPoint}</p></div> : null}
        {n.commonMistakes && n.commonMistakes.length ? <div className="callout callout--warn"><div className="co-head">⚠ 자주 하는 실수</div><ProseList items={n.commonMistakes} /></div> : null}
        {n.quickMemoryTip ? <div className="callout callout--tip"><div className="co-head">💡 암기 팁</div><p className="prose">{n.quickMemoryTip}</p></div> : null}
        {n.relatedConcepts && n.relatedConcepts.length ? <Field label="관련 개념" color="var(--violet)"><Tags items={n.relatedConcepts} variant="violet" /></Field> : null}
        {n.practiceLinks && n.practiceLinks.length ? (
          <div className="btn-row" style={{ marginTop: 12 }}>
            {n.practiceLinks.map((l: any, i: number) => <Link key={i} className="btn btn--sm btn--accent" href={safeHref(l.href)}>{l.label || "연습하기"}</Link>)}
          </div>
        ) : null}
        {n.tags && n.tags.length ? <div style={{ marginTop: 12 }}><Tags items={n.tags} variant="cyan" /></div> : null}
      </div>
    </details>
  );
}

function FormulaCard({ f }: { f: any }) {
  return (
    <details className="card note-card">
      <summary>
        <span className="nc-title">∑ {f.title}</span>
        <span className="badge badge--violet">{chapterTitle(f.chapterId)}</span>
        <span className="nc-chev">▸</span>
      </summary>
      <div className="note-body">
        {f.original ? <Field label="원래 식" color="var(--text-mut)"><FormulaBlock value={f.original} /></Field> : null}
        <Field label="최종적으로 기억할 형태" color="var(--cyan)"><FormulaBlock value={f.memorize || f.original} /></Field>
        {f.symbols && f.symbols.length ? <Field label="기호 설명" color="var(--cyan)"><SymbolTable items={f.symbols} /></Field> : null}
        {f.meaning ? <Field label="의미" color="var(--blue)"><p className="prose">{f.meaning}</p></Field> : null}
        {f.whenToUse ? <Field label="언제 쓰는가" color="var(--green)"><p className="prose">{f.whenToUse}</p></Field> : null}
        {f.numericExample ? <Field label="짧은 숫자 예" color="var(--green)"><div className="callout"><p className="prose">{f.numericExample}</p></div></Field> : null}
        {f.derivation ? <details className="callout"><summary className="co-head" style={{ cursor: "pointer", color: "var(--text-mut)" }}>필요한 만큼만 보는 전개</summary><p className="prose" style={{ marginTop: 8 }}>{f.derivation}</p></details> : null}
        {f.tags && f.tags.length ? <div style={{ marginTop: 12 }}><Tags items={f.tags} variant="violet" /></div> : null}
      </div>
    </details>
  );
}

function ExampleCard({ ex }: { ex: any }) {
  return (
    <details className="card note-card">
      <summary>
        <span className="nc-title">✎ {ex.title}</span>
        <span className="badge badge--cyan">{ex.topic || "예제"}</span>
        <span className="badge badge--violet">{chapterTitle(ex.chapterId)}</span>
        <span className="nc-chev">▸</span>
      </summary>
      <div className="note-body">
        <Field label="문제" color="var(--blue)"><p className="prose">{ex.problem}</p></Field>
        {ex.given ? <Field label="주어진 값" color="var(--text-mut)"><FormulaBlock value={ex.given} /></Field> : null}
        <Field label="풀이" color="var(--cyan)"><Steps items={ex.steps} /></Field>
        {ex.answer ? <div className="callout callout--tip"><div className="co-head">✓ 최종 답</div><p className="prose">{ex.answer}</p></div> : null}
        {ex.takeaway ? <div className="callout callout--exam"><div className="co-head">🎯 핵심 포인트</div><p className="prose">{ex.takeaway}</p></div> : null}
        {ex.tags && ex.tags.length ? <div style={{ marginTop: 12 }}><Tags items={ex.tags} variant="cyan" /></div> : null}
      </div>
    </details>
  );
}

export default function NotesView({ notes, formulas, examples, chapters }: { notes: any[]; formulas: any[]; examples: any[]; chapters: any[] }) {
  const [q, setQ] = useState("");
  const [chapter, setChapter] = useState("");
  const ql = q.trim().toLowerCase();
  const match = (s: string) => !ql || (s || "").toLowerCase().includes(ql);

  const sections = useMemo(() => chapters.filter((c) => !chapter || c.id === chapter).map((c) => ({
    c,
    notes: notes.filter((n) => n.chapterId === c.id && match(((n.title || "") + " " + (n.tags || []).join(" ") + " " + (n.beginnerExplanation || "")))),
  })).filter((s) => s.notes.length), [chapters, chapter, notes, ql]);

  const fList = formulas.filter((f) => (!chapter || f.chapterId === chapter) && match((f.title || "") + " " + (f.tags || []).join(" ")));
  const eList = examples.filter((ex) => (!chapter || ex.chapterId === chapter) && match((ex.title || "") + " " + (ex.topic || "") + " " + (ex.tags || []).join(" ")));

  const toc: { id: string; label: string }[] = [];
  sections.forEach((s) => toc.push({ id: "sec-" + s.c.id, label: s.c.title }));
  if (fList.length) toc.push({ id: "sec-formulas", label: "공식 모음" });
  if (eList.length) toc.push({ id: "sec-examples", label: "계산 예제" });

  return (
    <>
      <div className="toolbar">
        <input className="search-input" placeholder="🔍 개념·공식·예제 검색 (예: 엔트로피, 마진, 베이즈)" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="filter-chips" style={{ marginBottom: 20 }}>
        <button className={"chip" + (chapter === "" ? " is-active" : "")} onClick={() => setChapter("")}>전체</button>
        {chapters.map((c) => <button key={c.id} className={"chip" + (chapter === c.id ? " is-active" : "")} onClick={() => setChapter(c.id)}>{c.title}</button>)}
      </div>

      <div className="layout">
        <div id="notesContent">
          {!sections.length && !fList.length && !eList.length ? (
            <div className="empty-state"><div className="es-ico">🔍</div><p>검색 결과가 없습니다.</p></div>
          ) : null}

          {sections.map((s) => (
            <section id={"sec-" + s.c.id} className="notes-section" key={s.c.id}>
              <div className="chapter-head"><span className="ch-num">{s.c.id.replace("lecture-", "")}</span><h2>{s.c.title}</h2></div>
              {CH_SVG[s.c.id] ? (
                <figure className="card" style={{ margin: "0 0 16px", textAlign: "center" }}>
                  <img src={asset(CH_SVG[s.c.id])} alt={s.c.title + " 개념도"} loading="lazy" style={{ width: "100%", maxWidth: 620, borderRadius: 12, background: "#0a1322" }} />
                </figure>
              ) : null}
              {s.notes.map((n) => <NoteCard key={n.id} n={n} />)}
            </section>
          ))}

          {fList.length ? (
            <section id="sec-formulas" className="notes-section">
              <div className="chapter-head"><span className="ch-num">∑</span><h2>공식 모음 (Formula Notes)</h2></div>
              <p className="muted" style={{ margin: "-6px 0 12px" }}>원래 식 → 기억할 형태 → 기호 → 의미 → 활용 → 숫자 예 순서로 정리했습니다. 수식은 KaTeX로 조판됩니다.</p>
              {fList.map((f) => <FormulaCard key={f.id} f={f} />)}
            </section>
          ) : null}

          {eList.length ? (
            <section id="sec-examples" className="notes-section">
              <div className="chapter-head"><span className="ch-num">✎</span><h2>계산 예제 (Solved Examples)</h2></div>
              {eList.map((ex) => <ExampleCard key={ex.id} ex={ex} />)}
            </section>
          ) : null}
        </div>

        <aside className="toc">
          <h4>목차</h4>
          {toc.map((it) => <a href={"#" + it.id} key={it.id}>{it.label}</a>)}
        </aside>
      </div>
    </>
  );
}
