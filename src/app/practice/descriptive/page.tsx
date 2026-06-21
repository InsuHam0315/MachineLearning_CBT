import PracticeList from "@/components/PracticeList";
import { ML_PRACTICE } from "@/data/ml_practice";
import { ML_PRACTICE_EXTRA } from "@/data/ml_practice_extra";

export const metadata = { title: "서술형 연습 | 머신러닝 기말 대비" };

export default function DescriptivePage() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">서술형 연습</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>서술형·비교형 답안 연습</h1>
        <p className="muted">개념 정의, 비교, 공식 의미 해석, 알고리즘 절차·의사코드 작성 문제입니다. <b>핵심 정의 → 비교 기준 → 예시 → 결론 문장</b> 구조로 작성하세요.</p>
      </section>
      <div className="callout callout--tip" style={{ marginBottom: 18 }}>
        <div className="co-head">서술형 답안 4단 구조</div>
        <p><b>① 핵심 정의</b> 무엇인지 한 문장으로 → <b>② 비교 기준</b> 어떤 축으로 나누는지 → <b>③ 예시</b> 구체 사례 → <b>④ 결론 문장</b> 정리 한 줄</p>
      </div>
      <PracticeList data={[...ML_PRACTICE, ...ML_PRACTICE_EXTRA] as any[]} pageKey="descriptive" filterTypes={["서술형", "비교형", "공식해석", "알고리즘절차", "의사코드", "단답정의"]} />
    </div>
  );
}
