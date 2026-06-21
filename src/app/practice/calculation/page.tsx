import PracticeList from "@/components/PracticeList";
import { ML_PRACTICE } from "@/data/ml_practice";
import { ML_PRACTICE_EXTRA } from "@/data/ml_practice_extra";

export const metadata = { title: "계산형 연습 | 머신러닝 기말 대비" };

export default function CalculationPage() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">🧮 계산형 연습</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>계산형 문제 풀이</h1>
        <p className="muted">직선의 방정식·행렬식·거리/유사도·시그모이드·엔트로피·평가지표 등 손으로 계산하는 문제입니다. 답안을 작성한 뒤 <b>풀이 과정 보기</b>로 검산하세요.</p>
      </section>
      <PracticeList data={[...ML_PRACTICE, ...ML_PRACTICE_EXTRA] as any[]} pageKey="calculation" filterTypes={["계산형", "행렬벡터계산", "지표계산", "복잡도분석"]} />
    </div>
  );
}
