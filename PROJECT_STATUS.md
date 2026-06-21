# PROJECT STATUS — Next.js 마이그레이션 (branch: nextjs)

> 이 브랜치는 기존 정적 사이트(main 브랜치)를 **Next.js(App Router) + 정적 export + KaTeX 수식**으로 재구축한 버전이다.

## 완료 상태
- [x] Next.js 14 App Router 프로젝트 구성 (`output: 'export'`, basePath=/MachineLearning_CBT, trailingSlash, images.unoptimized)
- [x] 기존 데이터(window.ML_*) → `src/data/*.ts` 모듈로 변환 (내용 동일: 노트 20·공식 34·예제 16·연습 28·모의 20)
- [x] 디자인 CSS 이식(`src/styles/globals.css`) + KaTeX 다크 보정(`src/styles/math.css`)
- [x] **KaTeX 수식**: `src/lib/mathify.ts`(유니코드→LaTeX) — 실제 식 144개 전부 변환·렌더 검증(KaTeX 실패 0)
- [x] 컴포넌트: SiteHeader/Footer, NotesView, PracticeList(풀이엔진), WrongNotesView, RecordsView, LoginForm, HomeDashboard, ui(수식/표/채점)
- [x] 라우트 9개: /, /login, /notes, /practice/{calculation,descriptive,mock-01,mock-02}, /review/wrong-notes, /stats/study-record
- [x] `.github/workflows/deploy.yml` (Actions로 Pages 배포)
- [x] `npm run build` 성공 → `out/` 정적 export 생성 (12 페이지 prerender)
- [x] 검증: KaTeX가 정적 HTML에 baked, basePath 적용, KaTeX 폰트 20개·SVG 8개·.nojekyll 모두 out/에 포함
- [x] 구 정적 파일 제거(이 브랜치) — main 브랜치에는 그대로 보존

## 빌드/실행
- 개발: `npm install` → `npm run dev` (localhost:3000)
- 빌드: `npm run build` → `out/`

## 배포(go-live)
1. nextjs → main 병합(또는 main으로 푸시)
2. Settings → Pages → Source: **GitHub Actions**
3. main 푸시 시 워크플로우가 빌드·배포 → https://insuham0315.github.io/MachineLearning_CBT/

## Git
- branch: nextjs (main에서 분기). 구 정적 사이트는 main 유지.
- push: 토큰/권한 필요(InsuHam0315).

## 안전
- `시험/` 원본 강의자료 수정/커밋 없음(.gitignore). `_extract/`도 gitignore.
