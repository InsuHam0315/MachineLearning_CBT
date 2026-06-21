import Link from "next/link";
import { ML_COVERAGE } from "@/data/lecture_coverage";
import { ML_NOTES } from "@/data/ml_notes";

export const metadata = { title: "개념 정리 | 머신러닝 기말 대비" };

export default function NotesIndex() {
  const chapters = ML_COVERAGE as any[];
  const notes = ML_NOTES as any[];
  const countFor = (id: string) => notes.filter((n) => n.chapterId === id).length;
  return (
    <div className="container">
      <section style={{ padding: "28px 0 8px" }}>
        <div className="page-kicker">개념 정리</div>
        <h1 style={{ fontSize: "2rem", margin: "6px 0 8px" }}>강의 챕터</h1>
        <p className="muted">챕터를 선택해 개념 정리 · 공식 · 계산 예제를 읽어보세요. 7개 강의(지도학습 개요 ~ 모델 평가).</p>
      </section>
      <div style={{ marginTop: 8 }}>
        {chapters.map((c) => (
          <Link key={c.id} className="chapter-row" href={"/notes/" + c.id}>
            <span className="cr-num">{c.id.replace("lecture-", "")}</span>
            <span className="cr-body">
              <span className="cr-title">{c.title}</span>
              <span className="cr-desc">{(c.majorTopics || []).slice(0, 3).join(" · ")}</span>
            </span>
            <span className="cr-go"><span className="badge">개념노트 {countFor(c.id)}개 →</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
