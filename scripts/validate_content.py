# -*- coding: utf-8 -*-
"""
validate_content.py
콘텐츠 데이터(JS) 완전성 검증:
- 7개 강의 전부 커버리지에 존재
- 7개 챕터 모두 개념노트 보유
- 공식에 기호 설명 포함
- 모든 연습/모의 문제에 modelAnswer / solutionSteps / scoringRubric 존재(비어있지 않음)
- 각 모의고사에 계산형·서술형 충분
- 빈 문제 없음
- 주요 강의가 노트/연습에서 누락되지 않음
종료코드 0=통과, 1=실패.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

LECTURES = ["lecture-0%d" % i for i in range(1, 8)]
errors = []
warnings = []
oks = []


def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def count_objects(text):
    """최상위 객체 수 = 줄 시작의 id: 키 개수."""
    return len(re.findall(r'(?m)^\s*id:\s*["\']', text))


def count_field(text, field):
    return len(re.findall(r'(?m)^\s*%s:\s*' % re.escape(field), text))


def has_empty_string(text, field):
    return bool(re.search(r'(?m)^\s*%s:\s*(""|\'\')\s*,?\s*$' % re.escape(field), text))


def has_empty_array(text, field):
    return bool(re.search(r'(?m)^\s*%s:\s*\[\s*\]\s*,?\s*$' % re.escape(field), text))


def check_file_exists(name):
    p = os.path.join(DATA, name)
    if not os.path.isfile(p):
        errors.append("데이터 파일 없음: data/%s" % name)
        return None
    return read(p)


# 1) 커버리지: 7개 강의 -------------------------------------------------
cov = check_file_exists("lecture_coverage.js")
if cov is not None:
    missing = [l for l in LECTURES if ('"%s"' % l) not in cov]
    if missing:
        errors.append("커버리지에 누락된 강의: %s" % ", ".join(missing))
    else:
        oks.append("커버리지: 7개 강의(lecture-01~07) 모두 존재")
    # 파일명 7개 .pptx 참조 확인
    pptx_refs = len(re.findall(r'\.pptx', cov))
    if pptx_refs < 7:
        warnings.append("커버리지의 .pptx 파일명 참조가 7개 미만(%d개)" % pptx_refs)

# 2) 노트: 7개 챕터 ----------------------------------------------------
notes = check_file_exists("ml_notes.js")
note_chapters = set()
if notes is not None:
    n_obj = count_objects(notes)
    for l in LECTURES:
        if ('chapterId: "%s"' % l) in notes or ("chapterId: '%s'" % l) in notes:
            note_chapters.add(l)
    miss = [l for l in LECTURES if l not in note_chapters]
    if miss:
        errors.append("개념노트가 없는 챕터: %s" % ", ".join(miss))
    else:
        oks.append("개념노트: 7개 챕터 모두 보유 (총 %d개 노트)" % n_obj)
    # 깊이 점검(개략): beginnerExplanation 필드 수가 노트 수와 일치
    if count_field(notes, "beginnerExplanation") < n_obj:
        warnings.append("일부 노트에 beginnerExplanation 누락 가능")

# 3) 공식: 기호 설명 ---------------------------------------------------
formulas = check_file_exists("ml_formulas.js")
if formulas is not None:
    f_obj = count_objects(formulas)
    f_sym = count_field(formulas, "symbols")
    if f_sym < f_obj:
        errors.append("공식 %d개 중 기호설명(symbols) 누락: symbols=%d" % (f_obj, f_sym))
    elif has_empty_array(formulas, "symbols"):
        errors.append("기호설명(symbols)이 빈 배열인 공식 존재")
    else:
        oks.append("공식노트: %d개 공식 전부 기호 설명 포함" % f_obj)

# 4) 예제 ---------------------------------------------------------------
examples = check_file_exists("ml_examples.js")
if examples is not None:
    e_obj = count_objects(examples)
    if count_field(examples, "steps") < e_obj:
        errors.append("일부 예제에 풀이(steps) 누락")
    else:
        oks.append("계산 예제: %d개, 모두 풀이 단계 포함" % e_obj)

# 5) 연습/모의 공통: 필수 필드 ----------------------------------------
REQUIRED = ["modelAnswer", "solutionSteps", "scoringRubric"]
ARRAY_FIELDS = ["solutionSteps", "scoringRubric"]
problem_files = {
    "ml_practice.js": "연습문제",
    "ml_mock_01.js": "모의고사 1회",
    "ml_mock_02.js": "모의고사 2회",
}
lecture_in_practice = set()
for fname, label in problem_files.items():
    txt = check_file_exists(fname)
    if txt is None:
        continue
    obj = count_objects(txt)
    if obj == 0:
        errors.append("%s: 문제가 0개" % label)
        continue
    # 빈 문제
    if has_empty_string(txt, "problem"):
        errors.append("%s: 비어있는 problem 존재" % label)
    # 필수 필드 존재 + 비어있지 않음
    for field in REQUIRED:
        c = count_field(txt, field)
        if c < obj:
            errors.append("%s: %s 누락 (%d/%d 문제만 보유)" % (label, field, c, obj))
        if has_empty_string(txt, field):
            errors.append("%s: %s 빈 문자열 존재" % (label, field))
    for field in ARRAY_FIELDS:
        if has_empty_array(txt, field):
            errors.append("%s: %s 빈 배열 존재" % (label, field))
    # 강의 추적
    for l in LECTURES:
        if ('sourceLecture: "%s"' % l) in txt:
            lecture_in_practice.add(l)
    # 모의고사 구성 점검 (유형 라벨은 다양할 수 있으므로 '계열'로 판정)
    if fname.startswith("ml_mock"):
        types = re.findall(r'type:\s*"([^"]+)"', txt)
        calc = sum(1 for t in types if "계산" in t)               # 계산형/행렬벡터계산/정보이득계산/통계량계산/지표계산 …
        desc = sum(1 for t in types if ("서술" in t or "비교" in t))  # 서술형/개념서술/비교형 …
        if calc < 3:
            errors.append("%s: 계산형 문제 부족(%d개, 3개 이상 필요)" % (label, calc))
        if desc < 3:
            errors.append("%s: 서술형 문제 부족(%d개, 3개 이상 필요)" % (label, desc))
        if obj < 10:
            warnings.append("%s: 문항 수 %d개(권장 10개)" % (label, obj))
        if calc >= 3 and desc >= 3 and obj >= 10:
            oks.append("%s: %d문항(계산형 %d, 서술형 %d) 구성 충족" % (label, obj, calc, desc))
    else:
        oks.append("%s: %d문제, 필수 필드(모범답안·풀이·채점기준) 모두 충족" % (label, obj))

# 6) 주요 강의가 노트/연습에 모두 등장 --------------------------------
covered = note_chapters | lecture_in_practice
miss_any = [l for l in LECTURES if l not in covered]
if miss_any:
    errors.append("노트·연습 어디에도 없는 강의: %s" % ", ".join(miss_any))
else:
    oks.append("7개 강의 전부 노트 또는 연습에 반영됨")

# ---- 출력 ----
print("=" * 60)
print(" 콘텐츠 검증 결과 (validate_content.py)")
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
