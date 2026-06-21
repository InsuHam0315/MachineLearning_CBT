/*
 * lecture_coverage.js
 * 강의자료 커버리지 맵 — 7개 PPTX 전부를 사이트 콘텐츠에 반영했는지 추적.
 * window.ML_COVERAGE 로 전역 노출.
 */
window.ML_COVERAGE = [
  {
    id: "lecture-01",
    fileName: "1.지도학습 개요.pptx",
    title: "지도학습 개요",
    slideCount: 62,
    extracted: true,
    majorTopics: [
      "지도학습 vs 비지도학습",
      "분류(Classification)와 회귀(Regression)",
      "모집단·표본·학습/테스트 데이터",
      "지도학습 실행 순서(표본추출→라벨링→특징선택→분류기학습→모델)",
      "선형 모델과 직선의 방정식(4가지 경우)",
      "결정 경계(Decision Boundary)와 분류함수",
      "우도(Likelihood)와 엔트로피 기반 학습",
      "정확도(Accuracy)와 학습/검증 분할(9:1)",
      "과대적합·과소적합·일반화",
      "교차검증(k-fold Cross Validation)"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: "수식 개체(OMML)는 텍스트로 일부만 추출되어 표준 정의로 보완함."
  },
  {
    id: "lecture-02",
    fileName: "2.선형회귀.pptx",
    title: "선형회귀 (Linear Regression)",
    slideCount: 49,
    extracted: true,
    majorTopics: [
      "선형회귀 함수와 회귀계수",
      "절대오차 vs 제곱오차, 최소제곱법(MSE)",
      "단변량·다변량(다중)회귀",
      "단위행렬·역행렬·2x2 역행렬·행렬식(determinant)",
      "Gauss-Jordan 소거법·LU 분해·역행렬로 연립방정식 풀기",
      "경사하강법·학습률(learning rate)·직선탐색(Armijo)",
      "결정계수 R²와 RMSE"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  },
  {
    id: "lecture-03",
    fileName: "3.로지스틱 회귀.pptx",
    title: "로지스틱 회귀 (Logistic Regression)",
    slideCount: 63,
    extracted: true,
    majorTopics: [
      "지수·로그함수와 오일러 수 e",
      "정보량(self-information)과 비트(bit)",
      "엔트로피·교차엔트로피·KL Divergence",
      "L1/L2 Norm과 정규화(Lasso/Ridge)",
      "Logit 변환·오즈비(odds)·시그모이드 함수",
      "음의 로그 손실(Negative Log Loss)과 경사상승법",
      "멀티클래스 로지스틱 회귀(One-vs-Rest)"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  },
  {
    id: "lecture-04",
    fileName: "4.Support Vector Machines (SVM).pptx",
    title: "서포트 벡터 머신 (SVM)",
    slideCount: 35,
    extracted: true,
    majorTopics: [
      "단위벡터·법선벡터·외적",
      "지지벡터(Support Vector)와 마진(Margin)",
      "Hard-Margin SVM과 마진 최대화",
      "이차계획법(QP)·라그랑주 승수·KKT·쌍대성(Duality)",
      "Soft-Margin SVM과 힌지 손실(Hinge Loss)",
      "커널 트릭·매핑함수·RBF(가우시안) 커널"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  },
  {
    id: "lecture-05",
    fileName: "5.Decision Tree.pptx",
    title: "의사결정 트리 (Decision Tree)",
    slideCount: 36,
    extracted: true,
    majorTopics: [
      "XOR 문제와 공간 분할",
      "엔트로피와 정보이득(Information Gain)",
      "배깅(Bagging)과 랜덤 포레스트(행·열 샘플링)",
      "부스팅(Boosting)과 AdaBoost",
      "가지치기(Pruning)"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  },
  {
    id: "lecture-06",
    fileName: "6.Naive Bayes Classifier.pptx",
    title: "나이브 베이즈 분류기 (Naive Bayes)",
    slideCount: 45,
    extracted: true,
    majorTopics: [
      "조건부확률·독립·곱셈법칙",
      "기대값·분산·공분산·상관계수",
      "베이즈 규칙(Bayes' Rule)과 사전/사후 확률",
      "혼동행렬과 Type I/II 오류",
      "나이브 베이즈 독립가정과 분류 절차"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  },
  {
    id: "lecture-07",
    fileName: "7.모델 평가.pptx",
    title: "모델 평가 (Model Evaluation)",
    slideCount: 16,
    extracted: true,
    majorTopics: [
      "혼동행렬(Confusion Matrix)",
      "정확도(Accuracy)·특이도(Specificity)",
      "재현율(Recall)·정밀도(Precision)",
      "F-measure(조화평균)",
      "정보검색에서의 Recall/Precision"
    ],
    includedInNotes: true,
    includedInPractice: true,
    limitations: ""
  }
];

// 챕터 메타(네비게이션/필터 공용)
window.ML_CHAPTERS = window.ML_COVERAGE.map(function (c) {
  return { id: c.id, title: c.title };
});
