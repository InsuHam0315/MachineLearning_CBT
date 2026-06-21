"use client";
import { useEffect, useState } from "react";
import { getFontSize, setFontSize, type FontSize } from "@/lib/preferences";

export default function FontSizeToggle() {
  const [f, setF] = useState<FontSize>("normal");
  useEffect(() => { setF(getFontSize()); }, []);
  function choose(v: FontSize) { setF(v); setFontSize(v); }
  return (
    <div className="seg" role="group" aria-label="글자 크기 조절">
      <button className={"fs-a" + (f === "normal" ? " is-on" : "")} onClick={() => choose("normal")} aria-label="기본 글자 크기" title="기본 글자 크기">a</button>
      <button className={"fs-A" + (f === "large" ? " is-on" : "")} onClick={() => choose("large")} aria-label="큰 글자 크기" title="큰 글자 크기">A</button>
    </div>
  );
}
