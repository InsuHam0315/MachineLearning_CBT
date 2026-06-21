# 머신러닝 기말 · 서술·계산형 대비 (Next.js · 미니멀 UI)

지도학습의 개요부터 모델 평가까지 7개 강의를 **깊이 있는 개념 정리 + 계산형·서술형 문제 + 모의고사 + 오답노트**로 준비하는 학습 사이트입니다.

**디자인**: 흰색 기반 미니멀(무채색), 라이트/다크 모드, 글자 크기(a/A) 조절. **수식은 KaTeX**로 조판.

## 기술 스택
- **Next.js 14 (App Router)** + **정적 export**(`output: 'export'`) → GitHub Pages
- 폰트: **Pretendard**(한국어 본문/제목) · **Geist Mono**(코드·공식·라벨) — `pretendard` / `geist` npm 패키지로 self-host
- 상태/설정: 브라우저 **localStorage** (서버 없음)
- KaTeX(수식), TypeScript

## 로컬 실행
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 export → ./out
```

## 구조
```text
src/
├─ app/                     # 라우트
│  ├─ layout.tsx            # 폰트 + 테마 초기화(FOUC 방지) + Header
│  ├─ page.tsx              # 홈(히어로·시험정보·챕터 리스트)
│  ├─ login/  notes/  notes/[chapterId]/   (챕터 상세, generateStaticParams)
│  ├─ practice/{calculation,descriptive,mock-01,mock-02,mock-03}/
│  └─ review/wrong-notes/  stats/study-record/
├─ components/              # Header, ThemeToggle, FontSizeToggle, ChapterDetail, PracticeList, ui(수식) …
├─ lib/                     # preferences(테마·글자크기), storage, mathify(유니코드→LaTeX), config(basePath)
├─ data/                    # 강의 커버리지·노트·공식·예제·연습·모의(01/02/03)
└─ styles/                  # globals.css(디자인 시스템), math.css
public/assets/img/*.svg     # 로컬 SVG 8종
next.config.mjs             # output:'export', images.unoptimized, basePath:/MachineLearning_CBT
```

## 설정(localStorage 키)
| 키 | 용도 |
|----|------|
| `mlCurrentUser` | 로컬 로그인 |
| `mlWrongNotes` | 오답노트 |
| `mlStudyRecords` | 자가점검 이력 |
| `mlPracticeState` | 문제별 답안·자가점검 |
| `mlThemePreference` | 라이트/다크 |
| `mlFontSizePreference` | 글자 크기(기본/큰) |

## GitHub Pages 배포
`main`에 푸시하면 `.github/workflows/deploy.yml`이 `npm ci && npm run build` 후 `out/`을 자동 배포합니다.
(Settings → Pages → Source: **GitHub Actions**)

- 기본 주소: `https://insuham0315.github.io/MachineLearning_CBT/`
- 커스텀 도메인 예시: `ist-ml.kro.kr`
- **basePath 주의**: 프로젝트 URL(`/MachineLearning_CBT`)에서는 `next.config.mjs`의 `basePath`가 필요합니다. 커스텀 도메인을 루트로 쓰면 `basePath`/`assetPrefix`를 비워야 합니다(같은 파일에서 조정).

## 검증
```bash
npm run build
python scripts/validate_site.py
python scripts/validate_content.py
```

## 다루는 강의(7강)
1. 지도학습 개요 · 2. 선형회귀 · 3. 로지스틱 회귀 · 4. SVM · 5. Decision Tree · 6. Naive Bayes · 7. 모델 평가

> 원본 강의자료(`시험/`)와 기출 PDF(`시험지/`)는 `.gitignore`로 저장소에 커밋되지 않습니다.
