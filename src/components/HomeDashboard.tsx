"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser, computeRecords, type User, type RecordsSummary } from "@/lib/storage";

export function HomeHero({ counts }: { counts: { content: number; practice: number; mock: number } }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { setUser(getUser()); }, []);
  return (
    <section className="hero">
      <span className="eyebrow">⚡ 객관식이 아닌 서술형·계산형 풀이 트레이너</span>
      <h1>머신러닝 기말고사<br /><span className="grad-text">서술형·계산형 완전 대비</span></h1>
      <p className="lead">
        {user ? <><b>{user.name}</b>님, 다시 오신 걸 환영합니다. 이어서 학습하세요. </> : null}
        계산 과정과 서술형 답안을 직접 연습하고, 모범답안·풀이·채점기준으로 스스로 채점하세요. 수식은 KaTeX로 진짜 수학 조판으로 보여줍니다.
      </p>
      <div className="stat-row">
        <div className="stat"><div className="num">{counts.content}</div><div className="lbl">개념·공식·예제</div></div>
        <div className="stat"><div className="num">{counts.practice}</div><div className="lbl">연습 문제</div></div>
        <div className="stat"><div className="num">{counts.mock}</div><div className="lbl">모의고사 문항</div></div>
        <div className="stat"><div className="num">7</div><div className="lbl">강의 챕터</div></div>
      </div>
      <div className="btn-row" style={{ marginTop: 22 }}>
        <Link className="btn btn--primary" href="/notes">개념노트로 시작하기 →</Link>
        <Link className="btn" href="/practice/calculation">계산형 연습</Link>
        {user ? <Link className="btn btn--ghost" href="/stats/study-record">학습기록 보기</Link> : <Link className="btn btn--ghost" href="/login">로그인</Link>}
      </div>
    </section>
  );
}

export function HomeSummary() {
  const [s, setS] = useState<RecordsSummary | null>(null);
  useEffect(() => { setS(computeRecords()); }, []);
  if (!s) return null;
  return (
    <div className="grid grid--2">
      <div className="card">
        <div className="field-label" style={{ color: "var(--cyan)" }}>📈 최근 학습 요약</div>
        {!s.totalChecks ? <p className="muted">아직 학습 기록이 없습니다. 연습 문제를 풀고 자가 점검을 눌러보세요.</p> : (
          <div className="stat-row" style={{ marginTop: 6 }}>
            <div className="stat"><div className="num">{s.totalChecks}</div><div className="lbl">자가점검 횟수</div></div>
            <div className="stat"><div className="num">{s.uniqueCount}</div><div className="lbl">푼 문항 수</div></div>
            <div className="stat"><div className="num">{s.scDist.good}</div><div className="lbl">잘 풀었음</div></div>
            <div className="stat"><div className="num">{s.wrongCount}</div><div className="lbl">오답노트</div></div>
          </div>
        )}
        <div className="btn-row" style={{ marginTop: 14 }}><Link className="btn btn--sm" href="/stats/study-record">학습기록 상세 →</Link></div>
      </div>
      <div className="card">
        <div className="field-label" style={{ color: "var(--amber)" }}>🎯 약점 토픽</div>
        {!s.weakTopics.length ? <p className="muted">약점으로 표시된 토픽이 없습니다. “애매함/틀림”으로 점검하면 여기에 모입니다.</p> : (
          <>
            <div className="tag-row" style={{ marginTop: 4 }}>{s.weakTopics.slice(0, 6).map((t: any) => <span className="badge badge--amber" key={t.topic}>{t.topic} · {(t.bad + t.meh)}회</span>)}</div>
            <div className="btn-row" style={{ marginTop: 14 }}><Link className="btn btn--sm btn--accent" href="/review/wrong-notes">오답노트로 복습 →</Link></div>
          </>
        )}
      </div>
    </div>
  );
}
