/* =========================================================================
   ui.tsx — 공용 렌더 컴포넌트 (수식=KaTeX, 기호표, 풀이단계, 채점기준, 배지 …)
   훅 미사용 → 서버/클라이언트 양쪽에서 사용 가능. 수식은 빌드시 정적 HTML로 렌더됨.
   ========================================================================= */
import React from "react";
import katex from "katex";
import { mathify } from "@/lib/mathify";

/* ---- KaTeX 렌더 (실패 시 null) ---- */
function katexHtml(tex: string, display: boolean): string | null {
  try {
    return katex.renderToString(tex, { throwOnError: true, displayMode: display, strict: false, output: "html" });
  } catch {
    return null;
  }
}

/* 한글 런 / 수식 런 분리 (KaTeX 폰트는 한글이 없으므로 한글은 일반 텍스트로) */
function splitKoreanMath(s: string): { ko: boolean; text: string }[] {
  const parts: { ko: boolean; text: string }[] = [];
  const re = /[가-힣]+(?:\s+[가-힣]+)*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) parts.push({ ko: false, text: s.slice(last, m.index) });
    parts.push({ ko: true, text: m[0] });
    last = m.index + m[0].length;
  }
  if (last < s.length) parts.push({ ko: false, text: s.slice(last) });
  return parts.filter((p) => p.text !== "");
}

function MathSeg({ expr, display }: { expr: string; display?: boolean }) {
  if (!expr || !expr.trim()) return <>{expr}</>;
  const html = katexHtml(mathify(expr), !!display);
  if (html) return <span className="math-inline" dangerouslySetInnerHTML={{ __html: html }} />;
  return <span className="math-fallback">{expr}</span>;
}

/* 한글+수식 혼합 한 줄 렌더 */
export function MathText({ value, display }: { value: string; display?: boolean }) {
  if (value == null) return null;
  const segs = splitKoreanMath(String(value));
  return (
    <span className="mathtext">
      {segs.map((seg, i) =>
        seg.ko ? <span key={i} className="math-ko">{seg.text}</span> : <MathSeg key={i} expr={seg.text} display={display} />
      )}
    </span>
  );
}

/* 공식 블록(여러 줄) */
export function FormulaBlock({ value }: { value?: string }) {
  if (!value) return null;
  const lines = String(value).split("\n").filter((l) => l.trim() !== "");
  return (
    <div className="formula-block">
      {lines.map((ln, i) => (
        <div className="formula-line" key={i}>
          <MathText value={ln} />
        </div>
      ))}
    </div>
  );
}

/* 긴 한국어 텍스트를 문장 단위로 끊고 2~3문장씩 문단으로 묶어 가독성↑ (소수점 보호) */
function formatProse(value: string): string[] {
  const paras: string[] = [];
  String(value).split(/\n+/).forEach((chunk) => {
    const t = chunk.trim();
    if (!t) return;
    let sentences: string[];
    try {
      sentences = t.split(/(?<=[가-힣\)\]%][.?!])\s+/);
    } catch {
      sentences = [t]; // 구형 브라우저(lookbehind 미지원) 폴백
    }
    sentences = sentences.map((s) => s.trim()).filter(Boolean);
    let buf: string[] = [];
    let len = 0;
    const flush = () => { if (buf.length) { paras.push(buf.join(" ")); buf = []; len = 0; } };
    for (const s of sentences) {
      buf.push(s); len += s.length;
      if (buf.length >= 3 || (buf.length >= 2 && len >= 120)) flush();
    }
    flush();
  });
  return paras.length ? paras : [String(value).trim()];
}

export function Prose({ value, className }: { value?: string; className?: string }) {
  if (value == null || value === "") return null;
  const paras = formatProse(value);
  if (paras.length <= 1) return <p className={"prose-p " + (className || "")}>{paras[0]}</p>;
  return <div className={"prose-block " + (className || "")}>{paras.map((p, i) => <p className="prose-p" key={i}>{p}</p>)}</div>;
}

/* 기호 설명표 (기호 칸은 실제 수식으로) */
export function SymbolTable({ items }: { items?: { sym: string; desc: string }[] }) {
  if (!items || !items.length) return null;
  return (
    <table className="symbol-table">
      <tbody>
        {items.map((o, i) => (
          <tr key={i}>
            <td><MathText value={o.sym} /></td>
            <td>{o.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ProseList({ items, className }: { items?: string[]; className?: string }) {
  if (!items || !items.length) return null;
  return (
    <ul className={className}>
      {items.map((x, i) => <li className="prose" key={i}>{x}</li>)}
    </ul>
  );
}

export function Steps({ items }: { items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <ol className="solution-steps">
      {items.map((x, i) => <li className="prose" key={i}>{x}</li>)}
    </ol>
  );
}

export function Rubric({ items }: { items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <ul className="rubric">
      {items.map((x, i) => {
        const mm = String(x).match(/[\(\[]\s*([0-9]+\s*점|배점[^\)\]]*)\s*[\)\]]\s*$/);
        let pts = "", text = String(x);
        if (mm) { pts = mm[1].replace(/\s+/g, ""); text = text.slice(0, mm.index).trim(); }
        return (
          <li key={i}>
            <span className="check-ico">✔</span>
            <span className="prose">{text}</span>
            {pts ? <span className="pts">{pts}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

export function Tags({ items }: { items?: string[]; variant?: string }) {
  if (!items || !items.length) return null;
  return (
    <span className="tag-row">
      {items.map((t, i) => <span className="badge badge--soft" key={i}>#{t}</span>)}
    </span>
  );
}

export function DiffDot({ d }: { d?: string }) {
  if (!d) return null;
  return <span className="badge"><span className={"dot-diff diff-" + d}></span>{d}</span>;
}
