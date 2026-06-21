/* =========================================================================
   preferences.ts — 테마(라이트/다크) · 글자크기(기본/큰) 환경설정 (localStorage)
   ========================================================================= */
export const THEME_KEY = "mlThemePreference";
export const FONT_KEY = "mlFontSizePreference";
export type Theme = "light" | "dark";
export type FontSize = "normal" | "large";

export function getTheme(): Theme {
  try { return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light"; } catch { return "light"; }
}
export function applyTheme(t: Theme): void {
  if (typeof document === "undefined") return;
  if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}
export function setTheme(t: Theme): void {
  try { localStorage.setItem(THEME_KEY, t); } catch { /* ignore */ }
  applyTheme(t);
}

export function getFontSize(): FontSize {
  try { return localStorage.getItem(FONT_KEY) === "large" ? "large" : "normal"; } catch { return "normal"; }
}
export function applyFontSize(f: FontSize): void {
  if (typeof document === "undefined") return;
  if (f === "large") document.documentElement.setAttribute("data-fontsize", "large");
  else document.documentElement.removeAttribute("data-fontsize");
}
export function setFontSize(f: FontSize): void {
  try { localStorage.setItem(FONT_KEY, f); } catch { /* ignore */ }
  applyFontSize(f);
}
