# -*- coding: utf-8 -*-
"""
validate_site.py — Next.js 정적 export 사이트 구조/설정 검증
- 필수 라우트/컴포넌트/데이터/SVG 존재
- output:'export', images.unoptimized
- Pretendard/Geist Mono 폰트 규칙, 라이트/다크·글자크기 토글 코드
- .nojekyll 존재
종료코드 0=통과, 1=실패.
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors, oks, warns = [], [], []

def has(rel): return os.path.isfile(os.path.join(ROOT, rel))
def read(rel):
    p = os.path.join(ROOT, rel)
    return open(p, encoding="utf-8").read() if os.path.isfile(p) else ""

def group(label, items, fatal=True):
    miss = [i for i in items if not has(i)]
    if miss: (errors if fatal else warns).append("%s 누락: %s" % (label, ", ".join(miss)))
    else: oks.append("%s: %d개 존재" % (label, len(items)))

ROUTES = ["src/app/layout.tsx","src/app/page.tsx","src/app/login/page.tsx","src/app/notes/page.tsx",
    "src/app/notes/[chapterId]/page.tsx","src/app/practice/calculation/page.tsx","src/app/practice/descriptive/page.tsx",
    "src/app/practice/mock-01/page.tsx","src/app/practice/mock-02/page.tsx","src/app/practice/mock-03/page.tsx",
    "src/app/review/wrong-notes/page.tsx","src/app/stats/study-record/page.tsx"]
COMPONENTS = ["src/components/Header.tsx","src/components/ThemeToggle.tsx","src/components/FontSizeToggle.tsx",
    "src/components/ChapterDetail.tsx","src/components/PracticeList.tsx","src/components/ui.tsx",
    "src/components/WrongNotesView.tsx","src/components/RecordsView.tsx","src/components/LoginForm.tsx"]
LIB = ["src/lib/storage.ts","src/lib/preferences.ts","src/lib/config.ts","src/lib/mathify.ts"]
DATA = ["src/data/lecture_coverage.ts","src/data/ml_notes.ts","src/data/ml_formulas.ts","src/data/ml_examples.ts",
    "src/data/ml_practice.ts","src/data/ml_mock_01.ts","src/data/ml_mock_02.ts","src/data/ml_mock_03.ts"]
SVG = ["public/assets/img/%s.svg" % n for n in ["ml-overview","supervised-learning","linear-regression",
    "logistic-regression","svm-margin","decision-tree","naive-bayes","model-evaluation"]]

group("필수 라우트", ROUTES)
group("필수 컴포넌트", COMPONENTS)
group("라이브러리", LIB)
group("데이터", DATA)
group("SVG", SVG)

# next.config: output export
cfg = read("next.config.mjs") or read("next.config.js")
if not cfg: errors.append("next.config.(mjs|js) 없음")
else:
    if re.search(r"output:\s*[\"']export[\"']", cfg): oks.append("output:'export' 설정")
    else: errors.append("next.config: output:'export' 없음")
    if "unoptimized" in cfg: oks.append("images.unoptimized 설정")
    else: warns.append("images.unoptimized 권장")

# 폰트 규칙
g = read("src/styles/globals.css")
if "Pretendard" in g and "font-geist-mono" in g: oks.append("Pretendard(본문)/Geist Mono(--font-mono) 폰트 규칙 존재")
else: errors.append("globals.css 폰트 규칙(Pretendard/Geist Mono) 누락")

# 테마/글자크기 토글
lay = read("src/app/layout.tsx")
pref = read("src/lib/preferences.ts")
if 'data-theme="dark"' in g and 'data-fontsize="large"' in g: oks.append("라이트/다크 + 글자크기 CSS 토큰 존재")
else: errors.append("data-theme/data-fontsize CSS 토큰 누락")
if "mlThemePreference" in pref and "mlFontSizePreference" in pref: oks.append("테마/글자크기 localStorage 키 존재")
else: errors.append("preferences localStorage 키 누락")
if "data-theme" in lay: oks.append("layout: FOUC 방지 테마 초기화 스크립트 존재")
else: warns.append("layout: 테마 초기화 스크립트 확인 필요")

# .nojekyll
if has("public/.nojekyll"): oks.append("public/.nojekyll 존재")
else: errors.append("public/.nojekyll 없음")

# 원본 강의 비커밋 (gitignore)
gi = read(".gitignore")
if "시험/" in gi: oks.append(".gitignore에 시험/(원본 강의) 제외")
else: errors.append(".gitignore에 시험/ 제외 누락")

print("="*58); print(" 사이트 검증 (validate_site.py)"); print("="*58)
for o in oks:
    if o: print("  [OK]   " + o)
for w in warns: print("  [WARN] " + w)
for e in errors: print("  [FAIL] " + e)
print("-"*58); print(" 통과 %d · 경고 %d · 실패 %d" % (len([o for o in oks if o]), len(warns), len(errors)))
sys.exit(1 if errors else 0)
