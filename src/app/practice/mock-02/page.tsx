import Link from "next/link";
import PracticeList from "@/components/PracticeList";
import { ML_MOCK_02 } from "@/data/ml_mock_02";

export const metadata = { title: "모의고사 2회 | 머신러닝 기말 대비" };

export default function Mock02Page() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">모의고사 2회</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>기말 모의고사 — 2회</h1>
        <p className="muted">1회와 겹치지 않는 소재(행렬식·정보이득·공분산·정규화·커널·군집)로 구성한 10문항입니다. 시간을 정해 실전처럼 풀어 보세요.</p>
      </section>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="field-label">구성</div>
        <div className="tag-row">
          <span className="badge">계산형 3</span><span className="badge badge--green">서술형 3</span>
          <span className="badge">공식해석 2</span><span className="badge">의사코드 1</span>
          <span className="badge badge--amber">복잡도/군집 1</span>
        </div>
      </div>
      <PracticeList data={ML_MOCK_02 as any[]} pageKey="mock-02" showToolbar={false} />
      <div className="btn-row" style={{ marginTop: 20 }}>
        <Link className="btn" href="/practice/mock-01">← 모의고사 1회</Link>
        <Link className="btn" href="/practice/mock-03">모의고사 3회 →</Link>
        <Link className="btn btn--ghost" href="/review/wrong-notes">오답노트로 복습</Link>
      </div>
    </div>
  );
}
