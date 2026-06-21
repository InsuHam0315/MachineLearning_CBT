"use client";
import { useEffect, useState } from "react";
import { getTheme, setTheme, type Theme } from "@/lib/preferences";

export default function ThemeToggle() {
  const [t, setT] = useState<Theme>("light");
  useEffect(() => { setT(getTheme()); }, []);
  function toggle() {
    const next: Theme = t === "dark" ? "light" : "dark";
    setT(next);
    setTheme(next);
  }
  return (
    <button className="icon-btn" onClick={toggle} aria-label="테마 전환"
      title={t === "dark" ? "라이트 모드로" : "다크 모드로"}>
      {t === "dark" ? "☀" : "☾"}
    </button>
  );
}
