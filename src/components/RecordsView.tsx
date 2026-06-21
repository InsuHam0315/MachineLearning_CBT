"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { KEYS, setItem, computeRecords, type RecordsSummary } from "@/lib/storage";

const SC_LABEL: Record<string, string> = { good: "잘 풀었음", meh: "애매함", bad: "틀림" };
const SC_VAR: Record<string, string> = { good: "green", meh: "amber", bad: "red" };

function fmt(ts: number) {
  try { const d = new Date(ts); return (d.getMonth() + 1) + "/" + d.getDate() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  catch { return ""; }
}

function StatCard({ num, label, variant }: { num: number; label: string; variant: string }) {
  return <div className="card center"><div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--" + variant + ")" }}>{num}</div><div className="muted" style={{ fontWeight: 600, fontSize: ".82rem" }}>{label}</div></div>;
}

export default function RecordsView() {
  const [s, setS] = useState<RecordsSummary | null>(null);
  const [tick, setTick] = useState(0);
  useEffect(() => { setS(computeRecords()); }, [tick]);
  if (!s) return <div className="empty-state"><div className="es-ico">⏳</div><p>기록을 분석하는 중…</p></div>;

  const uname = s.user && s.user.name ? s.user.name : "게스트";
  const tot = (s.scDist.good + s.scDist.meh + s.scDist.bad) || 1;

  return (
    <>
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div className="brand__logo" style={{ width: 48, height: 48, fontSize: "1.1rem" }}>{uname.slice(0, 2)}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>{uname} 님의 학습 현황</div>
            <div className="muted" style={{ fontSize: ".85rem" }}>{s.user ? "로컬 로그인 됨" : "게스트 모드"}</div>
          </div>
          <Link className="btn btn--ghost btn--sm" href="/login" style={{ marginLeft: "auto" }}>계정</Link>
        </div>
      </div>

      <div className="grid grid--4" style={{ marginBottom: 18 }}>
        <StatCard num={s.totalChecks} label="총 자가점검" variant="blue" />
        <StatCard num={s.uniqueCount} label="푼 문항 수" variant="cyan" />
        <StatCard num={s.scDist.good} label="잘 풀었음" variant="green" />
        <StatCard num={s.wrongCount} label="오답노트 항목" variant="amber" />
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field-label">자가 점검 분포</div>
        {(["good", "meh", "bad"] as const).map((k) => {
          const pct = Math.round((s.scDist[k] / tot) * 100);
          return (
            <div key={k}>
              <div className="progress-label"><span>{SC_LABEL[k]}</span><span>{s.scDist[k]}회 ({pct}%)</span></div>
              <div className="progress" style={{ marginBottom: 12 }}><div className="progress__bar" style={{ width: pct + "%", background: "var(--" + SC_VAR[k] + ")" }}></div></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid--2" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="field-label">🎯 약점 토픽 Top</div>
          {!s.weakTopics.length ? <p className="muted">데이터가 쌓이면 약점 토픽이 표시됩니다.</p> : (
            <table className="data-table"><thead><tr><th>토픽</th><th>틀림</th><th>애매</th><th>강도</th></tr></thead>
              <tbody>{s.weakTopics.map((t: any) => <tr key={t.topic}><td>{t.topic}</td><td>{t.bad || 0}</td><td>{t.meh || 0}</td><td><span className="badge badge--red">{t.score}</span></td></tr>)}</tbody>
            </table>
          )}
        </div>
        <div className="card">
          <div className="field-label">🔁 자주 틀리는 유형</div>
          {!s.weakTypes.length ? <p className="muted">데이터가 쌓이면 유형별 약점이 표시됩니다.</p> : (
            <table className="data-table"><thead><tr><th>유형</th><th>틀림</th><th>애매</th><th>강도</th></tr></thead>
              <tbody>{s.weakTypes.map((t: any) => <tr key={t.type}><td>{t.type}</td><td>{t.bad || 0}</td><td>{t.meh || 0}</td><td><span className="badge">{t.score}</span></td></tr>)}</tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field-label">🕘 최근 학습 기록</div>
        {!s.recent.length ? <p className="muted">최근 기록이 없습니다.</p> : (
          <table className="data-table"><thead><tr><th>시각</th><th>토픽</th><th>유형</th><th>결과</th></tr></thead>
            <tbody>{s.recent.map((e: any, i: number) => <tr key={i}><td className="muted">{fmt(e.ts)}</td><td>{e.topic || "-"}</td><td>{e.type || "-"}</td><td><span className={"badge badge--" + (SC_VAR[e.sc] || "blue")}>{SC_LABEL[e.sc] || e.sc}</span></td></tr>)}</tbody>
          </table>
        )}
      </div>

      <div className="btn-row">
        <Link className="btn btn--primary" href="/review/wrong-notes">약점 문제 복습하기 →</Link>
        <Link className="btn" href="/practice/calculation">계산형 더 풀기</Link>
        <Link className="btn" href="/practice/descriptive">서술형 더 풀기</Link>
        <button className="btn btn--ghost" style={{ marginLeft: "auto" }} onClick={() => { if (confirm("학습기록(자가점검 이력)을 초기화할까요? 오답노트는 유지됩니다.")) { setItem(KEYS.records, { events: [] }); setTick((t) => t + 1); } }}>학습기록 초기화</button>
      </div>
    </>
  );
}
