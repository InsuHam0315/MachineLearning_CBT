import { notFound } from "next/navigation";
import ChapterDetail from "@/components/ChapterDetail";
import { ML_COVERAGE } from "@/data/lecture_coverage";
import { ML_NOTES } from "@/data/ml_notes";
import { ML_FORMULAS } from "@/data/ml_formulas";
import { ML_EXAMPLES } from "@/data/ml_examples";

export function generateStaticParams() {
  return (ML_COVERAGE as any[]).map((c) => ({ chapterId: c.id }));
}

export function generateMetadata({ params }: { params: { chapterId: string } }) {
  const c = (ML_COVERAGE as any[]).find((x) => x.id === params.chapterId);
  return { title: (c ? c.title : "개념 정리") + " | 머신러닝 기말 대비" };
}

export default function ChapterPage({ params }: { params: { chapterId: string } }) {
  const chapter = (ML_COVERAGE as any[]).find((c) => c.id === params.chapterId);
  if (!chapter) return notFound();
  const notes = (ML_NOTES as any[]).filter((n) => n.chapterId === params.chapterId);
  const formulas = (ML_FORMULAS as any[]).filter((f) => f.chapterId === params.chapterId);
  const examples = (ML_EXAMPLES as any[]).filter((e) => e.chapterId === params.chapterId);
  return <ChapterDetail chapter={chapter} notes={notes} formulas={formulas} examples={examples} />;
}
