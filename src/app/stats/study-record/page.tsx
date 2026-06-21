import RecordsView from "@/components/RecordsView";

export const metadata = { title: "학습기록 | 머신러닝 기말 대비" };

export default function StudyRecordPage() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">학습기록</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>학습기록 · 약점 분석</h1>
        <p className="muted">자가 점검 결과를 모아 어떤 토픽·유형이 약한지 보여줍니다. 약점 위주로 복습 계획을 세우세요.</p>
      </section>
      <RecordsView />
    </div>
  );
}
