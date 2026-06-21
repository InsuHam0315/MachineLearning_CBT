# 머신러닝 기말고사 서술형·계산형 대비

> 객관식 CBT가 아닌 **서술형·계산형 풀이 트레이너**.
> 머신러닝 7개 강의(지도학습 개요 ~ 모델 평가)를 깊이 있는 한국어 노트로 학습하고,
> 계산 과정·서술형 답안을 직접 작성한 뒤 **모범답안·풀이과정·채점기준**으로 스스로 채점합니다.

GitHub Pages용 **정적 사이트**(HTML/CSS/Vanilla JS)입니다. 빌드 도구·서버·프레임워크가 없습니다.

---

## 1. 무엇을 위한 사이트인가

이 교수님의 시험은 **계산형 + 서술형** 중심입니다(객관식 아님). 그래서 이 사이트는:

- **깊은 개념노트** — 처음 배우는 학생도 이해할 수 있도록 개념을 처음부터 설명
- **공식노트** — `원래 식 → 기억할 형태 → 기호 설명 → 의미 → 활용 → 숫자 예` 구조 (긴 전개 지양)
- **계산 예제** — 실제 숫자로 끝까지 풀이
- **계산형 연습** — 행렬식·거리/유사도·확률·평가지표 등 손으로 계산
- **서술형 연습** — `핵심 정의 → 비교 기준 → 예시 → 결론 문장` 답안 구조 + 모범답안 + 채점기준
- **모의고사 2회** — 계산·서술·공식해석·의사코드·복잡도 혼합 10문항씩
- **오답노트 / 학습기록** — 약점 토픽·유형 자동 분석

---

## 2. 로컬에서 실행하기

정적 사이트라 그냥 `index.html`을 열어도 되지만, 데이터(JS) 로딩을 위해 **간단한 로컬 서버** 사용을 권장합니다.

PowerShell:

```powershell
Set-Location "C:\Users\HS\H\머신러닝시험"
python -m http.server 8000
```

브라우저에서:

```
http://localhost:8000/
```

> Node가 있다면 `npx serve` 등도 가능합니다. 별도 빌드 과정은 없습니다.

---

## 3. 파일 구조

```text
머신러닝시험/
├─ index.html              # 대시보드(랜딩) + 바로가기 + 학습 요약
├─ login.html              # 로컬 로그인(이름/별칭, 서버 인증 없음)
├─ README.md
├─ .nojekyll               # GitHub Pages Jekyll 비활성화
├─ .gitignore              # 시험/(원본 강의) 및 임시물 제외
├─ PROJECT_STATUS.md       # 진행 상황/재개용 문서
├─ assets/
│  ├─ css/style.css        # 다크 대시보드 디자인 시스템
│  ├─ js/
│  │  ├─ common.js         # 스토리지·헤더/푸터 주입·렌더 헬퍼
│  │  ├─ auth.js           # 로컬 로그인/로그아웃
│  │  ├─ practice.js       # 풀이 엔진(연습·모의 공용)
│  │  ├─ notes.js          # 개념/공식/예제 렌더 + TOC
│  │  ├─ wrongNotes.js     # 오답노트
│  │  └─ records.js        # 학습기록 집계
│  └─ img/                 # 로컬 SVG 다이어그램 8종(외부 핫링크 없음)
├─ data/
│  ├─ lecture_coverage.js  # 7개 강의 커버리지 맵
│  ├─ ml_notes.js          # 개념노트 20개
│  ├─ ml_formulas.js       # 공식노트 34개
│  ├─ ml_examples.js       # 계산 예제 16개
│  ├─ ml_practice.js       # 연습문제 28개(10개 유형)
│  ├─ ml_mock_01.js        # 모의고사 1회 10문항
│  └─ ml_mock_02.js        # 모의고사 2회 10문항
├─ notes/index.html        # 개념·공식·예제 (우측 sticky 목차)
├─ practice/
│  ├─ calculation.html     # 계산형 연습
│  ├─ descriptive.html     # 서술형 연습
│  ├─ mock-01.html         # 모의고사 1회
│  └─ mock-02.html         # 모의고사 2회
├─ review/wrong-notes.html # 오답노트
├─ stats/study-record.html # 학습기록
└─ scripts/
   ├─ validate_content.py  # 콘텐츠 완전성 검증
   └─ validate_site.py     # 파일/경로/배포 검증
```

> `시험/` 폴더(원본 PPTX 강의자료)는 읽기 전용이며 **저장소에 커밋되지 않습니다**(.gitignore).

---

## 4. 서술형·계산형 시험에 맞춘 설계

- **연습/모의 문제**는 객관식이 아니라 `문제 → 답안 작성(textarea) → 스크래치패드 → 모범답안/풀이과정/채점기준 공개 → 자가 점검(잘 풀었음/애매함/틀림)` 흐름입니다.
- **계산형**: 답안 형식 가이드, 핵심 공식, 단계별 풀이, 자주 하는 계산 실수 제공.
- **서술형**: `핵심 정의 / 비교 기준 / 예시 / 결론 문장` 4단 구조 + 모범답안 + 채점 기준 제공.
- **공식노트**는 긴 식 전개(식1→식2→…)를 지양하고 “기억할 형태와 의미” 중심으로 정리.

---

## 5. 데이터 저장(localStorage) 안내

모든 학습 데이터는 **브라우저 localStorage에만** 저장되며 서버로 전송되지 않습니다.

| 키 | 용도 |
|----|------|
| `mlCurrentUser` | 로컬 로그인 사용자(이름/별칭) |
| `mlWrongNotes` | 오답노트 항목 |
| `mlStudyRecords` | 자가 점검 이력(학습기록) |
| `mlPracticeState` | 문제별 작성 답안·자가점검 상태 |

브라우저 데이터를 지우면 기록도 사라집니다. 다른 기기와 동기화되지 않습니다.

---

## 6. GitHub Pages 배포

1. GitHub 저장소에 푸시: `https://github.com/InsuHam0315/MachineLearning_CBT.git`
2. 저장소 **Settings → Pages** 이동
3. **Build and deployment → Source: Deploy from a branch**
4. **Branch: `main` / Folder: `/ (root)`** 선택 후 **Save**
5. 잠시 후 아래 주소에서 접속

예상 기본 주소:

```
https://insuham0315.github.io/MachineLearning_CBT/
```

커스텀 도메인(예시):

```
ist-ml.kro.kr
```

> `.nojekyll`이 포함되어 있어 `assets/`·`data/` 등이 정상 서빙됩니다. 모든 경로는 상대경로라 하위경로(`/MachineLearning_CBT/`)에서도 동작합니다.

---

## 7. 검증

```powershell
python scripts/validate_content.py   # 콘텐츠 완전성
python scripts/validate_site.py      # 파일/경로/배포 준비
```

(선택) JS 문법 검사:

```powershell
node --check assets/js/common.js
node --check assets/js/auth.js
node --check assets/js/practice.js
node --check assets/js/wrongNotes.js
node --check assets/js/records.js
```

---

## 8. 다루는 강의 범위

1. 지도학습 개요 · 2. 선형회귀 · 3. 로지스틱 회귀 · 4. SVM · 5. Decision Tree · 6. Naive Bayes · 7. 모델 평가
