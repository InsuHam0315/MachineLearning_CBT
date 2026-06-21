# -*- coding: utf-8 -*-
"""
validate_site.py
정적 사이트/배포 준비 검증:
- 필수 HTML / JS / CSS / 데이터 / SVG 파일 존재
- HTML의 상대경로(src/href) 실제 파일 존재
- 외부 이미지 핫링크 없음
- 절대경로(/로 시작) 없음 (GitHub Pages 하위경로 호환)
- .nojekyll 존재
종료코드 0=통과, 1=실패.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
errors = []
warnings = []
oks = []

REQUIRED_HTML = [
    "index.html", "login.html",
    "notes/index.html",
    "practice/calculation.html", "practice/descriptive.html",
    "practice/mock-01.html", "practice/mock-02.html",
    "review/wrong-notes.html",
    "stats/study-record.html",
]
REQUIRED_JS = [
    "assets/js/common.js", "assets/js/auth.js", "assets/js/practice.js",
    "assets/js/wrongNotes.js", "assets/js/records.js",
]
RECOMMENDED_JS = ["assets/js/notes.js"]
REQUIRED_CSS = ["assets/css/style.css"]
REQUIRED_DATA = [
    "data/lecture_coverage.js", "data/ml_notes.js", "data/ml_formulas.js",
    "data/ml_examples.js", "data/ml_practice.js",
    "data/ml_mock_01.js", "data/ml_mock_02.js",
]
REQUIRED_SVG = [
    "assets/img/ml-overview.svg", "assets/img/supervised-learning.svg",
    "assets/img/linear-regression.svg", "assets/img/logistic-regression.svg",
    "assets/img/svm-margin.svg", "assets/img/decision-tree.svg",
    "assets/img/naive-bayes.svg", "assets/img/model-evaluation.svg",
]


def exists(rel):
    return os.path.isfile(os.path.join(ROOT, rel))


def check_group(label, items, fatal=True):
    miss = [i for i in items if not exists(i)]
    if miss:
        msg = "%s 누락: %s" % (label, ", ".join(miss))
        (errors if fatal else warnings).append(msg)
    else:
        oks.append("%s: %d개 모두 존재" % (label, len(items)))


check_group("필수 HTML", REQUIRED_HTML)
check_group("필수 JS", REQUIRED_JS)
check_group("권장 JS", RECOMMENDED_JS, fatal=False)
check_group("필수 CSS", REQUIRED_CSS)
check_group("필수 데이터", REQUIRED_DATA)
check_group("필수 SVG", REQUIRED_SVG)

# .nojekyll
if exists(".nojekyll"):
    oks.append(".nojekyll 존재 (GitHub Pages Jekyll 비활성화)")
else:
    errors.append(".nojekyll 없음 — assets/_ 폴더가 무시될 수 있음")

# HTML 상대경로 / 핫링크 / 절대경로 검사
attr_re = re.compile(r'(?:src|href)\s*=\s*"([^"]+)"')
img_http_re = re.compile(r'<img[^>]+src\s*=\s*"(https?://[^"]+)"', re.IGNORECASE)

html_files = [h for h in REQUIRED_HTML if exists(h)]
broken_paths = []
abs_paths = []
hotlinks = []

for h in html_files:
    full = os.path.join(ROOT, h)
    base_dir = os.path.dirname(full)
    with open(full, "r", encoding="utf-8") as f:
        content = f.read()
    # 외부 이미지 핫링크
    for m in img_http_re.findall(content):
        hotlinks.append("%s → %s" % (h, m))
    # src/href 경로
    for val in attr_re.findall(content):
        v = val.strip()
        if v.startswith(("http://", "https://", "mailto:", "tel:", "data:", "javascript:")):
            continue
        if v.startswith("#") or v == "":
            continue
        if v.startswith("/"):
            abs_paths.append("%s → %s" % (h, v))
            continue
        # 프래그먼트 제거
        target = v.split("#", 1)[0]
        if target == "":
            continue
        resolved = os.path.normpath(os.path.join(base_dir, target))
        if not os.path.isfile(resolved):
            broken_paths.append("%s → %s" % (h, v))

if broken_paths:
    errors.append("깨진 상대경로: " + " | ".join(broken_paths))
else:
    oks.append("HTML 상대경로(src/href) 모두 유효")

if abs_paths:
    errors.append("절대경로(/로 시작) 사용 — Pages 하위경로에서 깨짐: " + " | ".join(abs_paths))
else:
    oks.append("절대경로 미사용 (GitHub Pages 하위경로 호환)")

# CSS url(http...) 핫링크 검사
css_path = os.path.join(ROOT, "assets/css/style.css")
if os.path.isfile(css_path):
    with open(css_path, "r", encoding="utf-8") as f:
        css = f.read()
    for m in re.findall(r'url\(\s*["\']?(https?://[^)]+)\)', css):
        hotlinks.append("style.css → %s" % m)

# SVG 외부 참조 검사
for svg in REQUIRED_SVG:
    p = os.path.join(ROOT, svg)
    if os.path.isfile(p):
        with open(p, "r", encoding="utf-8") as f:
            s = f.read()
        for m in re.findall(r'(?:href|xlink:href|src)\s*=\s*"(https?://[^"]+)"', s):
            hotlinks.append("%s → %s" % (svg, m))

if hotlinks:
    errors.append("외부 이미지/리소스 핫링크 발견: " + " | ".join(hotlinks))
else:
    oks.append("외부 이미지 핫링크 없음 (모든 시각자료 로컬 SVG)")

# ---- 출력 ----
print("=" * 60)
print(" 사이트 검증 결과 (validate_site.py)")
print("=" * 60)
for o in oks:
    print("  [OK]   " + o)
for w in warnings:
    print("  [WARN] " + w)
for e in errors:
    print("  [FAIL] " + e)
print("-" * 60)
print(" 통과 %d · 경고 %d · 실패 %d" % (len(oks), len(warnings), len(errors)))
print("=" * 60)
sys.exit(1 if errors else 0)
