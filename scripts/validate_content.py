# -*- coding: utf-8 -*-
"""
validate_content.py — 콘텐츠 데이터(src/data/*.ts) 완전성 검증
- 7개 강의 커버리지 / 7개 챕터 노트
- 공식 기호 설명
- 연습·모의 문제의 modelAnswer / solutionSteps / scoringRubric
- 모의고사 계산형·서술형 구성
종료코드 0=통과, 1=실패.
"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "src", "data")
LECTURES = ["lecture-0%d" % i for i in range(1, 8)]
errors, oks, warns = [], [], []

def read(name):
    p = os.path.join(DATA, name)
    if not os.path.isfile(p):
        errors.append("데이터 파일 없음: src/data/%s" % name); return None
    return open(p, encoding="utf-8").read()

def n_obj(t): return len(re.findall(r'(?m)^\s*id:\s*["\']', t))
def n_field(t, f): return len(re.findall(r'(?m)^\s*%s:\s*' % re.escape(f), t))
def empty_str(t, f): return bool(re.search(r'(?m)^\s*%s:\s*(""|\'\')\s*,?\s*$' % re.escape(f), t))
def empty_arr(t, f): return bool(re.search(r'(?m)^\s*%s:\s*\[\s*\]\s*,?\s*$' % re.escape(f), t))

cov = read("lecture_coverage.ts")
if cov is not None:
    miss = [l for l in LECTURES if ('"%s"' % l) not in cov]
    if miss: errors.append("커버리지 누락 강의: %s" % ", ".join(miss))
    else: oks.append("커버리지: 7개 강의 모두 존재")

notes = read("ml_notes.ts"); note_ch = set()
if notes is not None:
    for l in LECTURES:
        if ('chapterId: "%s"' % l) in notes: note_ch.add(l)
    miss = [l for l in LECTURES if l not in note_ch]
    if miss: errors.append("개념노트 없는 챕터: %s" % ", ".join(miss))
    else: oks.append("개념노트: 7개 챕터 모두 보유 (총 %d개)" % n_obj(notes))

formulas = read("ml_formulas.ts")
if formulas is not None:
    o = n_obj(formulas)
    if n_field(formulas, "symbols") < o or empty_arr(formulas, "symbols"):
        errors.append("일부 공식에 기호 설명(symbols) 누락")
    else: oks.append("공식노트: %d개 전부 기호 설명 포함" % o)

ex = read("ml_examples.ts")
if ex is not None:
    if n_field(ex, "steps") < n_obj(ex): errors.append("일부 예제에 풀이(steps) 누락")
    else: oks.append("계산 예제: %d개, 풀이 포함" % n_obj(ex))

REQ = ["modelAnswer", "solutionSteps", "scoringRubric"]
files = {"ml_practice.ts": "연습문제", "ml_practice_extra.ts": "연습보강",
         "ml_mock_01.ts": "모의 1회", "ml_mock_02.ts": "모의 2회", "ml_mock_03.ts": "모의 3회"}
lec_in_prac = set()
for fn, label in files.items():
    t = read(fn)
    if t is None: continue
    o = n_obj(t)
    if o == 0: errors.append("%s: 문제 0개" % label); continue
    if empty_str(t, "problem"): errors.append("%s: 빈 problem 존재" % label)
    for f in REQ:
        if n_field(t, f) < o: errors.append("%s: %s 누락(%d/%d)" % (label, f, n_field(t, f), o))
        if empty_str(t, f): errors.append("%s: %s 빈 문자열" % (label, f))
    for f in ["solutionSteps", "scoringRubric"]:
        if empty_arr(t, f): errors.append("%s: %s 빈 배열" % (label, f))
    for l in LECTURES:
        if ('sourceLecture: "%s"' % l) in t: lec_in_prac.add(l)
    if fn.startswith("ml_mock"):
        types = re.findall(r'type:\s*"([^"]+)"', t)
        calc = sum(1 for x in types if "계산" in x)
        desc = sum(1 for x in types if ("서술" in x or "비교" in x))
        if calc < 3: errors.append("%s: 계산형 계열 부족(%d)" % (label, calc))
        if desc < 1: warns.append("%s: 서술형 계열 적음(%d)" % (label, desc))
        if calc >= 3: oks.append("%s: %d문항(계산 %d·서술 %d) 구성 충족" % (label, o, calc, desc))
    else:
        oks.append("%s: %d문제, 필수 필드 충족" % (label, o))

covd = note_ch | lec_in_prac
miss = [l for l in LECTURES if l not in covd]
if miss: errors.append("노트·연습 어디에도 없는 강의: %s" % ", ".join(miss))
else: oks.append("7개 강의 전부 노트 또는 연습에 반영")

print("="*58); print(" 콘텐츠 검증 (validate_content.py)"); print("="*58)
for o in oks: print("  [OK]   " + o)
for w in warns: print("  [WARN] " + w)
for e in errors: print("  [FAIL] " + e)
print("-"*58); print(" 통과 %d · 경고 %d · 실패 %d" % (len(oks), len(warns), len(errors)))
sys.exit(1 if errors else 0)
