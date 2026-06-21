/*
 * ml_formulas.js
 * 머신러닝 시험 대비 "공식노트" 데이터 — 7개 챕터(lecture-01~lecture-07)의 핵심 공식 모음.
 * 각 공식은 "원래 식 = 최종 기억할 식 / 의미 / 기호 / 시험 활용 / 짧은 숫자 예" 구조.
 * window.ML_FORMULAS 배열로 전역 노출. 긴 식 전개는 derivation 필드에서만, 필요한 만큼만.
 */
window.ML_FORMULAS = [
  {
    id: "formula-line-equation",
    chapterId: "lecture-01",
    title: "직선의 방정식",
    original: "y = ax + b",
    memorize: "y = ax + b (a=기울기, b=절편)",
    symbols: [
      { sym: "a", desc: "기울기(slope), x가 1 늘 때 y의 증가량" },
      { sym: "b", desc: "y절편(intercept), x=0일 때의 y값" },
      { sym: "x", desc: "입력(독립변수)" },
      { sym: "y", desc: "출력(종속변수)" }
    ],
    meaning: "입력 x와 출력 y의 선형 관계를 나타내는 가장 기본 모델. 선형 분류의 결정 경계나 회귀 직선의 형태가 모두 이 식이다.",
    whenToUse: "선형 모델·결정 경계·회귀 직선을 그릴 때. a, b 두 파라미터만 정하면 직선이 결정됨을 묻는 문제에서 사용.",
    numericExample: "a=2, b=1, x=3 → y = 2·3 + 1 = 7",
    derivation: "",
    tags: ["선형모델", "기초"]
  },
  {
    id: "formula-accuracy-01",
    chapterId: "lecture-01",
    title: "정확도(Accuracy)",
    original: "accuracy = 정분류 수 / 전체 표본 수",
    memorize: "accuracy = (맞게 분류한 개수) / (전체 개수)",
    symbols: [
      { sym: "정분류 수", desc: "정답과 일치하게 예측한 표본 개수" },
      { sym: "전체 표본 수", desc: "검증/테스트 데이터의 전체 개수" }
    ],
    meaning: "모델이 전체 데이터 중 얼마나 맞췄는지를 0~1(또는 %)로 나타내는 가장 기본 평가지표.",
    whenToUse: "분류 모델 성능 비교, 학습/검증 분할(예: 9:1) 후 검증 데이터에서 성능을 계산할 때.",
    numericExample: "100개 중 90개 정분류 → accuracy = 90/100 = 0.9 (90%)",
    derivation: "",
    tags: ["평가지표", "분류"]
  },
  {
    id: "formula-ols-slope",
    chapterId: "lecture-02",
    title: "최소제곱법 기울기 a",
    original: "a = Σ(xᵢ-x̄)(yᵢ-ȳ) / Σ(xᵢ-x̄)²",
    memorize: "a = Σ(xᵢ-x̄)(yᵢ-ȳ) / Σ(xᵢ-x̄)²  (= 공분산/분산)",
    symbols: [
      { sym: "xᵢ, yᵢ", desc: "i번째 데이터의 입력·출력" },
      { sym: "x̄, ȳ", desc: "x, y의 평균" },
      { sym: "Σ", desc: "모든 데이터에 대한 합" }
    ],
    meaning: "제곱오차의 합을 최소화하는 회귀 직선의 기울기. 분자는 x와 y의 공분산, 분모는 x의 분산에 해당한다.",
    whenToUse: "단변량 선형회귀에서 손으로 기울기를 구할 때. 먼저 평균을 구하고 편차의 곱/제곱을 합산.",
    numericExample: "점 (1,2),(2,4),(3,6) → x̄=2, ȳ=4\n분자=(-1)(-2)+0+(1)(2)=4, 분모=1+0+1=2 → a = 4/2 = 2",
    derivation: "목적함수 SSE=Σ(yᵢ-(axᵢ+b))²를 a로 편미분하여 0으로 놓고 정리하면 위 식이 나온다.",
    tags: ["선형회귀", "최소제곱법"]
  },
  {
    id: "formula-ols-intercept",
    chapterId: "lecture-02",
    title: "최소제곱법 절편 b",
    original: "b = ȳ - a·x̄",
    memorize: "b = ȳ - a·x̄ (회귀 직선은 평균점 (x̄, ȳ)를 지난다)",
    symbols: [
      { sym: "ȳ", desc: "y의 평균" },
      { sym: "x̄", desc: "x의 평균" },
      { sym: "a", desc: "앞서 구한 기울기" }
    ],
    meaning: "회귀 직선이 데이터의 평균점 (x̄, ȳ)를 반드시 지난다는 사실에서 절편을 결정한다.",
    whenToUse: "기울기 a를 먼저 구한 뒤 절편을 계산할 때. a 계산 직후 바로 사용.",
    numericExample: "x̄=2, ȳ=4, a=2 → b = 4 - 2·2 = 0  (직선 y = 2x)",
    derivation: "",
    tags: ["선형회귀", "최소제곱법"]
  },
  {
    id: "formula-determinant-2x2",
    chapterId: "lecture-02",
    title: "2×2 행렬식(determinant)",
    original: "det([[a,b],[c,d]]) = ad - bc",
    memorize: "det = ad - bc (주대각 곱 - 반대각 곱)",
    symbols: [
      { sym: "a, b, c, d", desc: "행렬 [[a,b],[c,d]]의 원소" },
      { sym: "ad", desc: "주대각선(↘) 원소의 곱" },
      { sym: "bc", desc: "반대각선(↙) 원소의 곱" }
    ],
    meaning: "2×2 행렬의 행렬식. 값이 0이면 역행렬이 존재하지 않는다(특이행렬).",
    whenToUse: "역행렬 존재 여부 판별, 연립방정식의 유일해 존재 여부 확인, 2×2 역행렬 계산 직전 단계.",
    numericExample: "[[1,2],[3,4]] → det = 1·4 - 2·3 = 4 - 6 = -2",
    derivation: "",
    tags: ["선형대수", "행렬"]
  },
  {
    id: "formula-inverse-2x2",
    chapterId: "lecture-02",
    title: "2×2 역행렬",
    original: "[[a,b],[c,d]]⁻¹ = (1/(ad-bc))·[[d,-b],[-c,a]]",
    memorize: "역행렬 = (1/det)·[[d,-b],[-c,a]]  (대각 교환, 비대각 부호 반전)",
    symbols: [
      { sym: "ad-bc", desc: "행렬식 det (0이면 역행렬 없음)" },
      { sym: "[[d,-b],[-c,a]]", desc: "a↔d 교환, b·c는 부호만 반전한 수반행렬" }
    ],
    meaning: "2×2 행렬의 역행렬 공식. 행렬식으로 나누고 대각 원소를 바꾼 뒤 비대각 원소의 부호를 뒤집는다.",
    whenToUse: "선형회귀의 정규방정식 등 2×2 연립방정식을 역행렬로 풀 때. det≠0 확인 후 적용.",
    numericExample: "[[1,2],[3,4]], det=-2 → 역행렬 = (1/-2)·[[4,-2],[-3,1]] = [[-2,1],[1.5,-0.5]]",
    derivation: "",
    tags: ["선형대수", "행렬"]
  },
  {
    id: "formula-r-squared",
    chapterId: "lecture-02",
    title: "결정계수 R²",
    original: "R² = 1 - SSE/SST",
    memorize: "R² = 1 - SSE/SST (1에 가까울수록 설명력↑)",
    symbols: [
      { sym: "SSE", desc: "잔차제곱합 Σ(yᵢ-ŷᵢ)², 모델이 못 맞춘 오차" },
      { sym: "SST", desc: "총제곱합 Σ(yᵢ-ȳ)², 평균 대비 전체 변동" },
      { sym: "ŷᵢ", desc: "모델 예측값" }
    ],
    meaning: "모델이 데이터의 변동을 얼마나 설명하는지 나타내는 0~1 지표. 1이면 완벽, 0이면 평균 예측 수준.",
    whenToUse: "회귀 모델의 설명력(적합도) 평가. 두 회귀 모델 비교 시 R²가 큰 쪽이 더 잘 설명.",
    numericExample: "SSE=10, SST=50 → R² = 1 - 10/50 = 1 - 0.2 = 0.8",
    derivation: "",
    tags: ["평가지표", "선형회귀"]
  },
  {
    id: "formula-rmse",
    chapterId: "lecture-02",
    title: "RMSE(표준오차)",
    original: "RMSE = √(Σ(yᵢ-ŷᵢ)² / n)",
    memorize: "RMSE = √(평균 제곱오차) = √(Σ(yᵢ-ŷᵢ)²/n)",
    symbols: [
      { sym: "yᵢ", desc: "실제값" },
      { sym: "ŷᵢ", desc: "예측값" },
      { sym: "n", desc: "데이터 개수" },
      { sym: "√", desc: "제곱근(원래 단위로 복원)" }
    ],
    meaning: "예측 오차의 제곱 평균에 루트를 씌운 값. y와 같은 단위를 가지며 작을수록 좋다.",
    whenToUse: "회귀 모델의 오차 크기를 원래 단위로 보고할 때. R²와 함께 회귀 평가에 사용.",
    numericExample: "오차 yᵢ-ŷᵢ = 1, 2, 2 (n=3) → 제곱합=1+4+4=9, 9/3=3 → RMSE = √3 ≈ 1.73",
    derivation: "",
    tags: ["평가지표", "선형회귀"]
  },
  {
    id: "formula-gradient-descent",
    chapterId: "lecture-02",
    title: "경사하강법 갱신식",
    original: "θ ← θ - η·∂L/∂θ",
    memorize: "θ ← θ - η·(기울기)  (기울기 반대 방향으로 η만큼 이동)",
    symbols: [
      { sym: "θ", desc: "최적화할 파라미터(가중치)" },
      { sym: "η", desc: "학습률(learning rate), 보폭 크기" },
      { sym: "∂L/∂θ", desc: "손실 L의 θ에 대한 기울기(gradient)" }
    ],
    meaning: "손실함수를 가장 빠르게 줄이는 방향(기울기의 반대)으로 파라미터를 조금씩 갱신해 최소점을 찾는다.",
    whenToUse: "최소제곱 해를 직접 못 구하거나 데이터가 클 때의 근사 최적화. η가 너무 크면 발산, 작으면 느림.",
    numericExample: "θ=1.0, η=0.1, ∂L/∂θ=4 → θ ← 1.0 - 0.1·4 = 0.6",
    derivation: "",
    tags: ["최적화", "경사하강법"]
  },
  {
    id: "formula-sigmoid",
    chapterId: "lecture-03",
    title: "시그모이드 함수",
    original: "σ(z) = 1 / (1 + e^(−z))",
    memorize: "σ(z) = 1/(1+e^(−z))  (출력 0~1, z=0이면 0.5)",
    symbols: [
      { sym: "z", desc: "선형결합 w·x (logit)" },
      { sym: "e", desc: "오일러 수 ≈ 2.718" },
      { sym: "σ(z)", desc: "확률로 해석되는 0~1 출력" }
    ],
    meaning: "실수 z를 0과 1 사이 확률로 압축하는 S자 곡선. 로지스틱 회귀의 출력(양성 클래스 확률)이다.",
    whenToUse: "로지스틱 회귀에서 선형결합 w·x를 확률 p로 변환할 때. 0.5를 기준으로 분류.",
    numericExample: "z=0 → σ=1/(1+1)=0.5\nz=2 → σ=1/(1+e^(−2))≈1/(1+0.135)≈0.88",
    derivation: "",
    tags: ["로지스틱회귀", "활성함수"]
  },
  {
    id: "formula-odds-logit",
    chapterId: "lecture-03",
    title: "오즈비와 로짓(logit)",
    original: "odds = p/(1-p),  logit = ln(p/(1-p)) = w·x",
    memorize: "logit = ln(p/(1-p)) = w·x  (확률 p ↔ 선형결합 연결)",
    symbols: [
      { sym: "p", desc: "양성 클래스일 확률" },
      { sym: "p/(1-p)", desc: "오즈(odds): 일어날 확률 / 안 일어날 확률" },
      { sym: "ln", desc: "자연로그" },
      { sym: "w·x", desc: "가중치와 입력의 내적(선형결합)" }
    ],
    meaning: "확률 p를 (0,∞)의 오즈로, 다시 (−∞,∞)의 로짓으로 변환하면 선형결합 w·x와 직접 연결된다. 시그모이드의 역함수.",
    whenToUse: "로지스틱 회귀가 '선형결합 = 로짓'으로 정의되는 이유를 설명할 때. 오즈비 해석 문제.",
    numericExample: "p=0.8 → odds = 0.8/0.2 = 4 → logit = ln(4) ≈ 1.386",
    derivation: "σ(z)=p에서 z를 풀면 z = ln(p/(1-p)), 즉 logit이 시그모이드의 역함수임이 나온다.",
    tags: ["로지스틱회귀", "오즈비"]
  },
  {
    id: "formula-self-information",
    chapterId: "lecture-03",
    title: "정보량(self-information)",
    original: "I(x) = −log₂ p(x)",
    memorize: "I(x) = −log₂ p(x)  (드문 사건일수록 정보량↑, 단위 bit)",
    symbols: [
      { sym: "p(x)", desc: "사건 x가 일어날 확률" },
      { sym: "log₂", desc: "밑이 2인 로그(비트 단위)" },
      { sym: "I(x)", desc: "사건 x의 정보량(bit)" }
    ],
    meaning: "확률이 낮은(드문) 사건이 일어났을 때 더 많은 '놀라움=정보'를 준다는 개념. 확률 1이면 정보량 0.",
    whenToUse: "엔트로피·교차엔트로피의 기본 단위 이해. bit 수를 묻는 문제.",
    numericExample: "p(x)=1/8 → I(x) = −log₂(1/8) = log₂8 = 3 bit",
    derivation: "",
    tags: ["정보이론", "엔트로피"]
  },
  {
    id: "formula-entropy-03",
    chapterId: "lecture-03",
    title: "엔트로피(Entropy)",
    original: "H = −Σ pᵢ log₂ pᵢ",
    memorize: "H = −Σ pᵢ log₂ pᵢ  (불확실성/혼잡도, 균등분포에서 최대)",
    symbols: [
      { sym: "pᵢ", desc: "i번째 사건(클래스)의 확률" },
      { sym: "Σ", desc: "모든 사건에 대한 합" },
      { sym: "−", desc: "log값이 음수라 양수로 만드는 부호" }
    ],
    meaning: "확률분포의 평균 정보량(불확실성). 한쪽으로 치우치면 작고, 균등하게 퍼지면 최대가 된다.",
    whenToUse: "분포의 무질서도 측정, 의사결정트리 정보이득 계산의 기초, 교차엔트로피와 비교.",
    numericExample: "p=(0.5, 0.5) → H = −(0.5·log₂0.5 + 0.5·log₂0.5) = −(−0.5−0.5) = 1 bit",
    derivation: "",
    tags: ["정보이론", "엔트로피"]
  },
  {
    id: "formula-cross-entropy",
    chapterId: "lecture-03",
    title: "교차엔트로피(Cross-Entropy)",
    original: "H(P,Q) = −Σ pᵢ log qᵢ",
    memorize: "H(P,Q) = −Σ pᵢ log qᵢ  (정답분포 P, 예측분포 Q의 차이 비용)",
    symbols: [
      { sym: "pᵢ", desc: "실제(정답) 분포의 확률" },
      { sym: "qᵢ", desc: "모델이 예측한 확률" },
      { sym: "log", desc: "로그(밑 2 또는 e)" }
    ],
    meaning: "정답 분포 P를 예측 분포 Q로 표현할 때 드는 평균 비용. 예측이 정답에 가까울수록 작아져 분류 손실로 쓰인다.",
    whenToUse: "분류 모델의 손실함수. 이진분류에서는 음의 로그 손실과 동일한 형태로 사용.",
    numericExample: "정답 p=(1,0), 예측 q=(0.9,0.1) → H = −(1·log₂0.9 + 0) ≈ −(−0.152) ≈ 0.152",
    derivation: "",
    tags: ["정보이론", "손실함수"]
  },
  {
    id: "formula-kl-divergence",
    chapterId: "lecture-03",
    title: "KL 발산(KL Divergence)",
    original: "D(P‖Q) = Σ pᵢ log(pᵢ/qᵢ)",
    memorize: "D(P‖Q) = Σ pᵢ log(pᵢ/qᵢ) ≥ 0  (두 분포의 차이, P=Q면 0)",
    symbols: [
      { sym: "pᵢ", desc: "기준(실제) 분포 P의 확률" },
      { sym: "qᵢ", desc: "비교(예측) 분포 Q의 확률" },
      { sym: "‖", desc: "P를 기준으로 Q를 비교한다는 표기" }
    ],
    meaning: "분포 P를 분포 Q로 근사할 때 발생하는 정보 손실(비대칭 거리). 항상 0 이상이며 두 분포가 같을 때만 0.",
    whenToUse: "예측분포가 정답분포에서 얼마나 벗어났는지 측정. 교차엔트로피 = 엔트로피 + KL 관계 설명.",
    numericExample: "P=(0.5,0.5), Q=(0.25,0.75) →\nD = 0.5·log₂(0.5/0.25)+0.5·log₂(0.5/0.75) ≈ 0.5(1)+0.5(−0.585) ≈ 0.21",
    derivation: "D(P‖Q) = H(P,Q) − H(P), 즉 교차엔트로피에서 P의 엔트로피를 뺀 값이다.",
    tags: ["정보이론", "거리"]
  },
  {
    id: "formula-l1-l2-norm",
    chapterId: "lecture-03",
    title: "L1·L2 노름(Norm)",
    original: "‖w‖₁ = Σ|wᵢ|,  ‖w‖₂ = √(Σ wᵢ²)",
    memorize: "L1 = Σ|wᵢ| (절댓값 합),  L2 = √(Σwᵢ²) (제곱합의 루트)",
    symbols: [
      { sym: "wᵢ", desc: "가중치 벡터의 i번째 성분" },
      { sym: "|wᵢ|", desc: "절댓값" },
      { sym: "‖w‖₁ / ‖w‖₂", desc: "각각 L1·L2 크기" }
    ],
    meaning: "벡터의 크기를 재는 두 방식. L1은 절댓값 합(Lasso, 희소성 유도), L2는 유클리드 길이(Ridge, 크기 억제).",
    whenToUse: "정규화 항 선택, 과적합 방지. L1은 일부 가중치를 0으로, L2는 전체적으로 작게.",
    numericExample: "w=(3,4) → L1 = 3+4 = 7,  L2 = √(9+16) = √25 = 5",
    derivation: "",
    tags: ["정규화", "노름"]
  },
  {
    id: "formula-neg-log-loss",
    chapterId: "lecture-03",
    title: "음의 로그 손실(Negative Log Loss)",
    original: "L = −Σ [yᵢ·log(pᵢ) + (1-yᵢ)·log(1-pᵢ)]",
    memorize: "L = −[y·log p + (1-y)·log(1-p)]  (정답일 때 확률이 높을수록 손실↓)",
    symbols: [
      { sym: "yᵢ", desc: "실제 라벨(0 또는 1)" },
      { sym: "pᵢ", desc: "모델이 예측한 양성 확률 σ(w·x)" },
      { sym: "−", desc: "log값이 음수라 손실을 양수로" }
    ],
    meaning: "로지스틱 회귀의 손실함수. 정답 클래스에 높은 확률을 줄수록 손실이 작아진다. 이진 교차엔트로피와 동일.",
    whenToUse: "로지스틱 회귀 학습(경사하강/상승)의 목적함수. 잘못 확신하면 손실이 급격히 커짐을 설명.",
    numericExample: "y=1, p=0.9 → L = −log(0.9) ≈ 0.105\ny=1, p=0.1 → L = −log(0.1) ≈ 2.303 (큰 손실)",
    derivation: "",
    tags: ["로지스틱회귀", "손실함수"]
  },
  {
    id: "formula-svm-margin",
    chapterId: "lecture-04",
    title: "SVM 마진(Margin)",
    original: "margin = 2 / ‖w‖",
    memorize: "margin = 2/‖w‖  (‖w‖를 줄이면 마진↑ → ‖w‖² 최소화)",
    symbols: [
      { sym: "‖w‖", desc: "가중치 벡터의 L2 노름" },
      { sym: "2", desc: "두 지지초평면(w·x+b=±1) 사이 거리 계산 상수" }
    ],
    meaning: "두 클래스를 가르는 결정 경계와 가장 가까운 데이터(지지벡터) 사이 폭. 마진을 키울수록 일반화 성능↑.",
    whenToUse: "Hard-Margin SVM 목표 설정. 마진 최대화 = ‖w‖ 최소화 = (1/2)‖w‖² 최소화로 변환.",
    numericExample: "w=(3,4) → ‖w‖=5 → margin = 2/5 = 0.4",
    derivation: "",
    tags: ["SVM", "마진"]
  },
  {
    id: "formula-svm-constraint",
    chapterId: "lecture-04",
    title: "SVM 제약조건",
    original: "yᵢ(w·xᵢ + b) ≥ 1",
    memorize: "yᵢ(w·xᵢ+b) ≥ 1  (모든 점을 마진 밖에 올바르게 분류)",
    symbols: [
      { sym: "yᵢ", desc: "라벨 +1 또는 −1" },
      { sym: "w·xᵢ+b", desc: "결정함수 값(부호=예측 클래스)" },
      { sym: "≥ 1", desc: "마진 경계 밖에 있어야 한다는 조건" }
    ],
    meaning: "각 데이터가 자기 클래스 쪽 마진 밖에 위치하도록 강제하는 조건. 등호(=1)가 성립하는 점이 지지벡터.",
    whenToUse: "Hard-Margin SVM의 제약식. 마진 최대화 문제를 제약 최적화(QP)로 세울 때.",
    numericExample: "y=+1, w·x+b=1.5 → 1·1.5 = 1.5 ≥ 1 (만족)\ny=−1, w·x+b=−2 → (−1)(−2)=2 ≥ 1 (만족)",
    derivation: "",
    tags: ["SVM", "제약조건"]
  },
  {
    id: "formula-hinge-loss",
    chapterId: "lecture-04",
    title: "힌지 손실(Hinge Loss)",
    original: "L = max(0, 1 − yᵢ(w·xᵢ + b))",
    memorize: "L = max(0, 1 − yᵢ(w·xᵢ+b))  (마진 안/오분류면 손실 발생)",
    symbols: [
      { sym: "yᵢ", desc: "라벨 +1 또는 −1" },
      { sym: "w·xᵢ+b", desc: "결정함수 값" },
      { sym: "max(0, ·)", desc: "음수면 0(마진 밖이면 손실 없음)" }
    ],
    meaning: "마진을 충분히(≥1) 만족하면 손실 0, 마진 안쪽이거나 오분류면 부족한 만큼 선형 손실을 준다. Soft-Margin SVM의 손실.",
    whenToUse: "데이터가 완벽히 선형분리 안 될 때(Soft-Margin). 일부 오류를 허용하며 마진을 키운다.",
    numericExample: "y=1, w·x+b=0.6 → max(0, 1−0.6)=0.4 (마진 안, 손실)\ny=1, w·x+b=1.5 → max(0, 1−1.5)=0 (손실 없음)",
    derivation: "",
    tags: ["SVM", "손실함수"]
  },
  {
    id: "formula-unit-vector",
    chapterId: "lecture-04",
    title: "단위벡터(Unit Vector)",
    original: "û = v / ‖v‖",
    memorize: "û = v/‖v‖  (방향은 그대로, 길이만 1로)",
    symbols: [
      { sym: "v", desc: "원래 벡터" },
      { sym: "‖v‖", desc: "v의 L2 노름(길이)" },
      { sym: "û", desc: "크기 1의 단위벡터(방향만 표현)" }
    ],
    meaning: "벡터를 자기 길이로 나눠 크기를 1로 만든 것. 방향 정보만 남기며, SVM의 법선벡터·거리 계산에 쓰인다.",
    whenToUse: "결정 경계의 법선 방향, 점-초평면 거리 계산, 벡터 정규화가 필요할 때.",
    numericExample: "v=(3,4), ‖v‖=5 → û = (3/5, 4/5) = (0.6, 0.8)",
    derivation: "",
    tags: ["벡터", "기초"]
  },
  {
    id: "formula-rbf-kernel",
    chapterId: "lecture-04",
    title: "RBF(가우시안) 커널",
    original: "K(x, x') = exp(−‖x-x'‖² / (2σ²))",
    memorize: "K(x,x') = exp(−‖x-x'‖²/(2σ²))  (가까우면 1, 멀면 0에 수렴)",
    symbols: [
      { sym: "‖x-x'‖²", desc: "두 점 사이 거리의 제곱" },
      { sym: "σ", desc: "폭(영향 범위), 작을수록 좁게 반응" },
      { sym: "exp", desc: "지수함수 e^(·)" }
    ],
    meaning: "두 점의 유사도를 거리 기반으로 0~1로 매기는 커널. 명시적 고차원 매핑 없이 비선형 분류를 가능하게 한다(커널 트릭).",
    whenToUse: "선형분리가 안 되는 데이터에 SVM을 적용할 때. σ로 결정경계의 유연성(과적합) 조절.",
    numericExample: "‖x-x'‖²=2, σ=1 → K = exp(−2/2) = e^(−1) ≈ 0.368",
    derivation: "",
    tags: ["SVM", "커널"]
  },
  {
    id: "formula-entropy-05",
    chapterId: "lecture-05",
    title: "엔트로피 H(S)",
    original: "H(S) = −Σ pᵢ log₂ pᵢ",
    memorize: "H(S) = −Σ pᵢ log₂ pᵢ  (집합 S의 클래스 불순도)",
    symbols: [
      { sym: "S", desc: "데이터 집합(노드)" },
      { sym: "pᵢ", desc: "S에서 클래스 i의 비율" },
      { sym: "log₂", desc: "밑 2 로그(bit)" }
    ],
    meaning: "의사결정트리에서 한 노드의 클래스가 얼마나 섞여 있는지(불순도)를 재는 값. 한 클래스뿐이면 0, 반반이면 최대.",
    whenToUse: "트리 분기 전후의 불순도 계산, 정보이득 산출의 기준값.",
    numericExample: "S에 양성 9개·음성 5개(총 14) → p=(9/14, 5/14)\nH(S) = −(9/14·log₂(9/14) + 5/14·log₂(5/14)) ≈ 0.940",
    derivation: "",
    tags: ["의사결정트리", "엔트로피"]
  },
  {
    id: "formula-information-gain",
    chapterId: "lecture-05",
    title: "정보이득(Information Gain)",
    original: "IG(S,A) = H(S) − Σ (|Sᵥ|/|S|)·H(Sᵥ)",
    memorize: "IG = H(S) − Σ(|Sᵥ|/|S|)·H(Sᵥ)  (분할 전 − 분할 후 불순도)",
    symbols: [
      { sym: "H(S)", desc: "분할 전 부모 노드의 엔트로피" },
      { sym: "A", desc: "분기에 사용할 속성(특징)" },
      { sym: "Sᵥ", desc: "A의 값 v로 나눠진 자식 부분집합" },
      { sym: "|Sᵥ|/|S|", desc: "자식의 가중치(데이터 비율)" }
    ],
    meaning: "속성 A로 나눴을 때 불순도가 얼마나 줄어드는지. 정보이득이 큰 속성을 분기 기준으로 선택한다.",
    whenToUse: "의사결정트리(ID3)에서 어떤 속성으로 나눌지 결정할 때. 각 속성의 IG를 비교해 최대 선택.",
    numericExample: "H(S)=0.940, 분할 후 가중평균 엔트로피=0.789\n→ IG = 0.940 − 0.789 = 0.151",
    derivation: "",
    tags: ["의사결정트리", "정보이득"]
  },
  {
    id: "formula-bayes-rule",
    chapterId: "lecture-06",
    title: "베이즈 규칙(Bayes' Rule)",
    original: "P(H|E) = P(E|H)·P(H) / P(E)",
    memorize: "사후 = (우도 × 사전) / 증거,  P(H|E)=P(E|H)P(H)/P(E)",
    symbols: [
      { sym: "P(H|E)", desc: "사후확률(증거 E 본 뒤 가설 H 확률)" },
      { sym: "P(E|H)", desc: "우도(가설 H에서 증거 E가 나올 확률)" },
      { sym: "P(H)", desc: "사전확률(증거 보기 전 H 확률)" },
      { sym: "P(E)", desc: "증거의 전체 확률(정규화 상수)" }
    ],
    meaning: "관측 증거 E를 본 뒤 가설 H의 확률을 갱신하는 규칙. 사전확률을 우도로 보정해 사후확률을 얻는다.",
    whenToUse: "나이브 베이즈 분류, 조건부확률 뒤집기, 진단/스팸 분류 문제에서 사후확률 계산.",
    numericExample: "P(E|H)=0.9, P(H)=0.01, P(E)=0.0414 →\nP(H|E) = 0.9·0.01/0.0414 ≈ 0.217",
    derivation: "P(E)는 전확률로 P(E)=P(E|H)P(H)+P(E|¬H)P(¬H)로 계산한다.",
    tags: ["나이브베이즈", "확률"]
  },
  {
    id: "formula-naive-assumption",
    chapterId: "lecture-06",
    title: "나이브(독립) 가정",
    original: "P(x₁,…,xₙ | c) = ∏ P(xᵢ | c)",
    memorize: "P(x₁..xₙ|c) = ∏ P(xᵢ|c)  (특징들이 조건부 독립이라 곱으로)",
    symbols: [
      { sym: "xᵢ", desc: "i번째 특징(feature)" },
      { sym: "c", desc: "클래스" },
      { sym: "∏", desc: "모든 특징에 대한 곱" }
    ],
    meaning: "클래스가 주어지면 각 특징이 서로 독립이라고 '순진하게' 가정해, 결합확률을 개별 확률의 곱으로 단순화한다.",
    whenToUse: "나이브 베이즈 분류기 계산. 베이즈 규칙의 우도 P(E|c)를 특징별 곱으로 분해할 때.",
    numericExample: "P(비|c)=0.6, P(바람|c)=0.5, 독립 가정 →\nP(비,바람|c) = 0.6·0.5 = 0.3",
    derivation: "",
    tags: ["나이브베이즈", "확률"]
  },
  {
    id: "formula-covariance",
    chapterId: "lecture-06",
    title: "공분산(Covariance)",
    original: "Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]",
    memorize: "Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]  (같이 커지면 +, 반대면 −)",
    symbols: [
      { sym: "X, Y", desc: "두 확률변수" },
      { sym: "μₓ, μᵧ", desc: "각 변수의 평균" },
      { sym: "E[·]", desc: "기대값(평균)" }
    ],
    meaning: "두 변수가 평균을 기준으로 함께 변하는 방향과 크기. 양수면 같은 방향, 음수면 반대 방향으로 움직인다.",
    whenToUse: "두 변수의 선형 관계 방향 파악, 상관계수 계산의 분자.",
    numericExample: "X=(1,2,3), Y=(2,4,6), μₓ=2, μᵧ=4 →\nCov = [(−1)(−2)+0+(1)(2)]/3 = 4/3 ≈ 1.33",
    derivation: "",
    tags: ["통계", "공분산"]
  },
  {
    id: "formula-correlation",
    chapterId: "lecture-06",
    title: "상관계수(Correlation)",
    original: "ρ = Cov(X,Y) / (σₓ·σᵧ)",
    memorize: "ρ = Cov(X,Y)/(σₓσᵧ)  (−1~1로 표준화한 선형 관계)",
    symbols: [
      { sym: "Cov(X,Y)", desc: "두 변수의 공분산" },
      { sym: "σₓ, σᵧ", desc: "각 변수의 표준편차" },
      { sym: "ρ", desc: "상관계수(−1~1)" }
    ],
    meaning: "공분산을 각 표준편차로 나눠 −1~1 범위로 표준화한 값. ±1에 가까울수록 강한 선형 관계, 0이면 선형 무관.",
    whenToUse: "두 변수의 선형 관계 강도를 단위에 상관없이 비교할 때. 공분산 부호+강도 해석.",
    numericExample: "Cov=1.33, σₓ≈0.816, σᵧ≈1.633 →\nρ = 1.33/(0.816·1.633) ≈ 1.0 (완전 양의 상관)",
    derivation: "",
    tags: ["통계", "상관계수"]
  },
  {
    id: "formula-precision",
    chapterId: "lecture-07",
    title: "정밀도(Precision)",
    original: "precision = TP / (TP + FP)",
    memorize: "precision = TP/(TP+FP)  (양성이라 한 것 중 진짜 양성 비율)",
    symbols: [
      { sym: "TP", desc: "True Positive: 양성을 양성으로 맞춤" },
      { sym: "FP", desc: "False Positive: 음성을 양성으로 잘못 예측" }
    ],
    meaning: "모델이 '양성'이라고 예측한 것들 중 실제로 양성인 비율. 오경보(FP)가 많으면 낮아진다.",
    whenToUse: "양성 예측의 신뢰도가 중요할 때(예: 스팸으로 분류한 게 진짜 스팸인지). 재현율과 트레이드오프.",
    numericExample: "TP=80, FP=20 → precision = 80/(80+20) = 0.8",
    derivation: "",
    tags: ["평가지표", "혼동행렬"]
  },
  {
    id: "formula-recall",
    chapterId: "lecture-07",
    title: "재현율(Recall)",
    original: "recall = TP / (TP + FN)",
    memorize: "recall = TP/(TP+FN)  (실제 양성 중 잡아낸 비율)",
    symbols: [
      { sym: "TP", desc: "True Positive: 양성을 양성으로 맞춤" },
      { sym: "FN", desc: "False Negative: 양성을 음성으로 놓침" }
    ],
    meaning: "실제 양성 중에서 모델이 제대로 찾아낸 비율(민감도). 놓침(FN)이 많으면 낮아진다.",
    whenToUse: "놓치면 치명적인 경우(예: 암 진단, 불량 검출)에 중시. 정밀도와 함께 본다.",
    numericExample: "TP=80, FN=40 → recall = 80/(80+40) = 0.667",
    derivation: "",
    tags: ["평가지표", "혼동행렬"]
  },
  {
    id: "formula-specificity",
    chapterId: "lecture-07",
    title: "특이도(Specificity)",
    original: "specificity = TN / (TN + FP)",
    memorize: "specificity = TN/(TN+FP)  (실제 음성 중 음성으로 맞춘 비율)",
    symbols: [
      { sym: "TN", desc: "True Negative: 음성을 음성으로 맞춤" },
      { sym: "FP", desc: "False Positive: 음성을 양성으로 잘못 예측" }
    ],
    meaning: "실제 음성을 음성으로 올바르게 분류한 비율. 재현율(민감도)이 양성에 대한 지표라면, 특이도는 음성에 대한 지표.",
    whenToUse: "음성을 정확히 가려내는 능력 평가(예: 정상인을 정상으로 판정). ROC 곡선의 축으로도 사용.",
    numericExample: "TN=90, FP=10 → specificity = 90/(90+10) = 0.9",
    derivation: "",
    tags: ["평가지표", "혼동행렬"]
  },
  {
    id: "formula-f1-score",
    chapterId: "lecture-07",
    title: "F1 점수(F-measure)",
    original: "F1 = 2·P·R / (P + R)",
    memorize: "F1 = 2PR/(P+R)  (정밀도·재현율의 조화평균)",
    symbols: [
      { sym: "P", desc: "정밀도(precision)" },
      { sym: "R", desc: "재현율(recall)" },
      { sym: "2PR/(P+R)", desc: "조화평균(둘 다 높아야 큼)" }
    ],
    meaning: "정밀도와 재현율의 조화평균. 한쪽만 높아서는 점수가 오르지 않아, 둘의 균형을 한 숫자로 본다.",
    whenToUse: "클래스 불균형 데이터에서 정밀도·재현율을 동시에 고려할 때. 단일 지표 비교가 필요할 때.",
    numericExample: "P=0.8, R=0.667 → F1 = 2·0.8·0.667/(0.8+0.667) ≈ 1.067/1.467 ≈ 0.727",
    derivation: "",
    tags: ["평가지표", "혼동행렬"]
  },
  {
    id: "formula-euclidean-distance",
    chapterId: "lecture-06",
    title: "유클리드 거리(Euclidean Distance)",
    original: "d = √(Σ(aᵢ-bᵢ)²)",
    memorize: "d = √(Σ(aᵢ-bᵢ)²)  (성분 차이 제곱합의 루트, 직선거리)",
    symbols: [
      { sym: "aᵢ, bᵢ", desc: "두 점 A, B의 i번째 좌표" },
      { sym: "Σ", desc: "모든 차원에 대한 합" },
      { sym: "√", desc: "제곱근" }
    ],
    meaning: "두 점 사이의 직선(최단) 거리. L2 노름으로 잰 거리이며, 값이 작을수록 두 점이 가깝다(유사하다).",
    whenToUse: "거리 기반 분류(k-NN), RBF 커널 내부, 군집화에서 유사도/거리 측정. 시험 단골 계산.",
    numericExample: "A=(1,2), B=(4,6) → d = √((4−1)²+(6−2)²) = √(9+16) = √25 = 5",
    derivation: "",
    tags: ["거리", "유사도"]
  },
  {
    id: "formula-jaccard-distance",
    chapterId: "lecture-06",
    title: "자카드 거리(Jaccard Distance)",
    original: "J = 1 − |A∩B| / |A∪B|",
    memorize: "J = 1 − |A∩B|/|A∪B|  (집합 비유사도, 0=동일 1=무공통)",
    symbols: [
      { sym: "|A∩B|", desc: "두 집합의 교집합 크기(공통 원소 수)" },
      { sym: "|A∪B|", desc: "두 집합의 합집합 크기(전체 원소 수)" },
      { sym: "1 − (·)", desc: "유사도를 거리로 변환" }
    ],
    meaning: "두 집합이 얼마나 다른지를 0~1로 나타내는 거리. 자카드 유사도(교집합/합집합)를 1에서 뺀 값이다.",
    whenToUse: "집합·이진 특징(태그, 단어 등장 여부)의 (비)유사도 비교. 추천/문서 유사도 문제.",
    numericExample: "A={1,2,3}, B={2,3,4} → 교집합={2,3}(2), 합집합={1,2,3,4}(4)\nJ = 1 − 2/4 = 0.5",
    derivation: "",
    tags: ["거리", "유사도"]
  }
];
