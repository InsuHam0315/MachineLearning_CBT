/* =========================================================================
   mathify.ts — 유니코드 수식 텍스트 → LaTeX 변환 (KaTeX 입력용)
   데이터의 식(예: "σ(z)=1/(1+e^(−z))", "RMSE=√(Σ(yᵢ-ŷᵢ)²/n)")을
   진짜 수학 조판으로 렌더하기 위해 LaTeX 문자열로 바꾼다.
   ========================================================================= */

const SUP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7",
  "⁸": "8", "⁹": "9", "ⁿ": "n", "⁺": "+", "⁻": "-", "⁼": "=", "⁽": "(", "⁾": ")",
  "ᵀ": "T", "ⁱ": "i",
};
const SUB: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7",
  "₈": "8", "₉": "9", "ᵢ": "i", "ⱼ": "j", "ₖ": "k", "ₙ": "n", "ₘ": "m", "ₐ": "a",
  "ₓ": "x", "₊": "+", "₋": "-", "ₜ": "t",
};
const PRECOMP: Record<string, string> = { "ŷ": "\\hat{y}", "ŵ": "\\hat{w}", "x̂": "\\hat{x}" };
const SYM: Record<string, string> = {
  "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ", "ε": "\\varepsilon ",
  "ζ": "\\zeta ", "η": "\\eta ", "θ": "\\theta ", "λ": "\\lambda ", "μ": "\\mu ",
  "ν": "\\nu ", "ξ": "\\xi ", "π": "\\pi ", "ρ": "\\rho ", "σ": "\\sigma ", "τ": "\\tau ",
  "φ": "\\phi ", "ϕ": "\\phi ", "χ": "\\chi ", "ψ": "\\psi ", "ω": "\\omega ",
  "Δ": "\\Delta ", "Σ": "\\sum ", "∑": "\\sum ", "Π": "\\prod ", "∏": "\\prod ",
  "Ω": "\\Omega ", "Φ": "\\Phi ", "Θ": "\\Theta ",
  "·": "\\cdot ", "∙": "\\cdot ", "×": "\\times ", "÷": "\\div ", "∗": "*",
  "≤": "\\le ", "≥": "\\ge ", "≠": "\\ne ", "≈": "\\approx ", "≡": "\\equiv ",
  "→": "\\to ", "⟶": "\\longrightarrow ", "⇒": "\\Rightarrow ", "↦": "\\mapsto ",
  "∂": "\\partial ", "∇": "\\nabla ", "∈": "\\in ", "∉": "\\notin ", "∋": "\\ni ",
  "∞": "\\infty ", "∫": "\\int ", "∮": "\\oint ", "∝": "\\propto ", "±": "\\pm ", "∓": "\\mp ",
  "∩": "\\cap ", "∪": "\\cup ", "⊂": "\\subset ", "⊆": "\\subseteq ", "⊃": "\\supset ",
  "∀": "\\forall ", "∃": "\\exists ", "∅": "\\emptyset ", "∖": "\\setminus ",
  "∘": "\\circ ", "⊗": "\\otimes ", "⊕": "\\oplus ", "…": "\\dots ", "⋯": "\\cdots ",
  "≜": "\\triangleq ", "≅": "\\cong ", "∥": "\\parallel ", "⟂": "\\perp ",
  "½": "\\tfrac{1}{2} ", "⅓": "\\tfrac{1}{3} ", "⅔": "\\tfrac{2}{3} ",
  "¼": "\\tfrac{1}{4} ", "¾": "\\tfrac{3}{4} ", "⅛": "\\tfrac{1}{8} ",
  "‖": "\\Vert ", "∣": "\\mid ", "⌊": "\\lfloor ", "⌋": "\\rfloor ",
};

function matchParen(s: string, open: number): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") { depth--; if (depth === 0) return i; }
  }
  return -1;
}

// √( ... ) → \sqrt{ ... } (괄호 균형 처리, 중첩 허용)
function convertSqrt(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "√") {
      let j = i + 1;
      while (s[j] === " ") j++;
      if (s[j] === "(") {
        const k = matchParen(s, j);
        if (k > -1) { out += "\\sqrt{" + convertSqrt(s.slice(j + 1, k)) + "}"; i = k; continue; }
      }
      out += "\\sqrt ";
      continue;
    }
    out += s[i];
  }
  return out;
}

// ^( ... ) → ^{ ... } (괄호 균형)
function convertCaretParen(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "^" && s[i + 1] === "(") {
      const k = matchParen(s, i + 1);
      if (k > -1) { out += "^{" + s.slice(i + 2, k) + "}"; i = k; continue; }
    }
    out += s[i];
  }
  return out;
}

function mapRun(run: string, table: Record<string, string>): string {
  let r = "";
  for (const c of run) r += table[c] || "";
  return r;
}

export function mathify(raw: string): string {
  if (raw == null) return "";
  let s = String(raw);

  // 유니코드 마이너스/곱셈표기 정규화
  s = s.replace(/[−–—]/g, "-").replace(/[‐-‒]/g, "-");
  // KaTeX 특수문자 이스케이프(우리가 생성하지 않는 것만)
  s = s.replace(/%/g, "\\%").replace(/(?<!\\)#/g, "\\#").replace(/(?<!\\)&/g, "\\&");

  // hat/bar (결합 문자 + 미리 합성된 글리프)
  s = s.replace(/([A-Za-z])̄/g, "\\bar{$1}").replace(/([A-Za-z])̂/g, "\\hat{$1}");
  for (const k in PRECOMP) s = s.split(k).join(PRECOMP[k]);

  // 노름 ‖x‖ → \lVert x \rVert
  s = s.replace(/‖([^‖]*)‖/g, "\\lVert $1\\rVert ");

  // √( ), ^( ) 균형 처리
  s = convertSqrt(s);
  s = convertCaretParen(s);

  // 위/아래 첨자 런
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿ⁺⁻⁼⁽⁾ᵀⁱ]+/g, (m) => "^{" + mapRun(m, SUP) + "}");
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉ᵢⱼₖₙₘₐₓ₊₋ₜ]+/g, (m) => "_{" + mapRun(m, SUB) + "}");

  // 함수 이름 정자체
  s = s.replace(/(?<![A-Za-z\\])(log|ln|exp|max|min|det|sin|cos|tan)(?![A-Za-z])/g, "\\$1 ");

  // 그리스/연산자
  for (const k in SYM) s = s.split(k).join(SYM[k]);

  // 남은 한글 런을 \text{} 로 보호
  s = s.replace(/[가-힣]+(?:\s+[가-힣]+)*/g, (m) => "\\text{" + m + "}");

  return s;
}
