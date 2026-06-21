import Link from "next/link";
import PracticeList from "@/components/PracticeList";
import { ML_MOCK_03 } from "@/data/ml_mock_03";

export const metadata = { title: "모의고사 3회 (기출 기반) | 머신러닝 기말 대비" };

export default function Mock03Page() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">🎓 모의고사 3회 · 기출 기반</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>기말 모의고사 — 3회 (기출 스타일)</h1>
        <p className="muted">2025 기말·2026 중간 기출을 분석해 교수님 실제 출제 스타일(계산·서술·의사코드)로 만든 예상 문항입니다. 출제 범위는 7개 강의(지도학습 개요 ~ 모델 평가)로 한정했습니다.</p>
      </section>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field-label">📋 구성 (기출 분석 반영)</div>
        <div className="tag-row">
          <span className="badge">계산형·지표계산 9</span><span className="badge badge--green">서술형 1</span>
          <span className="badge">공식해석 1</span><span className="badge">의사코드 1</span>
        </div>
        <p className="muted" style={{ margin: "10px 0 0", fontSize: ".85rem" }}>실제 기출 빈출: 최소제곱·조건부확률·정보이득·시그모이드·KL·커널·F-score</p>
      </div>
      <PracticeList data={ML_MOCK_03 as any[]} pageKey="mock-03" showToolbar={false} />
      <div className="btn-row" style={{ marginTop: 20 }}>
        <Link className="btn" href="/practice/mock-02">← 모의고사 2회</Link>
        <Link className="btn btn--ghost" href="/review/wrong-notes">오답노트로 복습</Link>
      </div>
    </div>
  );
}
