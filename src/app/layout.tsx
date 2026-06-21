import type { Metadata } from "next";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import "@/styles/math.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "머신러닝 기말고사 서술형·계산형 대비",
  description: "머신러닝 기말고사를 위한 서술형·계산형 풀이 트레이너. 개념노트·공식노트·계산예제·모의고사·오답노트·학습기록.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
