/**
 * High School Math Practice Platform - QUESTIONS_G10
 * Auto-generated with strict desensitization and MathJax compliance.
 * Export: window.QUESTIONS_G10
 */
(function (root) {
  'use strict';

  var questionsList = [
  {
    "id": "G10_Q01_SET_NOTATION",
    "chapter": "ch01_sets",
    "section": "1.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "數集符號",
      "元素與集合從屬關係"
    ],
    "prompt": "下列元素與常用數集符號的從屬關係中，正確的是",
    "stem": "下列元素與常用數集符號的從屬關係中，正確的是",
    "options": [
      {
        "key": "A",
        "text": "$-3 \\in \\mathbf{N}$"
      },
      {
        "key": "B",
        "text": "$\\sqrt{2} \\in \\mathbf{Q}$"
      },
      {
        "key": "C",
        "text": "$0 \\in \\mathbf{N}$"
      },
      {
        "key": "D",
        "text": "$\\pi \\notin \\mathbf{R}$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】$\\mathbf{N}$ 表示自然數集（包含 $0$ 與正整數），因此 $0 \\in \\mathbf{N}$ 是正確的，而 $-3 \\notin \\mathbf{N}$（A 錯誤）；$\\mathbf{Q}$ 表示有理數集，$\\sqrt{2}$ 是無理數，故 $\\sqrt{2} \\notin \\mathbf{Q}$（B 錯誤）；$\\mathbf{R}$ 表示實數集，$\\pi$ 是實數，故 $\\pi \\in \\mathbf{R}$（D 錯誤）。綜上，正確選項為 C。"
  },
  {
    "id": "G10_Q02_SET_INTERSECTION",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "集合運算",
      "交集"
    ],
    "prompt": "已知集合 $A = \\{1, 2, 3\\}$，集合 $B = \\{2, 3, 4\\}$，則 $A \\cap B$ 等於",
    "stem": "已知集合 $A = \\{1, 2, 3\\}$，集合 $B = \\{2, 3, 4\\}$，則 $A \\cap B$ 等於",
    "options": [
      {
        "key": "A",
        "text": "$\\{2, 3\\}$"
      },
      {
        "key": "B",
        "text": "$\\{1, 4\\}$"
      },
      {
        "key": "C",
        "text": "$\\{1, 2, 3, 4\\}$"
      },
      {
        "key": "D",
        "text": "$\\emptyset$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】集合的交集是指由屬於集合 $A$ 且屬於集合 $B$ 的所有公共元素組成的集合。$A = \\{1, 2, 3\\}$，$B = \\{2, 3, 4\\}$，兩者公共元素為 $2$ 和 $3$，故 $A \\cap B = \\{2, 3\\}$。正確選項為 A。"
  },
  {
    "id": "G10_Q03_LOGIC_CONDITION",
    "chapter": "ch02_logic",
    "section": "2.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "常用邏輯用語",
      "充分條件與必要條件"
    ],
    "prompt": "“四邊形是菱形”是“該四邊形的對角線互相垂直”的",
    "stem": "“四邊形是菱形”是“該四邊形的對角線互相垂直”的",
    "options": [
      {
        "key": "A",
        "text": "充分不必要條件"
      },
      {
        "key": "B",
        "text": "必要不充分條件"
      },
      {
        "key": "C",
        "text": "充要條件"
      },
      {
        "key": "D",
        "text": "既不充分也不必要條件"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】若一個四邊形是菱形，則根據菱形幾何性質，其對角線必互相垂直，故充分性成立；反之，若一個四邊形的對角線互相垂直（例如鳶形或任意對角線垂直的四邊形），它不一定是菱形，故必要性不成立。因此“四邊形是菱形”是“該四邊形的對角線互相垂直”的充分不必要條件。正確選項為 A。"
  },
  {
    "id": "G10_Q04_PROPOSITION_NEGATION",
    "chapter": "ch02_logic",
    "section": "2.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "全稱量詞命題",
      "命題的否定"
    ],
    "prompt": "全稱量詞命題“$\\forall x \\in \\mathbf{R},\\, x^2 + 1 > 0$”的否定是",
    "stem": "全稱量詞命題“$\\forall x \\in \\mathbf{R},\\, x^2 + 1 > 0$”的否定是",
    "options": [
      {
        "key": "A",
        "text": "$\\exists x \\in \\mathbf{R},\\, x^2 + 1 \\le 0$"
      },
      {
        "key": "B",
        "text": "$\\forall x \\notin \\mathbf{R},\\, x^2 + 1 \\le 0$"
      },
      {
        "key": "C",
        "text": "$\\exists x \\in \\mathbf{R},\\, x^2 + 1 < 0$"
      },
      {
        "key": "D",
        "text": "$\\forall x \\in \\mathbf{R},\\, x^2 + 1 \\le 0$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】全稱量詞命題“$\\forall x \\in M,\\, p(x)$”的否定為存在量詞命題“$\\exists x \\in M,\\, \\neg p(x)$”。因此全稱量詞“$\\forall$”變為存在量詞“$\\exists$”，不等號“$>$”否定為“$\\le$”，變量所屬集合 $\\mathbf{R}$ 保持不變。即否定命題為“$\\exists x \\in \\mathbf{R},\\, x^2 + 1 \\le 0$”。正確選項為 A。"
  },
  {
    "id": "G10_Q05_INEQUALITY_PROPERTY",
    "chapter": "ch03_inequalities",
    "section": "3.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "不等式性質",
      "同加性質"
    ],
    "prompt": "若實數 $a, b, c$ 滿足 $a > b$，則下列不等式中恆成立的是",
    "stem": "若實數 $a, b, c$ 滿足 $a > b$，則下列不等式中恆成立的是",
    "options": [
      {
        "key": "A",
        "text": "$ac > bc$"
      },
      {
        "key": "B",
        "text": "$a + c > b + c$"
      },
      {
        "key": "C",
        "text": "$a^2 > b^2$"
      },
      {
        "key": "D",
        "text": "$\\frac{a}{c} > \\frac{b}{c}$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】根據實數不等式的基本性質，不等式兩邊同加（或同減）同一個實數，不等號方向不變，故 $a > b \\implies a + c > b + c$ 恆成立（B 正確）；當 $c \\le 0$ 時 $ac > bc$ 不成立（A 錯誤）；若 $a=1, b=-2$，滿足 $a>b$ 但 $a^2 = 1 < b^2 = 4$（C 錯誤）；當 $c=0$ 或 $c<0$ 時，除法可能無意義或不等號改變方向（D 錯誤）。正確選項為 B。"
  },
  {
    "id": "G10_Q06_QUADRATIC_SET",
    "chapter": "ch01_sets",
    "section": "1.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "方程實根集合",
      "子集個數"
    ],
    "prompt": "方程 $x^2 - 9 = 0$ 的所有實數根組成的集合用列舉法表示為 $A$，集合 $\\{m, n\\}$ 的子集共有 $N$ 個，則集合 $A$ 與 $N$ 的值分別為",
    "stem": "方程 $x^2 - 9 = 0$ 的所有實數根組成的集合用列舉法表示為 $A$，集合 $\\{m, n\\}$ 的子集共有 $N$ 個，則集合 $A$ 與 $N$ 的值分別為",
    "options": [
      {
        "key": "A",
        "text": "$A = \\{-3, 3\\},\\, N = 4$"
      },
      {
        "key": "B",
        "text": "$A = \\{3\\},\\, N = 4$"
      },
      {
        "key": "C",
        "text": "$A = \\{-3, 3\\},\\, N = 2$"
      },
      {
        "key": "D",
        "text": "$A = \\{9\\},\\, N = 8$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】解二次方程 $x^2 - 9 = 0$ 得 $x_1 = -3, x_2 = 3$，故其根的集合用列舉法表示為 $\\{-3, 3\\}$；含 $n$ 個元素的有限集合，其子集個數為 $2^n$，集合 $\\{m, n\\}$ 含 2 個元素，子集個數為 $2^2 = 4$ 個（$\\emptyset, \\{m\\}, \\{n\\}, \\{m, n\\}$）。正確選項為 A。"
  },
  {
    "id": "G10_Q07_SET_COMPLEMENT_INTERVAL",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "補集運算",
      "區間交集"
    ],
    "prompt": "設全集 $U = \\{1, 2, 3, 4, 5\\}$，集合 $A = \\{1, 3, 5\\}$；若區間集合 $M = \\{x \\mid 1 < x < 4\\}$，$N = \\{x \\mid 2 < x < 5\\}$。則 $\\complement_U A$ 與 $M \\cap N$ 分別為",
    "stem": "設全集 $U = \\{1, 2, 3, 4, 5\\}$，集合 $A = \\{1, 3, 5\\}$；若區間集合 $M = \\{x \\mid 1 < x < 4\\}$，$N = \\{x \\mid 2 < x < 5\\}$。則 $\\complement_U A$ 與 $M \\cap N$ 分別為",
    "options": [
      {
        "key": "A",
        "text": "$\\complement_U A = \\{2, 4\\},\\, M \\cap N = \\{x \\mid 1 < x < 5\\}$"
      },
      {
        "key": "B",
        "text": "$\\complement_U A = \\{2, 4\\},\\, M \\cap N = \\{x \\mid 2 < x < 4\\}$"
      },
      {
        "key": "C",
        "text": "$\\complement_U A = \\{1, 5\\},\\, M \\cap N = \\{x \\mid 2 < x < 4\\}$"
      },
      {
        "key": "D",
        "text": "$\\complement_U A = \\emptyset,\\, M \\cap N = \\{3\\}$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】全集 $U = \\{1, 2, 3, 4, 5\\}$ 剔除 $A = \\{1, 3, 5\\}$ 中的元素，得補集 $\\complement_U A = \\{2, 4\\}$；在實數軸上求區間 $(1, 4)$ 與 $(2, 5)$ 的重疊部分，左界為 $\\max(1, 2)=2$，右界為 $\\min(4, 5)=4$，故 $M \\cap N = \\{x \\mid 2 < x < 4\\}$。正確選項為 B。"
  },
  {
    "id": "G10_Q08_EXISTENTIAL_NEGATION",
    "chapter": "ch02_logic",
    "section": "2.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "特稱命題",
      "存在量詞否定"
    ],
    "prompt": "存在量詞命題“$\\exists x \\in \\mathbf{R},\\, x + 2 \\le 0$”的否定是",
    "stem": "存在量詞命題“$\\exists x \\in \\mathbf{R},\\, x + 2 \\le 0$”的否定是",
    "options": [
      {
        "key": "A",
        "text": "$\\forall x \\in \\mathbf{R},\\, x + 2 > 0$"
      },
      {
        "key": "B",
        "text": "$\\exists x \\in \\mathbf{R},\\, x + 2 > 0$"
      },
      {
        "key": "C",
        "text": "$\\forall x \\notin \\mathbf{R},\\, x + 2 > 0$"
      },
      {
        "key": "D",
        "text": "$\\forall x \\in \\mathbf{R},\\, x + 2 \\ge 0$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】特稱命題（存在量詞命題）的否定遵循規則：存在量詞“$\\exists$”改為全稱量詞“$\\forall$”，變量範圍 $\\mathbf{R}$ 保持不變，結論的不等號由“$\\le$”取反向為“$>$”。故命題否定為“$\\forall x \\in \\mathbf{R},\\, x + 2 > 0$”。正確選項為 A。"
  },
  {
    "id": "G10_Q09_AM_GM_BASIC",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "基本不等式",
      "最小值求解"
    ],
    "prompt": "已知實數 $x > 0$，則代數式 $x + \\frac{1}{x}$ 的最小值以及取得最小值時 $x$ 的值分別為",
    "stem": "已知實數 $x > 0$，則代數式 $x + \\frac{1}{x}$ 的最小值以及取得最小值時 $x$ 的值分別為",
    "options": [
      {
        "key": "A",
        "text": "最小值為 $1$，此時 $x = 1$"
      },
      {
        "key": "B",
        "text": "最小值為 $2$，此時 $x = 2$"
      },
      {
        "key": "C",
        "text": "最小值為 $2$，此時 $x = 1$"
      },
      {
        "key": "D",
        "text": "最小值為 $4$，此時 $x = 2$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】因為 $x > 0$，所以 $\\frac{1}{x} > 0$。由基本不等式 $a + b \\ge 2\\sqrt{ab}$ 得：$x + \\frac{1}{x} \\ge 2\\sqrt{x \\cdot \\frac{1}{x}} = 2\\sqrt{1} = 2$。當且僅當 $x = \\frac{1}{x}$ 即 $x^2 = 1$，由 $x > 0$ 解得 $x = 1$ 時等號成立。因此最小值為 $2$，取得最小值時 $x = 1$。正確選項為 C。"
  },
  {
    "id": "G10_Q10_ADVANCED_SET_UNION",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "集合綜合運算",
      "交集與並集"
    ],
    "prompt": "若集合 $P = \\{0, 1, 2\\}$，集合 $Q = \\{0, 2, 3\\}$，集合 $R = \\{1, 2, 3, 4\\}$，則集合 $P \\cap (Q \\cup R)$ 等於",
    "stem": "若集合 $P = \\{0, 1, 2\\}$，集合 $Q = \\{0, 2, 3\\}$，集合 $R = \\{1, 2, 3, 4\\}$，則集合 $P \\cap (Q \\cup R)$ 等於",
    "options": [
      {
        "key": "A",
        "text": "$\\{0, 1, 2\\}$"
      },
      {
        "key": "B",
        "text": "$\\{2, 3\\}$"
      },
      {
        "key": "C",
        "text": "$\\{0, 2\\}$"
      },
      {
        "key": "D",
        "text": "$\\{1, 2\\}$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】首先求括號內的並集運算：$Q \\cup R = \\{0, 2, 3\\} \\cup \\{1, 2, 3, 4\\} = \\{0, 1, 2, 3, 4\\}$。接著求與集合 $P$ 的交集：$P = \\{0, 1, 2\\}$，比對兩集合的公共元素為 $0, 1, 2$。故 $P \\cap (Q \\cup R) = \\{0, 1, 2\\}$（注意此時 $P \\subseteq (Q \\cup R)$，故交集即為 $P$ 本身）。正確選項為 A。"
  },
  {
    "id": "G10_Q11_ADVANCED_PARAM_INEQ",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "二次不等式",
      "集合交集",
      "逆求參數"
    ],
    "prompt": "設集合 $A = \\{x \\mid x^2 - 3x - 4 \\le 0\\}$，集合 $B = \\{x \\mid 3x + a \\ge 0\\}$。若 $A \\cap B = \\{x \\mid 2 \\le x \\le 4\\}$，則實數 $a$ 的值為",
    "stem": "設集合 $A = \\{x \\mid x^2 - 3x - 4 \\le 0\\}$，集合 $B = \\{x \\mid 3x + a \\ge 0\\}$。若 $A \\cap B = \\{x \\mid 2 \\le x \\le 4\\}$，則實數 $a$ 的值為",
    "options": [
      {
        "key": "A",
        "text": "$6$"
      },
      {
        "key": "B",
        "text": "$-2$"
      },
      {
        "key": "C",
        "text": "$-3$"
      },
      {
        "key": "D",
        "text": "$-6$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】解二次不等式 $x^2 - 3x - 4 \\le 0$，因式分解得 $(x-4)(x+1) \\le 0$，解得 $-1 \\le x \\le 4$，即 $A = [-1, 4]$；解一次不等式 $3x + a \\ge 0$ 得 $x \\ge -\\frac{a}{3}$，即 $B = [-\\frac{a}{3}, +\\infty)$。已知交集 $A \\cap B = [2, 4]$，故其左端點必由集合 $B$ 提供，即 $-\\frac{a}{3} = 2$，解得 $a = -6$。正確選項為 D。"
  },
  {
    "id": "G10_MC01_SET_SUBSETS",
    "chapter": "ch01_sets",
    "section": "1.2",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "集合概念",
      "子集真子集",
      "空集性質"
    ],
    "prompt": "下列關於集合與元素關係的命題中，正確的選項有",
    "stem": "下列關於集合與元素關係的命題中，正確的選項有",
    "options": [
      {
        "key": "A",
        "text": "空集 $\\emptyset$ 是任何集合的子集"
      },
      {
        "key": "B",
        "text": "集合 $\\{1, 2\\}$ 的真子集共有 $4$ 個"
      },
      {
        "key": "C",
        "text": "$0 \\in \\{x \\in \\mathbf{N} \\mid x < 3\\}$"
      },
      {
        "key": "D",
        "text": "若 $A \\subseteq B$ 且 $B \\subseteq C$，則 $A \\subseteq C$"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "C",
      "D"
    ],
    "explanation": "【解析】A：由子集公理知空集 $\\emptyset$ 是任意集合的子集，正確；B：含 2 個元素的集合子集數為 $2^2=4$，真子集個數為 $2^2-1=3$ 個，故 B 錯誤；C：自然數集 $\\mathbf{N}$ 包含 $0$，$0 < 3$ 成立，故 $0$ 屬於該集合，正確；D：子集包含關係具備傳遞性，正確。綜上，正確答案為 A、C、D。"
  },
  {
    "id": "G10_MC02_INEQUALITY_PROPERTIES",
    "chapter": "ch03_inequalities",
    "section": "3.1",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "不等式性質",
      "多項判定"
    ],
    "prompt": "已知實數 $a, b, c$ 滿足 $a > b > 0$ 且 $c < 0$，則下列不等式中恆成立的是",
    "stem": "已知實數 $a, b, c$ 滿足 $a > b > 0$ 且 $c < 0$，則下列不等式中恆成立的是",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{1}{a} > \\frac{1}{b}$"
      },
      {
        "key": "B",
        "text": "$ac < bc$"
      },
      {
        "key": "C",
        "text": "$a - c > b - c$"
      },
      {
        "key": "D",
        "text": "$a^2 < b^2$"
      }
    ],
    "steps": null,
    "answer": [
      "B",
      "C"
    ],
    "explanation": "【解析】A：因 $a > b > 0$，同號兩正數取倒數不等號改變方向，應為 $\\frac{1}{a} < \\frac{1}{b}$，A 錯誤；B：不等式兩邊同乘以負數 $c < 0$，不等號方向改變，由 $a > b$ 可得 $ac < bc$，B 正確；C：兩邊同減去實數 $c$，不等號方向保持不變，故 $a - c > b - c$ 恆成立，C 正確；D：兩邊為正數且 $a > b > 0$，同平方得 $a^2 > b^2$，D 錯誤。正確選項為 B、C。"
  },
  {
    "id": "G10_MC03_CONDITION_ANALYSIS",
    "chapter": "ch02_logic",
    "section": "2.1",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "充分條件",
      "必要條件",
      "等價命題"
    ],
    "prompt": "下列各組條件中，$p$ 是 $q$ 的充分條件的選項有",
    "stem": "下列各組條件中，$p$ 是 $q$ 的充分條件的選項有",
    "options": [
      {
        "key": "A",
        "text": "$p: x = 1,\\quad q: x^2 = 1$"
      },
      {
        "key": "B",
        "text": "$p: x > 2,\\quad q: x > 0$"
      },
      {
        "key": "C",
        "text": "$p: x^2 = 4,\\quad q: x = 2$"
      },
      {
        "key": "D",
        "text": "$p: x = y = 0,\\quad q: x^2 + y^2 = 0$"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "【解析】若 $p \\implies q$ 成立，則 $p$ 是 $q$ 的充分條件。A：$x = 1 \\implies x^2 = 1$，充分性成立；B：$x > 2 \\implies x > 0$，充分性成立；C：$x^2 = 4 \\implies x = \\pm 2$，不能推得 $x = 2$，充分性不成立；D：$x = y = 0 \\implies x^2 + y^2 = 0$，充分性成立。故正確選項為 A、B、D。"
  },
  {
    "id": "G10_MC04_AM_GM_CONDITIONS",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "基本不等式",
      "一正二定三相等"
    ],
    "prompt": "在使用基本不等式 $a + b \\ge 2\\sqrt{ab}$ 求極值時，下列說法中正確的選項有",
    "stem": "在使用基本不等式 $a + b \\ge 2\\sqrt{ab}$ 求極值時，下列說法中正確的選項有",
    "options": [
      {
        "key": "A",
        "text": "各項必須保證為正數（“一正”）"
      },
      {
        "key": "B",
        "text": "求和的最小值時，要求兩項的和必須為定值"
      },
      {
        "key": "C",
        "text": "等號成立的充要條件是參與運算的兩項相等（“三相等”）"
      },
      {
        "key": "D",
        "text": "只要兩項相等，就一定能取到最小值，無需驗證變量取值是否在定義域內"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "C"
    ],
    "explanation": "【解析】A：基本不等式的前提條件是各項均為正實數，正確；B：由 $a+b \\ge 2\\sqrt{ab}$ 知，求和的最小值時要求兩項的乘積 $ab$ 為定值（“二定”），而非和為定值，B 錯誤；C：等號成立當且僅當 $a = b$，正確；D：等號成立對應的自變量值必須落在給定的定義域內，否則極值無法取得，D 錯誤。正確選項為 A、C。"
  },
  {
    "id": "G10_MC05_SET_INTERVAL_OPERATIONS",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "集合運算",
      "區間表示",
      "包含關係"
    ],
    "prompt": "設集合 $A = \\{x \\mid -1 \\le x < 3\\}$，集合 $B = \\{x \\mid x > 1\\}$，全集為實數集 $\\mathbf{R}$。下列運算結論中正確的選項有",
    "stem": "設集合 $A = \\{x \\mid -1 \\le x < 3\\}$，集合 $B = \\{x \\mid x > 1\\}$，全集為實數集 $\\mathbf{R}$。下列運算結論中正確的選項有",
    "options": [
      {
        "key": "A",
        "text": "$A \\cap B = \\{x \\mid 1 < x < 3\\}$"
      },
      {
        "key": "B",
        "text": "$A \\cup B = \\{x \\mid x \\ge -1\\}$"
      },
      {
        "key": "C",
        "text": "$\\complement_\\mathbf{R} B = \\{x \\mid x \\le 1\\}$"
      },
      {
        "key": "D",
        "text": "$A \\subseteq B$"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "【解析】A：求公共覆蓋重疊部分，左界為 $x>1$，右界為 $x<3$，故 $A \\cap B = \\{x \\mid 1 < x < 3\\}$，A 正確；B：取兩集合聯集，覆蓋從 $-1$ 向右的所有實數，故 $A \\cup B = \\{x \\mid x \\ge -1\\}$，B 正確；C：全集為 $\\mathbf{R}$，集合 $B$ 的補集為其餘實數，注意開端點取補變閉端點，即 $x \\le 1$，C 正確；D：元素 $0 \\in A$ 但 $0 \\notin B$，故 $A \\subseteq B$ 不成立，D 錯誤。正確選項為 A、B、C。"
  },
  {
    "id": "G10_Q12_STEP_ORDER",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "step_order",
    "difficulty": "Level_B",
    "tags": [
      "集合交集",
      "連續區間",
      "思維步驟排序"
    ],
    "prompt": "設全集 $U = \\mathbf{R}$，集合 $M = \\{t \\mid 2 \\le t < 6\\}$，集合 $N = \\{t \\mid t > 3\\}$。求集合 $M \\cap N$（結果用描述法表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "設全集 $U = \\mathbf{R}$，集合 $M = \\{t \\mid 2 \\le t < 6\\}$，集合 $N = \\{t \\mid t > 3\\}$。求集合 $M \\cap N$（結果用描述法表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "分析集合 $M = \\{t \\mid 2 \\le t < 6\\}$ 在數軸上的表示為半開半閉區間 $[2, 6)$，左端點 $t = 2$ 包含（實心點），右端點 $t = 6$ 不包含（空心點）。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "分析集合 $N = \\{t \\mid t > 3\\}$ 在數軸上的表示為以 $3$ 為起點向右無限延伸的開區間 $(3, +\\infty)$，起點 $t = 3$ 為空心點。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "依據交集定義 $M \\cap N = \\{t \\mid t \\in M \\text{ 且 } t \\in N\\}$，目標元素 $t$ 必須同時滿足不等式組 $\\begin{cases} 2 \\le t < 6 \\\\ t > 3 \\end{cases}$。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "在數軸上求兩區間的公共重疊部分，左界由 $t > 3$ 制約（取 $\\max(2, 3) = 3$，且不含端點 $3$），右界由 $t < 6$ 制約（取 $\\min(6, +\\infty) = 6$，且不含端點 $6$）。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "將重疊覆蓋的實數範圍寫成集合描述法形式，得出最終運算結論：$M \\cap N = \\{t \\mid 3 < t < 6\\}$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "將兩集合的所有元素合併，取兩區間聯集得到 $\\{t \\mid t \\ge 2\\}$。",
        "isDistractor": true,
        "distractorReason": "混淆交集與並集概念，求成了並集而非交集。"
      },
      {
        "id": "S7",
        "text": "將交集端點均視為包含端點，得出閉區間 $\\{t \\mid 3 \\le t \\le 6\\}$。",
        "isDistractor": true,
        "distractorReason": "端點開閉誤判，將開區間端點錯誤取等為閉區間。"
      },
      {
        "id": "S8",
        "text": "將實數連續軸誤判為整數集，列舉出交集為有限集合 $\\{4, 5\\}$。",
        "isDistractor": true,
        "distractorReason": "忽視全集為實數集R，將連續區間誤判為離散整數集。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 幾何區間定性（S1, S2）：將兩個抽象集合轉化為數軸幾何形態，精準識別開閉端點特性。\n2. 代數條件聯立（S3）：由交集定義建立不等式組約束。\n3. 數軸重疊求交（S4）：計算重疊邊界，裁定公共覆蓋範圍 $(3, 6)$。\n4. 規範語言輸出（S5）：以數學描述法嚴格輸出結論 $\\{t \\mid 3 < t < 6\\}$。\n典型干擾剖析：S6混淆了並集與交集；S7忽視了開端點不可取等；S8錯誤將實數域離散化。"
  },
  {
    "id": "G10_Q13_STEP_ORDER",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "step_order",
    "difficulty": "Level_B",
    "tags": [
      "集合補集",
      "集合交集",
      "離散集合",
      "思維步驟排序"
    ],
    "prompt": "設全集 $S = \\{y \\in \\mathbf{N} \\mid y \\le 9\\}$，集合 $P = \\{1, 2, 3, 4, 5\\}$，集合 $Q = \\{4, 5, 6, 7, 8\\}$。求集合 $(\\complement_S P) \\cap Q$（結果用列舉法表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "設全集 $S = \\{y \\in \\mathbf{N} \\mid y \\le 9\\}$，集合 $P = \\{1, 2, 3, 4, 5\\}$，集合 $Q = \\{4, 5, 6, 7, 8\\}$。求集合 $(\\complement_S P) \\cap Q$（結果用列舉法表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "明確自然數集 $\\mathbf{N}$ 包含元素 $0$，將全集 $S = \\{y \\in \\mathbf{N} \\mid y \\le 9\\}$ 用列舉法完整寫出：$S = \\{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\\}$。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "依據補集定義 $\\complement_S P = \\{y \\in S \\mid y \\notin P\\}$，從全集 $S$ 中逐一剔除集合 $P = \\{1, 2, 3, 4, 5\\}$ 中所含的元素。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "求得集合 $P$ 在全集 $S$ 中的補集為 $\\complement_S P = \\{0, 6, 7, 8, 9\\}$（特別注意包含關鍵元素 $0$）。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "對比補集 $\\complement_S P = \\{0, 6, 7, 8, 9\\}$ 與給定集合 $Q = \\{4, 5, 6, 7, 8\\}$，提取兩者的公共元素。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "取兩集合共同包含的元素 $6, 7, 8$，用列舉法得出最終運算結果：$(\\complement_S P) \\cap Q = \\{6, 7, 8\\}$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "誤認為自然數集不包含 $0$，得到全集 $S=\\{1, 2, \\dots, 9\\}$，進而遺漏關鍵元素 $0$。",
        "isDistractor": true,
        "distractorReason": "混淆自然數集概念，錯誤認為0不是自然數。"
      },
      {
        "id": "S7",
        "text": "顛倒運算順序，先求 $P \\cap Q = \\{4, 5\\}$，再計算 $\\complement_S (P \\cap Q) = \\{0, 1, 2, 3, 6, 7, 8, 9\\}$。",
        "isDistractor": true,
        "distractorReason": "混淆運算優先級，將補集後求交顛倒為交集後求補。"
      },
      {
        "id": "S8",
        "text": "未經過全集補集轉化，直接計算集合差並誤記為連續實數區間 $(6, 8)$。",
        "isDistractor": true,
        "distractorReason": "混淆離散集合與連續實數區間表示法。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 基石定義（S1）：落實自然數集 $\\mathbf{N}$ 包含 $0$ 的核心考點，準確完整列舉全集 $S$。\n2. 補集運算規則（S2）：應用補集定義執行元素剔除篩選。\n3. 補集精確鎖定（S3）：確定中間結果 $\\complement_S P$ 包含 $0$ 及大於 $5$ 的元素。\n4. 公共元素提取（S4）：比對補集與目標集合 $Q$ 的公共部分。\n5. 結果輸出（S5）：以列舉法規范給出最終答案 $\\{6, 7, 8\\}$。\n典型干擾剖析：S6遺漏了0；S7顛倒了括號運算先後次序；S8混用了區間與集合符號。"
  },
  {
    "id": "G10_Q14_STEP_ORDER",
    "chapter": "ch01_sets",
    "section": "1.2",
    "type": "step_order",
    "difficulty": "Level_C",
    "tags": [
      "子集包含",
      "參數取值範圍",
      "臨界值檢驗",
      "思維步驟排序"
    ],
    "prompt": "已知集合 $E = \\{y \\mid 2 \\le y < 6\\}$，集合 $F = \\{y \\mid y < k\\}$。若 $E \\subseteq F$，求實數 $k$ 的取值範圍（結果用不等式表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "已知集合 $E = \\{y \\mid 2 \\le y < 6\\}$，集合 $F = \\{y \\mid y < k\\}$。若 $E \\subseteq F$，求實數 $k$ 的取值範圍（結果用不等式表示）。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "根據子集包含關係 $E \\subseteq F$ 的定義，集合 $E$ 中的每一個元素 $y$ 都必須屬於集合 $F$，即對任意 $y \\in [2, 6)$，均需滿足 $y < k$。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "在數軸上分析兩幾何圖形：$E$ 為左閉右開區間 $[2, 6)$，右界開端點為 $6$；$F$ 為射線 $(-\\infty, k)$，右界開端點為 $k$。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "要使開射線 $(-\\infty, k)$ 完全覆蓋區間 $[2, 6)$，射線的右端點 $k$ 必須位於區間 $E$ 右端點 $6$ 的右側或與之重合。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "檢驗臨界值 $k = 6$：當 $k = 6$ 時，$F = \\{y \\mid y < 6\\}$；因 $E = [2, 6)$ 中所有元素均嚴格小於 $6$（即對任意 $y \\in E$ 均有 $y < 6$），故 $E \\subseteq F$ 依然成立，故 $k = 6$ 包含在取值範圍內。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "綜合大於與等於的條件，確定實數 $k$ 的取值範圍用不等式表示為 $k \\ge 6$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "認為因為 $F$ 是開區間 $y < k$，所以 $k$ 必須嚴格大於 $6$，得出錯誤結論 $k > 6$。",
        "isDistractor": true,
        "distractorReason": "臨界端點取等分析錯誤，未驗證k=6時包含關係依然成立。"
      },
      {
        "id": "S7",
        "text": "誤考慮左端點條件，列出 $k > 2$ 或 $2 \\le k < 6$。",
        "isDistractor": true,
        "distractorReason": "誤以左界作為覆蓋制約條件，忽略了必須覆蓋整個右區間。"
      },
      {
        "id": "S8",
        "text": "將包含條件顛倒為 $F \\subseteq E$，得出 $k \\le 6$。",
        "isDistractor": true,
        "distractorReason": "子集主從包含關係方向顛倒。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 形式化轉化（S1）：將集合包含符號 $E \\subseteq F$ 翻譯為全稱代數約束（任意元素均小於 $k$）。\n2. 幾何形態分析（S2）：在實數軸上確定目標區間與動態射線的幾何特徵。\n3. 不等式建立（S3）：建立宏觀覆蓋條件，鎖定右端點相對位置。\n4. 臨界點微觀檢驗（S4）：極其關鍵的端點論證——當 $k=6$ 時，由於 $E$ 本身右端點開，所以 $E$ 中任意元素均滿足 $y<6$，包含關係仍然成立。\n5. 結論輸出（S5）：閉合取等範圍 $k \\ge 6$。\n典型干擾剖析：S6盲目認為開區間不能取等；S7忽視了右端點才是實質制約邊界；S8顛倒了包含主客體。"
  },
  {
    "id": "G10_Q15_STEP_ORDER",
    "chapter": "ch03_inequalities",
    "section": "3.1",
    "type": "step_order",
    "difficulty": "Level_B",
    "tags": [
      "作差法",
      "代數式大小比較",
      "整式展開",
      "思維步驟排序"
    ],
    "prompt": "設 $t \\in \\mathbf{R}$，試用作差法比較代數式 $A = (t+3)(t+4)$ 與 $B = (t+2)(t+5)$ 的大小，並寫出詳細證明過程。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "設 $t \\in \\mathbf{R}$，試用作差法比較代數式 $A = (t+3)(t+4)$ 與 $B = (t+2)(t+5)$ 的大小，並寫出詳細證明過程。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "運用比較實數大小的作差法，構造目標差值式：$A - B = [(t+3)(t+4)] - [(t+2)(t+5)]$。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "分別展開兩個多項式：$(t+3)(t+4) = t^2 + 7t + 12$，且 $(t+2)(t+5) = t^2 + 7t + 10$。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "將展開式代入差值式並去括號：$A - B = (t^2 + 7t + 12) - (t^2 + 7t + 10) = t^2 - t^2 + 7t - 7t + 12 - 10$。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "合併同類項抵消二次項與一次項，計算得出常數差值：$A - B = 2$。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "因為常數 $2 > 0$ 恆成立，根據實數大小比較基本事實（$A - B > 0 \\iff A > B$），得出對任意 $t \\in \\mathbf{R}$ 均有 $(t+3)(t+4) > (t+2)(t+5)$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "在去括號時漏乘負號，算成 $t^2+7t+12 - t^2+7t+10 = 14t+22$，誤得出與 $t$ 的正負有關。",
        "isDistractor": true,
        "distractorReason": "去括號時符號處理錯誤，漏乘負號。"
      },
      {
        "id": "S7",
        "text": "僅代入特殊值 $t=0$，得出 $12 > 10$ 故宣稱 $A > B$ 成立。",
        "isDistractor": true,
        "distractorReason": "以特殊值驗證代替嚴格代數恆等式證明。"
      },
      {
        "id": "S8",
        "text": "將展開的常數項 $3 \\times 4$ 算成 $7$ 或 $2 \\times 5$ 算成 $7$，得出差值為 $0$ 宣稱兩者相等。",
        "isDistractor": true,
        "distractorReason": "多項式乘法展開常數項運算錯誤。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 方法選型（S1）：作差法是比較代數式大小最根本的通用方法，先構造差式。\n2. 代數展開（S2）：精確計算兩次二項式乘積。\n3. 消元簡化（S3）：去括號變號，消去含變量 $t$ 的高次項與一次項。\n4. 定量計算（S4）：求得淨差值為定值正數 $2$。\n5. 公理閉環（S5）：由差值大於 0 判定原式大小順序，完成嚴謹代數證明。\n典型干擾剖析：S6為高頻去括號符號失誤；S7為邏輯上不充分的特殊值法；S8為基礎運算失誤。"
  },
  {
    "id": "G10_Q16_STEP_ORDER",
    "chapter": "ch02_logic",
    "section": "2.1",
    "type": "step_order",
    "difficulty": "Level_C",
    "tags": [
      "充要條件",
      "雙向證明",
      "因式分解",
      "思維步驟排序"
    ],
    "prompt": "已知正數 $x > 0, y > 0$。求證：$p: x > y$ 是 $q: x^2 + 1 > y^2 + 1$ 的充要條件。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "已知正數 $x > 0, y > 0$。求證：$p: x > y$ 是 $q: x^2 + 1 > y^2 + 1$ 的充要條件。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "確立充要條件證明結構：需分別證明充分性（若 $x > y$ 則 $x^2 + 1 > y^2 + 1$）與必要性（若 $x^2 + 1 > y^2 + 1$ 則 $x > y$）。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "將目標不等式兩邊同減 $1$ 並作差因式分解：$x^2 + 1 > y^2 + 1 \\iff x^2 - y^2 > 0 \\iff (x-y)(x+y) > 0$。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "證明充分性：若 $x > y$，則 $x - y > 0$；又因 $x > 0, y > 0$，必有 $x + y > 0$；兩正數之積 $(x-y)(x+y) > 0 \\implies x^2 + 1 > y^2 + 1$ 成立。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "證明必要性：若 $x^2 + 1 > y^2 + 1$，則 $(x-y)(x+y) > 0$；因 $x > 0, y > 0 \\implies x+y > 0$，兩邊同除以正數 $x+y$ 得 $x - y > 0 \\implies x > y$ 成立。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "綜合充分性與必要性均獲證，得出當 $x > 0, y > 0$ 時，$x > y$ 是 $x^2 + 1 > y^2 + 1$ 的充要條件。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "只證明了 $x > y \\implies x^2 + 1 > y^2 + 1$，便直接宣稱兩者互為充要條件。",
        "isDistractor": true,
        "distractorReason": "缺失必要性證明，單向充分推導不能等同充要條件。"
      },
      {
        "id": "S7",
        "text": "在除以 $x+y$ 時未說明 $x+y > 0$ 的符號判定，若 $x, y$ 未限定正數則無法保證不等號不變向。",
        "isDistractor": true,
        "distractorReason": "忽略除法運算保序必須依賴正數條件的前提說明。"
      },
      {
        "id": "S8",
        "text": "由 $x^2 > y^2$ 直接得出 $x > y$ 而未考慮一般情況下開方應為 $|x| > |y|$。",
        "isDistractor": true,
        "distractorReason": "未經符號判定直接開方，忽視絕對值符號約束。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 宏觀架構（S1）：充要條件證明必須涵蓋「充分性」與「必要性」雙向論證，結構先行。\n2. 等價代數化簡（S2）：同減常數後利用平方差公式 $(x-y)(x+y)$ 將問題拆解為正負符號判定。\n3. 正向充分推導（S3）：由 $x>y$ 與正數條件推導乘積大於 0。\n4. 逆向必要推導（S4）：由乘積大於 0，利用 $x+y>0$ 進行除法保序，反推出 $x>y$。\n5. 結論閉環（S5）：雙向邏輯均獲證，充要關係成立。\n典型干擾剖析：S6缺少逆向推導；S7忽視了不等式除法保序的前提；S8開方忽視了正負性。"
  },
  {
    "id": "G10_Q17_STEP_ORDER",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "step_order",
    "difficulty": "Level_B",
    "tags": [
      "基本不等式",
      "實際情境",
      "最值求解",
      "思維步驟排序"
    ],
    "prompt": "在綠色算力中心的能耗優化中，伺服器完成單元任務的總能耗指標函數為 $g(t) = t + \\frac{4}{t}$，其中運算調度參數 $t > 0$。利用基本不等式求總能耗指標數函數 $g(t)$ 的最小能耗指標的值，並求出取得最小值時 $t$ 的具體取值。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "在綠色算力中心的能耗優化中，伺服器完成單元任務的總能耗指標函數為 $g(t) = t + \\frac{4}{t}$，其中運算調度參數 $t > 0$。利用基本不等式求總能耗指標數函數 $g(t)$ 的最小能耗指標的值，並求出取得最小值時 $t$ 的具體取值。請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "檢驗基本不等式應用前提：因調度參數 $t > 0$，故 $\\frac{4}{t} > 0$（正數條件）；且兩項乘積 $t \\cdot \\frac{4}{t} = 4$ 為常數（定值條件）。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "套用基本不等式公式 $a + b \\ge 2\\sqrt{ab}$，得 $g(t) = t + \\frac{4}{t} \\ge 2\\sqrt{t \\cdot \\frac{4}{t}}$。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "計算開方乘積項：$2\\sqrt{4} = 2 \\times 2 = 4$，得出能耗指標函數的理論下界值為 $4$。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "檢驗取等條件：當且僅當兩項相等即 $t = \\frac{4}{t}$ 時，等號成立；去分母得 $t^2 = 4$。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "解方程 $t^2 = 4$，結合已知物理條件 $t > 0$，取正根 $t = 2$；結論：當 $t = 2$ 時，總能耗指標取得最小值 $4$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "套用不等式時漏寫係數 $2$，算成 $g(t) \\ge \\sqrt{t \\cdot \\frac{4}{t}} = 2$。",
        "isDistractor": true,
        "distractorReason": "基本不等式公式記憶錯誤，漏乘係數2。"
      },
      {
        "id": "S7",
        "text": "解 $t^2 = 4$ 時得出 $t = \\pm 2$，未排除負根 $t = -2$。",
        "isDistractor": true,
        "distractorReason": "忽略物理情境定義域t>0，錯誤保留負根。"
      },
      {
        "id": "S8",
        "text": "求出值域 $\\ge 4$ 後，未解出等號成立時 $t$ 的具體值即結束解答。",
        "isDistractor": true,
        "distractorReason": "缺少等號成立條件的驗證與自變量取值求解。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 前提檢驗（S1）：應用基本不等式前必須確認「一正、二定」條件具備。\n2. 公式建立（S2）：準確代入 $a + b \\ge 2\\sqrt{ab}$ 不等式。\n3. 定量求值（S3）：計算求得理論極值下界 $4$。\n4. 方程建立（S4）：列出等號成立條件方程 $t = \\frac{4}{t}$。\n5. 域內定案（S5）：結合 $t>0$ 排除負根，確立最優參數 $t=2$ 與最小能耗 $4$。\n典型干擾剖析：S6漏乘了公式關鍵係數 2；S7忽略實際背景中參數大於 0 的物理約束；S8回答不完整，未給出自變量具體取值。"
  },
  {
    "id": "G10_Q18_STEP_ORDER",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "step_order",
    "difficulty": "Level_B",
    "tags": [
      "幾何建模",
      "周長最值",
      "基本不等式應用",
      "思維步驟排序"
    ],
    "prompt": "科技展覽館計劃在平整展廳內用安全隔離帶圍出一個面積為 $144\\text{ m}^2$ 的矩形臨時互動展區。設該矩形展區的長為 $a\\text{ m}$，寬為 $b\\text{ m}$（$a > 0, b > 0$）。當這個矩形展區的長與寬各為多少米時，所用隔離帶的總長度最短？最短長度是多少米？請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "stem": "科技展覽館計劃在平整展廳內用安全隔離帶圍出一個面積為 $144\\text{ m}^2$ 的矩形臨時互動展區。設該矩形展區的長為 $a\\text{ m}$，寬為 $b\\text{ m}$（$a > 0, b > 0$）。當這個矩形展區的長與寬各為多少米時，所用隔離帶的總長度最短？最短長度是多少米？請從下列 8 個步驟中，選出 5 個關鍵正確步驟，並按嚴密的解題邏輯順序排序（$S_1 \\to S_2 \\to S_3 \\to S_4 \\to S_5$）。",
    "options": null,
    "steps": [
      {
        "id": "S1",
        "text": "由題意建立幾何模型：矩形面積 $ab = 144$（$a > 0, b > 0$），隔離帶總長度為周長函數 $L = 2(a + b)$。",
        "isDistractor": false
      },
      {
        "id": "S2",
        "text": "因長寬均為正數 $a > 0, b > 0$，應用基本不等式求半周長下界：$a + b \\ge 2\\sqrt{ab}$。",
        "isDistractor": false
      },
      {
        "id": "S3",
        "text": "將已知乘積定值 $ab = 144$ 代入：$a + b \\ge 2\\sqrt{144} = 24$，得總長度 $L = 2(a + b) \\ge 2 \\times 24 = 48\\text{ m}$。",
        "isDistractor": false
      },
      {
        "id": "S4",
        "text": "檢驗等號成立條件：當且僅當 $a = b$ 時周長最短；代入面積方程 $a^2 = 144$，由 $a > 0$ 解得 $a = b = 12\\text{ m}$。",
        "isDistractor": false
      },
      {
        "id": "S5",
        "text": "作答：當矩形展區的長與寬均為 $12\\text{ m}$（即展區為正方形）時，隔離帶總長度最短，最短長度為 $48\\text{ m}$。",
        "isDistractor": false
      },
      {
        "id": "S6",
        "text": "將總長度誤當成半周長 $a+b$，得出最短長度為 $24\\text{ m}$。",
        "isDistractor": true,
        "distractorReason": "混淆周長2(a+b)與半周長a+b，遺漏係數2。"
      },
      {
        "id": "S7",
        "text": "選取一組整數解 $a=16, b=9$，計算周長 $2(16+9)=50\\text{ m}$ 並誤認為是最短長度。",
        "isDistractor": true,
        "distractorReason": "以特殊非對稱數值代替均值極值，未理解取等條件。"
      },
      {
        "id": "S8",
        "text": "將面積公式誤記為 $\\frac{1}{2}ab = 144$，導致邊長計算錯誤。",
        "isDistractor": true,
        "distractorReason": "混淆三角形與矩形面積公式。"
      }
    ],
    "answer": [
      "S1",
      "S2",
      "S3",
      "S4",
      "S5"
    ],
    "explanation": "【解題思維邏輯鏈】\n1. 幾何建模（S1）：由實際場景建立代數目標函數，明確已知定值 $ab=144$ 與待優化目標 $L=2(a+b)$。\n2. 基本不等式引入（S2）：由「積定和最小」原理，構造不等式 $a+b \\ge 2\\sqrt{ab}$。\n3. 定量求解（S3）：代入常數計算周長絕對下界 $48\\text{ m}$。\n4. 極值條件分析（S4）：當且僅當矩形為正方形（$a=b$）時取得極值，求解邊長方程得 $a=b=12\\text{ m}$。\n5. 實際場景結論（S5）：給出幾何應用意義完整回答。\n典型干擾剖析：S6漏乘了周長乘2的關係；S7以隨意枚舉代替最值數學證明；S8混淆了幾何公式。"
  },
  {
    "id": "G10_Q19_ADVANCED_AM_GM_PROD",
    "chapter": "ch03_inequalities",
    "section": "3.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "基本不等式變式",
      "乘積最值",
      "線性約束"
    ],
    "prompt": "若正實數 $a > 0, b > 0$ 滿足約束條件 $5a + 4b = 3$，則乘積 $ab$ 的最大值為",
    "stem": "若正實數 $a > 0, b > 0$ 滿足約束條件 $5a + 4b = 3$，則乘積 $ab$ 的最大值為",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{9}{80}$"
      },
      {
        "key": "B",
        "text": "$\\frac{80}{9}$"
      },
      {
        "key": "C",
        "text": "$\\frac{3}{20}$"
      },
      {
        "key": "D",
        "text": "$\\frac{9}{40}$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】因為 $a > 0, b > 0$，所以 $5a > 0, 4b > 0$。由基本不等式：$5a + 4b \\ge 2\\sqrt{(5a)(4b)} = 2\\sqrt{20ab}$。已知 $5a + 4b = 3$，代入得：$3 \\ge 2\\sqrt{20ab}$，兩邊同除以 2 得 $\\sqrt{20ab} \\le \\frac{3}{2}$。兩邊平方得 $20ab \\le \\frac{9}{4}$，解得 $ab \\le \\frac{9}{80}$。當且僅當 $5a = 4b = \\frac{3}{2}$，即 $a = \\frac{3}{10}, b = \\frac{3}{8}$ 時取等號。故乘積 $ab$ 的最大值為 $\\frac{9}{80}$。正確選項為 A。"
  },
  {
    "id": "G10_Q20_QUADRATIC_SET_INTERSECT",
    "chapter": "ch01_sets",
    "section": "1.3",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "二次不等式解集",
      "集合交集",
      "離散點集"
    ],
    "prompt": "設集合 $A = \\{x \\mid x^2 + 3x - 4 \\ge 0\\}$，集合 $B = \\{-4, -2, 0, 3\\}$，則集合 $A \\cap B$ 等於",
    "stem": "設集合 $A = \\{x \\mid x^2 + 3x - 4 \\ge 0\\}$，集合 $B = \\{-4, -2, 0, 3\\}$，則集合 $A \\cap B$ 等於",
    "options": [
      {
        "key": "A",
        "text": "$\\{-4, 3\\}$"
      },
      {
        "key": "B",
        "text": "$\\{-2, 0\\}$"
      },
      {
        "key": "C",
        "text": "$\\{-4, -2\\}$"
      },
      {
        "key": "D",
        "text": "$\\{0, 3\\}$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】解二次不等式 $x^2 + 3x - 4 \\ge 0$，因式分解得 $(x+4)(x-1) \\ge 0$，解得 $x \\le -4$ 或 $x \\ge 1$。即集合 $A = (-\\infty, -4] \\cup [1, +\\infty)$。將離散集合 $B = \\{-4, -2, 0, 3\\}$ 中的各元素逐一代入檢驗：當 $x = -4$ 時，$-4 \\le -4$ 成立，$-4 \\in A$；當 $x = -2$ 時，$-4 < -2 < 1$，$-2 \\notin A$；當 $x = 0$ 時，$-4 < 0 < 1$，$0 \\notin A$；當 $x = 3$ 時，$3 \\ge 1$ 成立，$3 \\in A$。故公共元素為 $-4$ 和 $3$，即 $A \\cap B = \\{-4, 3\\}$。正確選項為 A。"
  }
];

  // Attach metadata and helper properties
  questionsList.grade = 10;
  questionsList.bankId = "G10_MATH_BANK_V1";
  questionsList.version = "2026.1";
  questionsList.totalCount = questionsList.length;
  questionsList.questions = questionsList;

  // Export to global window
  if (typeof window !== 'undefined') {
    window.QUESTIONS_G10 = questionsList;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.QUESTIONS_G10 = questionsList;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTIONS_G10: questionsList };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
