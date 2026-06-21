/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "MachineLearning_CBT";
const basePath = isProd ? "/" + repo : "";

const nextConfig = {
  output: "export",              // 정적 export → GitHub Pages
  trailingSlash: true,           // /notes/ → notes/index.html
  images: { unoptimized: true }, // export 시 이미지 최적화 비활성
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
