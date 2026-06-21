import NotesView from "@/components/NotesView";
import { asset } from "@/lib/config";
import { ML_NOTES } from "@/data/ml_notes";
import { ML_FORMULAS } from "@/data/ml_formulas";
import { ML_EXAMPLES } from "@/data/ml_examples";
import { ML_COVERAGE } from "@/data/lecture_coverage";

export const metadata = { title: "개념노트 · 공식노트 · 예제 | 머신러닝 기말 대비" };

export default function NotesPage() {
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <span className="eyebrow">📘 학습 노트</span>
        <h1 style={{ fontSize: "1.8rem", margin: "8px 0 6px" }}>개념노트 · 공식노트 · 계산 예제</h1>
        <p className="muted">처음 배우는 학생도 이 노트만으로 이해할 수 있도록 개념을 처음부터 풀어 설명합니다. 수식은 KaTeX로 조판됩니다. 각 노트를 눌러 펼치세요.</p>
        <figure className="card" style={{ margin: "14px 0 0", textAlign: "center" }}>
          <img src={asset("/assets/img/ml-overview.svg")} alt="머신러닝 전체 개요 개념도" loading="lazy" style={{ width: "100%", maxWidth: 640, borderRadius: 12, background: "#0a1322" }} />
          <figcaption className="muted" style={{ fontSize: ".82rem", marginTop: 8 }}>머신러닝 한눈에 보기 — 지도/비지도, 분류/회귀/군집</figcaption>
        </figure>
      </section>
      <NotesView notes={ML_NOTES as any[]} formulas={ML_FORMULAS as any[]} examples={ML_EXAMPLES as any[]} chapters={ML_COVERAGE as any[]} />
    </div>
  );
}
