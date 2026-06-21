// 경로/에셋 헬퍼 (GitHub Pages 하위경로 basePath 대응)
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(p: string): string {
  if (!p) return "";
  if (/^https?:/i.test(p)) return p;
  return BASE_PATH + (p.startsWith("/") ? p : "/" + p);
}
