# PROJECT STATUS — Next.js 미니멀 UI 개편 (branch: nextjs / main)

## 완료 상태 — 화이트 미니멀 재디자인 + 라이트/다크 + 글자크기
- [x] Next.js 14 App Router · 정적 export 유지(`output:'export'`, basePath /MachineLearning_CBT)
- [x] 디자인 시스템 전면 교체: `src/styles/globals.css` — 흰색 기반 무채색, 기존 클래스명 재사용으로 전 페이지 일괄 적용
- [x] 폰트: Pretendard(본문) + Geist Mono(코드/공식/라벨) — `pretendard`/`geist` 패키지 self-host
- [x] 라이트/다크 토글(`ThemeToggle`) — 라이트 기본, FOUC 방지 초기화 스크립트(layout `<head>`)
- [x] 글자 크기 a/A 토글(`FontSizeToggle`) — 읽기 본문 17px ↔ 19.5px
- [x] 미니멀 헤더(`Header`): 브랜드 + 범위 pill + 네비 + a/A + 테마 + 로그인 칩
- [x] 홈 재설계: 히어로 + 시험정보 카드(일시/장소/범위) + 챕터 리스트 + 연습 바로가기
- [x] 노트 재구조화: `/notes`(챕터 리스트) → `/notes/[chapterId]`(가독성 높은 챕터 상세, generateStaticParams로 7개 정적 생성)
- [x] 콘텐츠 보존: 노트20·공식34·예제16·연습28+6·모의(10/10/12), 오답노트·학습기록·로그인 그대로
- [x] 장식 이모지 제거(미니멀), 콜아웃/배지 무채색화
- [x] 검증 스크립트 재작성(scripts/validate_site.py, validate_content.py)

## 빌드/검증
- `npm run build`: 성공 — 20개 정적 페이지(챕터 상세 7개 SSG 포함)
- validate_site.py: 통과 13 · 실패 0
- validate_content.py: 통과 10 · 실패 0
- 폰트 번들 확인(Pretendard/Geist/KaTeX), 라이트 기본(html에 data-theme 없음), 다크/글자크기 토큰 존재

## localStorage 키
mlCurrentUser · mlWrongNotes · mlStudyRecords · mlPracticeState · mlThemePreference · mlFontSizePreference

## Git / 배포
- branch nextjs = main, origin/main 자동배포(Actions). 커밋/푸시는 검증 통과 후 진행.
- `시험/`(원본 강의), `시험지/`(기출 PDF)는 .gitignore로 제외. node_modules/.next/out 제외.

## 다음 동작(Resume)
→ 커밋 + 푸시(토큰) → Actions 배포 성공 확인 → 라이트/다크·글자크기 라이브 확인.
