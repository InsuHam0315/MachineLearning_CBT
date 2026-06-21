import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import "pretendard/dist/web/variable/pretendardvariable.css";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import "@/styles/math.css";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "머신러닝 기말 · 서술·계산형 대비",
  description: "지도학습의 개요부터 모델 평가까지 — 개념 정리와 단답·서답형 문제, 모의고사, 오답노트.",
};

// 하이드레이션 전에 테마/글자크기를 적용해 화면 깜빡임(FOUC) 방지
const initScript = `(function(){try{var t=localStorage.getItem('mlThemePreference');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');var f=localStorage.getItem('mlFontSizePreference');if(f==='large')document.documentElement.setAttribute('data-fontsize','large');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={GeistMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">본문 바로가기</a>
        <Header />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
