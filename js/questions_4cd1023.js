/**
 * questions_4cd1023.js - 4CD 1023 High School Mathematics Question Pool (80 Questions)
 * Tier 1: 40 Questions (50%), 4 Options (A-D), Single Choice (1 correctKey)
 * Tier 2: 16 Questions (20%), 6 Options (A-F), Single Choice (1 correctKey)
 * Tier 3: 24 Questions (30%), 8 Options (A-H), Multi-Select (>= 2 correctKeys)
 */

(function (root) {
  'use strict';

  const QUESTIONS_4CD1023 = [
  {
    "id": "4CD_1023_Q01",
    "q_num": 1,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: 1021@F4CD.pptx",
    "stem": "二次函數 $y = 2x^2 - 3x + 1$ 的圖象開口方向是？",
    "options": [
      {
        "key": "A",
        "text": "向上"
      },
      {
        "key": "B",
        "text": "向下"
      },
      {
        "key": "C",
        "text": "向左"
      },
      {
        "key": "D",
        "text": "向右"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "因為二次項係數 $a = 2 > 0$，所以二次函數圖象開口向上。"
  },
  {
    "id": "4CD_1023_Q02",
    "q_num": 2,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: 1020@4CD.pptx",
    "stem": "二次函數 $y = -x^2 + 4x - 5$ 的圖象開口方向及最值類型為？",
    "options": [
      {
        "key": "A",
        "text": "開口向上，函數有最小值"
      },
      {
        "key": "B",
        "text": "開口向下，函數有最大值"
      },
      {
        "key": "C",
        "text": "開口向下，函數有最小值"
      },
      {
        "key": "D",
        "text": "開口向上，函數有最大值"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "二次項係數 $a = -1 < 0$，圖象開口向下，拋物線在頂點處取得最大值。"
  },
  {
    "id": "4CD_1023_Q03",
    "q_num": 3,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "若二次函數 $y = ax^2 + bx + c$ 的圖象開口向下，則係數 $a$ 必須滿足？",
    "options": [
      {
        "key": "A",
        "text": "$a > 0$"
      },
      {
        "key": "B",
        "text": "$a = 0$"
      },
      {
        "key": "C",
        "text": "$a < 0$"
      },
      {
        "key": "D",
        "text": "$a \\ge 0$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "二次函數拋物線開口方向完全由二次項係數 $a$ 的正負符號決定，$a < 0$ 時開口向下。"
  },
  {
    "id": "4CD_1023_Q04",
    "q_num": 4,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "二次函數 $y = -\\frac{1}{2}x^2 + 3x - 1$ 的圖象開口方向是？",
    "options": [
      {
        "key": "A",
        "text": "向上"
      },
      {
        "key": "B",
        "text": "向左"
      },
      {
        "key": "C",
        "text": "向右"
      },
      {
        "key": "D",
        "text": "向下"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "二次項係數 $a = -\\frac{1}{2} < 0$，圖象開口向下。"
  },
  {
    "id": "4CD_1023_Q05",
    "q_num": 5,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "二次函數 $y = 3(x - 2)^2 + 4$ 的圖象開口方向是？",
    "options": [
      {
        "key": "A",
        "text": "向上"
      },
      {
        "key": "B",
        "text": "向下"
      },
      {
        "key": "C",
        "text": "水平向左"
      },
      {
        "key": "D",
        "text": "水平向右"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "頂點式 $y = a(x - h)^2 + k$ 中，$a = 3 > 0$，圖象開口向上。"
  },
  {
    "id": "4CD_1023_Q06",
    "q_num": 6,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "若二次函數 $f(x) = (m - 1)x^2 + 2x + 1$ 的圖象開口向上，則實數 $m$ 的取值範圍是？",
    "options": [
      {
        "key": "A",
        "text": "$m < 1$"
      },
      {
        "key": "B",
        "text": "$m > 1$"
      },
      {
        "key": "C",
        "text": "$m \\ge 1$"
      },
      {
        "key": "D",
        "text": "$m \\ne 1$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "拋物線開口向上要求二次項係數大於零，即 $m - 1 > 0 \\implies m > 1$。"
  },
  {
    "id": "4CD_1023_Q07",
    "q_num": 7,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "函數 $y = -3(x + 1)^2 - 2$ 的頂點座標所對應的函數值是該函數的？",
    "options": [
      {
        "key": "A",
        "text": "最小值，值為 $-2$"
      },
      {
        "key": "B",
        "text": "最大值，值為 $2$"
      },
      {
        "key": "C",
        "text": "最大值，值為 $-2$"
      },
      {
        "key": "D",
        "text": "最小值，值為 $1$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "因為 $a = -3 < 0$，當 $x = -1$ 時取得最大值 $y_{\\max} = -2$。"
  },
  {
    "id": "4CD_1023_Q08",
    "q_num": 8,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 拋物線開口方向與係數符號",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "下列二次函數中，圖象開口向下且頂點在 $y$ 軸上的是？",
    "options": [
      {
        "key": "A",
        "text": "$y = 2x^2 + 3$"
      },
      {
        "key": "B",
        "text": "$y = -(x - 1)^2$"
      },
      {
        "key": "C",
        "text": "$y = -2x^2 + 4x$"
      },
      {
        "key": "D",
        "text": "$y = -2x^2 + 3$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "$y = -2x^2 + 3$ 中 $a = -2 < 0$ 開口向下，一次項係數 $b = 0$，對稱軸為 $y$ 軸（$x = 0$），頂點在 $y$ 軸上。"
  },
  {
    "id": "4CD_1023_Q09",
    "q_num": 9,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: F4CD一元二次不等式.pptx",
    "stem": "一元二次不等式 $(x - 1)(x - 4) < 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$(1, 4)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, 1) \\cup (4, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-1, 4]$"
      },
      {
        "key": "D",
        "text": "$(4, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "對應方程的兩根為 $x_1 = 1, x_2 = 4$。根據「小於取中間」口訣，解集為 $(1, 4)$。"
  },
  {
    "id": "4CD_1023_Q10",
    "q_num": 10,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: F4CD一元二次不等式.pptx",
    "stem": "一元二次不等式 $(x - 2)(x - 5) > 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$(2, 5)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, 2) \\cup (5, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[2, 5]$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 2]$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "對應方程兩根為 $2$ 和 $5$。根據「大於取兩邊」口訣，解集為 $(-\\infty, 2) \\cup (5, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q11",
    "q_num": 11,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: 1014@F4CD",
    "stem": "一元二次不等式 $(x + 3)(x - 1) \\le 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$(-3, 1)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, -3] \\cup [1, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-3, 1]$"
      },
      {
        "key": "D",
        "text": "$[-1, 3]$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "方程 $(x + 3)(x - 1) = 0$ 兩根為 $x = -3$ 和 $x = 1$。帶等號的小於取中間閉區間 $[-3, 1]$。"
  },
  {
    "id": "4CD_1023_Q12",
    "q_num": 12,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "一元二次不等式 $(x + 2)(x + 6) \\ge 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$[-6, -2]$"
      },
      {
        "key": "B",
        "text": "$(-6, -2)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 2] \\cup [6, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -6] \\cup [-2, +\\infty)$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "兩根為 $-6$ 和 $-2$。大於等於取兩端閉區間 $(-\\infty, -6] \\cup [-2, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q13",
    "q_num": 13,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": true,
    "source": "Verbatim Archive: 1013@4CSEN",
    "stem": "不等式 $x(x - 3) < 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$(0, 3)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, 0) \\cup (3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[0, 3]$"
      },
      {
        "key": "D",
        "text": "$(3, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "因式分解型兩根為 $0$ 與 $3$，小於取中間，解集為 $(0, 3)$。"
  },
  {
    "id": "4CD_1023_Q14",
    "q_num": 14,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $(2x - 1)(x - 3) < 0$ 的解集是？",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, \\frac{1}{2}) \\cup (3, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$(\\frac{1}{2}, 3)$"
      },
      {
        "key": "C",
        "text": "$(1, 3)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 3)$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "令各因式為零得兩根 $x_1 = \\frac{1}{2}, x_2 = 3$。二次項係數 $2 > 0$，小於取中間，解集為 $(\\frac{1}{2}, 3)$。"
  },
  {
    "id": "4CD_1023_Q15",
    "q_num": 15,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "方程 $(x - 3)(x + 5) = 0$ 的兩根中較小者為 $x_1$，較大者為 $x_2$，則不等式 $(x - 3)(x + 5) > 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$(-5, 3)$"
      },
      {
        "key": "B",
        "text": "$[-5, 3]$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, -5) \\cup (3, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(3, +\\infty)$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "兩根分別為 $-5$ 和 $3$。大於取兩邊，解集為 $(-\\infty, -5) \\cup (3, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q16",
    "q_num": 16,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 因式分解型基礎解法",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $(x - 4)(x + 1) \\le 0$ 的整數解共有多少個？",
    "options": [
      {
        "key": "A",
        "text": "5個"
      },
      {
        "key": "B",
        "text": "4個"
      },
      {
        "key": "C",
        "text": "7個"
      },
      {
        "key": "D",
        "text": "6個"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "不等式解集為閉區間 $[-1, 4]$。其中的整數解為 $-1, 0, 1, 2, 3, 4$，共 6 個整數。"
  },
  {
    "id": "4CD_1023_Q17",
    "q_num": 17,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "一元二次方程 $x^2 - 6x + 9 = 0$ 的判別式 $\\Delta = b^2 - 4ac$ 的值是？",
    "options": [
      {
        "key": "A",
        "text": "$0$"
      },
      {
        "key": "B",
        "text": "$36$"
      },
      {
        "key": "C",
        "text": "$-36$"
      },
      {
        "key": "D",
        "text": "$72$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "$\\Delta = (-6)^2 - 4 \\times 1 \\times 9 = 36 - 36 = 0$。"
  },
  {
    "id": "4CD_1023_Q18",
    "q_num": 18,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "二次函數 $y = x^2 - 4x + 5$ 的判別式 $\\Delta$ 及其圖象與 $x$ 軸交點情況是？",
    "options": [
      {
        "key": "A",
        "text": "$\\Delta = 4 > 0$，與 $x$ 軸有兩個交點"
      },
      {
        "key": "B",
        "text": "$\\Delta = -4 < 0$，與 $x$ 軸無交點"
      },
      {
        "key": "C",
        "text": "$\\Delta = 0$，與 $x$ 軸切於一點"
      },
      {
        "key": "D",
        "text": "$\\Delta = -4 < 0$，與 $x$ 軸有兩個交點"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "$\\Delta = (-4)^2 - 4 \\times 1 \\times 5 = 16 - 20 = -4 < 0$，判別式小於零說明方程無實根，圖象與 $x$ 軸無交點。"
  },
  {
    "id": "4CD_1023_Q19",
    "q_num": 19,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "二次方程 $2x^2 + 5x - 3 = 0$ 的判別式 $\\Delta$ 的值為？",
    "options": [
      {
        "key": "A",
        "text": "$1$"
      },
      {
        "key": "B",
        "text": "$-1$"
      },
      {
        "key": "C",
        "text": "$49$"
      },
      {
        "key": "D",
        "text": "$25$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "$\\Delta = b^2 - 4ac = 5^2 - 4 \\times 2 \\times (-3) = 25 + 24 = 49$。"
  },
  {
    "id": "4CD_1023_Q20",
    "q_num": 20,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "若二次函數 $y = x^2 - 2x + c$ 的圖象與 $x$ 軸只有一個交點（切點），則常數 $c$ 的值為？",
    "options": [
      {
        "key": "A",
        "text": "$-1$"
      },
      {
        "key": "B",
        "text": "$0$"
      },
      {
        "key": "C",
        "text": "$4$"
      },
      {
        "key": "D",
        "text": "$1$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "圖象與 $x$ 軸只有一個交點等價於 $\\Delta = 0$，即 $(-2)^2 - 4 \\times 1 \\times c = 0 \\implies 4 - 4c = 0 \\implies c = 1$。"
  },
  {
    "id": "4CD_1023_Q21",
    "q_num": 21,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "當判別式 $\\Delta = b^2 - 4ac < 0$ 且二次項係數 $a > 0$ 時，不等式 $ax^2 + bx + c > 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "$\\emptyset$"
      },
      {
        "key": "C",
        "text": "$(0, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 0)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "因為拋物線開口向上 ($a > 0$) 且與 $x$ 軸沒有交點 ($\\Delta < 0$)，整個圖象位於 $x$ 軸上方，故對任意實數 $x$ 函數值均大於零，解集為 $\\mathbb{R}$。"
  },
  {
    "id": "4CD_1023_Q22",
    "q_num": 22,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "二次方程 $x^2 + 2x + 3 = 0$ 在實數範圍內的解的情況是？",
    "options": [
      {
        "key": "A",
        "text": "有兩個不相等的正實數解"
      },
      {
        "key": "B",
        "text": "無實數解"
      },
      {
        "key": "C",
        "text": "有兩個不相等的負實數解"
      },
      {
        "key": "D",
        "text": "有兩個相等的實數解"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "$\\Delta = 2^2 - 4 \\times 1 \\times 3 = 4 - 12 = -8 < 0$，故方程無實數解。"
  },
  {
    "id": "4CD_1023_Q23",
    "q_num": 23,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "拋物線 $y = -x^2 + 2x - 1$ 與 $x$ 軸交點的個數為？",
    "options": [
      {
        "key": "A",
        "text": "2個"
      },
      {
        "key": "B",
        "text": "0個"
      },
      {
        "key": "C",
        "text": "1個"
      },
      {
        "key": "D",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "$\\Delta = 2^2 - 4 \\times (-1) \\times (-1) = 4 - 4 = 0$，故拋物線與 $x$ 軸恰有 1 個交點（頂點在 $x$ 軸上）。"
  },
  {
    "id": "4CD_1023_Q24",
    "q_num": 24,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 判別式計算與零點判定",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "方程 $3x^2 - 2x - 1 = 0$ 的判別式 $\\Delta$ 的值為？",
    "options": [
      {
        "key": "A",
        "text": "$-8$"
      },
      {
        "key": "B",
        "text": "$4$"
      },
      {
        "key": "C",
        "text": "$12$"
      },
      {
        "key": "D",
        "text": "$16$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "$\\Delta = (-2)^2 - 4 \\times 3 \\times (-1) = 4 + 12 = 16$。"
  },
  {
    "id": "4CD_1023_Q25",
    "q_num": 25,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $x > 2$ 用區間表示法表示為？",
    "options": [
      {
        "key": "A",
        "text": "$(2, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$[2, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 2)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 2]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "大於 2 且不包含 2，用圓括號表示開區間 $(2, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q26",
    "q_num": 26,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式組 $-1 \\le x \\le 3$ 用區間表示法表示為？",
    "options": [
      {
        "key": "A",
        "text": "$(-1, 3)$"
      },
      {
        "key": "B",
        "text": "$[-1, 3]$"
      },
      {
        "key": "C",
        "text": "$[-1, 3)$"
      },
      {
        "key": "D",
        "text": "$(-1, 3]$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "兩端均包含等號，用方括號表示閉區間 $[-1, 3]$。"
  },
  {
    "id": "4CD_1023_Q27",
    "q_num": 27,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "集合 $\\{x \\mid x < 0 \\text{ 或 } x \\ge 4\\}$ 用區間表示法表示為？",
    "options": [
      {
        "key": "A",
        "text": "$[0, 4]$"
      },
      {
        "key": "B",
        "text": "$(0, 4]$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 0) \\cup [4, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 0] \\cup (4, +\\infty)$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "$x < 0$ 對應 $(-\\infty, 0)$，$x \\ge 4$ 對應 $[4, +\\infty)$，兩者取並集為 $(-\\infty, 0) \\cup [4, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q28",
    "q_num": 28,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "區間 $[2, 5)$ 在數軸上的表示含義是？",
    "options": [
      {
        "key": "A",
        "text": "不包含端點 2，但包含端點 5"
      },
      {
        "key": "B",
        "text": "同時包含端點 2 和 5"
      },
      {
        "key": "C",
        "text": "不包含端點 2 和 5"
      },
      {
        "key": "D",
        "text": "包含端點 2，但不包含端點 5"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "左方括號代表左閉（包含端點 2），右圓括號代表右開（不包含端點 5）。"
  },
  {
    "id": "4CD_1023_Q29",
    "q_num": 29,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "設集合 $A = (-2, 3)$，集合 $B = [1, 4]$，則交集 $A \\cap B$ 為？",
    "options": [
      {
        "key": "A",
        "text": "$[1, 3)$"
      },
      {
        "key": "B",
        "text": "$(-2, 4]$"
      },
      {
        "key": "C",
        "text": "$[-2, 3]$"
      },
      {
        "key": "D",
        "text": "$(1, 3)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "$A$ 與 $B$ 的公共部分為大於等於 1 且小於 3 的實數，即 $[1, 3)$。"
  },
  {
    "id": "4CD_1023_Q30",
    "q_num": 30,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "設集合 $A = (-\\infty, 2]$，集合 $B = (0, +\\infty)$，則並集 $A \\cup B$ 為？",
    "options": [
      {
        "key": "A",
        "text": "$(0, 2]$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, +\\infty)$ 即 $\\mathbb{R}$"
      },
      {
        "key": "C",
        "text": "$[0, 2)$"
      },
      {
        "key": "D",
        "text": "$\\emptyset$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "$(-\\infty, 2]$ 與 $(0, +\\infty)$ 在區間 $(0, 2]$ 處重疊，並集覆蓋整個實數軸，即 $\\mathbb{R}$。"
  },
  {
    "id": "4CD_1023_Q31",
    "q_num": 31,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $-3 < x \\le 1$ 所對應的區間是？",
    "options": [
      {
        "key": "A",
        "text": "$[-3, 1)$"
      },
      {
        "key": "B",
        "text": "$(-3, 1)$"
      },
      {
        "key": "C",
        "text": "$(-3, 1]$"
      },
      {
        "key": "D",
        "text": "$[-3, 1]$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "左端點不含等號用圓括號，右端點含等號用方括號，表示為左開右閉區間 $(-3, 1]$。"
  },
  {
    "id": "4CD_1023_Q32",
    "q_num": 32,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 基礎區間表示法與集合",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "設全集 $U = \\mathbb{R}$，集合 $A = [2, +\\infty)$，則補集 $\\complement_U A$ 為？",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, 2]$"
      },
      {
        "key": "B",
        "text": "$(2, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$\\emptyset$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 2)$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "全集中扣除大於等於 2 的數，剩餘小於 2 的實數，即 $(-\\infty, 2)$。"
  },
  {
    "id": "4CD_1023_Q33",
    "q_num": 33,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "解一元二次不等式 $-x^2 + 4x - 3 > 0$，兩邊同乘以 $-1$ 後轉化為的標準形式是？",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 4x + 3 < 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 4x + 3 > 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 4x - 3 < 0$"
      },
      {
        "key": "D",
        "text": "$-x^2 - 4x + 3 < 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "不等式兩邊同乘以負數，不等號方向必須改變，大於號變為小於號，即 $x^2 - 4x + 3 < 0$。"
  },
  {
    "id": "4CD_1023_Q34",
    "q_num": 34,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $x^2 + 4 > 0$ 在實數範圍內的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\emptyset$"
      },
      {
        "key": "B",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "C",
        "text": "$(-2, 2)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -2) \\cup (2, +\\infty)$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "對任意實數 $x$，均有 $x^2 \\ge 0$，所以 $x^2 + 4 \\ge 4 > 0$ 恆成立，解集為全體實數 $\\mathbb{R}$。"
  },
  {
    "id": "4CD_1023_Q35",
    "q_num": 35,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $x^2 + 9 \\le 0$ 在實數範圍內的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "$\\{-3, 3\\}$"
      },
      {
        "key": "C",
        "text": "$\\emptyset$"
      },
      {
        "key": "D",
        "text": "$[-3, 3]$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "因為 $x^2 \\ge 0$，所以 $x^2 + 9 \\ge 9 > 0$ 恆成立，不可能小於等於零，解集為空集 $\\emptyset$。"
  },
  {
    "id": "4CD_1023_Q36",
    "q_num": 36,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $(x - 3)^2 \\le 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\emptyset$"
      },
      {
        "key": "B",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 3]$"
      },
      {
        "key": "D",
        "text": "$\\{3\\}$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "完全平方數 $(x - 3)^2 \\ge 0$ 恆成立。若 $(x - 3)^2 \\le 0$，只能取等號 $(x - 3)^2 = 0 \\implies x = 3$，解集為單元素集 $\\{3\\}$。"
  },
  {
    "id": "4CD_1023_Q37",
    "q_num": 37,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $(x + 2)^2 > 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\{x \\mid x \\ne -2\\}$"
      },
      {
        "key": "B",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "C",
        "text": "$\\emptyset$"
      },
      {
        "key": "D",
        "text": "$(-2, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "當 $x = -2$ 時 $(x + 2)^2 = 0$ 不滿足大於零；當 $x \\ne -2$ 時平方恆大於零，故解集為 $\\{x \\mid x \\ne -2\\}$。"
  },
  {
    "id": "4CD_1023_Q38",
    "q_num": 38,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "解不等式 $-2x^2 + 6x \\le 0$，兩邊同除以 $-2$ 後等價於？",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 3x \\le 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 3x \\ge 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 3x \\ge 0$"
      },
      {
        "key": "D",
        "text": "$2x^2 - 6x \\le 0$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "兩邊同除以負數 $-2$，小於等於號轉為大於等於號，得到 $x^2 - 3x \\ge 0$。"
  },
  {
    "id": "4CD_1023_Q39",
    "q_num": 39,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $-(x - 1)(x - 5) \\ge 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, 1] \\cup [5, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$(1, 5)$"
      },
      {
        "key": "C",
        "text": "$[1, 5]$"
      },
      {
        "key": "D",
        "text": "$\\emptyset$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "兩邊乘以 $-1$ 得 $(x - 1)(x - 5) \\le 0$。兩根為 $1$ 和 $5$，小於等於取中間閉區間 $[1, 5]$。"
  },
  {
    "id": "4CD_1023_Q40",
    "q_num": 40,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 負首項變號與特殊解集",
    "type": "single_choice",
    "difficulty": "Basic",
    "isVerbatimArchive": false,
    "source": "1023基礎題庫",
    "stem": "不等式 $x^2 - 2x + 1 < 0$ 的解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\{1\\}$"
      },
      {
        "key": "B",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$\\emptyset$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "左邊配方為 $(x - 1)^2$。因為任何實數的平方都不可能嚴格小於 0，故解集為空集 $\\emptyset$。"
  },
  {
    "id": "4CD_1023_Q41",
    "q_num": 41,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 頂點式與最值判定",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "將二次函數 $f(x) = x^2 - 4x + 7$ 配方為頂點式，其頂點座標與函數最值分別為？",
    "options": [
      {
        "key": "A",
        "text": "頂點為 $(2, 3)$，最小值為 $3$"
      },
      {
        "key": "B",
        "text": "頂點為 $(-2, 3)$，最小值為 $3$"
      },
      {
        "key": "C",
        "text": "頂點為 $(2, 7)$，最小值為 $7$"
      },
      {
        "key": "D",
        "text": "頂點為 $(2, 3)$，最大值為 $3$"
      },
      {
        "key": "E",
        "text": "頂點為 $(4, 7)$，最大值為 $7$"
      },
      {
        "key": "F",
        "text": "頂點為 $(2, -3)$，最小值為 $-3$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "配方過程：$f(x) = (x^2 - 4x + 4) - 4 + 7 = (x - 2)^2 + 3$。二次項係數 $1 > 0$，當 $x = 2$ 時取得最小值 $3$，頂點座標為 $(2, 3)$。"
  },
  {
    "id": "4CD_1023_Q42",
    "q_num": 42,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 頂點式與最值判定",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "二次函數 $y = -2x^2 + 8x - 5$ 配方後的頂點座標及最大值為？",
    "options": [
      {
        "key": "A",
        "text": "頂點為 $(2, 3)$，最小值為 $3$"
      },
      {
        "key": "B",
        "text": "頂點為 $(2, 3)$，最大值為 $3$"
      },
      {
        "key": "C",
        "text": "頂點為 $(-2, 3)$，最大值為 $3$"
      },
      {
        "key": "D",
        "text": "頂點為 $(2, -5)$，最大值為 $-5$"
      },
      {
        "key": "E",
        "text": "頂點為 $(4, 3)$，最大值為 $3$"
      },
      {
        "key": "F",
        "text": "頂點為 $(-2, -5)$，最小值為 $-5$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "提取負二次項係數並配方：$y = -2(x^2 - 4x) - 5 = -2(x - 2)^2 + 8 - 5 = -2(x - 2)^2 + 3$。由於 $a = -2 < 0$，當 $x = 2$ 時取得最大值 $3$，頂點為 $(2, 3)$。"
  },
  {
    "id": "4CD_1023_Q43",
    "q_num": 43,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 頂點式與最值判定",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "已知二次函數 $y = a(x - 1)^2 + 4$ 的圖象經過點 $(0, 2)$，則係數 $a$ 的值與該函數的最值分別為？",
    "options": [
      {
        "key": "A",
        "text": "$a = 2$，最小值為 $4$"
      },
      {
        "key": "B",
        "text": "$a = -2$，最小值為 $4$"
      },
      {
        "key": "C",
        "text": "$a = -2$，最大值為 $4$"
      },
      {
        "key": "D",
        "text": "$a = -1$，最大值為 $4$"
      },
      {
        "key": "E",
        "text": "$a = 1$，最小值為 $2$"
      },
      {
        "key": "F",
        "text": "$a = -4$，最大值為 $2$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "將 $(0, 2)$ 代入函數式：$2 = a(0 - 1)^2 + 4 = a + 4 \\implies a = -2$。因為 $a = -2 < 0$，函數開口向下，當 $x = 1$ 時取得最大值 $4$。"
  },
  {
    "id": "4CD_1023_Q44",
    "q_num": 44,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 頂點式與最值判定",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "二次函數 $f(x) = 3(x + 2)^2 - 5$ 在閉區間 $[-4, 0]$ 上的最小值和最大值分別為？",
    "options": [
      {
        "key": "A",
        "text": "最小值為 $-5$，最大值為 $-2$"
      },
      {
        "key": "B",
        "text": "最小值為 $-2$，最大值為 $7$"
      },
      {
        "key": "C",
        "text": "最小值為 $-5$，最大值為 $12$"
      },
      {
        "key": "D",
        "text": "最小值為 $-5$，最大值為 $7$"
      },
      {
        "key": "E",
        "text": "最小值為 $7$，最大值為 $12$"
      },
      {
        "key": "F",
        "text": "最小值為 $-5$，最大值為 $0$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "對稱軸為 $x = -2$，位於給定區間 $[-4, 0]$ 內部。開口向上，故最小值在頂點處取得：$f(-2) = -5$。計算端點值：$f(-4) = 3(-4+2)^2 - 5 = 12 - 5 = 7$；$f(0) = 3(0+2)^2 - 5 = 12 - 5 = 7$。因此最大值為 $7$。"
  },
  {
    "id": "4CD_1023_Q45",
    "q_num": 45,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 對稱軸與代數對稱性",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "拋物線 $y = 3x^2 - 12x + 5$ 的對稱軸方程為？",
    "options": [
      {
        "key": "A",
        "text": "$x = -2$"
      },
      {
        "key": "B",
        "text": "$x = 4$"
      },
      {
        "key": "C",
        "text": "$x = -4$"
      },
      {
        "key": "D",
        "text": "$x = \\frac{1}{2}$"
      },
      {
        "key": "E",
        "text": "$x = 2$"
      },
      {
        "key": "F",
        "text": "$x = 1$"
      }
    ],
    "correctKeys": [
      "E"
    ],
    "answer": [
      "E"
    ],
    "explanation": "由二次函數對稱軸公式 $x = -\\frac{b}{2a}$，代入 $a = 3, b = -12$ 得 $x = -\\frac{-12}{2 \\times 3} = \\frac{12}{6} = 2$。"
  },
  {
    "id": "4CD_1023_Q46",
    "q_num": 46,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 對稱軸與代數對稱性",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "已知二次函數 $f(x)$ 滿足 $f(1) = f(7)$，則該二次函數圖象的對稱軸直線方程為？",
    "options": [
      {
        "key": "A",
        "text": "$x = 3$"
      },
      {
        "key": "B",
        "text": "$x = 3.5$"
      },
      {
        "key": "C",
        "text": "$x = 5$"
      },
      {
        "key": "D",
        "text": "$x = 6$"
      },
      {
        "key": "E",
        "text": "$x = 2$"
      },
      {
        "key": "F",
        "text": "$x = 4$"
      }
    ],
    "correctKeys": [
      "F"
    ],
    "answer": [
      "F"
    ],
    "explanation": "若二次函數在兩點處函數值相等，則對稱軸必為這兩點橫座標的垂直平分線：$x = \\frac{1 + 7}{2} = 4$。"
  },
  {
    "id": "4CD_1023_Q47",
    "q_num": 47,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 對稱軸與代數對稱性",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "已知拋物線 $y = -(x - 3)^2 + 2$，點 $A(1, y_1)$ 與點 $B(5, y_2)$ 均在拋物線上，則 $y_1$ 與 $y_2$ 的大小關係及數值為？",
    "options": [
      {
        "key": "A",
        "text": "$y_1 = y_2 = -2$"
      },
      {
        "key": "B",
        "text": "$y_1 > y_2$"
      },
      {
        "key": "C",
        "text": "$y_1 < y_2$"
      },
      {
        "key": "D",
        "text": "$y_1 = y_2 = 2$"
      },
      {
        "key": "E",
        "text": "$y_1 = y_2 = 0$"
      },
      {
        "key": "F",
        "text": "$y_1 = -2, y_2 = 2$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "對稱軸為 $x = 3$。點 $A$ 橫座標 1 與點 $B$ 橫座標 5 關於對稱軸對稱（$\\frac{1+5}{2} = 3$）。代入得 $y_1 = -(1 - 3)^2 + 2 = -4 + 2 = -2$，$y_2 = -(5 - 3)^2 + 2 = -2$。故 $y_1 = y_2 = -2$。"
  },
  {
    "id": "4CD_1023_Q48",
    "q_num": 48,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 對稱軸與代數對稱性",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "若二次函數 $y = ax^2 + bx + c$ 的圖象開口向上，對稱軸為直線 $x = 1$，則函數值 $f(-1), f(1), f(2)$ 的大小關係是？",
    "options": [
      {
        "key": "A",
        "text": "$f(1) < f(-1) < f(2)$"
      },
      {
        "key": "B",
        "text": "$f(1) < f(2) < f(-1)$"
      },
      {
        "key": "C",
        "text": "$f(-1) < f(2) < f(1)$"
      },
      {
        "key": "D",
        "text": "$f(2) < f(1) < f(-1)$"
      },
      {
        "key": "E",
        "text": "$f(1) = f(2) < f(-1)$"
      },
      {
        "key": "F",
        "text": "$f(-1) = f(2) > f(1)$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "拋物線開口向上，頂點 $x = 1$ 處函數值最小，且離對稱軸越遠函數值越大。點 $x = 1$ 到對稱軸距離為 0；點 $x = 2$ 到對稱軸距離為 1；點 $x = -1$ 到對稱軸距離為 2。因此 $f(1) < f(2) < f(-1)$。"
  },
  {
    "id": "4CD_1023_Q49",
    "q_num": 49,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 定義域限制與根式分母非負",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "函數 $f(x) = \\frac{1}{x^2 - 9}$ 的定義域用區間表示為？",
    "options": [
      {
        "key": "A",
        "text": "$[-3, 3]$"
      },
      {
        "key": "B",
        "text": "$(-3, 3)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, -3) \\cup (-3, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -3] \\cup [3, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$\\{x \\mid x \\ne 3\\}$"
      },
      {
        "key": "F",
        "text": "$\\mathbb{R}$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "分式有意義要求分母不為零，即 $x^2 - 9 \\ne 0 \\implies x \\ne \\pm 3$。寫成區間並集為 $(-\\infty, -3) \\cup (-3, 3) \\cup (3, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q50",
    "q_num": 50,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 定義域限制與根式分母非負",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "函數 $f(x) = \\sqrt{x^2 - 4}$ 的定義域為？",
    "options": [
      {
        "key": "A",
        "text": "$[-2, 2]$"
      },
      {
        "key": "B",
        "text": "$(-2, 2)$"
      },
      {
        "key": "C",
        "text": "$[2, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -2] \\cup [2, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$(-\\infty, -2]$"
      },
      {
        "key": "F",
        "text": "$(-2, +\\infty)$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "二次根式有意義要求被開方數非負：$x^2 - 4 \\ge 0 \\implies (x - 2)(x + 2) \\ge 0$。大於等於取兩端閉區間，定義域為 $(-\\infty, -2] \\cup [2, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q51",
    "q_num": 51,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 定義域限制與根式分母非負",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "函數 $f(x) = \\frac{1}{\\sqrt{x^2 - 3x + 2}}$ 的定義域用區間表示為？",
    "options": [
      {
        "key": "A",
        "text": "$[1, 2]$"
      },
      {
        "key": "B",
        "text": "$(1, 2)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 1] \\cup [2, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 2)$"
      },
      {
        "key": "E",
        "text": "$(-\\infty, 1) \\cup (2, +\\infty)$"
      },
      {
        "key": "F",
        "text": "$(1, +\\infty)$"
      }
    ],
    "correctKeys": [
      "E"
    ],
    "answer": [
      "E"
    ],
    "explanation": "被開方數在分母位置，必須嚴格大於零：$x^2 - 3x + 2 > 0 \\implies (x - 1)(x - 2) > 0$。大於取兩邊開區間，定義域為 $(-\\infty, 1) \\cup (2, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q52",
    "q_num": 52,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "二次函數 · 定義域限制與根式分母非負",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "函數 $f(x) = \\sqrt{6 - x - x^2}$ 的定義域為？",
    "options": [
      {
        "key": "A",
        "text": "$(-3, 2)$"
      },
      {
        "key": "B",
        "text": "$[-2, 3]$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, -3] \\cup [2, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -2] \\cup [3, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$[-6, 1]$"
      },
      {
        "key": "F",
        "text": "$[-3, 2]$"
      }
    ],
    "correctKeys": [
      "F"
    ],
    "answer": [
      "F"
    ],
    "explanation": "要求被開方數非負：$6 - x - x^2 \\ge 0 \\implies x^2 + x - 6 \\le 0 \\implies (x + 3)(x - 2) \\le 0$。小於等於取中間閉區間，定義域為 $[-3, 2]$。"
  },
  {
    "id": "4CD_1023_Q53",
    "q_num": 53,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 含係數標準二次不等式",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "解一元二次不等式 $2x^2 - 5x + 2 < 0$，其解集為？",
    "options": [
      {
        "key": "A",
        "text": "$(\\frac{1}{2}, 2)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, \\frac{1}{2}) \\cup (2, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[\\frac{1}{2}, 2]$"
      },
      {
        "key": "D",
        "text": "$(-2, -\\frac{1}{2})$"
      },
      {
        "key": "E",
        "text": "$(-\\infty, 2)$"
      },
      {
        "key": "F",
        "text": "$(0, 2)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "十字相乘分解因式：$2x^2 - 5x + 2 = (2x - 1)(x - 2) < 0$。對應兩根為 $\\frac{1}{2}$ 和 $2$。二次項係數 $2 > 0$，小於取中間，解集為 $(\\frac{1}{2}, 2)$。"
  },
  {
    "id": "4CD_1023_Q54",
    "q_num": 54,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 含係數標準二次不等式",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "解一元二次不等式 $3x^2 - 10x + 3 \\ge 0$，其解集為？",
    "options": [
      {
        "key": "A",
        "text": "$[\\frac{1}{3}, 3]$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, \\frac{1}{3}] \\cup [3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$(\\frac{1}{3}, 3)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, \\frac{1}{3}) \\cup (3, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$[3, +\\infty)$"
      },
      {
        "key": "F",
        "text": "$(-\\infty, 3]$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "explanation": "因式分解：$(3x - 1)(x - 3) \\ge 0$。兩根為 $\\frac{1}{3}$ 和 $3$。大於等於取兩端閉區間，解集為 $(-\\infty, \\frac{1}{3}] \\cup [3, +\\infty)$。"
  },
  {
    "id": "4CD_1023_Q55",
    "q_num": 55,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 含係數標準二次不等式",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "解一元二次不等式 $-2x^2 + x + 1 > 0$，其解集為？",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, -\\frac{1}{2}) \\cup (1, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$[-1, \\frac{1}{2}]$"
      },
      {
        "key": "C",
        "text": "$(-\\frac{1}{2}, 1)$"
      },
      {
        "key": "D",
        "text": "$(-1, \\frac{1}{2})$"
      },
      {
        "key": "E",
        "text": "$[0, 1]$"
      },
      {
        "key": "F",
        "text": "$(-1, 1)$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "explanation": "兩邊同乘以 $-1$ 改變符號：$2x^2 - x - 1 < 0$。因式分解：$(2x + 1)(x - 1) < 0$。兩根為 $-\\frac{1}{2}$ 和 $1$。小於取中間，解集為 $(-\\frac{1}{2}, 1)$。"
  },
  {
    "id": "4CD_1023_Q56",
    "q_num": 56,
    "chapter": "ch03_quadratic_functions_and_inequalities",
    "topic": "一元二次不等式 · 含係數標準二次不等式",
    "type": "single_choice",
    "difficulty": "Intermediate",
    "isVerbatimArchive": false,
    "source": "1023進階題庫",
    "stem": "解一元二次不等式 $4x^2 - 12x + 9 > 0$，其解集為？",
    "options": [
      {
        "key": "A",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "$\\emptyset$"
      },
      {
        "key": "C",
        "text": "$(\\frac{3}{2}, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$\\{x \\mid x \\ne \\frac{3}{2}\\}$"
      },
      {
        "key": "E",
        "text": "$(-\\infty, \\frac{3}{2})$"
      },
      {
        "key": "F",
        "text": "$[\\frac{3}{2}, +\\infty)$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "explanation": "左邊為完全平方式：$(2x - 3)^2 > 0$。除 $2x - 3 = 0$（即 $x = \\frac{3}{2}$）使得平方等於 0 外，其餘實數平方均嚴格大於 0。故解集為 $\\{x \\mid x \\ne \\frac{3}{2}\\}$。"
  },
  {
    "id": "4CD_1023_Q57",
    "q_num": 57,
    "topic": "一元二次不等式 · 基礎解集與拋物線特徵",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 3 例1",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "求一元二次不等式 $x^2 - 5x + 6 > 0$ 的解集與相應二次函數 $f(x) = x^2 - 5x + 6$ 的幾何代數性質。下列敘述中正確的有：",
    "diagram_spec": "二次函數圖象（開口向上拋物線 $y = x^2 - 5x + 6$，標註兩零點 $x=2, x=3$ 與頂點 $(\\frac{5}{2}, -\\frac{1}{4})$，陰影表示 $y > 0$ 區間）",
    "diagram_filename": "q01_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "對應二次方程 $x^2 - 5x + 6 = 0$ 的兩實數根分別為 $x_1 = 2$ 與 $x_2 = 3$"
      },
      {
        "key": "B",
        "text": "對應二次函數 $f(x) = x^2 - 5x + 6$ 的圖象開口向上，且與 $x$ 軸有兩個不同交點 $(2, 0)$ 與 $(3, 0)$"
      },
      {
        "key": "C",
        "text": "原不等式 $x^2 - 5x + 6 > 0$ 的解集用區間表示為 $(2, 3)$"
      },
      {
        "key": "D",
        "text": "原不等式 $x^2 - 5x + 6 > 0$ 的解集用集合描述法表示為 $\\{x \\mid x < 2 \\text{ 或 } x > 3\\}$"
      },
      {
        "key": "E",
        "text": "對應二次函數的頂點坐標為 $(\\frac{5}{2}, -\\frac{1}{4})$"
      },
      {
        "key": "F",
        "text": "若 $x = \\frac{5}{2}$，則 $x$ 屬於原不等式的解集"
      },
      {
        "key": "G",
        "text": "原不等式的解集用區間表示為 $(-\\infty, 2] \\cup [3, +\\infty)$"
      },
      {
        "key": "H",
        "text": "函數 $f(x) = x^2 - 5x + 6$ 在區間 $(-\\infty, \\frac{5}{2}]$ 上單調遞減，在 $[\\frac{5}{2}, +\\infty)$ 上單調遞增"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "D",
      "E",
      "H"
    ],
    "explanation": "1. **方程根與因式分解**: 二次三項式 $x^2 - 5x + 6$ 可十字相乘分解為 $(x - 2)(x - 3) = 0$，解得兩實數根 $x_1 = 2, x_2 = 3$。故選項 A 正確。\n  2. **圖象交點與頂點**: 二次項係數 $a = 1 > 0$，拋物線開口向上，與 $x$ 軸交於 $(2, 0)$ 與 $(3, 0)$。頂點橫坐標 $x_v = -\\frac{b}{2a} = \\frac{5}{2}$，縱坐標 $f(\\frac{5}{2}) = (\\frac{5}{2})^2 - 5(\\frac{5}{2}) + 6 = \\frac{25}{4} - \\frac{50}{4} + \\frac{24}{4} = -\\frac{1}{4}$。故選項 B、E 正確。\n  3. **不等式解集判定**: 由「大於取兩邊」法則，開口向上的拋物線在 $x$ 軸上方對應的區域為 $x < 2$ 或 $x > 3$。描述法為 $\\{x \\mid x < 2 \\text{ 或 } x > 3\\}$，區間法為 $(-\\infty, 2) \\cup (3, +\\infty)$。原題為嚴格不等式，端點處取空心，不含等號。故選項 D 正確，C 錯誤（C 是小於 0 的解集），G 錯誤（不應含閉區間方括號）。\n  4. **特值驗證與單調性**: 當 $x = \\frac{5}{2}$ 時，$f(\\frac{5}{2}) = -\\frac{1}{4} < 0$，不滿足 $> 0$，故 F 錯誤。拋物線對稱軸為 $x = \\frac{5}{2}$，開口向上，故在 $(-\\infty, \\frac{5}{2}]$ 上單調遞減，在 $[\\frac{5}{2}, +\\infty)$ 上單調遞增，選項 H 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選但無錯選給相應比例分（每選對 1 個且無錯選得 0.8 分）；凡選入任何錯誤選項（C、F、G）者，本小題得 0 分。"
  },
  {
    "id": "4CD_1023_Q58",
    "q_num": 58,
    "topic": "一元二次不等式 · 判別式為零的臨界情況",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 4 例2",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "關於一元二次不等式 $9x^2 - 6x + 1 > 0$ 及其對應二次函數 $y = 9x^2 - 6x + 1$，下列說法正確的有：",
    "diagram_spec": "二次函數圖象（開口向上拋物線 $y = 9x^2 - 6x + 1$，頂點切於 $x$ 軸點 $(\\frac{1}{3}, 0)$）",
    "diagram_filename": "q02_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "判別式 $\\Delta = (-6)^2 - 4 \\times 9 \\times 1 = 0$"
      },
      {
        "key": "B",
        "text": "二次方程 $9x^2 - 6x + 1 = 0$ 有兩個相等的實數根 $x_1 = x_2 = \\frac{1}{3}$"
      },
      {
        "key": "C",
        "text": "原不等式 $9x^2 - 6x + 1 > 0$ 的解集為全體實數集 $\\mathbb{R}$"
      },
      {
        "key": "D",
        "text": "原不等式 $9x^2 - 6x + 1 > 0$ 的解集用集合描述法表示為 $\\{x \\in \\mathbb{R} \\mid x \\ne \\frac{1}{3}\\}$"
      },
      {
        "key": "E",
        "text": "原不等式 $9x^2 - 6x + 1 > 0$ 的解集用區間表示為 $(-\\infty, \\frac{1}{3}) \\cup (\\frac{1}{3}, +\\infty)$"
      },
      {
        "key": "F",
        "text": "不等式 $9x^2 - 6x + 1 \\le 0$ 的解集為單元素集 $\\{\\frac{1}{3}\\}$"
      },
      {
        "key": "G",
        "text": "二次函數 $y = 9x^2 - 6x + 1$ 的頂點為 $(\\frac{1}{3}, 1)$"
      },
      {
        "key": "H",
        "text": "不等式 $9x^2 - 6x + 1 < 0$ 的解集為 $(-\\infty, \\frac{1}{3})$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "D",
      "E",
      "F"
    ],
    "explanation": "1. **判別式與方程根**: $\\Delta = b^2 - 4ac = (-6)^2 - 4(9)(1) = 36 - 36 = 0$。方程 $9x^2 - 6x + 1 = (3x - 1)^2 = 0$ 解得重根 $x_1 = x_2 = \\frac{1}{3}$。故 A、B 正確。\n  2. **圖象幾何關係與頂點**: 頂點為 $(\\frac{1}{3}, 0)$，圖象完全位於 $x$ 軸上方且僅在 $x = \\frac{1}{3}$ 處切於 $x$ 軸。故 G 錯誤（頂點縱坐標為 0 而非 1）。\n  3. **解集嚴格判定**:\n     - 對於嚴格不等式 $(3x - 1)^2 > 0$，因平方項非負，除使底數為 0 的 $x = \\frac{1}{3}$ 外其餘實數均成立。因此解集為 $\\{x \\mid x \\ne \\frac{1}{3}\\}$，區間記為 $(-\\infty, \\frac{1}{3}) \\cup (\\frac{1}{3}, +\\infty)$。故 D、E 正確，C 錯誤（漏排除了使式子等於 0 的臨界點）。\n     - 對於非嚴格不等式 $(3x - 1)^2 \\le 0$，平方不可能小於 0，僅當 $3x - 1 = 0 \\iff x = \\frac{1}{3}$ 時取等號，故解集為單元素集合 $\\{\\frac{1}{3}\\}$。故 F 正確。\n     - 對於嚴格小於 0 的不等式 $(3x - 1)^2 < 0$，實數平方非負，無解，解集為空集 $\\varnothing$。故 H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；凡選入 C、G、H 中任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q59",
    "q_num": 59,
    "topic": "一元二次不等式 · 負首項係數與判別式小於零",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 5 例3",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "關於一元二次不等式 $-x^2 + 2x - 3 > 0$ 及其轉化形式，下列命題正確的有：",
    "diagram_spec": "二次函數圖象（開口向下拋物線 $y = -x^2 + 2x - 3$，頂點 $(1, -2)$，完全位於 $x$ 軸下方）",
    "diagram_filename": "q03_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "原不等式兩邊同乘以 $-1$，可等價轉化為 $x^2 - 2x + 3 < 0$"
      },
      {
        "key": "B",
        "text": "二次方程 $x^2 - 2x + 3 = 0$ 的判別式 $\\Delta = 2^2 - 4 \\times 1 \\times 3 = -8 < 0$"
      },
      {
        "key": "C",
        "text": "原不等式 $-x^2 + 2x - 3 > 0$ 的解集為空集 $\\varnothing$"
      },
      {
        "key": "D",
        "text": "二次函數 $y = -x^2 + 2x - 3$ 的圖象開口向下，且完全位於 $x$ 軸的下方"
      },
      {
        "key": "E",
        "text": "不等式 $-x^2 + 2x - 3 < 0$ 的解集為全體實數集 $\\mathbb{R}$"
      },
      {
        "key": "F",
        "text": "對任意實數 $x$，代數式 $-x^2 + 2x - 3$ 的最大值為 $2$"
      },
      {
        "key": "G",
        "text": "二次方程 $-x^2 + 2x - 3 = 0$ 在實數範圍內有兩個相異實根"
      },
      {
        "key": "H",
        "text": "若將不等式改為 $-x^2 + 2x - 3 \\le -2$，則其解集為 $\\{1\\}$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "explanation": "1. **等價轉化與判別式**: 不等式兩端乘以負數變號，$-x^2 + 2x - 3 > 0 \\iff x^2 - 2x + 3 < 0$。對應二次方程 $x^2 - 2x + 3 = 0$ 的判別式 $\\Delta = (-2)^2 - 4(1)(3) = 4 - 12 = -8 < 0$。故 A、B 正確，G 錯誤（方程無實數根）。\n  2. **圖象分析與解集判定**: 函數 $y = -x^2 + 2x - 3 = -(x - 1)^2 - 2$ 開口向下，頂點為 $(1, -2)$。因為最大值為 $-2 < 0$，所以圖象完全位於 $x$ 軸下方，函數值恆小於 0。因此：\n     - $-x^2 + 2x - 3 > 0$ 無解，解集為 $\\varnothing$。C 正確。\n     - $-x^2 + 2x - 3 < 0$ 恆成立，解集為 $\\mathbb{R}$。E 正確。\n     - 圖象特徵描述 D 正確。\n  3. **極值與變式辨析**:\n     - 函數最大值為 $-2$，而非 $2$。F 錯誤。\n     - 對於變式 $-x^2 + 2x - 3 \\le -2$，化為 $-(x - 1)^2 - 2 \\le -2 \\iff -(x - 1)^2 \\le 0 \\iff (x - 1)^2 \\ge 0$，實數平方恆非負，其解集為全體實數 $\\mathbb{R}$，而非單點 $\\{1\\}$。故 H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選給相應比例分；選入 F、G、H 中任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q60",
    "q_num": 60,
    "topic": "一元二次不等式 · 解集運算與數軸映射",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 7 練習第1題",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "已知一元二次不等式 $x^2 - 2x - 3 > 0$，設其解集為集合 $A$。下列說法正確的有：",
    "diagram_spec": "實數數軸區間圖（數軸上以 $-1$ 和 $3$ 為空心端點向兩側延伸的兩條開射線）",
    "diagram_filename": "q04_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "二次多項式可因式分解為 $(x - 3)(x + 1)$"
      },
      {
        "key": "B",
        "text": "對應二次方程 $x^2 - 2x - 3 = 0$ 的根為 $x_1 = -1$ 與 $x_2 = 3$"
      },
      {
        "key": "C",
        "text": "解集 $A$ 用區間表示為 $(-\\infty, -1) \\cup (3, +\\infty)$"
      },
      {
        "key": "D",
        "text": "實數 $0 \\in A$"
      },
      {
        "key": "E",
        "text": "實數 $-2 \\in A$ 且 $4 \\in A$"
      },
      {
        "key": "F",
        "text": "設集合 $B = \\{x \\mid x > 0\\}$，則 $A \\cap B = (3, +\\infty)$"
      },
      {
        "key": "G",
        "text": "解集 $A$ 在實數軸上表示為以 $-1$ 和 $3$ 為端點的閉線段 $[-1, 3]$"
      },
      {
        "key": "H",
        "text": "不等式 $x^2 - 2x - 3 \\le 0$ 的解集為 $(-\\infty, -1] \\cup [3, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "E",
      "F"
    ],
    "explanation": "1. **因式分解與根**: $x^2 - 2x - 3 = (x - 3)(x + 1)$，對應零點為 $x = -1, 3$。A、B 正確。\n  2. **解集區間**: 開口向上，大於 0 取兩邊，解集 $A = (-\\infty, -1) \\cup (3, +\\infty)$。C 正確，G 錯誤（G 混淆了兩邊與中間、開閉端點）。\n  3. **元素代入檢驗**:\n     - 代入 $x = 0$：$0^2 - 0 - 3 = -3 < 0$，不滿足 $> 0$，故 $0 \\notin A$。D 錯誤。\n     - 代入 $x = -2$：$(-2)^2 - 2(-2) - 3 = 4 + 4 - 3 = 5 > 0$，滿足；代入 $x = 4$：$16 - 8 - 3 = 5 > 0$，滿足。故 E 正確。\n  4. **集合交集與補集性質**:\n     - $A \\cap B = ((-\\infty, -1) \\cup (3, +\\infty)) \\cap (0, +\\infty) = (3, +\\infty)$。F 正確。\n     - 不等式 $x^2 - 2x - 3 \\le 0$ 的解集為閉區間 $[-1, 3]$，H 選項給出的形式是其補集解，故 H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例得分；選入 D、G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q61",
    "q_num": 61,
    "topic": "一元二次不等式 · 非嚴格不等式與單點解集",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 7 練習第2題",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "關於不等式 $-x^2 + 6x - 9 \\ge 0$ 及其對應方程、函數，下列論斷正確的有：",
    "diagram_spec": "二次函數圖象（開口向下拋物線 $y = -x^2 + 6x - 9$，頂點切於點 $(3, 0)$）",
    "diagram_filename": "q05_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "原不等式兩邊同乘以 $-1$，等價變形為 $x^2 - 6x + 9 \\le 0$"
      },
      {
        "key": "B",
        "text": "代數式 $x^2 - 6x + 9$ 可配方為 $(x - 3)^2$"
      },
      {
        "key": "C",
        "text": "原不等式 $-x^2 + 6x - 9 \\ge 0$ 的解集為單元素集合 $\\{3\\}$"
      },
      {
        "key": "D",
        "text": "二次函數 $y = -x^2 + 6x - 9$ 的圖象頂點為 $(3, 0)$，且拋物線開口向下"
      },
      {
        "key": "E",
        "text": "不等式 $-x^2 + 6x - 9 > 0$ 的解集為 $\\{3\\}$"
      },
      {
        "key": "F",
        "text": "不等式 $-x^2 + 6x - 9 < 0$ 的解集為 $\\{x \\in \\mathbb{R} \\mid x \\ne 3\\}$"
      },
      {
        "key": "G",
        "text": "二次函數 $y = -x^2 + 6x - 9$ 在區間 $(-\\infty, 3]$ 上單調遞減"
      },
      {
        "key": "H",
        "text": "原不等式 $-x^2 + 6x - 9 \\ge 0$ 的解集為區間 $[3, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "F"
    ],
    "explanation": "1. **變形與配方**: 兩端同乘 $-1$ 需翻轉不等號，化為 $x^2 - 6x + 9 \\le 0$。配方得 $(x - 3)^2 \\le 0$。A、B 正確。\n  2. **非負性與單點解**: 對任意實數 $x$，實數平方非負，即 $(x - 3)^2 \\ge 0$ 恆成立。因此 $(x - 3)^2 \\le 0$ 只能取等號，即 $x - 3 = 0 \\iff x = 3$。解集僅有唯一的單個實數 3，記作集合 $\\{3\\}$。C 正確，H 錯誤（誤將單點擴大為半無窮區間）。\n  3. **嚴格不等式辨析**:\n     - 若為嚴格大於 0：$-x^2 + 6x - 9 > 0 \\iff (x - 3)^2 < 0$，無解，解集為 $\\varnothing$。E 錯誤。\n     - 若為嚴格小於 0：$-x^2 + 6x - 9 < 0 \\iff (x - 3)^2 > 0$，只要 $x \\ne 3$ 均成立，解集為 $\\{x \\in \\mathbb{R} \\mid x \\ne 3\\}$。F 正確。\n  4. **幾何圖象與單調性**: 拋物線 $y = -(x - 3)^2$ 開口向下，對稱軸為 $x = 3$。在對稱軸左側 $(-\\infty, 3]$ 上，圖象隨 $x$ 增大而上升，為單調遞增；在 $[3, +\\infty)$ 上單調遞減。故 G 錯誤（將遞增誤判為遞減）。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；凡選入 E、G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q62",
    "q_num": 62,
    "topic": "一元二次不等式 · 恆成立與空集辨析矩陣",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 10 綜合練習",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "檢驗下列源自課本與課件的一元二次不等式，其「解集為全體實數集 $\\mathbb{R}$」或「解集為空集 $\\varnothing$」的判斷中，正確的有：",
    "diagram_spec": "多組二次拋物線與 $x$ 軸相對位置對比圖（$\\Delta < 0$ 開口向上高於 $x$ 軸 vs 開口向下低於 $x$ 軸）",
    "diagram_filename": "q06_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "不等式 $x^2 - 3x + 4 > 0$ 的判別式 $\\Delta = (-3)^2 - 4(1)(4) = -7 < 0$，其解集為 $\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "不等式 $-2x^2 + x - 3 > 0$ 等價於 $2x^2 - x + 3 < 0$，判別式 $\\Delta = 1 - 24 = -23 < 0$，其解集為 $\\varnothing$"
      },
      {
        "key": "C",
        "text": "不等式 $x^2 - x + \\frac{1}{4} < 0$ 即 $(x - \\frac{1}{2})^2 < 0$，其解集為 $\\varnothing$"
      },
      {
        "key": "D",
        "text": "不等式 $x^2 - x + \\frac{1}{4} \\le 0$ 的解集為 $\\varnothing$"
      },
      {
        "key": "E",
        "text": "不等式 $-x^2 + 4x - 4 < 0$ 等價於 $(x - 2)^2 > 0$，其解集為 $\\mathbb{R}$"
      },
      {
        "key": "F",
        "text": "不等式 $-x^2 + 4x - 4 \\le 0$ 等價於 $(x - 2)^2 \\ge 0$，其解集為 $\\mathbb{R}$"
      },
      {
        "key": "G",
        "text": "不等式 $3x^2 - 6x + 2 > 0$ 的解集為 $\\mathbb{R}$"
      },
      {
        "key": "H",
        "text": "不等式 $x^2 - 4x + 9 > 0$ 的解集為空集 $\\varnothing$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "F"
    ],
    "explanation": "1. **選項 A**: $x^2 - 3x + 4 = (x - \\frac{3}{2})^2 + \\frac{7}{4} > 0$ 恆成立，$\\Delta = -7 < 0, a > 0$，解集為 $\\mathbb{R}$。A 正確。\n  2. **選項 B**: $-2x^2 + x - 3 > 0 \\iff 2x^2 - x + 3 < 0$。對應拋物線開口向上，頂點縱坐標為正（$\\Delta = -23 < 0$），圖象全在 $x$ 軸上方，故無點小於 0，解集為 $\\varnothing$。B 正確。\n  3. **選項 C 與 D**: $x^2 - x + \\frac{1}{4} = (x - \\frac{1}{2})^2$。嚴格小於 0 無實數解，解集為 $\\varnothing$，C 正確。但當不等號為 $\\le 0$ 時，$x = \\frac{1}{2}$ 使得平方等於 0，解集為單點 $\\{\\frac{1}{2}\\}$ 而非空集，D 錯誤。\n  4. **選項 E 與 F**: $-x^2 + 4x - 4 < 0 \\iff x^2 - 4x + 4 > 0 \\iff (x - 2)^2 > 0$。當 $x = 2$ 時左式為 0 不滿足，解集為 $\\{x \\mid x \\ne 2\\} \\ne \\mathbb{R}$，E 錯誤。若帶等號 $(x - 2)^2 \\ge 0$，平方恆非負，解集為 $\\mathbb{R}$，F 正確。\n  5. **選項 G 與 H**:\n     - 對於 $3x^2 - 6x + 2 = 0$，$\\Delta = (-6)^2 - 4(3)(2) = 36 - 24 = 12 > 0$，有兩相異實根，解集為兩側開區間而非全集 $\\mathbb{R}$，G 錯誤。\n     - 對於 $x^2 - 4x + 9 = (x - 2)^2 + 5 > 0$ 恆成立，解集為 $\\mathbb{R}$ 而非空集，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選得相應比例分；選入 D、E、G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q63",
    "q_num": 63,
    "topic": "一元二次不等式 · 雙不等式集合運算與交集並集",
    "source": "Verbatim Archive: `F4CD一元二次不等式.pptx` Slide 12 綜合題",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "設集合 $M = \\{x \\in \\mathbb{R} \\mid 4x^2 - 4x - 15 > 0\\}$，集合 $N = \\{x \\in \\mathbb{R} \\mid x^2 - 5x - 6 > 0\\}$。下列集合運算結果與包含關係正確的有：",
    "diagram_spec": "雙層實數數軸區間重疊圖（標註 $-\\frac{3}{2}, -1, \\frac{5}{2}, 6$ 關鍵分割點）",
    "diagram_filename": "q07_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "方程 $4x^2 - 4x - 15 = 0$ 的兩根為 $x_1 = -\\frac{3}{2}, x_2 = \\frac{5}{2}$"
      },
      {
        "key": "B",
        "text": "集合 $M = (-\\infty, -\\frac{3}{2}) \\cup (\\frac{5}{2}, +\\infty)$"
      },
      {
        "key": "C",
        "text": "集合 $N = (-\\infty, -1) \\cup (6, +\\infty)$"
      },
      {
        "key": "D",
        "text": "集合交集 $M \\cap N = (-\\infty, -\\frac{3}{2}) \\cup (6, +\\infty)$"
      },
      {
        "key": "E",
        "text": "集合並集 $M \\cup N = (-\\infty, -1) \\cup (\\frac{5}{2}, +\\infty)$"
      },
      {
        "key": "F",
        "text": "實數 $0 \\in M \\cap N$"
      },
      {
        "key": "G",
        "text": "實數 $3 \\in M \\cap N$"
      },
      {
        "key": "H",
        "text": "集合補集 $\\complement_{\\mathbb{R}}M = [-\\frac{3}{2}, \\frac{5}{2}]$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "H"
    ],
    "explanation": "1. **集合 $M$ 的求解**: 方程 $4x^2 - 4x - 15 = (2x + 3)(2x - 5) = 0$ 解得根為 $x_1 = -\\frac{3}{2}, x_2 = \\frac{5}{2}$。由大於號取兩邊，解集 $M = (-\\infty, -\\frac{3}{2}) \\cup (\\frac{5}{2}, +\\infty)$。補集為閉區間 $[-\\frac{3}{2}, \\frac{5}{2}]$。A、B、H 正確。\n  2. **集合 $N$ 的求解**: 方程 $x^2 - 5x - 6 = (x - 6)(x + 1) = 0$ 解得根為 $x = -1, 6$。由大於號取兩邊，解集 $N = (-\\infty, -1) \\cup (6, +\\infty)$。C 正確。\n  3. **數軸交集與並集**:\n     - 在負半軸部分：$(-\\infty, -\\frac{3}{2})$ 與 $(-\\infty, -1)$ 取交集為較小者 $(-\\infty, -\\frac{3}{2})$；在正半軸部分：$(\\frac{5}{2}, +\\infty)$ 與 $(6, +\\infty)$ 取交集為較小者 $(6, +\\infty)$。故 $M \\cap N = (-\\infty, -\\frac{3}{2}) \\cup (6, +\\infty)$，D 正確。\n     - 取並集：負側覆蓋 $(-\\infty, -1)$，正側覆蓋 $(\\frac{5}{2}, +\\infty)$。故 $M \\cup N = (-\\infty, -1) \\cup (\\frac{5}{2}, +\\infty)$，E 正確。\n  4. **元素從屬反例**:\n     - 當 $x = 0$ 時，$4(0)^2 - 4(0) - 15 = -15 < 0$，故 $0 \\notin M$，更不可能屬於交集。F 錯誤。\n     - 當 $x = 3$ 時，$3 > 2.5 \\implies 3 \\in M$；但代入 $N$：$3^2 - 5(3) - 6 = 9 - 15 - 6 = -12 < 0 \\implies 3 \\notin N$。因此 $3 \\notin M \\cap N$。G 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 F、G 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q64",
    "q_num": 64,
    "topic": "二次函數 · 同一函數兩步判定法（定義域一票否決權）",
    "source": "Verbatim Archive: `1014@F4CD` 導學案教師版 例3 & Slide 11",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "下列各函數中，依據「同一函數兩步判定法」（第一步看定義域享有一票否決權，第二步定義域相同前提下化簡比對對應法則），與基準函數 $y = x$（定義域為 $\\mathbb{R}$）是「同一個函數」的判定及分析中，正確的有：",
    "diagram_spec": "多函數幾何圖象對比（直線 $y = x$ 全直線 vs 射線 $(\\sqrt{x})^2$ vs 折線 $\\sqrt{x^2}=|x|$ vs 挖去原點直線 $\\frac{x^2}{x}$）",
    "diagram_filename": "q08_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "函數 $y = (\\sqrt{x})^2$：因為其自變量要求 $x \\ge 0$，定義域為 $[0, +\\infty) \\ne \\mathbb{R}$，故與 $y = x$ 不是同一個函數"
      },
      {
        "key": "B",
        "text": "函數 $y = \\sqrt[3]{x^3}$：其定義域為 $\\mathbb{R}$，且對任意 $x \\in \\mathbb{R}$ 均有 $\\sqrt[3]{x^3} = x$，對應法則完全一致，故與 $y = x$ 是同一個函數"
      },
      {
        "key": "C",
        "text": "函數 $y = \\sqrt{x^2}$：雖然其定義域為 $\\mathbb{R}$，但 $\\sqrt{x^2} = |x|$，當 $x < 0$ 時對應值為 $-x \\ne x$，故與 $y = x$ 不是同一個函數"
      },
      {
        "key": "D",
        "text": "函數 $y = \\frac{x^2}{x}$：約分後解析式為 $y = x$，所以無論定義域為何，它都與 $y = x$ 是同一個函數"
      },
      {
        "key": "E",
        "text": "函數 $y = \\frac{x^2}{x}$：因要求分母 $x \\ne 0$，其定義域為 $\\{x \\in \\mathbb{R} \\mid x \\ne 0\\} \\ne \\mathbb{R}$，享有一票否決權，故與 $y = x$ 不是同一個函數"
      },
      {
        "key": "F",
        "text": "函數 $s = t$（$t \\in \\mathbb{R}$）：自變量與函數值採用了字母 $t$ 與 $s$，本質與自變量符號無關，定義域與法則完全相同，故與 $y = x$ 是同一個函數"
      },
      {
        "key": "G",
        "text": "函數 $y = \\sqrt{x} \\cdot \\sqrt{x}$：定義域為 $\\mathbb{R}$，故與 $y = x$ 是同一個函數"
      },
      {
        "key": "H",
        "text": "函數 $y = |x|$：在 $[0, +\\infty)$ 上與 $y = x$ 數值相等，故在全體實數上兩者為同一函數"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "E",
      "F"
    ],
    "explanation": "1. **同一函數核心判定準則**: 兩個函數為同一函數的充要條件是：① 定義域完全相同；② 對應法則完全一致。自變量與函數值的代表字母與函數本質無關。\n  2. **逐項深入剖析**:\n     - **A 選項**: $y = (\\sqrt{x})^2$，偶次根式要求被開方數 $x \\ge 0$，定義域為 $[0, +\\infty)$，與 $\\mathbb{R}$ 不同。第一步定義域直接否決。故 A 正確。\n     - **B 選項**: 奇次立方根對任意實數均有意義，定義域為 $\\mathbb{R}$，且 $\\sqrt[3]{x^3} \\equiv x$，兩步均符合。故 B 正確。\n     - **C 選項**: $\\sqrt{x^2} = |x|$，雖然定義域為 $\\mathbb{R}$，但在負半軸 $x < 0$ 時對應法則為 $y = -x \\ne x$，法則不一致。故 C 正確。\n     - **D 與 E 選項**: 初學者常犯「先盲目約分忽視定義域」的致命錯誤。$y = \\frac{x^2}{x}$ 分母不能為 0，其定義域為 $(-\\infty, 0) \\cup (0, +\\infty)$，在原點處無定義，圖象在 $(0, 0)$ 為空心孔。定義域不同享有一票否決權！故 D 錯誤，E 正確。\n     - **F 選項**: 函數本質是集合間的映射，$s = t$（$t \\in \\mathbb{R}$）與 $y = x$（$x \\in \\mathbb{R}$）本質完全同一。F 正確。\n     - **G 與 H 選項**: $y = \\sqrt{x}\\sqrt{x}$ 要求 $x \\ge 0$，定義域不是 $\\mathbb{R}$，G 錯誤；局部相等不能代表整體同一，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 D、G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q65",
    "q_num": 65,
    "topic": "二次函數 · 根式與分式雙重限制求解三部曲",
    "source": "Verbatim Archive: `4CSEN/@融合提升1013.docx` 練習3(1) & `1014@F4CD` 例2",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "求函數 $f(x) = \\frac{\\sqrt{x - 1}}{x - 3}$ 的定義域及其性質。下列敘述中正確的有：",
    "diagram_spec": "實數數軸區間圖（數軸上以 $1$ 為實心端點向右射線，並在 $x = 3$ 處挖去空心點）",
    "diagram_filename": "q09_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "自變量 $x$ 必須同時滿足偶次根式被開方數非負 $x - 1 \\ge 0$ 與分母非零 $x - 3 \\ne 0$"
      },
      {
        "key": "B",
        "text": "由 $x - 1 \\ge 0$ 解得 $x \\ge 1$，由 $x - 3 \\ne 0$ 解得 $x \\ne 3$"
      },
      {
        "key": "C",
        "text": "該函數的定義域用區間規範表示為 $[1, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "D",
        "text": "該函數的定義域用區間表示為 $[1, 3] \\cup [3, +\\infty)$"
      },
      {
        "key": "E",
        "text": "實數 $1$ 屬於該函數的定義域，且 $f(1) = 0$"
      },
      {
        "key": "F",
        "text": "實數 $3$ 屬於該函數的定義域，且 $f(3) = 0$"
      },
      {
        "key": "G",
        "text": "實數 $0$ 屬於該函數的定義域"
      },
      {
        "key": "H",
        "text": "函數圖象在 $x = 3$ 處無定義，在數軸上表示該點時必須用空心圈標註"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "E",
      "H"
    ],
    "explanation": "1. **求定義域解題三部曲**:\n     - 第一步（找限制）：分子為偶次根式，要求被開方數非負 $x - 1 \\ge 0$；分母在分式底端，要求分母非零 $x - 3 \\ne 0$。A、B 正確。\n     - 第二步（列不等式組並解不等式）：$\\begin{cases} x \\ge 1 \\\\ x \\ne 3 \\end{cases}$。\n     - 第三步（數軸畫圖取交集並規範書寫）：在數軸上以 $1$ 為起點向右畫射線，在 $3$ 處挖掉空心孔。用區間表示為 $[1, 3) \\cup (3, +\\infty)$。必須用並集符號 $\\cup$ 連接，且 3 兩側均為開區間小括號。故 C 正確，D 錯誤。\n  2. **點值驗證與圖象符號**:\n     - 代入 $x = 1$：$f(1) = \\frac{\\sqrt{1 - 1}}{1 - 3} = \\frac{0}{-2} = 0$，有意義，E 正確。\n     - 代入 $x = 3$：分母為 0，無意義，無定義，F 錯誤。\n     - 代入 $x = 0$：$0 < 1$，根號下為 $-1$ 在實數範圍內無意義，G 錯誤。\n     - 數軸規範要求在不包含的界限點 $x = 3$ 上畫空心圈，H 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 D、F、G 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q66",
    "q_num": 66,
    "topic": "二次函數 · 根式夾逼與雙重不等式組求解",
    "source": "Verbatim Archive: `4CSEN/@融合提升1013.docx` 練習3(2) (蔡清琰示範題)",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "已知函數 $f(x) = \\sqrt{2 - x} + \\frac{1}{\\sqrt{x + 1}}$。下列關於該函數定義域與函數值的命題中，正確的有：",
    "diagram_spec": "實數數軸區間圖（數軸上以 $-1$ 為空心點，$2$ 為實心點的半開半閉線段 $(-1, 2]$）",
    "diagram_filename": "q10_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "自變量 $x$ 滿足的不等式組為 $\\begin{cases} 2 - x \\ge 0 \\\\ x + 1 > 0 \\end{cases}$"
      },
      {
        "key": "B",
        "text": "分母中的偶次根式要求被開方數嚴格大於 0，即 $x + 1 > 0$ 而不能取等號"
      },
      {
        "key": "C",
        "text": "該函數的定義域為開區間 $(-1, 2)$"
      },
      {
        "key": "D",
        "text": "該函數的定義域用區間規範表示為左開右閉區間 $(-1, 2]$"
      },
      {
        "key": "E",
        "text": "實數 $2$ 屬於該函數的定義域，且 $f(2) = \\frac{\\sqrt{3}}{3}$"
      },
      {
        "key": "F",
        "text": "實數 $-1$ 屬於該函數的定義域"
      },
      {
        "key": "G",
        "text": "實數 $0$ 屬於該函數的定義域，且 $f(0) = \\sqrt{2} + 1$"
      },
      {
        "key": "H",
        "text": "該函數的定義域也可以表示為集合 $\\{x \\in \\mathbb{R} \\mid -1 \\le x \\le 2\\}$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "D",
      "E",
      "G"
    ],
    "explanation": "1. **限制條件建立與求解**:\n     - 項一 $\\sqrt{2 - x}$ 要求被開方數 $2 - x \\ge 0 \\iff x \\le 2$。\n     - 項二 $\\frac{1}{\\sqrt{x + 1}}$ 偶次根式在分母，分母既不能為 0 又需開方，故限制為嚴格大於零 $x + 1 > 0 \\iff x > -1$。故 A、B 正確。\n     - 取交集：$-1 < x \\le 2$。區間記法必須為左開右閉 $(-1, 2]$。故 D 正確，C 錯誤（右端點漏閉），H 錯誤（左端點誤閉）。\n  2. **特殊點代入計算**:\n     - 當 $x = 2$ 時：$f(2) = \\sqrt{2 - 2} + \\frac{1}{\\sqrt{2 + 1}} = 0 + \\frac{1}{\\sqrt{3}} = \\frac{\\sqrt{3}}{3}$。E 正確。\n     - 當 $x = -1$ 時：分母為 $\\sqrt{0} = 0$，無定義，故 $-1$ 不屬於定義域。F 錯誤。\n     - 當 $x = 0$ 時：$f(0) = \\sqrt{2 - 0} + \\frac{1}{\\sqrt{0 + 1}} = \\sqrt{2} + 1$。G 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 C、F、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q67",
    "q_num": 67,
    "topic": "二次函數 · 一次函數增減性依據定義作差證明",
    "source": "Verbatim Archive: `1021@F4CD.pptx` Slide 6 例1",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "設一次函數 $f(x) = kx + b$（$k, b \\in \\mathbb{R}$ 且 $k \\ne 0$），定義域為 $\\mathbb{R}$。下列依據函數單調性嚴格定義的推導及結論中，正確的有：",
    "diagram_spec": "直角坐標系幾何直線圖（$k > 0$ 斜率為正上升直線 vs $k < 0$ 斜率為負下降直線）",
    "diagram_filename": "q11_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "任取實數 $x_1, x_2 \\in \\mathbb{R}$ 且 $x_1 < x_2$，則作差可得 $f(x_1) - f(x_2) = k(x_1 - x_2)$"
      },
      {
        "key": "B",
        "text": "因為 $x_1 < x_2$，所以 $x_1 - x_2 < 0$ 恆成立"
      },
      {
        "key": "C",
        "text": "當 $k > 0$ 時，由 $x_1 - x_2 < 0$ 可得 $k(x_1 - x_2) < 0$，即 $f(x_1) < f(x_2)$，故 $f(x)$ 在 $\\mathbb{R}$ 上是單調遞增函數"
      },
      {
        "key": "D",
        "text": "當 $k < 0$ 時，由 $x_1 - x_2 < 0$ 可得 $k(x_1 - x_2) > 0$，即 $f(x_1) > f(x_2)$，故 $f(x)$ 在 $\\mathbb{R}$ 上是單調遞減函數"
      },
      {
        "key": "E",
        "text": "一次函數 $f(x) = kx + b$ 的單調性與常數項 $b$ 的正負密切相關"
      },
      {
        "key": "F",
        "text": "若函數 $f(x) = -3x + 2$，則在 $\\mathbb{R}$ 上任意取 $x_1 < x_2$，都有 $f(x_1) < f(x_2)$"
      },
      {
        "key": "G",
        "text": "若函數 $f(x) = 5x - 4$，則該函數在區間 $[0, 10]$ 上是增函數"
      },
      {
        "key": "H",
        "text": "一次函數 $f(x) = kx + b$（$k \\ne 0$）在其定義域 $\\mathbb{R}$ 上不可能存在極值點或拐點"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "G",
      "H"
    ],
    "explanation": "1. **定義法證明單調性四部曲（取值、作差、定號、下結論）**:\n     - 取值：設任意 $x_1 < x_2$，必有 $x_1 - x_2 < 0$。B 正確。\n     - 作差：$f(x_1) - f(x_2) = (kx_1 + b) - (kx_2 + b) = k(x_1 - x_2)$。A 正確。\n     - 定號：常數項 $b$ 完全抵消，說明單調性純粹由斜率 $k$ 決定，與 $b$ 無關，故 E 錯誤。\n       - 若 $k > 0$：正乘負得負，$f(x_1) - f(x_2) < 0 \\implies f(x_1) < f(x_2)$，為增函數。C 正確。\n       - 若 $k < 0$：負乘負得正，$f(x_1) - f(x_2) > 0 \\implies f(x_1) > f(x_2)$，為減函數。D 正確。\n  2. **具體函數檢驗**:\n     - 對於 $f(x) = -3x + 2$，$k = -3 < 0$，應有 $f(x_1) > f(x_2)$，為減函數，F 錯誤。\n     - 對於 $f(x) = 5x - 4$，$k = 5 > 0$，全體實數上增，在其子區間 $[0, 10]$ 上自然也是增函數，G 正確。\n     - 一次函數圖象為無限非水平直線，無局部最值點或極值點，H 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 E、F 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q68",
    "q_num": 68,
    "topic": "二次函數 · 耐克函數（對勾函數）定義法深入證明",
    "source": "Verbatim Archive: `1021@F4CD.pptx` Slide 8 例3",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "關於耐克函數（對勾函數）$f(x) = x + \\frac{1}{x}$ 在各區間上的單調性與極值，依據單調性定義 $f(x_1) - f(x_2) = (x_1 - x_2)(1 - \\frac{1}{x_1 x_2})$，下列論述正確的有：",
    "diagram_spec": "耐克函數圖象（坐標系中雙曲形態，標註第 I 象限最低點 $(1, 2)$ 與第 III 象限最高點 $(-1, -2)$）",
    "diagram_filename": "q12_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "該函數的定義域為 $(-\\infty, 0) \\cup (0, +\\infty)$"
      },
      {
        "key": "B",
        "text": "函數 $f(x) = x + \\frac{1}{x}$ 是奇函數，其圖象關於坐標原點對稱"
      },
      {
        "key": "C",
        "text": "函數 $f(x)$ 在區間 $(1, +\\infty)$ 上是單調遞增函數"
      },
      {
        "key": "D",
        "text": "函數 $f(x)$ 在區間 $(0, 1]$ 上是單調遞減函數"
      },
      {
        "key": "E",
        "text": "函數 $f(x)$ 在區間 $(-\\infty, -1]$ 上是單調遞增函數，在 $[-1, 0)$ 上是單調遞減函數"
      },
      {
        "key": "F",
        "text": "函數 $f(x)$ 在其整個定義域 $(-\\infty, 0) \\cup (0, +\\infty)$ 上是單調遞增函數"
      },
      {
        "key": "G",
        "text": "當 $x > 0$ 時，$f(x)$ 在 $x = 1$ 處取得最小值 $2$"
      },
      {
        "key": "H",
        "text": "當 $x < 0$ 時，$f(x)$ 在 $x = -1$ 處取得最小值 $-2$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "G"
    ],
    "explanation": "1. **定義域與奇偶性**: 分母 $x \\ne 0$，定義域為 $(-\\infty, 0) \\cup (0, +\\infty)$，關於原點對稱。$f(-x) = -x - \\frac{1}{x} = -f(x)$，為奇函數，圖象中心對稱。A、B 正確。\n  2. **定義法作差證明單調性**:\n     - 任取 $0 < x_1 < x_2$：$f(x_1) - f(x_2) = (x_1 - x_2) + (\\frac{1}{x_1} - \\frac{1}{x_2}) = (x_1 - x_2)(1 - \\frac{1}{x_1 x_2}) = \\frac{(x_1 - x_2)(x_1 x_2 - 1)}{x_1 x_2}$。\n     - 若 $x_1, x_2 \\in (1, +\\infty)$，則 $x_1 - x_2 < 0, x_1 x_2 > 1 \\implies x_1 x_2 - 1 > 0$。分子負乘正為負，差值小於 0，故在 $(1, +\\infty)$ 上單調遞增。C 正確。\n     - 若 $x_1, x_2 \\in (0, 1]$，則 $x_1 x_2 < 1 \\implies x_1 x_2 - 1 < 0$。負乘負為正，差值大於 0，故在 $(0, 1]$ 上單調遞減。D 正確。\n     - 依據奇函數圖象對稱性，在負半軸對應區間單調性相同：在 $(-\\infty, -1]$ 上單調遞增，在 $[-1, 0)$ 上單調遞減。E 正確。\n  3. **定義域全局單調性與最值辨析**:\n     - 函數在不連續的分離區間上不能直接跨區間判定單調性。例如 $x = -1$ 時 $f(-1) = -2$，$x = 0.5$ 時 $f(0.5) = 2.5$，而 $x = 1$ 時 $f(1) = 2 < 2.5$，並非全體遞增。F 錯誤。\n     - 對於 $x > 0$，由基本不等式 $x + \\frac{1}{x} \\ge 2\\sqrt{x \\cdot \\frac{1}{x}} = 2$，等號在 $x = 1$ 時成立，故最小值為 2。G 正確。\n     - 對於 $x < 0$，$f(x) = -((-x) + \\frac{1}{-x}) \\le -2$，等號在 $x = -1$ 時成立，此時 $f(-1) = -2$ 是負半軸上的**最大值**而非最小值。H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 F、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q69",
    "q_num": 69,
    "topic": "二次函數 · 閉區間上反比例函數嚴格單調減與端點極值",
    "source": "Verbatim Archive: `1021@F4CD.pptx` Slide 11 例5 & `1020@4CD.pptx`",
    "difficulty": "Verbatim Archive",
    "isVerbatimArchive": true,
    "stem": "已知反比例函數 $f(x) = \\frac{4}{x}$，將其定義域限制在閉區間 $[2, 6]$ 上。下列關於其單調性與最值的分析正確的有：",
    "diagram_spec": "反比例截段曲線圖（直角坐標系中 $f(x) = \\frac{4}{x}$ 限制在 $[2, 6]$ 上的下降弧段，標註端點 $(2, 2)$ 與 $(6, \\frac{2}{3})$）",
    "diagram_filename": "q13_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "對任意 $x_1, x_2 \\in [2, 6]$ 且 $x_1 < x_2$，作差得 $f(x_1) - f(x_2) = \\frac{4(x_2 - x_1)}{x_1 x_2} > 0$"
      },
      {
        "key": "B",
        "text": "函數 $f(x) = \\frac{4}{x}$ 在閉區間 $[2, 6]$ 上是嚴格單調遞減函數"
      },
      {
        "key": "C",
        "text": "函數在左端點 $x = 2$ 處取得最大值，最大值為 $f(2) = 2$"
      },
      {
        "key": "D",
        "text": "函數在右端點 $x = 6$ 處取得最小值，最小值為 $f(6) = \\frac{2}{3}$"
      },
      {
        "key": "E",
        "text": "函數在區間 $[2, 6]$ 上的值域為 $[\\frac{2}{3}, 2]$"
      },
      {
        "key": "F",
        "text": "函數在 $x = 4$ 處取得極大值 $1$"
      },
      {
        "key": "G",
        "text": "若將區間改為 $[-6, -2]$，則該函數在 $[-6, -2]$ 上也是單調遞減的"
      },
      {
        "key": "H",
        "text": "函數 $f(x) = \\frac{4}{x}$ 在集合 $[-6, -2] \\cup [2, 6]$ 上單調遞減"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "G"
    ],
    "explanation": "1. **作差法證明單調減**:\n     - 任取 $2 \\le x_1 < x_2 \\le 6$：$f(x_1) - f(x_2) = \\frac{4}{x_1} - \\frac{4}{x_2} = \\frac{4(x_2 - x_1)}{x_1 x_2}$。\n     - 因為 $x_2 > x_1 \\implies x_2 - x_1 > 0$；且 $x_1, x_2 \\ge 2 > 0 \\implies x_1 x_2 > 0$。\n     - 因此差值恆大於 0，即 $f(x_1) > f(x_2)$，函數在 $[2, 6]$ 上嚴格單調遞減。A、B 正確。\n  2. **端點最值與值域**:\n     - 減函數的性質：左端點取得最大值 $f(2) = \\frac{4}{2} = 2$；右端點取得最小值 $f(6) = \\frac{4}{6} = \\frac{2}{3}$。C、D 正確。\n     - 函數的值域即為最值區間 $[\\frac{2}{3}, 2]$。E 正確。\n     - 閉區間嚴格單調函數內部不可能存在局部極大值點，$f(4) = 1$ 僅是中間普通點值。F 錯誤。\n  3. **負半軸區間與全局單調性辨析**:\n     - 在 $[-6, -2]$ 上，任意負數作差同樣分子為正分母為正，仍是單調遞減的。G 正確。\n     - 但是在兩區間並集 $[-6, -2] \\cup [2, 6]$ 上，例如取 $x_1 = -2 \\in [-6, -2], x_2 = 2 \\in [2, 6]$，此時 $x_1 < x_2$，但 $f(-2) = -2 < f(2) = 2$，不滿足遞減定義！單調區間不能直接用並集符號合併。H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 F、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q70",
    "q_num": 70,
    "topic": "一元二次不等式 · 深度綜合辨析",
    "source": "Synthesis Hard: 參數分類討論與二次不等式根的位置關係",
    "difficulty": "Synthesis Hard",
    "isVerbatimArchive": false,
    "stem": "設實數 $a \\in \\mathbb{R}$，關於未知數 $x$ 的一元二次不等式 $(x - a)(x - a^2) < 0$ 的解集隨參數 $a$ 的變化而動態改變。下列關於該不等式解集與參數分類討論的論斷中，正確的有：",
    "diagram_spec": "參數分類動態拋物線圖（展示 $a < 0, 0 < a < 1, a > 1$ 三種情境下兩根 $a$ 與 $a^2$ 的相對大小與解區間）",
    "diagram_filename": "q14_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "對應二次方程 $(x - a)(x - a^2) = 0$ 的兩個實數根分別為 $x_1 = a$ 與 $x_2 = a^2$"
      },
      {
        "key": "B",
        "text": "兩根作差比較得 $a^2 - a = a(a - 1)$，其正負取決於臨界點 $a = 0$ 與 $a = 1$"
      },
      {
        "key": "C",
        "text": "當 $a > 1$ 或 $a < 0$ 時，有 $a < a^2$，此時不等式的解集為開區間 $(a, a^2)$"
      },
      {
        "key": "D",
        "text": "當 $0 < a < 1$ 時，有 $a^2 < a$，此時不等式的解集為開區間 $(a^2, a)$"
      },
      {
        "key": "E",
        "text": "當 $a = 0$ 或 $a = 1$ 時，兩根相等，原不等式化為完全平方小於 0，解集為空集 $\\varnothing$"
      },
      {
        "key": "F",
        "text": "當 $a = -2$ 時，原不等式具體化為 $(x + 2)(x - 4) < 0$，其解集為 $(-2, 4)$"
      },
      {
        "key": "G",
        "text": "當 $a = \\frac{1}{2}$ 時，不等式的解集為開區間 $(\\frac{1}{2}, \\frac{1}{4})$"
      },
      {
        "key": "H",
        "text": "對任意實數 $a$，該不等式的解集長度恆大於 0"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ],
    "explanation": "1. **方程根與分類討論的本質**:\n     - 方程 $(x - a)(x - a^2) = 0$ 的根為 $x_1 = a, x_2 = a^2$。A 正確。\n     - 二次項係數為 1（展開為 $x^2 - (a + a^2)x + a^3 < 0$），開口向上，小於號取兩根之間。核心在於判斷兩根 $a$ 與 $a^2$ 誰大誰小。\n     - 作差法：$a^2 - a = a(a - 1)$。臨界點為 $a = 0$ 和 $a = 1$。B 正確。\n  2. **三種參數情形分類討論**:\n     - **情形一**: 當 $a(a - 1) > 0$，即 $a > 1$ 或 $a < 0$ 時，$a^2 > a$。較小根為 $a$，較大根為 $a^2$。解集為 $(a, a^2)$。C 正確。\n       - 例如 $a = -2$ 屬於此類，$a = -2, a^2 = 4$，不等式為 $(x + 2)(x - 4) < 0$，解集為 $(-2, 4)$。F 正確。\n     - **情形二**: 當 $a(a - 1) < 0$，即 $0 < a < 1$ 時，$a^2 < a$。較小根為 $a^2$，較大根為 $a$。解集為 $(a^2, a)$。D 正確。\n       - 例如 $a = \\frac{1}{2}$ 時，$a^2 = \\frac{1}{4} < \\frac{1}{2}$，解集應為 $(\\frac{1}{4}, \\frac{1}{2})$，而 G 選項將小數寫在左端點，違反區間「左小右大」規範，G 錯誤。\n     - **情形三**: 當 $a = 0$ 時，不等式為 $x^2 < 0$，無解；當 $a = 1$ 時，不等式為 $(x - 1)^2 < 0$，無解。解集均為 $\\varnothing$。E 正確。\n  3. **邊界與綜合性質**:\n     - 當 $a = 0$ 或 $a = 1$ 時解集為空集，長度為 0，並非恆大於 0，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q71",
    "q_num": 71,
    "topic": "一元二次不等式 · 深度綜合辨析",
    "source": "Synthesis Hard: 閉區間恆成立與拋物線動態對稱軸",
    "difficulty": "Synthesis Hard",
    "isVerbatimArchive": false,
    "stem": "若一元二次不等式 $x^2 - 2ax + a + 2 > 0$ 對於任意 $x \\in [1, 3]$ 恆成立，設二次函數 $g(x) = x^2 - 2ax + a + 2$，其對稱軸為直線 $x = a$。下列關於實數 $a$ 的取值範圍及推導過程正確的有：",
    "diagram_spec": "動態對稱軸拋物線族圖（對稱軸 $x=a$ 位於區間 $[1, 3]$ 左側、內部、右側三種走勢圖）",
    "diagram_filename": "q15_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "拋物線 $g(x)$ 的圖象開口向上，對稱軸為直線 $x = a$"
      },
      {
        "key": "B",
        "text": "若對稱軸在區間左側，即 $a < 1$，則 $g(x)$ 在 $[1, 3]$ 上單調遞增，只需 $g(1) > 0 \\implies 1 - 2a + a + 2 > 0 \\implies a < 3$，故此時 $a < 1$ 恆成立"
      },
      {
        "key": "C",
        "text": "若對稱軸在區間內部，即 $1 \\le a \\le 3$，則 $g(x)$ 的最小值為頂點值 $g(a) = -a^2 + a + 2 > 0 \\implies a^2 - a - 2 < 0 \\implies -1 < a < 2$，綜合此時得 $1 \\le a < 2$"
      },
      {
        "key": "D",
        "text": "若對稱軸在區間右側，即 $a > 3$，則 $g(x)$ 在 $[1, 3]$ 上單調遞減，只需 $g(3) > 0 \\implies 9 - 6a + a + 2 > 0 \\implies 5a < 11 \\implies a < \\frac{11}{5}$，與 $a > 3$ 矛盾，此時無解"
      },
      {
        "key": "E",
        "text": "綜合上述三種情況，使該不等式在 $[1, 3]$ 上恆成立的實數 $a$ 的取值範圍是 $(-\\infty, 2)$"
      },
      {
        "key": "F",
        "text": "若 $a = 2$，則在 $x = 2$ 處 $g(2) = 4 - 8 + 2 + 2 = 0 \\ngtr 0$，故 $a = 2$ 不滿足條件"
      },
      {
        "key": "G",
        "text": "實數 $a$ 可以取 $2.5$"
      },
      {
        "key": "H",
        "text": "該不等式在 $[1, 3]$ 上恆成立的充要條件是判別式 $\\Delta < 0$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ],
    "explanation": "1. **函數最值法轉化**: 要使 $g(x) > 0$ 對任意 $x \\in [1, 3]$ 恆成立，充要條件是 $g(x)$ 在 $[1, 3]$ 上的最小值 $g_{\\min} > 0$。開口向上，頂點 $x = a$。A 正確。\n  2. **三大類對稱軸位置嚴格討論**:\n     - **類別 1（軸在左側 $a < 1$）**: 頂點在區間左側，函數在 $[1, 3]$ 上單調遞增，最小值在左端點 $x = 1$ 處取得。$g_{\\min} = g(1) = 1^2 - 2a(1) + a + 2 = 3 - a > 0 \\implies a < 3$。與 $a < 1$ 取交集，得 $a < 1$。B 正確。\n     - **類別 2（軸在內部 $1 \\le a \\le 3$）**: 頂點在區間內部，最小值在頂點 $x = a$ 處取得。$g_{\\min} = g(a) = a^2 - 2a^2 + a + 2 = -a^2 + a + 2 > 0 \\iff a^2 - a - 2 < 0 \\iff (a - 2)(a + 1) < 0 \\implies -1 < a < 2$。與 $1 \\le a \\le 3$ 取交集，得 $1 \\le a < 2$。C 正確。\n     - **類別 3（軸在右側 $a > 3$）**: 頂點在區間右側，函數在 $[1, 3]$ 上單調遞減，最小值在右端點 $x = 3$ 處取得。$g_{\\min} = g(3) = 9 - 6a + a + 2 = 11 - 5a > 0 \\implies a < \\frac{11}{5} = 2.2$。與 $a > 3$ 取交集為空集，此類別無解。D 正確。\n  3. **綜合求並集**: 將三類情況取並集：$(-\\infty, 1) \\cup [1, 2) = (-\\infty, 2)$。E 正確。\n  4. **臨界與易錯選項辨析**:\n     - 代入 $a = 2$：在 $x = 2 \\in [1, 3]$ 處，$g(2) = 0$ 不滿足 $> 0$，F 正確。\n     - $a = 2.5 > 2$，不在範圍內，G 錯誤。\n     - 本題是區間恆成立，只要在區間內部大於 0 即可，拋物線頂點在區間外時允許 $\\Delta \\ge 0$，故 $\\Delta < 0$ 只是充分非必要條件，不是充要條件，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q72",
    "q_num": 72,
    "topic": "一元二次不等式 · 深度綜合辨析",
    "source": "Synthesis Hard: 抽象複合函數映射機制與二次根式約束",
    "difficulty": "Synthesis Hard",
    "isVerbatimArchive": false,
    "stem": "已知函數 $f(t)$ 的定義域為閉區間 $[-1, 3]$。現構建新函數 $g(x) = \\frac{f(2x - 1)}{\\sqrt{4 - x^2}}$。下列關於函數 $g(x)$ 的定義域、限制條件與解集的敘述中，正確的有：",
    "diagram_spec": "複合映射定義域區間數軸圖（展示內層自變量映射到外層區間 $[-1, 3]$ 的數軸變換與 $(-2, 2)$ 根式交集）",
    "diagram_filename": "q16_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "外層函數 $f(t)$ 要求內層自變量滿足 $-1 \\le 2x - 1 \\le 3$"
      },
      {
        "key": "B",
        "text": "解不等式 $-1 \\le 2x - 1 \\le 3$ 可得 $0 \\le 2x \\le 4$，即 $0 \\le x \\le 2$"
      },
      {
        "key": "C",
        "text": "分母偶次根式要求被開方數嚴格大於 0，即 $4 - x^2 > 0$"
      },
      {
        "key": "D",
        "text": "解不等式 $4 - x^2 > 0$ 可得 $-2 < x < 2$"
      },
      {
        "key": "E",
        "text": "聯立上述兩條件，取交集 $[0, 2] \\cap (-2, 2)$，得到函數 $g(x)$ 的定義域為 $[0, 2)$"
      },
      {
        "key": "F",
        "text": "實數 $2$ 屬於函數 $g(x)$ 的定義域"
      },
      {
        "key": "G",
        "text": "實數 $0$ 屬於函數 $g(x)$ 的定義域，且若 $f(-1) = 4$，則 $g(0) = 2$"
      },
      {
        "key": "H",
        "text": "函數 $g(x)$ 的定義域用集合描述法表示為 $\\{x \\in \\mathbb{R} \\mid -2 < x \\le 2\\}$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "G"
    ],
    "explanation": "1. **複合函數定義域傳遞法則**:\n     - 函數 $f(t)$ 的定義域指括號內整體 $t$ 的取值範圍。對於 $f(2x - 1)$，必須滿足 $-1 \\le 2x - 1 \\le 3$。\n     - 各邊加 1：$0 \\le 2x \\le 4$；同除以 2：$0 \\le x \\le 2$，即 $x \\in [0, 2]$。A、B 正確。\n  2. **分式根號限制求解**:\n     - 分母 $\\sqrt{4 - x^2}$，偶次根式在分母，限制條件為 $4 - x^2 > 0 \\iff x^2 < 4 \\iff -2 < x < 2$。C、D 正確。\n  3. **數軸交集與端點判定**:\n     - 函數 $g(x)$ 的自變量 $x$ 必須同時滿足上述兩條件，取交集：$[0, 2] \\cap (-2, 2) = [0, 2)$。\n     - 注意：左端點 $x = 0$ 滿足兩者，取閉區間方括號；右端點 $x = 2$ 使得分母為 0，必須排除，取開區間圓括號。故 E 正確，H 錯誤。\n     - $x = 2$ 使得分母 $\\sqrt{4 - 4} = 0$ 無意義，故 $2$ 不屬於定義域，F 錯誤。\n     - 當 $x = 0$ 時，$g(0) = \\frac{f(2(0) - 1)}{\\sqrt{4 - 0}} = \\frac{f(-1)}{2} = \\frac{4}{2} = 2$，G 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 F、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q73",
    "q_num": 73,
    "topic": "二次函數 · 頂點對稱軸與閉區間最值綜合分析",
    "source": "4CD 課堂練習：二次函數綜合性質與最值",
    "difficulty": "Synthesis Hard",
    "isVerbatimArchive": false,
    "stem": "已知二次函數 $f(x) = x^2 - 4x + 3$，分析其圖象開口、頂點坐標、對稱軸、與坐標軸交點及在閉區間 $[0, 5]$ 上的性質，下列說法正確的有：",
    "diagram_spec": "分段對接單調曲線圖（$x < 2$ 射線對接 $x \\ge 2$ 拋物線，標註 $a \\le \\frac{4}{3}$ 臨界接合點以保證全局單調增）",
    "diagram_filename": "q17_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "拋物線開口向上，因為二次項係數 $a = 1 > 0$"
      },
      {
        "key": "B",
        "text": "拋物線的對稱軸方程為直線 $x = 2$"
      },
      {
        "key": "C",
        "text": "拋物線的頂點坐標為 $(2, -1)$"
      },
      {
        "key": "D",
        "text": "函數在 $\\mathbb{R}$ 上的最小值為 $-1$"
      },
      {
        "key": "E",
        "text": "圖象與 $y$ 軸的交點坐標為 $(0, 3)$"
      },
      {
        "key": "F",
        "text": "圖象與 $x$ 軸的交點坐標為 $(1, 0)$ 和 $(3, 0)$"
      },
      {
        "key": "G",
        "text": "當 $x \\in [0, 5]$ 時，函數的最大值為 $f(5) = 8$"
      },
      {
        "key": "H",
        "text": "函數在區間 $(-\\infty, 2]$ 上單調遞減，在 $[2, +\\infty)$ 上單調遞增"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H"
    ],
    "explanation": "解析：\\n1. 開口方向：二次項係數 a = 1 > 0，拋物線開口向上，A 正確。\\n2. 對稱軸：x = -b/(2a) = -(-4)/2 = 2，B 正確。\\n3. 配方求頂點：f(x) = (x - 2)^2 - 1，頂點為 (2, -1)，C 正確。\\n4. 最小值：因為 a > 0，在頂點處取得最小值 f(2) = -1，D 正確。\\n5. 與 y 軸交點：令 x = 0，得 y = 3，交點為 (0, 3)，E 正確。\\n6. 與 x 軸交點：令 x^2 - 4x + 3 = 0，解得 x = 1 或 x = 3，交點為 (1, 0) 和 (3, 0)，F 正確。\\n7. 區間 [0, 5] 最值：對稱軸 x = 2 在區間內，離對稱軸最遠的端點為 x = 5，f(5) = 25 - 20 + 3 = 8，最大值為 8，G 正確。\\n8. 單調性：拋物線開口向上，對稱軸 x = 2，因此在 (-∞, 2] 上單調遞減，在 [2, +∞) 上單調遞增，H 正確。\\n綜上，全部選項 A, B, C, D, E, F, G, H 均正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 G、H 任何一項者得 0 分。",
    "answer": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H"
    ]
  },
  {
    "id": "4CD_1023_Q74",
    "q_num": 74,
    "topic": "一元二次不等式 · 深度綜合辨析",
    "source": "Synthesis Hard: 差商大於0與抽象單調複合不等式",
    "difficulty": "Synthesis Hard",
    "isVerbatimArchive": false,
    "stem": "設定義在 $\\mathbb{R}$ 上的函數 $f(x)$ 滿足：對任意不相等的實數 $x_1, x_2 \\in \\mathbb{R}$，均有 $\\frac{f(x_1) - f(x_2)}{x_1 - x_2} > 0$。設新函數 $g(x) = f(x^2 - 2x) - f(x + 4)$。下列關於函數性質與不等式 $g(x) < 0$ 的論述中，正確的有：",
    "diagram_spec": "抽象單調曲線與二次拋物線映射圖（差商符號轉化為自變量大小關係，對應 $x^2 - 3x - 4 < 0$ 開口向上拋物線）",
    "diagram_filename": "q18_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "條件 $\\frac{f(x_1) - f(x_2)}{x_1 - x_2} > 0$ 說明函數 $f(x)$ 在 $\\mathbb{R}$ 上是嚴格單調遞增函數"
      },
      {
        "key": "B",
        "text": "不等式 $g(x) < 0$ 等價於 $f(x^2 - 2x) < f(x + 4)$"
      },
      {
        "key": "C",
        "text": "依據單調遞增性質，不等式 $f(x^2 - 2x) < f(x + 4)$ 充要等價於自變量不等式 $x^2 - 2x < x + 4$"
      },
      {
        "key": "D",
        "text": "整理不等式得 $x^2 - 3x - 4 < 0$"
      },
      {
        "key": "E",
        "text": "二次方程 $x^2 - 3x - 4 = 0$ 的兩根分別為 $x_1 = -1$ 與 $x_2 = 4$"
      },
      {
        "key": "F",
        "text": "不等式 $g(x) < 0$ 的解集用區間表示為開區間 $(-1, 4)$"
      },
      {
        "key": "G",
        "text": "實數 $0$ 是不等式 $g(x) < 0$ 的一個解"
      },
      {
        "key": "H",
        "text": "不等式 $g(x) \\ge 0$ 的解集為閉區間 $[-1, 4]$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **差商條件與單調性脫殼**:\n     - 條件 $\\frac{f(x_1) - f(x_2)}{x_1 - x_2} > 0$ 是函數嚴格單調遞增的典型等價形式（分子與分母同號：若 $x_1 < x_2$，則 $f(x_1) < f(x_2)$）。A 正確。\n     - 由 $g(x) < 0 \\iff f(x^2 - 2x) < f(x + 4)$。B 正確。\n     - 因為 $f(x)$ 在 $\\mathbb{R}$ 上嚴格單調遞增，函數值的大小關係與自變量的大小關係互為充要條件，故可直接「脫去函數符號 $f$」：$x^2 - 2x < x + 4$。C 正確。\n  2. **一元二次不等式求解**:\n     - 移項整理得：$x^2 - 3x - 4 < 0$。D 正確。\n     - 因式分解：$(x - 4)(x + 1) < 0$，兩根為 $x = -1, 4$。E 正確。\n     - 開口向上，小於號取兩根之間，解集為 $(-1, 4)$。F 正確。\n  3. **元素驗證與反向不等式**:\n     - 當 $x = 0$ 時，$0 \\in (-1, 4)$，$g(0) = f(0) - f(4) < 0$，故 0 是其解。G 正確。\n     - 對於 $g(x) \\ge 0 \\iff x^2 - 3x - 4 \\ge 0$，大於等於號取兩邊，解集為 $(-\\infty, -1] \\cup [4, +\\infty)$，H 選項誤記為中間閉區間，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q75",
    "q_num": 75,
    "topic": "澳門情境 · 澳門旅遊塔（Macau Tower）高空蹦極跳極致安全高度模型",
    "source": "Macau Context: 澳門旅遊塔蹦極跳二次位移與不等式安全窗口",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "澳門旅遊塔（Macau Tower）總高 338 米，主觀光層蹦極跳（Bungy Jump）平台高 233 米。遊客體驗蹦極下落時，在緩衝主繩完全拉直前的自由落體階段，體驗者對地高度 $h(t)$（單位：米）與下落時間 $t$（單位：秒）滿足二次函數模型：$h(t) = 233 - 5t^2$（$t \\ge 0$）。國際邊界運動安全規範規定，在離地高度不低於 53 米處必須完成主繩張力釋放與制動對接（即安全高度要求 $h(t) \\ge 53$）。下列關於該運動模型與不等式求解的敘述中，正確的有：",
    "diagram_spec": "自由下落二次拋物線高度-時間圖（開口向下拋物線 $h(t) = 233 - 5t^2$，水平安全基準線 $h = 53$，標註安全時間窗口 $[0, 6]$）",
    "diagram_filename": "q19_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "起跳瞬間 $t = 0$ 秒時，對地高度為 $h(0) = 233$ 米"
      },
      {
        "key": "B",
        "text": "安全高度要求對應的一元二次不等式為 $233 - 5t^2 \\ge 53$"
      },
      {
        "key": "C",
        "text": "不等式 $233 - 5t^2 \\ge 53$ 整理可得 $5t^2 \\le 180 \\iff t^2 \\le 36$"
      },
      {
        "key": "D",
        "text": "結合實際時間非負條件 $t \\ge 0$，該安全下落時間範圍為 $[0, 6]$ 秒"
      },
      {
        "key": "E",
        "text": "函數 $h(t) = 233 - 5t^2$ 在時間區間 $[0, 6]$ 上是單調遞減函數"
      },
      {
        "key": "F",
        "text": "當下落時間 $t = 4$ 秒時，體驗者的對地高度為 $153$ 米"
      },
      {
        "key": "G",
        "text": "若下落持續到第 7 秒，對地高度將低於 0 米（發生觸地）"
      },
      {
        "key": "H",
        "text": "安全時間區間如果用不等式表示為 $-6 \\le t \\le 6$"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F"
    ],
    "explanation": "1. **物理情境與函數解析式**:\n     - 起跳初始高度：$t = 0$ 代入得 $h(0) = 233 - 5(0)^2 = 233$ 米，正好是澳門旅遊塔蹦極起跳台海拔高度。A 正確。\n     - 安全高度要求離地高度 $h(t) \\ge 53$ 米，直接列不等式 $233 - 5t^2 \\ge 53$。B 正確。\n  2. **一元二次不等式求解與時間約束**:\n     - 移項整理：$5t^2 \\le 233 - 53 = 180 \\iff t^2 \\le 36$。C 正確。\n     - 純代數求解 $t^2 \\le 36$ 得 $-6 \\le t \\le 6$。\n     - 但在實際物理世界中，下落時間 $t$ 具有時間起點的單向性，即 $t \\ge 0$。因此時間有效範圍為 $0 \\le t \\le 6$，即閉區間 $[0, 6]$ 秒。D 正確，H 錯誤（忽視了物理時間非負的實際約束）。\n  3. **單調性與點位驗證**:\n     - 函數 $h(t) = -5t^2 + 233$ 對稱軸為 $t = 0$，開口向下，所以在 $t \\ge 0$ 上單調遞減，說明隨著時間推移高度持續下降。E 正確。\n     - 代入 $t = 4$：$h(4) = 233 - 5(4)^2 = 233 - 80 = 153$ 米，F 正確。\n     - 若代入 $t = 7$：$h(7) = 233 - 5(49) = 233 - 245 = -12$ 米，但自由落體模型在緩衝繩拉直（$t = 6$ 秒）後即轉為阻尼減速階段，該自由落體二次模型在 $t > 6$ 時已不再適用，不會出現無保護觸地，G 錯誤（盲目外推模型失效區間）。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 G、H 任何一項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q76",
    "q_num": 76,
    "topic": "澳門情境 · 澳門格蘭披治大賽車東望洋賽道葡京彎制動模型",
    "source": "Macau Context: 東望洋跑道葡京彎賽車減速二次位移與制動不等式",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "澳門東望洋跑道（Guia Circuit）以狹窄、多彎和高速直道著稱。在著名的「葡京彎」（Lisboa Bend）前，賽車以高速進入減速緩衝區並全力制動。自踩下剎車起，賽車在 $t$ 秒內的滑行距離 $s(t)$（單位：米）滿足二次函數：$s(t) = 60t - 5t^2$。當賽車完全停止（即速度降為 0，此時 $t = 6$ 秒）後不再後退。為避免衝出賽道撞擊護欄，滑行距離不得超過 160 米（即要求 $s(t) \\le 160$）。下列論述中，正確的有：",
    "diagram_spec": "制動滑行二次曲線頂點圖（開口向下拋物線 $s(t) = 60t - 5t^2$，最高點 $(6, 180)$，安全警戒水平線 $s = 160$）",
    "diagram_filename": "q20_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "賽車在滑行階段的有效時間區間為 $[0, 6]$ 秒"
      },
      {
        "key": "B",
        "text": "函數 $s(t) = -5t^2 + 60t = -5(t - 6)^2 + 180$，在 $[0, 6]$ 上單調遞增"
      },
      {
        "key": "C",
        "text": "賽車從制動到完全停止的最大滑行距離為 $180$ 米"
      },
      {
        "key": "D",
        "text": "解不等式 $60t - 5t^2 \\le 160$ 等價於 $t^2 - 12t + 32 \\ge 0$"
      },
      {
        "key": "E",
        "text": "方程 $t^2 - 12t + 32 = 0$ 的兩根分別為 $t_1 = 4$ 與 $t_2 = 8$"
      },
      {
        "key": "F",
        "text": "在制動有效時間 $[0, 6]$ 秒內，滿足滑行距離不超過 160 米的安全時間區間為 $[0, 4]$ 秒"
      },
      {
        "key": "G",
        "text": "在 $t = 4$ 秒時，賽車的滑行距離恰好為 160 米"
      },
      {
        "key": "H",
        "text": "若賽車制動時間達到 5 秒，其滑行距離仍小於 160 米"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **物理模型與頂點特徵**:\n     - 賽車制動位移 $s(t) = -5t^2 + 60t = -5(t - 6)^2 + 180$。\n     - 對稱軸為 $t = 6$ 秒，此時位移達到最大值 180 米，賽車完全停止。滑行階段的有效物理時間為 $[0, 6]$ 秒。A、B、C 正確。\n  2. **一元二次不等式推導與求解**:\n     - 安全防撞限制：$s(t) \\le 160 \\iff 60t - 5t^2 \\le 160$。\n     - 兩邊移項：$5t^2 - 60t + 160 \\ge 0$，同除以 5 得 $t^2 - 12t + 32 \\ge 0$。D 正確。\n     - 因式分解：$(t - 4)(t - 8) \\ge 0$，兩根為 $t_1 = 4, t_2 = 8$。E 正確。\n     - 解集為 $t \\le 4$ 或 $t \\ge 8$。\n     - 結合有效滑行時間 $[0, 6]$ 秒取交集：$[0, 6] \\cap ((-\\infty, 4] \\cup [8, +\\infty)) = [0, 4]$ 秒。說明在第 4 秒末賽車已達到 160 米警戒線。F 正確。\n  3. **數值驗證**:\n     - 當 $t = 4$ 秒時：$s(4) = 60(4) - 5(16) = 240 - 80 = 160$ 米，剛好達到警戒邊界。G 正確。\n     - 當 $t = 5$ 秒時：$s(5) = 60(5) - 5(25) = 300 - 125 = 175$ 米，大於 160 米，已突破安全防撞線，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q77",
    "q_num": 77,
    "topic": "澳門情境 · 路氹城（Cotai）填海區生態景觀隔離帶圍欄規劃",
    "source": "Macau Context: 路氹城金光大道旁綠化隔離帶面積二次函數與不等式",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "澳門特區政府在路氹城（Cotai）金光大道旁規劃一處矩形生態景觀隔離帶，一側緊靠現有的輕軌高架混凝土防音牆（牆體足夠長，該側無需修建圍欄），其餘三側使用總長為 120 米的新型環保透水圍欄圍成。設垂直於防音牆的一邊長度為 $x$ 米（$x > 0$），隔離帶的面積為 $S(x)$ 平方米。規劃部門要求隔離帶的面積不少於 1600 平方米（即 $S(x) \\ge 1600$）。下列結論中，正確的有：",
    "diagram_spec": "矩形規劃幾何草圖與開口向下二次拋物線（頂點 $(30, 1800)$，門檻高度線 $S = 1600$，相交於 $x=20, x=40$）",
    "diagram_filename": "q21_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "平行於防音牆的一側長度可表示為 $(120 - 2x)$ 米"
      },
      {
        "key": "B",
        "text": "自變量 $x$ 的幾何物理限制範圍為開區間 $(0, 60)$"
      },
      {
        "key": "C",
        "text": "隔離帶面積關於邊長 $x$ 的函數解析式為 $S(x) = -2x^2 + 120x$"
      },
      {
        "key": "D",
        "text": "函數 $S(x) = -2(x - 30)^2 + 1800$，當 $x = 30$ 米時面積取得最大值 1800 平方米"
      },
      {
        "key": "E",
        "text": "面積滿足 $S(x) \\ge 1600$ 的一元二次不等式可化簡為 $x^2 - 60x + 800 \\le 0$"
      },
      {
        "key": "F",
        "text": "方程 $x^2 - 60x + 800 = 0$ 的兩根分別為 $x_1 = 20$ 與 $x_2 = 40$"
      },
      {
        "key": "G",
        "text": "符合面積要求的邊長 $x$ 的取值範圍是閉區間 $[20, 40]$ 米"
      },
      {
        "key": "H",
        "text": "函數 $S(x)$ 在區間 $[30, 60)$ 上是單調遞增函數"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **幾何建模與定義域**:\n     - 三側圍欄總長 120 米，兩條垂直邊長度均為 $x$，故平行邊長度為 $120 - 2x$ 米。A 正確。\n     - 邊長需大於零：$x > 0$ 且 $120 - 2x > 0 \\implies 0 < x < 60$。B 正確。\n     - 面積公式：$S(x) = x(120 - 2x) = -2x^2 + 120x$。C 正確。\n  2. **二次函數頂點與最值**:\n     - 配方得 $S(x) = -2(x^2 - 60x + 900) + 1800 = -2(x - 30)^2 + 1800$。\n     - 拋物線開口向下，對稱軸為 $x = 30 \\in (0, 60)$，故當 $x = 30$ 米時取得最大面積 1800 平方米。D 正確。\n  3. **一元二次不等式求解**:\n     - 規劃要求 $S(x) \\ge 1600 \\iff -2x^2 + 120x \\ge 1600$。\n     - 移項並除以 $-2$（翻轉不等號）：$x^2 - 60x + 800 \\le 0$。E 正確。\n     - 因式分解：$(x - 20)(x - 40) \\le 0$，兩根為 $x_1 = 20, x_2 = 40$。F 正確。\n     - 小於等於取兩根之間：$20 \\le x \\le 40$。該區間完全包含在 $(0, 60)$ 之內，故合適的邊長取值範圍為 $[20, 40]$ 米。G 正確。\n  4. **單調性辨析**:\n     - 拋物線對稱軸為 $x = 30$，開口向下。在對稱軸右側 $[30, 60)$ 上，面積隨 $x$ 增大而減小，為單調遞減函數，故 H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q78",
    "q_num": 78,
    "topic": "澳門情境 · 港珠澳大橋（HZMB）穿梭金巴票價浮動收益函數",
    "source": "Macau Context: 港珠澳大橋金巴營運票價浮動與二次函數收益最優化",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "港珠澳大橋（HZMB）澳門邊檢大樓往返香港口岸的跨境穿梭巴士（俗稱「金巴」），每日客運總收益 $R(x)$（單位：千澳門元）與單程票價調整額 $x$（單位：澳門元）滿足二次函數關係：$R(x) = -0.5x^2 + 20x + 450$。根據澳門特區交通事務局監管規定，票價浮動範圍限制在 $x \\in [-10, 30]$ 之內。下列關於該收益函數的單調性、極值及不等式的敘述中，正確的有：",
    "diagram_spec": "二次函數收益拋物線（開口向下拋物線 $R(x) = -0.5(x-20)^2 + 650$，標註頂點 $(20, 650)$ 與收益門檻水平線 $R = 600$）",
    "diagram_filename": "q22_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "函數 $R(x)$ 配方後可表示為 $R(x) = -0.5(x - 20)^2 + 650$"
      },
      {
        "key": "B",
        "text": "函數 $R(x)$ 的圖象為開口向下的拋物線，對稱軸為直線 $x = 20$"
      },
      {
        "key": "C",
        "text": "函數 $R(x)$ 在區間 $[-10, 20]$ 上單調遞增，在區間 $[20, 30]$ 上單調遞減"
      },
      {
        "key": "D",
        "text": "當調整額 $x = 20$ 澳門元時，每日客運總收益達到最大值 650 千澳門元（即 65 萬澳門元）"
      },
      {
        "key": "E",
        "text": "若要求每日總收益不低於 600 千澳門元，對應不等式為 $-0.5x^2 + 20x + 450 \\ge 600$"
      },
      {
        "key": "F",
        "text": "不等式 $-0.5x^2 + 20x + 450 \\ge 600$ 整理得 $x^2 - 40x + 300 \\le 0$，其解集為 $[10, 30]$"
      },
      {
        "key": "G",
        "text": "在基準票價（即 $x = 0$）時，每日總收益為 450 千澳門元"
      },
      {
        "key": "H",
        "text": "函數 $R(x)$ 在區間 $[-10, 30]$ 上的最小值在 $x = 30$ 處取得"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **配方與拋物線特徵**:\n     - $R(x) = -0.5(x^2 - 40x) + 450 = -0.5(x^2 - 40x + 400) + 450 + 200 = -0.5(x - 20)^2 + 650$。A 正確。\n     - 二次項係數為 $-0.5 < 0$，拋物線開口向下，對稱軸為直線 $x = 20$。B 正確。\n  2. **單調性與最大值**:\n     - 在定義域 $[-10, 30]$ 內，對稱軸 $x = 20$ 將區間分為兩部分：在 $[-10, 20]$ 上隨票價微調增加而總收益單調遞增；在 $[20, 30]$ 上因高票價引發客流流失而單調遞減。C 正確。\n     - 當 $x = 20$ 時達到最大值 $R(20) = 650$ 千澳門元。D 正確。\n  3. **收益門檻二次不等式求解**:\n     - 要求 $R(x) \\ge 600 \\iff -0.5x^2 + 20x + 450 \\ge 600$。E 正確。\n     - 整理：$-0.5x^2 + 20x - 150 \\ge 0 \\iff 0.5x^2 - 20x + 150 \\le 0 \\iff x^2 - 40x + 300 \\le 0$。\n     - 因式分解：$(x - 10)(x - 30) \\le 0$，解得 $10 \\le x \\le 30$。F 正確。\n  4. **端點最值與基準驗證**:\n     - 當 $x = 0$ 時，$R(0) = 450$ 千澳門元，G 正確。\n     - 比較兩端點值：$R(-10) = -0.5(-10 - 20)^2 + 650 = -0.5(900) + 650 = 200$ 千澳門元；而 $R(30) = -0.5(30 - 20)^2 + 650 = -0.5(100) + 650 = 600$ 千澳門元。最小值顯然在 $x = -10$ 處取得（200 千元），而非 $x = 30$ 處。故 H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q79",
    "q_num": 79,
    "topic": "澳門情境 · 澳門文創大賽紀念明信片印製平均成本函數單調性與最值",
    "source": "Creative Context: 文創紀念品批量生產邊際成本耐克函數模型",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "澳門國際文化創意博覽會印製「大三巴牌坊」立體紀念明信片，印製總成本 $C(x)$（單位：澳門元）與印製數量 $x$（單位：百套，$x \\in [1, 20]$）的關係為 $C(x) = 4x^2 + 100$。每百套的平均印刷成本為 $f(x) = \\frac{C(x)}{x} = 4x + \\frac{100}{x}$。下列關於平均成本函數 $f(x)$ 的單調性、最低成本與不等式的分析中，正確的有：",
    "diagram_spec": "對勾函數成本曲線圖（第 I 象限耐克雙曲形態，最低點 $(5, 40)$，成本門檻水平線 $y = 50$）",
    "diagram_filename": "q23_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "平均成本函數為 $f(x) = 4x + \\frac{100}{x}$，其定義域限制在 $[1, 20]$"
      },
      {
        "key": "B",
        "text": "對任意 $x_1, x_2 \\in [1, 20]$ 且 $x_1 < x_2$，作差得 $f(x_1) - f(x_2) = (x_1 - x_2)(4 - \\frac{100}{x_1 x_2})$"
      },
      {
        "key": "C",
        "text": "函數 $f(x)$ 在區間 $[1, 5]$ 上單調遞減，在區間 $[5, 20]$ 上單調遞增"
      },
      {
        "key": "D",
        "text": "當印製數量為 $x = 5$ 百套（即 500 套）時，每百套平均印刷成本最低，最低成本為 40 澳門元"
      },
      {
        "key": "E",
        "text": "若要求每百套平均成本不超過 50 澳門元，對應不等式為 $4x + \\frac{100}{x} \\le 50$"
      },
      {
        "key": "F",
        "text": "不等式 $4x + \\frac{100}{x} \\le 50$ 整理得 $2x^2 - 25x + 50 \\le 0 \\iff (2x - 5)(x - 10) \\le 0$"
      },
      {
        "key": "G",
        "text": "滿足平均成本不超過 50 澳門元的印製數量範圍為 $[2.5, 10]$ 百套（即 250 至 1000 套）"
      },
      {
        "key": "H",
        "text": "函數 $f(x)$ 在區間 $[1, 20]$ 上的最大值在 $x = 5$ 處取得"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **平均成本函數構建**:\n     - $f(x) = \\frac{C(x)}{x} = \\frac{4x^2 + 100}{x} = 4x + \\frac{100}{x}$，定義域為 $[1, 20]$。A 正確。\n  2. **作差法證明單調性與極值點**:\n     - 任取 $1 \\le x_1 < x_2 \\le 20$：\n       $$f(x_1) - f(x_2) = (4x_1 + \\frac{100}{x_1}) - (4x_2 + \\frac{100}{x_2}) = 4(x_1 - x_2) - \\frac{100(x_1 - x_2)}{x_1 x_2} = (x_1 - x_2)(4 - \\frac{100}{x_1 x_2})$$\n       B 正確。\n     - 當 $x_1, x_2 \\in [1, 5]$ 時，$x_1 x_2 < 25 \\implies \\frac{100}{x_1 x_2} > 4 \\implies 4 - \\frac{100}{x_1 x_2} < 0$。負乘負為正，差值大於 0，故在 $[1, 5]$ 上單調遞減。\n     - 當 $x_1, x_2 \\in [5, 20]$ 時，$x_1 x_2 > 25 \\implies \\frac{100}{x_1 x_2} < 4 \\implies 4 - \\frac{100}{x_1 x_2} > 0$。負乘正為負，差值小於 0，故在 $[5, 20]$ 上單調遞增。C 正確。\n     - 當 $x = 5$ 時取得最低平均成本：$f(5) = 4(5) + \\frac{100}{5} = 20 + 20 = 40$ 澳門元。D 正確。\n  3. **成本容限二次不等式求解**:\n     - 要求平均成本 $f(x) \\le 50 \\iff 4x + \\frac{100}{x} \\le 50$。E 正確。\n     - 因為 $x > 0$，兩邊同乘 $x$ 不改變符號：$4x^2 + 100 \\le 50x \\iff 4x^2 - 50x + 100 \\le 0 \\iff 2x^2 - 25x + 50 \\le 0$。\n     - 十字相乘因式分解：$(2x - 5)(x - 10) \\le 0$，兩根為 $x = 2.5, 10$。F 正確。\n     - 解集為 $[2.5, 10]$，即印製 250 至 1000 套時，每百套成本可控制在 50 澳門元以內。G 正確。\n  4. **最值誤區辨析**:\n     - $x = 5$ 處是整個區間上的**最小值點**（最低成本），而不是最大值點，H 錯誤。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  },
  {
    "id": "4CD_1023_Q80",
    "q_num": 80,
    "topic": "澳門情境 · 橫琴深合區微電子晶片表面散熱溫升二次模型",
    "source": "Creative Context: 晶片散熱功率二次溫控模型與安全閾值不等式",
    "difficulty": "Macau / Creative Context",
    "isVerbatimArchive": false,
    "stem": "澳門橫琴粵澳深度合作區微電子國家重點實驗室在測試新一代物聯網傳感器晶片時，晶片表面運算散熱溫升 $T(w)$（單位：$^\\circ\\text{C}$）與工作電流功率參數 $w$（單位：毫瓦，$w > 0$）滿足二次函數關係：$T(w) = w^2 - 8w + 25$。為確保晶片在半導體安全工作溫度下運行，要求溫升控制在 $T(w) \\le 40^\\circ\\text{C}$。下列關於該溫控模型與二次不等式的分析中，正確的有：",
    "diagram_spec": "晶片溫升二次曲線圖（開口向上拋物線 $T(w) = (w-4)^2 + 9$，頂點 $(4, 9)$，水平安全溫控線 $T = 40$）",
    "diagram_filename": "q24_diagram.png",
    "options": [
      {
        "key": "A",
        "text": "溫升函數配方後為 $T(w) = (w - 4)^2 + 9$"
      },
      {
        "key": "B",
        "text": "函數 $T(w)$ 在區間 $(0, 4]$ 上單調遞減，在區間 $[4, +\\infty)$ 上單調遞增"
      },
      {
        "key": "C",
        "text": "當功率參數 $w = 4$ 毫瓦時，晶片表面溫升最低，最低溫升為 $9^\\circ\\text{C}$"
      },
      {
        "key": "D",
        "text": "安全工作條件對應的一元二次不等式為 $w^2 - 8w + 25 \\le 40$"
      },
      {
        "key": "E",
        "text": "不等式 $w^2 - 8w + 25 \\le 40$ 整理得 $w^2 - 8w - 15 \\le 0$"
      },
      {
        "key": "F",
        "text": "方程 $w^2 - 8w - 15 = 0$ 的判別式 $\\Delta = (-8)^2 - 4(1)(-15) = 124 > 0$，兩根為 $w = 4 \\pm \\sqrt{31}$"
      },
      {
        "key": "G",
        "text": "結合 $w > 0$ 的物理約束，允許的安全功率參數範圍為 $(0, 4 + \\sqrt{31}]$ 毫瓦"
      },
      {
        "key": "H",
        "text": "函數 $T(w)$ 在定義域 $(0, +\\infty)$ 上是嚴格單調遞增函數"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G"
    ],
    "explanation": "1. **溫升二次函數特徵**:\n     - $T(w) = w^2 - 8w + 25 = (w - 4)^2 + 9$。A 正確。\n     - 二次項係數為 $1 > 0$，開口向上，對稱軸為 $w = 4$。\n     - 函數在 $(0, 4]$ 上單調遞減，在 $[4, +\\infty)$ 上單調遞增。B 正確，H 錯誤（誤判為全域單調遞增）。\n     - 當 $w = 4$ 毫瓦時，取得晶片散熱的極佳靜態平衡點，溫升最低為 $9^\\circ\\text{C}$。C 正確。\n  2. **安全溫控不等式求解**:\n     - 要求 $T(w) \\le 40 \\iff w^2 - 8w + 25 \\le 40$。D 正確。\n     - 移項整理得：$w^2 - 8w - 15 \\le 0$。E 正確。\n     - 對應方程 $w^2 - 8w - 15 = 0$ 的判別式 $\\Delta = 64 + 60 = 124 > 0$。\n     - 求根公式：$w = \\frac{8 \\pm \\sqrt{124}}{2} = \\frac{8 \\pm 2\\sqrt{31}}{2} = 4 \\pm \\sqrt{31}$。F 正確。\n     - 代數解集為 $[4 - \\sqrt{31}, 4 + \\sqrt{31}]$。\n     - 考慮實際物理約束：因為 $5 < \\sqrt{31} < 6$，左根 $4 - \\sqrt{31} < 0$，而功率 $w > 0$。因此與物理限制 $w > 0$ 取交集，得 $0 < w \\le 4 + \\sqrt{31}$ 毫瓦，即 $(0, 4 + \\sqrt{31}]$。G 正確。",
    "rubric": "- 滿分 4 分。全對得 4 分；漏選且無錯選按比例給分；選入 H 錯誤選項者得 0 分。"
  }
];

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = QUESTIONS_4CD1023;
  }
  if (typeof root !== 'undefined') {
    root.QUESTIONS_4CD1023 = QUESTIONS_4CD1023;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
