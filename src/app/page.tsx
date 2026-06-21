import Link from "next/link";
import { HomeSummary } from "@/components/HomeDashboard";
import { ML_COVERAGE } from "@/data/lecture_coverage";

// 시험 정보 — 실제 일정이 정해지면 이 값만 바꾸면 됩니다.
const EXAM = {
  date: "미정 — 직접 입력",
  place: "미정 — 직접 입력",
  range: "지도학습 개요 ~ 모델 평가 (1–7강)",
};

const QUICK = [
  { href: "/practice/calculation", ico: "CALC", title: "계산형 연습", desc: "행렬·확률·정보이득·지표 계산" },
  { href: "/practice/descriptive", ico: "DESC", title: "서술형 연습", desc: "정의·비교·답안 구조" },
  { href: "/practice/mock-01", ico: "MOCK 1", title: "모의고사 1회", desc: "계산+서술 10문항" },
  { href: "/practice/mock-02", ico: "MOCK 2", title: "모의고사 2회", desc: "행렬·정보이득 10문항" },
  { href: "/practice/mock-03", ico: "MOCK 3", title: "모의고사 3회", desc: "기출 기반 예상 12문항" },
  { href: "/review/wrong-notes", ico: "WRONG", title: "오답노트", desc: "틀린 문제 모아 복습" },
  { href: "/stats/study-record", ico: "STATS", title: "학습기록", desc: "자가점검·약점 분석" },
];

export default function Home() {
  const chapters = ML_COVERAGE as any[];
  return (
    <div className="container">
      <section className="hero">
        <span className="eyebrow">머신러닝 기말 대비</span>
        <h1>데이터로 배우는 머신러닝<br /><span className="grad-text">· 기말 대비</span></h1>
        <p className="lead">지도학습의 개요부터 모델 평가까지 — 깊이 있는 개념 정리와 단답·서답형·계산형 문제로 준비합니다.</p>

        <div className="exam-card">
          <div className="exam-item"><div className="k">일시</div><div className="v">{EXAM.date}</div></div>
          <div className="exam-item"><div className="k">장소</div><div className="v">{EXAM.place}</div></div>
          <div className="exam-item"><div className="k">범위</div><div className="v">{EXAM.range}</div></div>
        </div>

        <div className="btn-row">
          <Link className="btn btn--primary" href="/practice/calculation">문제 풀기</Link>
          <Link className="btn" href="/review/wrong-notes">오답 노트</Link>
          <Link className="btn btn--ghost" href="/notes">개념 정리</Link>
        </div>
      </section>

      <section className="section">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>강의 챕터</h2>
        <div>
          {chapters.map((c) => (
            <Link key={c.id} className="chapter-row" href={"/notes/" + c.id}>
              <span className="cr-num">{c.id.replace("lecture-", "")}</span>
              <span className="cr-body">
                <span className="cr-title">{c.title}</span>
                <span className="cr-desc">{(c.majorTopics || []).slice(0, 3).join(" · ")}</span>
              </span>
              <span className="cr-go"><span className="btn btn--sm">개념 정리 →</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>연습 &amp; 기록</h2>
        <div className="grid grid--4">
          {QUICK.map((q) => (
            <Link className="quick-card" href={q.href} key={q.title}>
              <span className="qc-ico">{q.ico}</span>
              <span className="qc-title">{q.title}</span>
              <span className="qc-desc">{q.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>내 학습 현황</h2>
        <HomeSummary />
      </section>
    </div>
  );
}
