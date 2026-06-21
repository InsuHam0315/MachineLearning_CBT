# PROJECT STATUS — 머신러닝 기말고사 서술형·계산형 대비 사이트

> 작업 재개(resume)용 단일 진실 소스. 중단 후 "작업 이어서 해줘"라고 하면 이 파일을 먼저 읽고 기존 파일을 점검한 뒤 마지막 완료 지점부터 이어서 진행한다.

## 현재 단계 — 빌드 완료, 검증 통과 (커밋/푸시 단계)
- [x] 1. 프로젝트 루트 점검
- [x] 2. 강의자료(`시험/`) 7개 PPTX 추출·분석 (`_extract/`, gitignore됨)
- [x] 3. SoftwareEngineering_CBT 디자인/구조 방향 반영(다크 대시보드 + 우측 TOC + 로컬 로그인/기록/오답노트)
- [x] 4. `.gitignore`, `.nojekyll`, `PROJECT_STATUS.md`
- [x] 5. 데이터 파일 7종 생성 (병렬 에이전트로 작성)
- [x] 6. 디자인 시스템 CSS (assets/css/style.css)
- [x] 7. JS 모듈 6종 (common/auth/practice/notes/wrongNotes/records)
- [x] 8. SVG 다이어그램 8종
- [x] 9. HTML 페이지 9종
- [x] 10. 검증 스크립트 2종 + 실행 + 통과
- [x] 11. git init / commit (2 커밋) — push는 인증 문제로 보류
- [x] 12. 한국어 최종 보고

## 강의 파일 점검 (7/7 추출·반영 완료)
| ID | 파일 | 슬라이드 | 반영 |
|----|------|---------|------|
| lecture-01 | 1.지도학습 개요.pptx | 62 | 노트·공식·예제·연습·모의 |
| lecture-02 | 2.선형회귀.pptx | 49 | 노트·공식·예제·연습·모의 |
| lecture-03 | 3.로지스틱 회귀.pptx | 63 | 노트·공식·예제·연습·모의 |
| lecture-04 | 4.Support Vector Machines (SVM).pptx | 35 | 노트·공식·예제·연습·모의 |
| lecture-05 | 5.Decision Tree.pptx | 36 | 노트·공식·예제·연습·모의 |
| lecture-06 | 6.Naive Bayes Classifier.pptx | 45 | 노트·공식·예제·연습·모의 |
| lecture-07 | 7.모델 평가.pptx | 16 | 노트·공식·예제·연습·모의 |

## 생성 데이터 파일 (검증됨)
- [x] data/lecture_coverage.js — 7개 강의 커버리지
- [x] data/ml_notes.js — 개념노트 20개
- [x] data/ml_formulas.js — 공식노트 34개
- [x] data/ml_examples.js — 계산 예제 16개
- [x] data/ml_practice.js — 연습문제 28개(10개 유형 전부)
- [x] data/ml_mock_01.js — 모의고사 1회 10문항
- [x] data/ml_mock_02.js — 모의고사 2회 10문항

## 완료 페이지
- [x] index.html / login.html
- [x] notes/index.html
- [x] practice/calculation.html · descriptive.html · mock-01.html · mock-02.html
- [x] review/wrong-notes.html
- [x] stats/study-record.html

## 검증 결과
- validate_content.py: 통과 8 · 경고 0 · 실패 0 (EXIT 0)
- validate_site.py: 통과 10 · 경고 0 · 실패 0 (EXIT 0)
- node --check (전 JS): 전부 OK
- Node 런타임 스모크(_extract/smoke.js): 전 데이터 렌더 throw 0건
- 로컬 HTTP 서빙: 주요 9개 URL 모두 200

## Git 상태
- repo: 초기화됨, branch=main, 커밋 2개 (4a6d1c3, 442c9ca), 작업트리 clean
- remote: origin = https://github.com/InsuHam0315/MachineLearning_CBT.git
- 시험/ 원본: 커밋 안 됨(.gitignore) — 확인 완료
- push: **보류**. HTTP 403 — 이 PC의 저장된 GitHub 자격증명이 'sikheon' 계정이라 InsuHam0315 저장소에 쓰기 권한 없음.

## 다음 동작 (Resume) — 푸시만 남음
InsuHam0315(또는 쓰기권한 계정)로 인증 후:
```
git -C "C:\Users\HS\H\머신러닝시험" push -u origin main
```
자격증명 교체 방법은 최종 보고의 8번 항목 참조.

## 안전
- `시험/` 원본은 수정/삭제/이동/커밋하지 않음. `_extract/`(분석 임시물)도 gitignore.
