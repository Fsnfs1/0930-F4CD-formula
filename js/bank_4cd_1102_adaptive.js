/**
 * bank_4cd_1102_adaptive.js
 * 4CD Mathematics Platform - Test 2 Dedicated Adaptive Incremental Question Bank
 * Total: 35 Questions (AD01-AD35 across 7 Core Topics)
 * Origin Sanitization: Strictly 100% rewritten, Zero provenance tags.
 */

window.BANK_4CD_1102_ADAPTIVE = [
  {
    "id": "AD01",
    "topic": "同一函數判定準則",
    "stem": "下列各組函數中，表示同一函數的是（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = x - 1$ 與 $g(x) = \\frac{x^2 - 1}{x + 1}$"
      },
      {
        "key": "B",
        "text": "$f(x) = |x|$ 與 $g(x) = \\sqrt{x^2}$"
      },
      {
        "key": "C",
        "text": "$f(x) = x$ 與 $g(x) = (\\sqrt{x})^2$"
      },
      {
        "key": "D",
        "text": "$f(x) = 1$ 與 $g(x) = x^0$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "A中 $g(x)$ 定義域為 $x \\neq -1$；B中兩函數定義域均為 $\\mathbb{R}$ 且對應法則 $|x| = \\sqrt{x^2}$ 完全一致，為同一函數；C中 $g(x)$ 定義域為 $x \\ge 0$；D中 $g(x)$ 定義域為 $x \\neq 0$。故選B。"
  },
  {
    "id": "AD02",
    "topic": "具體函數定義域求解",
    "stem": "函數 $f(x) = \\frac{\\sqrt{2 - x}}{x + 1}$ 的定義域為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, 2]$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, -1) \\cup (-1, 2]$"
      },
      {
        "key": "C",
        "text": "$[-1, 2]$"
      },
      {
        "key": "D",
        "text": "$(-1, 2]$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "由根式非負得 $2 - x \\ge 0 \\implies x \\le 2$；分母不為零得 $x + 1 \\neq 0 \\implies x \\neq -1$。故定義域為 $(-\\infty, -1) \\cup (-1, 2]$。故選B。"
  },
  {
    "id": "AD03",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "已知函數 $f(2x + 1)$ 的定義域為 $[-1, 2]$，則函數 $f(x)$ 的定義域為（　）",
    "options": [
      {
        "key": "A",
        "text": "$[-1, 5]$"
      },
      {
        "key": "B",
        "text": "$[-1, 2]$"
      },
      {
        "key": "C",
        "text": "$[-3, 3]$"
      },
      {
        "key": "D",
        "text": "$[0, 5]$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "由 $x \\in [-1, 2]$ 得 $2x + 1$ 的範圍為 $2(-1) + 1 \\le 2x + 1 \\le 2(2) + 1$，即 $-1 \\le 2x + 1 \\le 5$。所以 $f(x)$ 的定義域為 $[-1, 5]$。故選A。"
  },
  {
    "id": "AD04",
    "topic": "同一函數判定準則",
    "stem": "下列函數中，定義域與值域均為 $\\mathbb{R}$ 的是（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = x^2$"
      },
      {
        "key": "B",
        "text": "$f(x) = \\frac{1}{x}$"
      },
      {
        "key": "C",
        "text": "$f(x) = x^3 - 1$"
      },
      {
        "key": "D",
        "text": "$f(x) = \\sqrt{x}$"
      }
    ],
    "answer": "C",
    "correctKeys": [
      "C"
    ],
    "explanation": "A的值域為 $[0, +\\infty)$；B的定義域與值域均為 $\\{x \\mid x \\neq 0\\}$；C為三次函數，定義域與值域均為全體實數 $\\mathbb{R}$；D定義域與值域均為 $[0, +\\infty)$。故選C。"
  },
  {
    "id": "AD05",
    "topic": "具體函數定義域求解",
    "stem": "函數 $f(x) = \\sqrt{x^2 - 4} + (x - 3)^0$ 的定義域是（　）",
    "options": [
      {
        "key": "A",
        "text": "$(-\\infty, -2] \\cup [2, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, -2] \\cup [2, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[2, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, -2) \\cup (2, +\\infty)$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "根式要求 $x^2 - 4 \\ge 0 \\implies x \\le -2$ 或 $x \\ge 2$；零次冪要求底數非零，即 $x - 3 \\neq 0 \\implies x \\neq 3$。求交集得 $(-\\infty, -2] \\cup [2, 3) \\cup (3, +\\infty)$。故選B。"
  },
  {
    "id": "AD06",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "已知分段函數 $f(x) = \\begin{cases} x^2 + 1, & x \\le 1 \\\\ \\frac{2}{x}, & x > 1 \\end{cases}$，則 $f(f(2)) =$（　）",
    "options": [
      {
        "key": "A",
        "text": "$1$"
      },
      {
        "key": "B",
        "text": "$2$"
      },
      {
        "key": "C",
        "text": "$5$"
      },
      {
        "key": "D",
        "text": "$\\frac{1}{2}$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "因為 $2 > 1$，所以 $f(2) = \\frac{2}{2} = 1$。接著計算 $f(1)$，因為 $1 \\le 1$，代入第一段 $f(1) = 1^2 + 1 = 2$。故選B。"
  },
  {
    "id": "AD07",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "已知 $f(x + 1) = x^2 + 3x + 2$，則函數 $f(x)$ 的解析式為（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = x^2 + x$"
      },
      {
        "key": "B",
        "text": "$f(x) = x^2 + 5x + 6$"
      },
      {
        "key": "C",
        "text": "$f(x) = x^2 + 3x$"
      },
      {
        "key": "D",
        "text": "$f(x) = x^2 - x$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "令 $t = x + 1$，則 $x = t - 1$。代入得 $f(t) = (t - 1)^2 + 3(t - 1) + 2 = t^2 - 2t + 1 + 3t - 3 + 2 = t^2 + t$。故 $f(x) = x^2 + x$。故選A。"
  },
  {
    "id": "AD08",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "設函數 $f(x) = \\begin{cases} 3x - 1, & x < 1 \\\\ 2^x, & x \\ge 1 \\end{cases}$，若 $f(a) = 8$，則實數 $a$ 的值為（　）",
    "options": [
      {
        "key": "A",
        "text": "$3$"
      },
      {
        "key": "B",
        "text": "$3$ 或 $-3$"
      },
      {
        "key": "C",
        "text": "$3$ 或 $\\frac{3}{2}$"
      },
      {
        "key": "D",
        "text": "不存在"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "若 $a < 1$，$3a - 1 = 8 \\implies 3a = 9 \\implies a = 3$，不滿足 $a < 1$，捨去；若 $a \\ge 1$，$2^a = 8 \\implies a = 3$，滿足 $a \\ge 1$。因此 $a = 3$。故選A。"
  },
  {
    "id": "AD09",
    "topic": "抽象函數遞推賦值、等差型遞推求解特定項值",
    "stem": "已知函數 $f(x)$ 滿足 $f(x + 1) = f(x) + 2$，且 $f(1) = 3$，則 $f(5) =$（　）",
    "options": [
      {
        "key": "A",
        "text": "$9$"
      },
      {
        "key": "B",
        "text": "$11$"
      },
      {
        "key": "C",
        "text": "$13$"
      },
      {
        "key": "D",
        "text": "$15$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "$f(x)$ 為公差為 $2$ 的等差數列結構，$f(5) = f(1) + 4 \\times 2 = 3 + 8 = 11$。故選B。"
  },
  {
    "id": "AD10",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "已知函數 $f(x) = \\begin{cases} x + 2, & x \\le 0 \\\\ -x + 2, & x > 0 \\end{cases}$，若 $f(x) \\ge 1$，則 $x$ 的取值範圍是（　）",
    "options": [
      {
        "key": "A",
        "text": "$[-1, 1]$"
      },
      {
        "key": "B",
        "text": "$[-2, 2]$"
      },
      {
        "key": "C",
        "text": "$[0, 1]$"
      },
      {
        "key": "D",
        "text": "$[-1, 0]$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "當 $x \\le 0$ 時，$x + 2 \\ge 1 \\implies x \\ge -1$，故 $-1 \\le x \\le 0$；當 $x > 0$ 時，$-x + 2 \\ge 1 \\implies x \\le 1$，故 $0 < x \\le 1$。併集得 $x \\in [-1, 1]$。故選A。"
  },
  {
    "id": "AD11",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "下列函數中，在區間 $(0, +\\infty)$ 上為嚴格單調遞減函數的是（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = x^2$"
      },
      {
        "key": "B",
        "text": "$f(x) = \\frac{1}{x}$"
      },
      {
        "key": "C",
        "text": "$f(x) = \\sqrt{x}$"
      },
      {
        "key": "D",
        "text": "$f(x) = 2x - 1$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "A在 $(0, +\\infty)$ 上單調遞增；B為反比例函數，在 $(0, +\\infty)$ 上隨 $x$ 增大而減小，為嚴格單調遞減；C和D均為增函數。故選B。"
  },
  {
    "id": "AD12",
    "topic": "平移反比例函數定義法單調性論證與閉區間最值",
    "stem": "函數 $f(x) = \\frac{2x + 1}{x - 1}$ 在區間 $[2, 4]$ 上的最大值與最小值分別為（　）",
    "options": [
      {
        "key": "A",
        "text": "最大值 $5$，最小值 $3$"
      },
      {
        "key": "B",
        "text": "最大值 $3$，最小值 $5$"
      },
      {
        "key": "C",
        "text": "最大值 $5$，最小值 $1$"
      },
      {
        "key": "D",
        "text": "最大值 $7$，最小值 $3$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "$f(x) = \\frac{2(x - 1) + 3}{x - 1} = 2 + \\frac{3}{x - 1}$。在 $[2, 4]$ 上，隨 $x$ 增大，$x - 1$ 增大，$\\frac{3}{x - 1}$ 遞減，故 $f(x)$ 單調遞減。當 $x = 2$ 時取得最大值 $f(2) = 2 + 3 = 5$；當 $x = 4$ 時取得最小值 $f(4) = 2 + \\frac{3}{3} = 3$。故選A。"
  },
  {
    "id": "AD13",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "用定義法證明函數 $f(x) = -3x + 5$ 在 $\\mathbb{R}$ 上的單調性時，設 $x_1 < x_2$，則 $f(x_1) - f(x_2)$ 的正負性為（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x_1) - f(x_2) > 0$"
      },
      {
        "key": "B",
        "text": "$f(x_1) - f(x_2) < 0$"
      },
      {
        "key": "C",
        "text": "$f(x_1) - f(x_2) = 0$"
      },
      {
        "key": "D",
        "text": "符號無法確定"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "$f(x_1) - f(x_2) = (-3x_1 + 5) - (-3x_2 + 5) = -3(x_1 - x_2) = 3(x_2 - x_1)$。因為 $x_1 < x_2 \\implies x_2 - x_1 > 0$，所以 $3(x_2 - x_1) > 0$，即 $f(x_1) > f(x_2)$，故為減函數。選A。"
  },
  {
    "id": "AD14",
    "topic": "含參二次函數對稱軸與閉區間最值分類討論",
    "stem": "函數 $f(x) = x^2 - 4x + 3$ 在區間 $[0, 3]$ 上的最小值為（　）",
    "options": [
      {
        "key": "A",
        "text": "$3$"
      },
      {
        "key": "B",
        "text": "$0$"
      },
      {
        "key": "C",
        "text": "$-1$"
      },
      {
        "key": "D",
        "text": "$-2$"
      }
    ],
    "answer": "C",
    "correctKeys": [
      "C"
    ],
    "explanation": "二次函數對稱軸為 $x = -\\frac{-4}{2 \\times 1} = 2 \\in [0, 3]$。開口向上，故最小值在頂點 $x = 2$ 處取得，$f(2) = 4 - 8 + 3 = -1$。故選C。"
  },
  {
    "id": "AD15",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "若函數 $f(x) = (2a - 1)x + 3$ 在 $\\mathbb{R}$ 上是減函數，則實數 $a$ 的取值範圍是（　）",
    "options": [
      {
        "key": "A",
        "text": "$a > \\frac{1}{2}$"
      },
      {
        "key": "B",
        "text": "$a < \\frac{1}{2}$"
      },
      {
        "key": "C",
        "text": "$a \\ge \\frac{1}{2}$"
      },
      {
        "key": "D",
        "text": "$a \\le \\frac{1}{2}$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "一次函數單調遞減的充要條件是斜率為負，即 $2a - 1 < 0 \\implies a < \\frac{1}{2}$。故選B。"
  },
  {
    "id": "AD16",
    "topic": "代數定義法論證函數奇偶性（定義域對稱+f(-x)）",
    "stem": "下列函數中，為定義在 $\\mathbb{R}$ 上的奇函數的是（　）",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = x^2 + x$"
      },
      {
        "key": "B",
        "text": "$f(x) = x^3 - x$"
      },
      {
        "key": "C",
        "text": "$f(x) = |x| + 1$"
      },
      {
        "key": "D",
        "text": "$f(x) = x^4 + 2$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "B中 $f(-x) = (-x)^3 - (-x) = -x^3 + x = -(x^3 - x) = -f(x)$，且定義域為 $\\mathbb{R}$，故為奇函數。A非奇非偶，C與D為偶函數。故選B。"
  },
  {
    "id": "AD17",
    "topic": "偶函數性質與對稱求值",
    "stem": "已知函數 $f(x)$ 是定義在 $\\mathbb{R}$ 上的偶函數，且當 $x \\ge 0$ 時 $f(x) = 2x - 3$，則 $f(-4) =$（　）",
    "options": [
      {
        "key": "A",
        "text": "$5$"
      },
      {
        "key": "B",
        "text": "$-5$"
      },
      {
        "key": "C",
        "text": "$11$"
      },
      {
        "key": "D",
        "text": "$-11$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "由偶函數性質 $f(-x) = f(x)$，得 $f(-4) = f(4)$。代入 $x \\ge 0$ 解析式：$f(4) = 2(4) - 3 = 5$。故選A。"
  },
  {
    "id": "AD18",
    "topic": "由奇偶性求對稱區間解析式（設x<0）與零點",
    "stem": "已知奇函數 $f(x)$ 在 $[0, +\\infty)$ 上的圖象如圖，則 $f(0) =$（　）",
    "options": [
      {
        "key": "A",
        "text": "$0$"
      },
      {
        "key": "B",
        "text": "$1$"
      },
      {
        "key": "C",
        "text": "$-1$"
      },
      {
        "key": "D",
        "text": "無法確定"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "若奇函數 $f(x)$ 在 $x = 0$ 處有定義，則必滿足 $f(0) = -f(0) \\implies 2f(0) = 0 \\implies f(0) = 0$。故選A。"
  },
  {
    "id": "AD19",
    "topic": "全實數奇函數偶次項消去與偶函數負自變量代換",
    "stem": "若函數 $f(x) = ax^2 + (b - 1)x + c$ 是定義在 $\\mathbb{R}$ 上的偶函數，則必有（　）",
    "options": [
      {
        "key": "A",
        "text": "$a = 0$"
      },
      {
        "key": "B",
        "text": "$b = 1$"
      },
      {
        "key": "C",
        "text": "$c = 0$"
      },
      {
        "key": "D",
        "text": "$a + c = 0$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "二次型為偶函數時，一次項係數必為 $0$。故 $b - 1 = 0 \\implies b = 1$。故選B。"
  },
  {
    "id": "AD20",
    "topic": "分式有理多項式奇偶性嚴格代數檢驗",
    "stem": "函數 $f(x) = \\frac{x}{x^2 + 1}$ 的奇偶性是（　）",
    "options": [
      {
        "key": "A",
        "text": "奇函數"
      },
      {
        "key": "B",
        "text": "偶函數"
      },
      {
        "key": "C",
        "text": "既是奇函數又是偶函數"
      },
      {
        "key": "D",
        "text": "非奇非偶函數"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "定義域為 $\\mathbb{R}$，關於原點對稱。$f(-x) = \\frac{-x}{(-x)^2 + 1} = -\\frac{x}{x^2 + 1} = -f(x)$。故為奇函數。選A。"
  },
  {
    "id": "AD21",
    "topic": "冪函數定義與單調性求參",
    "stem": "若函數 $f(x) = (m^2 - m - 1)x^m$ 是冪函數，且在 $(0, +\\infty)$ 上單調遞增，則實數 $m =$（　）",
    "options": [
      {
        "key": "A",
        "text": "$2$"
      },
      {
        "key": "B",
        "text": "$-1$"
      },
      {
        "key": "C",
        "text": "$2$ 或 $-1$"
      },
      {
        "key": "D",
        "text": "$1$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "由冪函數定義，係數 $m^2 - m - 1 = 1 \\implies m^2 - m - 2 = 0 \\implies (m - 2)(m + 1) = 0 \\implies m = 2$ 或 $m = -1$。又在 $(0, +\\infty)$ 單調遞增要求指數 $m > 0$，故 $m = 2$。選A。"
  },
  {
    "id": "AD22",
    "topic": "冪函數公共定點坐標運算",
    "stem": "所有冪函數 $y = x^\\alpha$ 的圖象在第一象限內必過的公共定點坐標為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(0, 0)$"
      },
      {
        "key": "B",
        "text": "$(1, 1)$"
      },
      {
        "key": "C",
        "text": "$(1, 0)$"
      },
      {
        "key": "D",
        "text": "$(0, 1)$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "對於任意實數 $\\alpha$，$1^\\alpha = 1$ 恆成立，因此所有冪函數圖象必過定點 $(1, 1)$。故選B。"
  },
  {
    "id": "AD23",
    "topic": "第一象限冪指數大小比較",
    "stem": "已知實數 $a = 2^{0.5}$，$b = 3^{0.5}$，$c = 0.8^{0.5}$，則 $a, b, c$ 的大小關係是（　）",
    "options": [
      {
        "key": "A",
        "text": "$c < a < b$"
      },
      {
        "key": "B",
        "text": "$a < b < c$"
      },
      {
        "key": "C",
        "text": "$b < a < c$"
      },
      {
        "key": "D",
        "text": "$c < b < a$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "構造冪函數 $y = x^{0.5} = \\sqrt{x}$。因為指數 $0.5 > 0$，所以該函數在 $(0, +\\infty)$ 上單調遞增。由 $0.8 < 2 < 3$ 得 $0.8^{0.5} < 2^{0.5} < 3^{0.5}$，即 $c < a < b$。故選A。"
  },
  {
    "id": "AD24",
    "topic": "冪函數圖象特徵與公共定點",
    "stem": "冪函數 $y = x^{-2}$ 的圖象關於（　）",
    "options": [
      {
        "key": "A",
        "text": "原點對稱"
      },
      {
        "key": "B",
        "text": "$y$ 軸對稱"
      },
      {
        "key": "C",
        "text": "$x$ 軸對稱"
      },
      {
        "key": "D",
        "text": "直線 $y = x$ 對稱"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "$f(x) = \\frac{1}{x^2}$，定義域為 $\\{x \\mid x \\neq 0\\}$。$f(-x) = \\frac{1}{(-x)^2} = \\frac{1}{x^2} = f(x)$，為偶函數，故圖象關於 $y$ 軸對稱。選B。"
  },
  {
    "id": "AD25",
    "topic": "第一象限冪曲線族不動點與指數梯隊排序",
    "stem": "在第一象限內，當 $x > 1$ 時，函數 $y_1 = x^2$，$y_2 = x$，$y_3 = x^{\\frac{1}{2}}$ 的圖象由上到下的排列順序是（　）",
    "options": [
      {
        "key": "A",
        "text": "$y_1, y_2, y_3$"
      },
      {
        "key": "B",
        "text": "$y_3, y_2, y_1$"
      },
      {
        "key": "C",
        "text": "$y_2, y_1, y_3$"
      },
      {
        "key": "D",
        "text": "$y_1, y_3, y_2$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "當 $x > 1$ 時，底數大於 $1$，指數越大值越大。因為 $2 > 1 > \\frac{1}{2}$，所以在 $x > 1$ 時 $x^2 > x > x^{\\frac{1}{2}}$，圖象自上而下為 $y_1, y_2, y_3$。選A。"
  },
  {
    "id": "AD26",
    "topic": "二次不等式因式分解區間解集",
    "stem": "不等式 $x^2 - 5x + 6 < 0$ 的解集為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(2, 3)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, 2) \\cup (3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-3, -2]$"
      },
      {
        "key": "D",
        "text": "$(1, 6)$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "因式分解得 $(x - 2)(x - 3) < 0$。開口向上取小於 $0$ 夾在兩根之間，故解集為 $(2, 3)$。選A。"
  },
  {
    "id": "AD27",
    "topic": "負首項不等式等價反號標準化",
    "stem": "不等式 $-x^2 + 3x + 4 \\ge 0$ 的解集為（　）",
    "options": [
      {
        "key": "A",
        "text": "$[-1, 4]$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, -1] \\cup [4, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-4, 1]$"
      },
      {
        "key": "D",
        "text": "$\\mathbb{R}$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "首項化正兩邊乘 $-1$：$x^2 - 3x - 4 \\le 0$。因式分解 $(x - 4)(x + 1) \\le 0 \\implies -1 \\le x \\le 4$。解集為 $[-1, 4]$。選A。"
  },
  {
    "id": "AD28",
    "topic": "二次不等式發散解與閉區間交集",
    "stem": "若不等式 $x^2 - 2x - 8 > 0$ 與集合 $A = [0, 5]$，則其解集與集合 $A$ 的交集為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(4, 5]$"
      },
      {
        "key": "B",
        "text": "$[0, 4)$"
      },
      {
        "key": "C",
        "text": "$[-2, 4]$"
      },
      {
        "key": "D",
        "text": "$[0, 5]$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "$(x - 4)(x + 2) > 0 \\implies x < -2$ 或 $x > 4$。與 $A = [0, 5]$ 取交集得 $(4, 5]$。故選A。"
  },
  {
    "id": "AD29",
    "topic": "含參一元二次不等式分類討論（二次項係數與根大小）",
    "stem": "解關於 $x$ 的不等式 $(x - 1)(x - a) < 0$，當 $a > 1$ 時，其解集為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(1, a)$"
      },
      {
        "key": "B",
        "text": "$(a, 1)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 1) \\cup (a, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$\\emptyset$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "兩根為 $1$ 和 $a$。因為 $a > 1$，所以小根為 $1$，大根為 $a$。二次項係數為 $1 > 0$，小於 $0$ 取兩根之間，即 $(1, a)$。選A。"
  },
  {
    "id": "AD30",
    "topic": "特殊二次不等式解集",
    "stem": "不等式 $x^2 - 4x + 4 \\le 0$ 的解集為（　）",
    "options": [
      {
        "key": "A",
        "text": "$\\{2\\}$"
      },
      {
        "key": "B",
        "text": "$\\emptyset$"
      },
      {
        "key": "C",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "D",
        "text": "$(-\\infty, 2]$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "$(x - 2)^2 \\le 0$。因為完全平方式非負，$(x - 2)^2 \\ge 0$ 恆成立，故只有 $(x - 2)^2 = 0$ 成立，得 $x = 2$。解集為 $\\{2\\}$。選A。"
  },
  {
    "id": "AD31",
    "topic": "二次函數恆為正充要條件（a>0且Δ<0，含參首項討論）",
    "stem": "若對任意實數 $x$，二次不等式 $x^2 + 2x + m > 0$ 恆成立，則實數 $m$ 的取值範圍是（　）",
    "options": [
      {
        "key": "A",
        "text": "$m > 1$"
      },
      {
        "key": "B",
        "text": "$m < 1$"
      },
      {
        "key": "C",
        "text": "$m \\ge 1$"
      },
      {
        "key": "D",
        "text": "$m \\le 1$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "二次項係數 $a = 1 > 0$，圖象開口向上。恆大於 $0$ 的充要條件是判別式 $\\Delta < 0$。$\\Delta = 2^2 - 4(1)(m) = 4 - 4m < 0 \\implies 4m > 4 \\implies m > 1$。選A。"
  },
  {
    "id": "AD32",
    "topic": "二次函數零點判別式與恆成立",
    "stem": "二次函數 $y = x^2 - 6x + 9$ 的圖象與 $x$ 軸的交點個數為（　）",
    "options": [
      {
        "key": "A",
        "text": "$1$ 個"
      },
      {
        "key": "B",
        "text": "$2$ 個"
      },
      {
        "key": "C",
        "text": "$0$ 個"
      },
      {
        "key": "D",
        "text": "無數個"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "$\\Delta = (-6)^2 - 4(1)(9) = 36 - 36 = 0$。頂點切於橫軸，有且僅有 $1$ 個交點 $(3, 0)$。選A。"
  },
  {
    "id": "AD33",
    "topic": "拋物線頂點切觸與橫軸交點個數",
    "stem": "拋物線 $y = -2x^2 + 4x - 5$ 的頂點坐標為（　）",
    "options": [
      {
        "key": "A",
        "text": "$(1, -3)$"
      },
      {
        "key": "B",
        "text": "$(-1, -3)$"
      },
      {
        "key": "C",
        "text": "$(1, 3)$"
      },
      {
        "key": "D",
        "text": "$(2, -5)$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "對稱軸 $x = -\\frac{4}{2 \\times (-2)} = 1$。代入求頂點縱坐標：$y = -2(1)^2 + 4(1) - 5 = -2 + 4 - 5 = -3$。頂點為 $(1, -3)$。選A。"
  },
  {
    "id": "AD34",
    "topic": "二次函數恆為正充要條件（a>0且Δ<0，含參首項討論）",
    "stem": "若不等式 $ax^2 + 4x - 2 < 0$ 對一切 $x \\in \\mathbb{R}$ 恆成立，則實數 $a$ 的取值範圍是（　）",
    "options": [
      {
        "key": "A",
        "text": "$a < -2$"
      },
      {
        "key": "B",
        "text": "$a \\le -2$"
      },
      {
        "key": "C",
        "text": "$a > 0$"
      },
      {
        "key": "D",
        "text": "$-2 < a < 0$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "若 $a = 0$，$4x - 2 < 0$ 不可能對全體實數恆成立，捨去；因此必為二次函數且開口向下：$a < 0$，且 $\\Delta = 4^2 - 4(a)(-2) = 16 + 8a < 0 \\implies 8a < -16 \\implies a < -2$。結合 $a < 0$ 得 $a < -2$。選A。"
  },
  {
    "id": "AD35",
    "topic": "完全平方式去根解與二次恆正參數邊界",
    "stem": "已知二次函數 $f(x) = x^2 - 2ax + 4$ 在區間 $[1, +\\infty)$ 上單調遞增，則實數 $a$ 的取值範圍是（　）",
    "options": [
      {
        "key": "A",
        "text": "$a \\le 1$"
      },
      {
        "key": "B",
        "text": "$a \\ge 1$"
      },
      {
        "key": "C",
        "text": "$a < 1$"
      },
      {
        "key": "D",
        "text": "$a > 1$"
      }
    ],
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "開口向上，對稱軸為 $x = a$。函數在 $[a, +\\infty)$ 上遞增。要使函數在 $[1, +\\infty)$ 上單調遞增，只需對稱軸在區間左端點左側或重合，即 $a \\le 1$。選A。"
  }
];
