# 머신러닝 기말고사 서술형·계산형 대비 (Next.js)

> 객관식이 아닌 **서술형·계산형 풀이 트레이너**.
> 머신러닝 7개 강의(지도학습 개요 ~ 모델 평가)를 깊이 있는 한국어 노트로 학습하고,
> 계산 과정·서술형 답안을 직접 작성한 뒤 **모범답안·풀이·채점기준**으로 스스로 채점합니다.
> **수식은 KaTeX**로 진짜 수학 조판으로 렌더됩니다.

**Next.js(App Router) + 정적 export(`output: 'export'`)** 로 GitHub Pages에 배포됩니다.

---

## 기술 스택
- **Next.js 14 (App Router)**, React 18, TypeScript
- **KaTeX** — 식 데이터(유니코드)를 LaTeX로 변환(`src/lib/mathify.ts`)해 진짜 수학 폰트로 조판
- 상태 저장: 브라우저 **localStorage** (서버 없음)
- 정적 export → `out/` → **GitHub Actions**로 Pages 배포

## 로컬 실행
```bash
npm install
npm run dev      # http://localhost:3000 (개발)
npm run build    # 정적 export → ./out 생성
```
> `npm run build` 는 `output: 'export'` 설정으로 `out/` 에 순수 정적 사이트를 만듭니다.

## 프로젝트 구조
```text
src/
├─ app/                      # App Router 페이지
│  ├─ layout.tsx             # 공통 레이아웃(헤더/푸터, globals+KaTeX+math CSS)
│  ├─ page.tsx               # 대시보드
│  ├─ login/ notes/
│  ├─ practice/{calculation,descriptive,mock-01,mock-02}/
│  ├─ review/wrong-notes/  stats/study-record/
├─ components/               # SiteHeader, NotesView, PracticeList, WrongNotesView, RecordsView, LoginForm, ui(수식 등)
├─ lib/                      # mathify(유니코드→LaTeX), storage(localStorage·집계), config(basePath)
├─ data/                     # ML_NOTES/FORMULAS/EXAMPLES/PRACTICE/MOCK_01/02/COVERAGE (TS 모듈)
└─ styles/                   # globals.css, math.css
public/
├─ .nojekyll
└─ assets/img/*.svg          # 로컬 SVG 다이어그램 8종
.github/workflows/deploy.yml # Pages 배포 워크플로우
next.config.mjs              # output:'export', basePath:/MachineLearning_CBT, images.unoptimized
```

## 진짜 수학 공식(KaTeX) 처리 방식
- 데이터의 식 문자열(예: `σ(z)=1/(1+e^(−z))`, `RMSE=√(Σ(yᵢ-ŷᵢ)²/n)`)을 `mathify()`가 LaTeX로 변환
- 위/아래첨자(²·ᵢ), 그리스문자(θ·σ·Σ), 연산자(≤···→·∂), `√(...)`·`^(...)` 괄호 균형, 노름 `‖·‖`, hat/bar 등을 처리
- 한글이 섞인 식은 한글 런과 수식 런을 분리(KaTeX 폰트엔 한글이 없음)해 한글은 일반 폰트로, 수식만 KaTeX로 렌더
- 변환 실패 시 수학 세리프 폰트로 폴백 → 절대 깨지지 않음
- **빌드 시점에 정적 HTML로 렌더**되어 SEO/속도에 유리

## localStorage 키
| 키 | 용도 |
|----|------|
| `mlCurrentUser` | 로컬 로그인 |
| `mlWrongNotes` | 오답노트 |
| `mlStudyRecords` | 자가점검 이력 |
| `mlPracticeState` | 문제별 답안·자가점검 |

## GitHub Pages 배포 (GitHub Actions)
정적 export는 Pages “브랜치 배포”가 아니라 **Actions 배포**를 씁니다.

1. 이 브랜치를 `main`에 병합(또는 `main`으로 푸시)
2. 저장소 **Settings → Pages → Build and deployment → Source: `GitHub Actions`** 선택
3. `main` 에 푸시되면 `.github/workflows/deploy.yml` 가 `npm ci && npm run build` 후 `out/` 을 배포
4. 접속:
```
https://insuham0315.github.io/MachineLearning_CBT/
```
커스텀 도메인(예시): `ist-ml.kro.kr`

> 저장소 이름이 `MachineLearning_CBT` 가 아니면 `next.config.mjs` 의 `repo` 값을 바꾸세요.

## 다루는 강의 범위
1. 지도학습 개요 · 2. 선형회귀 · 3. 로지스틱 회귀 · 4. SVM · 5. Decision Tree · 6. Naive Bayes · 7. 모델 평가
