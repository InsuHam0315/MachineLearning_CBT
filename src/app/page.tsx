import Link from "next/link";
import { HomeHero, HomeSummary } from "@/components/HomeDashboard";
import { ML_NOTES } from "@/data/ml_notes";
import { ML_FORMULAS } from "@/data/ml_formulas";
import { ML_EXAMPLES } from "@/data/ml_examples";
import { ML_PRACTICE } from "@/data/ml_practice";
import { ML_MOCK_01 } from "@/data/ml_mock_01";
import { ML_MOCK_02 } from "@/data/ml_mock_02";
import { ML_COVERAGE } from "@/data/lecture_coverage";

const QUICK = [
  { href: "/notes", ico: "📘", title: "개념노트", desc: "7개 강의 깊이 있는 한국어 설명" },
  { href: "/notes#sec-formulas", ico: "∑", title: "공식노트", desc: "KaTeX 수식 · 기호·의미·예" },
  { href: "/practice/calculation", ico: "🧮", title: "계산형 연습", desc: "행렬·거리·확률·지표 계산 풀이" },
  { href: "/practice/descriptive", ico: "✍️", title: "서술형 연습", desc: "정의·비교·답안 구조 템플릿" },
  { href: "/practice/mock-01", ico: "📝", title: "모의고사 1회", desc: "계산+서술+의사코드 10문항" },
  { href: "/practice/mock-02", ico: "📋", title: "모의고사 2회", desc: "행렬·정보이득·군집 10문항" },
  { href: "/review/wrong-notes", ico: "🗒️", title: "오답노트", desc: "틀린 문제 모아 복습" },
  { href: "/stats/study-record", ico: "📊", title: "학습기록", desc: "자가점검·약점 토픽 분석" },
];
const FLOW = [
  ["1. 이해", "개념노트로 각 강의의 원리를 이해"], ["2. 정리", "공식노트로 핵심 식과 기호 암기"],
  ["3. 적용", "계산 예제·계산형 연습으로 손에 익히기"], ["4. 표현", "서술형 연습으로 답안 구조 만들기"],
  ["5. 실전", "모의고사 1·2회로 시간 안에 풀기"], ["6. 복습", "오답노트로 틀린 문제 다시 풀기"],
  ["7. 점검", "학습기록으로 약점 토픽 확인"], ["8. 반복", "약점 위주로 2~7 반복"],
];

export default function Home() {
  const counts = {
    content: ML_NOTES.length + ML_FORMULAS.length + ML_EXAMPLES.length,
    practice: ML_PRACTICE.length,
    mock: ML_MOCK_01.length + ML_MOCK_02.length,
  };
  return (
    <div className="container">
      <HomeHero counts={counts} />

      <section className="section">
        <h2 style={{ marginBottom: 16 }}>바로가기</h2>
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
        <h2 style={{ marginBottom: 16 }}>내 학습 현황</h2>
        <HomeSummary />
      </section>

      <section className="section">
        <div className="card">
          <div className="field-label" style={{ color: "var(--cyan)" }}>🧭 추천 학습 흐름</div>
          <div className="grid grid--4" style={{ marginTop: 8 }}>
            {FLOW.map(([t, d]) => <div className="panel" key={t}><b>{t}</b><p className="muted" style={{ margin: "6px 0 0" }}>{d}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 style={{ marginBottom: 16 }}>강의 챕터</h2>
        <div className="grid grid--auto">
          {(ML_COVERAGE as any[]).map((c) => (
            <Link className="card quick-card" href={"/notes#sec-" + c.id} key={c.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="ch-num" style={{ width: 34, height: 34, fontSize: ".95rem" }}>{c.id.replace("lecture-", "")}</span>
                <span className="qc-title" style={{ fontSize: ".98rem" }}>{c.title}</span>
              </div>
              <div className="tag-row" style={{ marginTop: 8 }}>{(c.majorTopics || []).slice(0, 3).map((t: string) => <span className="badge badge--blue" key={t}>{t}</span>)}</div>
              <span className="qc-desc">슬라이드 {c.slideCount || "-"}쪽 · 노트로 보기 →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
