/**
 * bank_4cd_t2.js
 * 4CD Mathematics Quiz Platform - Test 2 Question Bank (Adapted & Calibrated)
 * Total: 99 Questions (77 Practice Questions P01-P77 + 22 Exam Questions Q01-Q22)
 * Preservation Rule: Exactly 13/22 (59.09% <= 60%) Exam answers preserved, 100% stems rewritten.
 * Origin Sanitization: Zero provenance tags or source annotations.
 */

window.BANK_4CD_T2 = {
  exam: [
  {
    "id": "Q01",
    "is_preserved": true,
    "type": "single_choice",
    "topic": "同一函數判定準則",
    "stem": "在平面解析幾何與實變量分析中，設基本映射由一次解析表達式 $y = x + 1$ 所定義。試於下列四個候選構造函數中，挑選出與其具有嚴格相同定義域及完全等價映射對應法則之函數：（　　）",
    "options": [
      {
        "key": "A",
        "text": "$y = (\\sqrt{x + 1})^2$"
      },
      {
        "key": "B",
        "text": "$y = \\sqrt[3]{(x + 1)^3}$"
      },
      {
        "key": "C",
        "text": "$y = \\sqrt{(x + 1)^2}$"
      },
      {
        "key": "D",
        "text": "$y = \\frac{(x + 1)^2}{x + 1}$"
      }
    ],
    "answer": "B",
    "correctKeys": [
      "B"
    ],
    "explanation": "A選項中二次根號要求被開方數非負，故自變量範圍為 $x \\ge -1$；B選項為奇次方立方根，在全實數域 $\\mathbb{R}$ 恆有定義且恆等化簡為 $x+1$，定義域與對應律均完全一致；C選項開方取絕對值 $|x+1|$；D選項分母要求 $x \\ne -1$。故選 B。"
  },
  {
    "id": "Q02",
    "is_preserved": true,
    "type": "single_choice",
    "topic": "二次不等式因式分解區間解集",
    "stem": "針對兩根已知的開口向上二次多項式，求解實數域開區間限制條件 $(x - 1)(x - 4) < 0$ 所約束的自變量全體集合為：（　　）",
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
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "二次方程相應兩根為 $x_1 = 1, x_2 = 4$。二次項係數為正數，負號不等式取兩根之間的開區間，即 $(1, 4)$。故選 A。"
  },
  {
    "id": "Q03",
    "is_preserved": true,
    "type": "single_choice",
    "topic": "拋物線頂點切觸與橫軸交點個數",
    "stem": "給出開口朝下之二次拋物線方程 $y = -x^2 + 2x - 1$，測算其在笛卡爾坐標平面內與水平橫軸（即直線 $y = 0$）的公共幾何交點總數量為：（　　）",
    "options": [
      {
        "key": "A",
        "text": "2 個"
      },
      {
        "key": "B",
        "text": "0 個"
      },
      {
        "key": "C",
        "text": "1 個"
      },
      {
        "key": "D",
        "text": "無數個"
      }
    ],
    "answer": "C",
    "correctKeys": [
      "C"
    ],
    "explanation": "判別式計算為 $\\Delta = b^2 - 4ac = 2^2 - 4(-1)(-1) = 4 - 4 = 0$。判別式為零表示拋物線頂點恰切於橫軸，故交點個數恰為 1 個。故選 C。"
  },
  {
    "id": "Q04",
    "is_preserved": true,
    "type": "single_choice",
    "topic": "負首項不等式等價反號標準化",
    "stem": "給定二次最高次係數為負之不等式 $-x^2 + 4x - 3 > 0$。若在不等號兩側同步乘以負實數 $-1$ 完成規範化改寫，所獲得之正係數等價不等式為：（　　）",
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
    "answer": "A",
    "correctKeys": [
      "A"
    ],
    "explanation": "根據不等式基本代數性質，全式同乘負數需翻轉不等號開口方向，故式子轉化為 $x^2 - 4x + 3 < 0$。故選 A。"
  },
  {
    "id": "Q05",
    "is_preserved": true,
    "type": "single_choice",
    "topic": "指數與冪底數中介分界比較法",
    "stem": "考察三組帶有分數底數及相反指數之數值：$a = (\\frac{5}{2})^{-1.1},\\, b = (\\frac{1}{3})^{1.1},\\, c = (\\frac{1}{3})^{-1.1}$。透過參考基準點 0 與 1 判定大小，則此三個實數之大小遞減順序為：（　　）",
    "options": [
      {
        "key": "A",
        "text": "$a > c > b$"
      },
      {
        "key": "B",
        "text": "$b > c > a$"
      },
      {
        "key": "C",
        "text": "$c > a > b$"
      },
      {
        "key": "D",
        "text": "$c > b > a$"
      }
    ],
    "answer": "C",
    "correctKeys": [
      "C"
    ],
    "explanation": "計算各項性質：$a = (2/5)^{1.1} \\in (0, 1)$；$b = (1/3)^{1.1} \\in (0, 1)$ 且因底數 $1/3 < 2/5$ 故 $b < a$；$c = 3^{1.1} > 1$。由此立即推出 $c > a > b$。故選 C。"
  },
  {
    "id": "Q06",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "二次不等式發散解與閉區間交集",
    "stem": "已知點集條件 $A = \\{x \\in \\mathbb{R} \\mid (x - 2)(x - 5) > 0\\}$，且區間約束集合 $B = \\{x \\in \\mathbb{R} \\mid -1 \\le x \\le 3\\}$。試確定集合 $A$ 之區間形式，並求兩集合的公共交集部分 $A \\cap B$。",
    "options": [
      {
        "key": "A",
        "text": "$A = (-\\infty, 2) \\cup (5, +\\infty)$；$A \\cap B = [-1, 2)$"
      },
      {
        "key": "B",
        "text": "$A = (2, 5)$；$A \\cap B = (2, 3]$"
      },
      {
        "key": "C",
        "text": "$A = (-\\infty, 2) \\cup (5, +\\infty)$；$A \\cap B = [-1, 3]$"
      },
      {
        "key": "D",
        "text": "$A = [2, 5]$；$A \\cap B = [-1, 2]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "解 $(x-2)(x-5)>0$ 得外側區間 $(-\\infty, 2) \\cup (5, +\\infty)$。與閉區間 $[-1, 3]$ 求交，落在 $(5, +\\infty)$ 無交集，在左側交出 $[-1, 2)$。"
  },
  {
    "id": "Q07",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "完全平方式去根解與二次恆正參數邊界",
    "stem": "對於二次式 $x^2 - 6x + 9 > 0$，求其非零解集；進一步，若含參二次式 $x^2 - 6x + k > 0$ 恆對任意實數 $x \\in \\mathbb{R}$ 均成立，求實數參數 $k$ 必須超越的下邊界閥值。",
    "options": [
      {
        "key": "A",
        "text": "解集為 $(-\\infty, 3) \\cup (3, +\\infty)$；$k > 9$"
      },
      {
        "key": "B",
        "text": "解集為 $\\mathbb{R}$；$k \\ge 9$"
      },
      {
        "key": "C",
        "text": "解集為 $(-\\infty, -3) \\cup (-3, +\\infty)$；$k > 3$"
      },
      {
        "key": "D",
        "text": "解集為 $(3, +\\infty)$；$k > 36$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "因式為 $(x-3)^2>0$，除零點 3 外全體實數皆正。恆正要求判別式 $\\Delta = 36 - 4k < 0 \\implies k > 9$。"
  },
  {
    "id": "Q08",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "偶次根式分式複合定義域及代入計算",
    "stem": "設實值函數映射規律為 $f(x) = \\frac{\\sqrt{x + 2}}{x - 1}$。試求出使得該解析式具備實數意義之最大可能定義域，並直接計算當自變量取值 $x = 2$ 時之函數輸出值 $f(2)$。",
    "options": [
      {
        "key": "A",
        "text": "定義域為 $[-2, 1) \\cup (1, +\\infty)$；$f(2) = 2$"
      },
      {
        "key": "B",
        "text": "定義域為 $(-2, 1) \\cup (1, +\\infty)$；$f(2) = 2$"
      },
      {
        "key": "C",
        "text": "定義域為 $[-2, +\\infty)$；$f(2) = 4$"
      },
      {
        "key": "D",
        "text": "定義域為 $[1, +\\infty)$；$f(2) = 1$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "分子要求被開方數非負 $x+2 \\ge 0 \\implies x \\ge -2$；分母非零 $x \\ne 1$。定義域為 $[-2, 1) \\cup (1, +\\infty)$。代入 $x=2$ 得 $\\sqrt{4}/(2-1) = 2$。"
  },
  {
    "id": "Q09",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "全實數奇函數偶次項消去與偶函數負自變量代換",
    "stem": "已知二次一次多項式 $f(x) = (m - 1)x^2 + 2x$ 在整個實數軸 $\\mathbb{R}$ 上保持原點奇對稱性；又設偶對稱函數 $g(x)$ 當自變量處於非負半軸 $x \\ge 0$ 時解析表達式為 $g(x) = x^2 - 2x$。求參量 $m$ 之數值與對稱點值 $g(-3)$。",
    "options": [
      {
        "key": "A",
        "text": "$m = 1$；$g(-3) = 3$"
      },
      {
        "key": "B",
        "text": "$m = 0$；$g(-3) = 3$"
      },
      {
        "key": "C",
        "text": "$m = 1$；$g(-3) = -3$"
      },
      {
        "key": "D",
        "text": "$m = -1$；$g(-3) = 15$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "奇函數偶次冪項係數必為 0，故 $m-1=0 \\implies m=1$。偶函數滿足 $g(-3)=g(3)=3^2-2(3)=3$。"
  },
  {
    "id": "Q10",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "冪函數平方非負性與開區間單調遞減參數判定",
    "stem": "設最簡二次冪函數 $f(x) = x^2$，分析條件式 $f(x) + 4 > 0$ 在實數軸上的有效覆蓋範圍；另設廣義單項冪函數 $g(x) = (m^2 - 2m - 2)x^{m^2 - 5m + 5}$ 在右側開區間 $(0, +\\infty)$ 上呈現單調下降態勢，求整數參量 $m$ 的確切數值。",
    "options": [
      {
        "key": "A",
        "text": "解集為 $\\mathbb{R}$；$m = 3$"
      },
      {
        "key": "B",
        "text": "解集為 $(0, +\\infty)$；$m = 3$"
      },
      {
        "key": "C",
        "text": "解集為 $\\mathbb{R}$；$m = -1$"
      },
      {
        "key": "D",
        "text": "解集為 $[-2, 2]$；$m = 1$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "平方非負加上 4 恆大於 0，解集為全體實數 $\\mathbb{R}$。冪函數定義要求前置係數 $m^2-2m-2=1 \\implies m^2-2m-3=0 \\implies m=3$ 或 $-1$。單調遞減要求指數小於 0：代入 $m=3$ 得指數 $-1<0$；代入 $m=-1$ 得指數 $11>0$ 矛盾。故 $m=3$。"
  },
  {
    "id": "Q11",
    "is_preserved": true,
    "type": "fill_in",
    "topic": "第一象限冪曲線族不動點與指數梯隊排序",
    "stem": "直角系第一象限繪出四條冪函數曲線 $y = x^a, y = x^b, y = x^c, y = x^d$。試寫出此四條曲線在自變量取值為 1 時共同交匯的幾何恆定點坐標，並依據 $x > 1$ 時圖象高度依序排列指數數值 $a, b, c, d$ 之鏈式大小關係。",
    "options": [
      {
        "key": "A",
        "text": "定點坐標 $(1, 1)$；大小關係 $a > b > c > d$"
      },
      {
        "key": "B",
        "text": "定點坐標 $(0, 0)$；大小關係 $a > b > c > d$"
      },
      {
        "key": "C",
        "text": "定點坐標 $(1, 1)$；大小關係 $d > c > b > a$"
      },
      {
        "key": "D",
        "text": "定點坐標 $(1, 0)$；大小關係 $a > c > b > d$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "冪函數第一象限必過點 $(1, 1)$。在直線 $x=1$ 右側，曲線位置越高則對應之冪指數越大，因此呈現 $a > b > c > d$。"
  },
  {
    "id": "Q12",
    "is_preserved": true,
    "type": "comprehensive",
    "topic": "十字相乘因式分解求閉區間解",
    "stem": "在實數域範圍內，詳細求解一元二次整式非正約束條件式 $x^2 - 5x + 6 \\le 0$ 的全體解集合，並規範書寫為閉區間型態。",
    "options": [
      {
        "key": "A",
        "text": "$[2, 3]$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, 2] \\cup [3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$(2, 3)$"
      },
      {
        "key": "D",
        "text": "$[-3, -2]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "十字相乘分解得 $(x - 2)(x - 3) \\le 0$。對應拋物線兩零點為 2 與 3，小於等於零取頂點所在中間閉區間 $[2, 3]$。"
  },
  {
    "id": "Q13",
    "is_preserved": true,
    "type": "comprehensive",
    "topic": "根式非負分母非零與零次冪複合定義域",
    "stem": "已知多項式複合解析結構 $f(x) = \\frac{\\sqrt{2x + 6}}{x - 1} + \\frac{1}{x - 3}$（或寫作含有分母零次冪 $(x - 3)^0$ 項）。請規範寫出確保該函數式每一項均滿足實數合法運算時的自變量定義域區間聯集。",
    "options": [
      {
        "key": "A",
        "text": "$[-3, 1) \\cup (1, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$(-\\infty, -3] \\cup (1, 3) \\cup (3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-3, 1) \\cup (1, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-3, 1) \\cup (1, 3) \\cup (3, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "偶次根式要求被開方數 $2x+6 \\ge 0 \\implies x \\ge -3$；分母要求 $x-1 \\ne 0 \\implies x \\ne 1$；右側分母要求 $x-3 \\ne 0 \\implies x \\ne 3$。三者取交集即得 $[-3, 1) \\cup (1, 3) \\cup (3, +\\infty)$。"
  },
  {
    "id": "Q14",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "折線連續函數單調區間分割識別",
    "stem": "給定一個在區間 $[-4, 6]$ 內連續分段定義的函數 $y = g(x)$。經觀測圖形，其在區間 $[-4, -1]$ 及 $[2, 5]$ 上沿自變量正方向持續攀升，而在 $[-1, 2]$ 及 $[5, 6]$ 上持續下滑。試指認其單調增區間與單調減區間。",
    "options": [
      {
        "key": "A",
        "text": "單調增區間為 $[-4, -1]$ 和 $[2, 5]$；單調減區間為 $[-1, 2]$ 和 $[5, 6]$"
      },
      {
        "key": "B",
        "text": "單調增區間為 $[-1, 2]$ 和 $[5, 6]$；單調減區間為 $[-4, -1]$ 和 $[2, 5]$"
      },
      {
        "key": "C",
        "text": "單調增區間為 $[-4, 2]$；單調減區間為 $[2, 6]$"
      },
      {
        "key": "D",
        "text": "單調增區間為 $[2, 5]$；單調減區間為 $[-1, 2]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "依據走勢趨勢劃分，上升段對應單調增區間 $[-4, -1], [2, 5]$；下降段對應單調減區間 $[-1, 2], [5, 6]$。"
  },
  {
    "id": "Q15",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "平移反比例函數定義法單調性論證與閉區間最值",
    "stem": "給定分式有理函數 $f(x) = \\frac{3}{x + 2}$。(1) 運用函數單調性的嚴格 $\\epsilon$-定義五步法，論證其在區間 $[0, 4]$ 上為嚴格單調減函數；(2) 求出該函數在閉區間 $[0, 4]$ 上的極端最大值與極端最小值。",
    "options": [
      {
        "key": "A",
        "text": "在 $[0, 4]$ 上單調遞減；最大值為 $1.5$，最小值為 $0.5$"
      },
      {
        "key": "B",
        "text": "在 $[0, 4]$ 上單調遞增；最大值為 $0.5$，最小值為 $1.5$"
      },
      {
        "key": "C",
        "text": "在 $[0, 4]$ 上單調遞減；最大值為 $3$，最小值為 $0.5$"
      },
      {
        "key": "D",
        "text": "在 $[0, 4]$ 上單調遞減；最大值為 $1.5$，最小值為 $0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "任取 $0 \\le x_1 < x_2 \\le 4$，作差得 $f(x_1) - f(x_2) = \\frac{3(x_2 - x_1)}{(x_1 + 2)(x_2 + 2)} > 0$，故遞減。最大值 $f(0)=3/2=1.5$，最小值 $f(4)=3/6=0.5$。故選 A。"
  },
  {
    "id": "Q16",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "分式有理多項式奇偶性嚴格代數檢驗",
    "stem": "針對定義在去心全軸上的函數表達式 $f(x) = 2x^3 - \\frac{8}{x}$，給出其定義域對稱性論證，並計算 $f(-x)$ 與 $f(x)$ 的代數正負關係，判定其奇偶性屬性。",
    "options": [
      {
        "key": "A",
        "text": "函數 $f(x)$ 為奇函數"
      },
      {
        "key": "B",
        "text": "函數 $f(x)$ 為偶函數"
      },
      {
        "key": "C",
        "text": "函數 $f(x)$ 既是奇函數又是偶函數"
      },
      {
        "key": "D",
        "text": "函數 $f(x)$ 非奇非偶函數"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "定義域為 $\\{x \\in \\mathbb{R} \\mid x \\ne 0\\}$ 關於坐標原點對稱。計算 $f(-x) = 2(-x)^3 - \\frac{8}{-x} = -2x^3 + \\frac{8}{x} = -f(x)$，故為奇函數。故選 A。"
  },
  {
    "id": "Q17",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "奇函數反向代換解析式求法",
    "stem": "已知函數 $f(x)$ 在 $\\mathbb{R}$ 上為奇函數，當 $x > 0$ 時解析式為 $f(x) = 2x^2 - 6x + 4$。(1) 評估原點函數值 $f(0)$；(2) 嚴格導出當自變量 $x < 0$ 時該函數的解析運算式。",
    "options": [
      {
        "key": "A",
        "text": "$f(0) = 0$；當 $x < 0$ 時，$f(x) = -2x^2 - 6x - 4$"
      },
      {
        "key": "B",
        "text": "$f(0) = 0$；當 $x < 0$ 時，$f(x) = -2x^2 + 6x - 4$"
      },
      {
        "key": "C",
        "text": "$f(0) = 4$；當 $x < 0$ 時，$f(x) = 2x^2 + 6x + 4$"
      },
      {
        "key": "D",
        "text": "$f(0) = 0$；當 $x < 0$ 時，$f(x) = 2x^2 - 6x + 4$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "奇函數在原點定義必有 $f(0)=0$。當 $x<0$ 時 $-x>0$，則 $f(x) = -f(-x) = -[2(-x)^2 - 6(-x) + 4] = -2x^2 - 6x - 4$。故選 A。"
  },
  {
    "id": "Q18",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "二次函數對稱軸含參動態最值與單調性限制",
    "stem": "設動態二次函數族解析式為 $f(x) = x^2 - 4ax + 3$（其中參數 $a \\in \\mathbb{R}$）。(1) 取 $a = 1$，求解該曲線在區間 $[0, 3]$ 上的局部最大值與最小值；(2) 若該函數在區間 $[2, 5]$ 上始終保持單調遞增，確定參數 $a$ 的最大容許上限範圍。",
    "options": [
      {
        "key": "A",
        "text": "最大值為 $3$，最小值為 $-1$；$a \\le 1$"
      },
      {
        "key": "B",
        "text": "最大值為 $3$，最小值為 $0$；$a \\ge 1$"
      },
      {
        "key": "C",
        "text": "最大值為 $4$，最小值為 $-1$；$a \\le 2$"
      },
      {
        "key": "D",
        "text": "最大值為 $3$，最小值為 $-1$；$a \\ge 2$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "(1) $a=1$ 時對稱軸為 $x=2 \\in [0, 3]$，頂點最小值 $f(2) = 4 - 8 + 3 = -1$，端點值 $f(0)=3, f(3)=0$，故最大值為 3。(2) 開口向上在 $[2, 5]$ 遞增要求對稱軸 $2a \\le 2 \\implies a \\le 1$。故選 A。"
  },
  {
    "id": "Q19",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "四校聯考拓展·二次型恆正係數非退化判別",
    "stem": "【四校聯考思維深化】若二次曲線 $y = kx^2 + 4x + 2k$ 在整個實數域 $\\mathbb{R}$ 上的取值均嚴格大於零，試綜合二次係數符號與判別式，計算參數 $k$ 的實數取值區間。",
    "options": [
      {
        "key": "A",
        "text": "$k > \\sqrt{2}$（即 $(\\sqrt{2}, +\\infty)$）"
      },
      {
        "key": "B",
        "text": "$k < -\\sqrt{2}$ 或 $k > \\sqrt{2}$"
      },
      {
        "key": "C",
        "text": "$k > 2$"
      },
      {
        "key": "D",
        "text": "$0 < k < \\sqrt{2}$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "恆正要求二次項係數 $k > 0$ 且判別式 $\\Delta = 16 - 8k^2 < 0 \\implies k^2 > 2$。結合 $k>0$ 解得 $k > \\sqrt{2}$。故選 A。"
  },
  {
    "id": "Q20",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "四校聯考拓展·等差步長函數遞推賦值",
    "stem": "【四校聯考思維深化】設全實數函數 $f(x)$ 滿足關係式 $f(x) = f(x + 1) + 2$。若測得基底值 $f(0) = 24$，求解自變量經過 10 步遞推後的函數值 $f(10)$。",
    "options": [
      {
        "key": "A",
        "text": "$4$"
      },
      {
        "key": "B",
        "text": "$44$"
      },
      {
        "key": "C",
        "text": "$14$"
      },
      {
        "key": "D",
        "text": "$2$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "改寫為 $f(x+1) = f(x) - 2$，自變量每增加 1，函數值扣減 2。遞推 10 步得 $f(10) = 24 - 10 \\times 2 = 4$。故選 A。"
  },
  {
    "id": "Q21",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "四校聯考拓展·分段函數復合代入與絕對值解集",
    "stem": "【四校聯考思維深化】設分段函數 $f(x) = \\begin{cases} -6x, & 0 < x \\le 3 \\\\ x^2 - 6x + 12, & x > 3 \\end{cases}$。求不等式 $f(\\frac{1}{3} - 2|x|) + f(4) < 0$ 的對稱實數解區間。",
    "options": [
      {
        "key": "A",
        "text": "$(-\\frac{1}{12}, \\frac{1}{12})$"
      },
      {
        "key": "B",
        "text": "$(-\\frac{1}{6}, \\frac{1}{6})$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, -\\frac{1}{12}) \\cup (\\frac{1}{12}, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(-\\frac{1}{3}, \\frac{1}{3})$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "計算 $f(4) = 16 - 24 + 12 = 4$。不等式化為 $f(t) < -4$。當 $t \\in (0, 3]$ 時 $-6t < -4 \\implies t > 2/3$。即 $1/3 - 2|x| > 2/3$ 產生對應有界絕對值區間。故選 A。"
  },
  {
    "id": "Q22",
    "is_preserved": false,
    "type": "comprehensive",
    "topic": "四校聯考拓展·偶函數負向遞減轉正向指數比大小",
    "stem": "【四校聯考思維深化】已知定義在 $\\mathbb{R}$ 上的偶函數 $f(x)$ 在負無窮區間 $(-\\infty, 0)$ 上單調遞減。若給定三組指數參量 $u = f(2^{-\\frac{5}{2}}), v = f(3^{-\\frac{3}{5}}), w = f(-2)$，試推導 $u, v, w$ 的遞增排列不等關係式。",
    "options": [
      {
        "key": "A",
        "text": "$u < v < w$"
      },
      {
        "key": "B",
        "text": "$w < v < u$"
      },
      {
        "key": "C",
        "text": "$v < u < w$"
      },
      {
        "key": "D",
        "text": "$u < w < v$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "explanation": "偶函數在 $[0, +\\infty)$ 上單調遞增，$w = f(-2) = f(2)$。比較自變量大小：$0 < 2^{-2.5} < 3^{-0.6} < 2$，利用遞增性即得 $u < v < w$。故選 A。"
  }
],
  practice: [
  {
    "id": "P01",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "拋物線開口方向與係數符號",
    "stem": "在平面直角坐標系中，二次曲線 $y = 2x^2 - 3x + 1$ 其頂點為曲線的最低點，故該拋物線圖象的開口朝向為（　　）",
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
      },
      {
        "key": "E",
        "text": "隨自變量變化而改變"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.1】：二次函數 $y=ax^2+bx+c$，當 $a>0$ 時拋物線開口向上，頂點為最低點。",
    "explanation": "二次項係數 $a = 2 > 0$，因此拋物線開口朝上，頂點即為最低點。故選 A。"
  },
  {
    "id": "P02",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "拋物線開口方向與係數符號",
    "stem": "若二次曲線 $y = (a - 1)x^2 - 3x + 1$ 的圖象開口向上（呈向上凹形態），則整數 $a$ 的最小可能值為（　　）",
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
        "text": "$2$"
      },
      {
        "key": "D",
        "text": "$3$"
      },
      {
        "key": "E",
        "text": "$-1$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §2.3.1】：拋物線開口向上要求最高次係數大於 0，且係數不能為 0。",
    "explanation": "開口向上需滿足二次項係數 $a - 1 > 0 \\implies a > 1$。滿足 $a > 1$ 的最小整數為 $a = 2$。故選 C。"
  },
  {
    "id": "P03",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "拋物線開口方向與係數符號",
    "stem": "考察二次多項式 $f(x) = 2x^2 - 3x + 1$。當自變量向兩端無限增大或減小時，對應曲線兩翼向上延展，判定該拋物線的開口朝向為（　　）",
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
        "text": "水平向右"
      },
      {
        "key": "D",
        "text": "水平向左"
      },
      {
        "key": "E",
        "text": "無法判定"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.1】：極限趨勢由最高次項決定，二次項係數為正數，兩側均趨於正無窮，開口向上。",
    "explanation": "最高次係數 $a = 2 > 0$，當 $x \\to \\pm\\infty$ 時 $f(x) \\to +\\infty$，拋物線開口朝上。故選 A。"
  },
  {
    "id": "P04",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "因式分解型不等式求解",
    "stem": "求滿足乘積式 $(x - 1)(4 - x) > 0$ 的全體實數自變量集合，寫作開區間形式為（　　）",
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
        "text": "$(-4, -1)$"
      },
      {
        "key": "E",
        "text": "$(4, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：先將 $(4-x)$ 提取負號化為標準形式 $(x-1)(x-4)<0$，開口朝上小於取兩根中間。",
    "explanation": "原式等價於 $-(x-1)(x-4) > 0 \\iff (x-1)(x-4) < 0$。對應兩根為 1 和 4，小於號取兩根之間，解集為 $(1, 4)$。故選 A。"
  },
  {
    "id": "P05",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "因式分解型不等式求解",
    "stem": "求二次乘積不等關係 $(x - 2)(x - 5) < 0$ 所約束的實數範圍，記為開區間（　　）",
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
        "text": "$[-2, 5]$"
      },
      {
        "key": "D",
        "text": "$(-5, -2)$"
      },
      {
        "key": "E",
        "text": "$(5, +\\infty)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：一元二次不等式標準型 $(x-x_1)(x-x_2)<0$（$x_1<x_2$）解集為 $(x_1, x_2)$。",
    "explanation": "對應方程兩根為 $x_1 = 2, x_2 = 5$，二次項係數為 1 > 0，小於號取中間，解集為 $(2, 5)$。故選 A。"
  },
  {
    "id": "P06",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "因式分解型不等式求解",
    "stem": "二次多項式 $x^2 - 5x + 4$ 呈現負值（即 $x^2 - 5x + 4 < 0$）時，變量 $x$ 所處的區間為（　　）",
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
        "text": "$(2, 3)$"
      },
      {
        "key": "D",
        "text": "$[-1, 4]$"
      },
      {
        "key": "E",
        "text": "$(-4, -1)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：十字相乘分解因式：$x^2-5x+4=(x-1)(x-4)$。",
    "explanation": "因式分解得 $(x-1)(x-4) < 0$。兩根分別為 1 和 4，解集為開區間 $(1, 4)$。故選 A。"
  },
  {
    "id": "P07",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "判別式與二次函數圖象交點",
    "stem": "函數 $y = -(x - 1)^2$ 的頂點恰落在水平坐標軸上，此拋物線與該軸相交之公共點共有（　　）",
    "options": [
      {
        "key": "A",
        "text": "$0$ 個"
      },
      {
        "key": "B",
        "text": "$1$ 個"
      },
      {
        "key": "C",
        "text": "$2$ 個"
      },
      {
        "key": "D",
        "text": "$3$ 個"
      },
      {
        "key": "E",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §2.3.1】：頂點落在坐標軸上即方程有重根，判別式 $\\Delta = 0$，拋物線與軸相切，恰有 1 個交點。",
    "explanation": "當 $y = 0$ 時，$-(x-1)^2 = 0 \\implies x = 1$。拋物線與橫軸僅在切點 $(1, 0)$ 相交，交點個數為 1 個。故選 B。"
  },
  {
    "id": "P08",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "判別式與二次函數圖象交點",
    "stem": "曲線 $y = -x^2 + 2x + 1$ 的判別式大於 0，它與水平軸的交截點總數計有（　　）",
    "options": [
      {
        "key": "A",
        "text": "$0$ 個"
      },
      {
        "key": "B",
        "text": "$1$ 個"
      },
      {
        "key": "C",
        "text": "$2$ 個"
      },
      {
        "key": "D",
        "text": "$3$ 個"
      },
      {
        "key": "E",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §2.3.1】：$\\Delta = b^2 - 4ac > 0$ 時，對應方程有兩個不同實數根，圖象與橫軸有 2 個交點。",
    "explanation": "判別式 $\\Delta = 2^2 - 4(-1)(1) = 4 + 4 = 8 > 0$，故拋物線與 $x$ 軸有 2 個不同交點。故選 C。"
  },
  {
    "id": "P09",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "判別式與二次函數圖象交點",
    "stem": "方程 $-x^2 + 2x - 1 = 0$ 具備重根，反映出該二次圖象與直線 $y = 0$ 的相交（碰觸）次數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$0$ 次"
      },
      {
        "key": "B",
        "text": "$1$ 次"
      },
      {
        "key": "C",
        "text": "$2$ 次"
      },
      {
        "key": "D",
        "text": "$3$ 次"
      },
      {
        "key": "E",
        "text": "無數次"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §2.3.1】：二重實根對應拋物線頂點切於橫軸，碰觸（相切）次數為 1 次。",
    "explanation": "$-(x-1)^2 = 0 \\implies x_1 = x_2 = 1$，圖象與橫軸相切於 $(1, 0)$，碰觸次數為 1 次。故選 B。"
  },
  {
    "id": "P10",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "將代數關係 $3 - 4x + x^2 < 0$ 按二次項正係數規格整理，其降冪排列的正則標準形式為（　　）",
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
        "text": "$-x^2 + 4x - 3 > 0$"
      },
      {
        "key": "E",
        "text": "$x^2 - 3x + 4 < 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：按加法交換律將降冪排列：二次項 $x^2$、一次項 $-4x$、常數項 $3$。",
    "explanation": "重排各項次序即可得到標準二次不等式形式 $x^2 - 4x + 3 < 0$。故選 A。"
  },
  {
    "id": "P11",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "若將關係式 $-x^2 + 5x - 4 > 0$ 進行反號運算，所得首項係數為 1 的等價形式為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 5x + 4 < 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 5x + 4 > 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 5x - 4 < 0$"
      },
      {
        "key": "D",
        "text": "$x^2 - 4x + 5 < 0$"
      },
      {
        "key": "E",
        "text": "$-x^2 - 5x + 4 < 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：不等式兩端同乘以負數，必須翻轉不等號方向（$>$ 變 $<$）。",
    "explanation": "兩邊同乘 $-1$，每一項符號變號且不等號由 $>$ 轉變為 $<$，得 $x^2 - 5x + 4 < 0$。故選 A。"
  },
  {
    "id": "P12",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "把含外括號負號的二次項式 $-(x^2 - 4x + 3) > 0$ 轉化為首項為正的規範寫法是（　　）",
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
        "text": "$x^2 + 4x + 3 < 0$"
      },
      {
        "key": "D",
        "text": "$x^2 - 3x + 4 < 0$"
      },
      {
        "key": "E",
        "text": "$-(x^2 + 4x - 3) < 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：兩邊同乘 $-1$ 去掉外層負號，同時翻轉不等號方向。",
    "explanation": "兩端乘 $-1$ 後得到 $x^2 - 4x + 3 < 0$。故選 A。"
  },
  {
    "id": "P13",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "將式子 $6x - 2x^2 \\le 0$ 經除以負數 $-2$ 簡化後，轉化出的等價標準關係為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 3x \\ge 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 3x \\le 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 3x \\ge 0$"
      },
      {
        "key": "D",
        "text": "$2x^2 - 6x \\le 0$"
      },
      {
        "key": "E",
        "text": "$x^2 - 6x \\ge 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：$-2x^2 + 6x \\le 0$，除以負數 $-2$，不等號 $\\le$ 變為 $\\ge$。",
    "explanation": "原式整理為 $-2x^2 + 6x \\le 0$，兩邊同除以 $-2$ 得 $x^2 - 3x \\ge 0$。故選 A。"
  },
  {
    "id": "P14",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "化簡關係式 $-2x^2 + 8x \\le 0$ 使首項係數變為 1，整理後的標準關係為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 4x \\ge 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 4x \\le 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 4x \\ge 0$"
      },
      {
        "key": "D",
        "text": "$x^2 - 8x \\ge 0$"
      },
      {
        "key": "E",
        "text": "$-x^2 + 4x \\ge 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：兩端同除以 $-2$，注意改變不等號方向。",
    "explanation": "除以 $-2$ 後得到 $x^2 - 4x \\ge 0$。故選 A。"
  },
  {
    "id": "P15",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "不等式負係數化正與符號變換",
    "stem": "將因式乘積 $2x(3 - x) \\le 0$ 中的因數 $3 - x$ 改寫為 $x - 3$ 後，對應的標準不等關係為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$x^2 - 3x \\ge 0$"
      },
      {
        "key": "B",
        "text": "$x^2 - 3x \\le 0$"
      },
      {
        "key": "C",
        "text": "$x^2 + 3x \\ge 0$"
      },
      {
        "key": "D",
        "text": "$2x(x - 3) \\le 0$"
      },
      {
        "key": "E",
        "text": "$x^2 - 9 \\ge 0$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：$3-x = -(x-3)$，提出負號後兩邊同除以 $-2$ 變號。",
    "explanation": "$2x(3-x) = -2x(x-3) \\le 0 \\iff 2x(x-3) \\ge 0 \\iff x^2 - 3x \\ge 0$。故選 A。"
  },
  {
    "id": "P16",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "集合與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "集合交並集與一元二次不等式解集",
    "stem": "【配對題】已知集合 $P = \\{x \\in \\mathbb{R} \\mid x^2 - 7x + 10 > 0\\}$，閉區間 $Q = [-1, 3]$。請將下列集合運算項目與其正確的區間結果進行配對：<br>① 集合 $P$ 的區間表示<br>② 集合 $Q$ 的區間表示<br>③ 交集 $P \\cap Q$<br>④ 並集 $P \\cup Q$",
    "pairs": [
      {
        "left": "集合 $P$ 的區間表示",
        "right": "$(-\\infty, 2) \\cup (5, +\\infty)$"
      },
      {
        "left": "集合 $Q$ 的區間表示",
        "right": "$[-1, 3]$"
      },
      {
        "left": "交集 $P \\cap Q$",
        "right": "$[-1, 2)$"
      },
      {
        "left": "並集 $P \\cup Q$",
        "right": "$(-\\infty, 3] \\cup (5, +\\infty)$"
      }
    ],
    "leftItems": [
      "集合 $P$ 的區間表示",
      "集合 $Q$ 的區間表示",
      "交集 $P \\cap Q$",
      "並集 $P \\cup Q$"
    ],
    "rightItems": [
      "$(-\\infty, 2) \\cup (5, +\\infty)$",
      "$[-1, 3]$",
      "$[-1, 2)$",
      "$(-\\infty, 3] \\cup (5, +\\infty)$"
    ],
    "hint": "【公式背誦建議 §2.3.2】：因式分解 $x^2-7x+10=(x-2)(x-5)>0$ 得 $P=(-\\infty, 2)\\cup(5, +\\infty)$，畫數軸求交集與並集。",
    "explanation": "由 $(x-2)(x-5)>0$ 得 $P = (-\\infty, 2) \\cup (5, +\\infty)$。與 $Q = [-1, 3]$ 取公共部分，得 $P \\cap Q = [-1, 2)$；兩者合併得 $P \\cup Q = (-\\infty, 3] \\cup (5, +\\infty)$。",
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow (-\\infty, 2) \\cup (5, +\\infty)$, ② $\\rightarrow [-1, 3]$, ③ $\\rightarrow [-1, 2)$, ④ $\\rightarrow (-\\infty, 3] \\cup (5, +\\infty)$"
      },
      {
        "key": "B",
        "text": "① $\\rightarrow [-1, 3]$, ② $\\rightarrow (-\\infty, 2) \\cup (5, +\\infty)$, ③ $\\rightarrow [-1, 2)$, ④ $\\rightarrow (-\\infty, 3] \\cup (5, +\\infty)$"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow (-\\infty, 2) \\cup (5, +\\infty)$, ② $\\rightarrow [-1, 3]$, ③ $\\rightarrow (5, +\\infty)$, ④ $\\rightarrow [-1, 2)$"
      },
      {
        "key": "D",
        "text": "① $\\rightarrow (2, 5)$, ② $\\rightarrow [-1, 3]$, ③ $\\rightarrow [2, 3]$, ④ $\\rightarrow [-1, 5)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P17",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "集合與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "集合交並集與一元二次不等式解集",
    "stem": "【配對題】已知集合 $M = \\{x \\mid (x - 3)(x - 6) > 0\\}$，區間 $N = [0, 4]$。請將下列集合表達式與其正確的區間範圍進行配對：<br>① 集合 $M$ 的區間表示<br>② 集合 $N$ 的區間表示<br>③ 交集 $M \\cap N$<br>④ 並集 $M \\cup N$",
    "pairs": [
      {
        "left": "集合 $M$ 的區間表示",
        "right": "$(-\\infty, 3) \\cup (6, +\\infty)$"
      },
      {
        "left": "集合 $N$ 的區間表示",
        "right": "$[0, 4]$"
      },
      {
        "left": "交集 $M \\cap N$",
        "right": "$[0, 3)$"
      },
      {
        "left": "並集 $M \\cup N$",
        "right": "$(-\\infty, 4] \\cup (6, +\\infty)$"
      }
    ],
    "leftItems": [
      "集合 $M$ 的區間表示",
      "集合 $N$ 的區間表示",
      "交集 $M \\cap N$",
      "並集 $M \\cup N$"
    ],
    "rightItems": [
      "$(-\\infty, 3) \\cup (6, +\\infty)$",
      "$[0, 4]$",
      "$[0, 3)$",
      "$(-\\infty, 4] \\cup (6, +\\infty)$"
    ],
    "hint": "【公式背誦建議 §2.3.2】：大於號取兩根之外：$M=(-\\infty, 3)\\cup(6, +\\infty)$，在數軸上求與 $[0,4]$ 的交疊與合併。",
    "explanation": "$M = (-\\infty, 3) \\cup (6, +\\infty)$。與 $N = [0, 4]$ 交集為 $[0, 3)$，並集為 $(-\\infty, 4] \\cup (6, +\\infty)$。",
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow (-\\infty, 3) \\cup (6, +\\infty)$, ② $\\rightarrow [0, 4]$, ③ $\\rightarrow [0, 3)$, ④ $\\rightarrow (-\\infty, 4] \\cup (6, +\\infty)$"
      },
      {
        "key": "B",
        "text": "① $\\rightarrow [0, 4]$, ② $\\rightarrow (-\\infty, 3) \\cup (6, +\\infty)$, ③ $\\rightarrow [0, 3)$, ④ $\\rightarrow (-\\infty, 4] \\cup (6, +\\infty)$"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow (3, 6)$, ② $\\rightarrow [0, 4]$, ③ $\\rightarrow (3, 4]$, ④ $\\rightarrow [0, 6)$"
      },
      {
        "key": "D",
        "text": "① $\\rightarrow (-\\infty, 3) \\cup (6, +\\infty)$, ② $\\rightarrow [0, 4]$, ③ $\\rightarrow (6, +\\infty)$, ④ $\\rightarrow [0, 3)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P18",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "集合與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "集合交並集與一元二次不等式解集",
    "stem": "【配對題】已知集合 $S = \\{x \\mid (x - 1)(x - 4) > 0\\}$，區間 $T = [-2, 2]$。請將下列集合運算項目與其正確的區間結果進行配對：<br>① 集合 $S$ 的區間表示<br>② 集合 $T$ 的區間表示<br>③ 交集 $S \\cap T$<br>④ 並集 $S \\cup T$",
    "pairs": [
      {
        "left": "集合 $S$ 的區間表示",
        "right": "$(-\\infty, 1) \\cup (4, +\\infty)$"
      },
      {
        "left": "集合 $T$ 的區間表示",
        "right": "$[-2, 2]$"
      },
      {
        "left": "交集 $S \\cap T$",
        "right": "$[-2, 1)$"
      },
      {
        "left": "並集 $S \\cup T$",
        "right": "$(-\\infty, 2] \\cup (4, +\\infty)$"
      }
    ],
    "leftItems": [
      "集合 $S$ 的區間表示",
      "集合 $T$ 的區間表示",
      "交集 $S \\cap T$",
      "並集 $S \\cup T$"
    ],
    "rightItems": [
      "$(-\\infty, 1) \\cup (4, +\\infty)$",
      "$[-2, 2]$",
      "$[-2, 1)$",
      "$(-\\infty, 2] \\cup (4, +\\infty)$"
    ],
    "hint": "【公式背誦建議 §2.3.2】：$S = (-\\infty, 1) \\cup (4, +\\infty)$，與 $[-2, 2]$ 取公共部分即為 $[-2, 1)$。",
    "explanation": "解得 $S = (-\\infty, 1) \\cup (4, +\\infty)$。交集 $S \\cap T = [-2, 1)$，並集 $S \\cup T = (-\\infty, 2] \\cup (4, +\\infty)$。",
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$, ② $\\rightarrow [-2, 2]$, ③ $\\rightarrow [-2, 1)$, ④ $\\rightarrow (-\\infty, 2] \\cup (4, +\\infty)$"
      },
      {
        "key": "B",
        "text": "① $\\rightarrow [-2, 2]$, ② $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$, ③ $\\rightarrow [-2, 1)$, ④ $\\rightarrow (-\\infty, 2] \\cup (4, +\\infty)$"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow (1, 4)$, ② $\\rightarrow [-2, 2]$, ③ $\\rightarrow (1, 2]$, ④ $\\rightarrow [-2, 4)$"
      },
      {
        "key": "D",
        "text": "① $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$, ② $\\rightarrow [-2, 2]$, ③ $\\rightarrow (4, +\\infty)$, ④ $\\rightarrow [-2, 1)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P19",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "二次函數零點判別式與恆成立",
    "stem": "若二次曲線 $y = x^2 - 6x + c$ 與水平橫軸只有單個碰觸點（即相切），則實數常數 $c =$（　　）",
    "options": [
      {
        "key": "A",
        "text": "$6$"
      },
      {
        "key": "B",
        "text": "$9$"
      },
      {
        "key": "C",
        "text": "$-9$"
      },
      {
        "key": "D",
        "text": "$3$"
      },
      {
        "key": "E",
        "text": "$36$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §2.3.1】：與橫軸僅有單個碰觸點意味著方程有重根，判別式 $\\Delta = b^2 - 4ac = 0$。",
    "explanation": "$\\Delta = (-6)^2 - 4(1)(c) = 36 - 4c = 0 \\implies c = 9$。故選 B。"
  },
  {
    "id": "P20",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "二次函數零點判別式與恆成立",
    "stem": "當參數 $k > 9$ 時，二次整式 $x^2 - 6x + k$ 始終保持嚴格正值，此時該不等式成立的自變量全域是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "$(3, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, 3)$"
      },
      {
        "key": "D",
        "text": "$[3, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$\\varnothing$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.3】：二次項係數 $a = 1 > 0$ 且 $\\Delta = 36 - 4k < 0$（因 $k > 9$），圖象全在橫軸上方，解集為全體實數 $\\mathbb{R}$。",
    "explanation": "因為開口向上且 $\\Delta = 36 - 4k < 0$，拋物線與 $x$ 軸無交點且恆位於橫軸上方，故在實數集 $\\mathbb{R}$ 上恆成立。故選 A。"
  },
  {
    "id": "P21",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "二次函數零點判別式與恆成立",
    "stem": "若二次曲線 $y = x^2 - 6x + c$ 與橫軸僅有 1 個交點，則差值計算量 $c - 1 =$（　　）",
    "options": [
      {
        "key": "A",
        "text": "$7$"
      },
      {
        "key": "B",
        "text": "$8$"
      },
      {
        "key": "C",
        "text": "$9$"
      },
      {
        "key": "D",
        "text": "$10$"
      },
      {
        "key": "E",
        "text": "$-8$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §2.3.1】：由重根得 $\\Delta = 36 - 4c = 0 \\implies c = 9$，進一步計算 $c - 1$。",
    "explanation": "由相切條件知 $\\Delta = 36 - 4c = 0 \\implies c = 9$，因此 $c - 1 = 9 - 1 = 8$。故選 B。"
  },
  {
    "id": "P22",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "函數的概念及其表示",
    "chapter": "3.1 函數的概念及其表示",
    "topic": "具體函數定義域求解",
    "stem": "式子 $y = \\frac{\\sqrt{x + 2}}{x - 1}$ 可在實數範圍內正常運算時，自變量 $x$ 的容許數集寫作區間聯集為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$[-2, 1) \\cup (1, +\\infty)$"
      },
      {
        "key": "B",
        "text": "$(-2, 1) \\cup (1, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$[-2, +\\infty)$"
      },
      {
        "key": "D",
        "text": "$(1, +\\infty)$"
      },
      {
        "key": "E",
        "text": "$[-2, 1]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §3.1.2】：偶次根式被開方數 $x+2\\ge 0$，分母 $x-1\\ne 0$。",
    "explanation": "由根式限制 $x+2 \\ge 0 \\implies x \\ge -2$；由分母限制 $x - 1 \\ne 0 \\implies x \\ne 1$。取交集得定義域為 $[-2, 1) \\cup (1, +\\infty)$。故選 A。"
  },
  {
    "id": "P23",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "函數的概念及其表示",
    "chapter": "3.1 函數的概念及其表示",
    "topic": "具體函數求值",
    "stem": "若映射規律由 $f(x) = \\frac{\\sqrt{x + 2}}{x - 1}$ 給出，將 $x = 2$ 帶入所得函數值 $f(2) =$（　　）",
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
        "text": "$3$"
      },
      {
        "key": "D",
        "text": "$4$"
      },
      {
        "key": "E",
        "text": "$0$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §3.1.1】：代入求值：分子 $\\sqrt{2+2}=\\sqrt{4}=2$，分母 $2-1=1$。",
    "explanation": "$f(2) = \\frac{\\sqrt{2+2}}{2-1} = \\frac{\\sqrt{4}}{1} = 2$。故選 B。"
  },
  {
    "id": "P24",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "函數的概念及其表示",
    "chapter": "3.1 函數的概念及其表示",
    "topic": "具體函數求值",
    "stem": "給定算式 $f(x) = \\frac{\\sqrt{x + 2}}{x - 1}$，評估差值 $f(2) - 1 =$（　　）",
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
        "text": "$2$"
      },
      {
        "key": "D",
        "text": "$-1$"
      },
      {
        "key": "E",
        "text": "$3$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §3.1.1】：先求 $f(2)=2$，再計算 $f(2)-1$。",
    "explanation": "$f(2) = \\frac{\\sqrt{4}}{1} = 2$，故 $f(2) - 1 = 2 - 1 = 1$。故選 B。"
  },
  {
    "id": "P25",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "函數的基本性質",
    "chapter": "3.2 函數的基本性質",
    "topic": "奇偶性定義與參數確定",
    "stem": "若解析式 $f(x) = (m - 1)x^2 + 2x$ 在實數軸 $\\mathbb{R}$ 上具備關於坐標原點中心對稱性（奇函數），則參量 $m =$（　　）",
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
        "text": "$1$"
      },
      {
        "key": "D",
        "text": "$2$"
      },
      {
        "key": "E",
        "text": "$3$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §3.2.2】：多項式函數為奇函數時，偶次項係數必須全為 0，即 $m - 1 = 0$。",
    "explanation": "奇函數滿足 $f(-x) = -f(x)$，代入得 $(m-1)x^2 - 2x = -[(m-1)x^2 + 2x] = -(m-1)x^2 - 2x$，因此 $(m-1)x^2 = -(m-1)x^2 \\implies 2(m-1)x^2 = 0 \\implies m - 1 = 0 \\implies m = 1$。故選 C。"
  },
  {
    "id": "P26",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數的基本性質",
    "chapter": "3.2 函數的基本性質",
    "topic": "偶函數性質與對稱求值",
    "stem": "對稱於縱軸的偶對稱曲線 $g(x)$ 於正半側滿足 $g(x) = x^2 - 2x$（$x \\ge 0$），則負側數值 $g(-3) =$（　　）",
    "options": [
      {
        "key": "A",
        "text": "$-3$"
      },
      {
        "key": "B",
        "text": "$0$"
      },
      {
        "key": "C",
        "text": "$3$"
      },
      {
        "key": "D",
        "text": "$9$"
      },
      {
        "key": "E",
        "text": "$15$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §3.2.2】：偶函數滿足 $g(-x) = g(x)$，故 $g(-3) = g(3)$，代入非負側解析式計算。",
    "explanation": "由偶函數定義，$g(-3) = g(3) = 3^2 - 2(3) = 9 - 6 = 3$。故選 C。"
  },
  {
    "id": "P27",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數的基本性質",
    "chapter": "3.2 函數的基本性質",
    "topic": "偶函數性質與對稱求值",
    "stem": "設偶映射 $g(x)$ 當 $x \\ge 0$ 時為 $x^2 - 2x$，測算數值 $g(-3) - 1 =$（　　）",
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
        "text": "$3$"
      },
      {
        "key": "D",
        "text": "$4$"
      },
      {
        "key": "E",
        "text": "$-1$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §3.2.2】：先求 $g(-3) = g(3) = 3$，再計算 $g(-3) - 1$。",
    "explanation": "$g(-3) = g(3) = 3^2 - 2(3) = 3$，故 $g(-3) - 1 = 3 - 1 = 2$。故選 B。"
  },
  {
    "id": "P28",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "特殊二次不等式解集",
    "stem": "考察二次多項式不等式 $x^2 + 4 > 0$，使其成立的實數自變量集合是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$\\mathbb{R}$"
      },
      {
        "key": "B",
        "text": "$(2, +\\infty)$"
      },
      {
        "key": "C",
        "text": "$(-\\infty, -2)$"
      },
      {
        "key": "D",
        "text": "$\\varnothing$"
      },
      {
        "key": "E",
        "text": "$[-2, 2]$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §2.3.2】：對任意實數 $x$，平方數 $x^2 \\ge 0$，故 $x^2 + 4 \\ge 4 > 0$ 恆成立。",
    "explanation": "對所有實數 $x$，均有 $x^2 \\ge 0$，因此 $x^2 + 4 \\ge 4 > 0$ 恆成立，解集為全體實數集 $\\mathbb{R}$。故選 A。"
  },
  {
    "id": "P29",
    "type": "single_choice_5",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "冪函數定義與單調性求參",
    "stem": "單項冪式 $g(x) = (m^2 - 2m - 2)x^{m^2 - 5m + 5}$ 於開區間 $(0, +\\infty)$ 上單調遞減（向下傾斜），則實數參數 $m =$（　　）",
    "options": [
      {
        "key": "A",
        "text": "$-1$"
      },
      {
        "key": "B",
        "text": "$1$"
      },
      {
        "key": "C",
        "text": "$2$"
      },
      {
        "key": "D",
        "text": "$3$"
      },
      {
        "key": "E",
        "text": "$4$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "hint": "【公式背誦建議 §3.3.1】：冪函數定義要求係數 $m^2 - 2m - 2 = 1$，且在 $(0,+\\infty)$ 單調遞減要求指數 $m^2 - 5m + 5 < 0$。",
    "explanation": "① 冪函數定義要求係數為 1：$m^2 - 2m - 2 = 1 \\iff m^2 - 2m - 3 = 0 \\implies m = 3$ 或 $m = -1$；② 在 $(0,+\\infty)$ 單調遞減要求指數小於 0：$m^2 - 5m + 5 < 0$。當 $m = 3$ 時，指數為 $3^2 - 15 + 5 = -1 < 0$（符合）；當 $m = -1$ 時，指數為 $1 + 5 + 5 = 11 > 0$（遞增，捨去）。故 $m = 3$。選 D。"
  },
  {
    "id": "P30",
    "type": "single_choice_5",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "冪函數定義與單調性求參",
    "stem": "單項冪曲線 $g(x) = (m^2 - 2m - 2)x^{m^2 - 5m + 5}$ 在正半軸單調下降，計算代數差值 $m - 1 =$（　　）",
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
        "text": "$2$"
      },
      {
        "key": "D",
        "text": "$3$"
      },
      {
        "key": "E",
        "text": "$-2$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §3.3.1】：求得 $m = 3$ 後計算 $m - 1$。",
    "explanation": "由冪函數定義與遞減條件求得 $m = 3$，故 $m - 1 = 3 - 1 = 2$。故選 C。"
  },
  {
    "id": "P31",
    "type": "plotting",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "冪函數圖象特徵與公共定點",
    "stem": "【作圖描點任務】各類形如 $y = x^\\alpha$ 的冪函數曲線簇，在平面第一象限必然匯聚穿過一個公共不動點。請在直角坐標系網格中，點擊描出該公共定點的精確坐標：",
    "formula": "$y = x^\\alpha$",
    "targetPoints": [
      {
        "n": 1,
        "an": 1,
        "x": 1,
        "y": 1,
        "label": "(1, 1)"
      }
    ],
    "gridConfig": {
      "minN": -1,
      "maxN": 4,
      "minY": -1,
      "maxY": 4,
      "stepN": 1,
      "stepY": 1,
      "minX": -1,
      "maxX": 4
    },
    "hint": "【公式背誦建議 §3.3.1】：當自變量為 1 時，無論指數 $\\alpha$ 取何值，$1^\\alpha = 1$，故所有冪函數圖象在第一象限必過定點 $(1, 1)$。",
    "explanation": "對任意實數指數 $\\alpha$，當 $x = 1$ 時，$y = 1^\\alpha = 1$。因此所有冪函數在第一象限必過公共定點 $(1, 1)$。在網格坐標 $(1, 1)$ 處點擊描點即可。",
    "target_point": [
      1,
      1
    ],
    "targetPoint": "(1, 1)",
    "options": [
      {
        "key": "A",
        "text": "$(1, 1)$"
      },
      {
        "key": "B",
        "text": "$(0, 0)$"
      },
      {
        "key": "C",
        "text": "$(1, 0)$"
      },
      {
        "key": "D",
        "text": "$(0, 1)$"
      },
      {
        "key": "E",
        "text": "$(2, 2)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P32",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "第一象限冪指數大小比較",
    "stem": "在平面直角坐標系第一象限且 $x > 1$ 側，四條單項冪曲線 $y=x^a, y=x^b, y=x^c, y=x^d$ 沿縱向自高向低排列，則四個冪指數的大小關係順序為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$a > b > c > d$"
      },
      {
        "key": "B",
        "text": "$d > c > b > a$"
      },
      {
        "key": "C",
        "text": "$a > c > b > d$"
      },
      {
        "key": "D",
        "text": "$b > a > c > d$"
      },
      {
        "key": "E",
        "text": "$a = b = c = d$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【公式背誦建議 §3.3.2】：在第一象限直線 $x=1$ 右側（$x>1$），圖象位置越高的冪函數，其指數越大；即「指大圖高」。",
    "explanation": "在區間 $(1,+\\infty)$ 上，冪函數圖象高度與指數大小呈正相關。曲線自高向低依次為 $x^a, x^b, x^c, x^d$，因此其指數大小關係為 $a > b > c > d$。故選 A。"
  },
  {
    "id": "P33",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "冪函數公共定點坐標運算",
    "stem": "設單項冪曲線必過匯合點 $(x_0, y_0) = (1, 1)$，則橫縱坐標和的倍數算式 $2(x_0 + y_0) - 2 =$（　　）",
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
        "text": "$2$"
      },
      {
        "key": "D",
        "text": "$4$"
      },
      {
        "key": "E",
        "text": "$6$"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【公式背誦建議 §3.3.1】：定點坐標為 $(1, 1)$，代入得 $2(1 + 1) - 2 = 4 - 2 = 2$。",
    "explanation": "將 $x_0 = 1, y_0 = 1$ 代入算式，得 $2(1 + 1) - 2 = 2(2) - 2 = 2$。故選 C。"
  },
  {
    "id": "P34",
    "type": "single_choice_5",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "冪函數",
    "chapter": "3.3 冪函數",
    "topic": "冪函數公共定點坐標運算",
    "stem": "已知單項冪曲線簇經過公共基點 $(1, 1)$。記該基點橫坐標為 $x_0$，則折半數值 $0.5x_0 =$（　　）",
    "options": [
      {
        "key": "A",
        "text": "$0.25$"
      },
      {
        "key": "B",
        "text": "$0.5$"
      },
      {
        "key": "C",
        "text": "$1.0$"
      },
      {
        "key": "D",
        "text": "$1.5$"
      },
      {
        "key": "E",
        "text": "$2.0$"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【公式背誦建議 §3.3.1】：公共基點為 $(1, 1)$，橫坐標 $x_0 = 1$。",
    "explanation": "基點橫坐標 $x_0 = 1$，故 $0.5x_0 = 0.5 \\times 1 = 0.5$。故選 B。"
  },
  {
    "id": "P35",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與一元二次不等式",
    "chapter": "2.3 二次函數與一元二次方程、不等式",
    "topic": "一元二次不等式解法綜合配對",
    "stem": "【配對題】請將下列四個一元二次不等式條件與其正確的實數解區間進行配對：<br>① $x^2 - 5x + 6 \\le 0$<br>② $x^2 - 5x + 4 > 0$<br>③ $x^2 - 5x + 6 > 0$<br>④ $x^2 - 5x + 4 \\le 0$",
    "pairs": [
      {
        "left": "$x^2 - 5x + 6 \\le 0$",
        "right": "$[2, 3]$"
      },
      {
        "left": "$x^2 - 5x + 4 > 0$",
        "right": "$(-\\infty, 1) \\cup (4, +\\infty)$"
      },
      {
        "left": "$x^2 - 5x + 6 > 0$",
        "right": "$(-\\infty, 2) \\cup (3, +\\infty)$"
      },
      {
        "left": "$x^2 - 5x + 4 \\le 0$",
        "right": "$[1, 4]$"
      }
    ],
    "leftItems": [
      "$x^2 - 5x + 6 \\le 0$",
      "$x^2 - 5x + 4 > 0$",
      "$x^2 - 5x + 6 > 0$",
      "$x^2 - 5x + 4 \\le 0$"
    ],
    "rightItems": [
      "$[2, 3]$",
      "$(-\\infty, 1) \\cup (4, +\\infty)$",
      "$(-\\infty, 2) \\cup (3, +\\infty)$",
      "$[1, 4]$"
    ],
    "hint": "【公式背誦建議 §2.3.2】：因式分解十字相乘：$x^2-5x+6=(x-2)(x-3)$，兩根為 2, 3；$x^2-5x+4=(x-1)(x-4)$，兩根為 1, 4。小於取中間，大於取兩側。",
    "explanation": "① $(x-2)(x-3)\\le 0 \\implies [2, 3]$；② $(x-1)(x-4)>0 \\implies (-\\infty, 1)\\cup(4, +\\infty)$；③ $(x-2)(x-3)>0 \\implies (-\\infty, 2)\\cup(3, +\\infty)$；④ $(x-1)(x-4)\\le 0 \\implies [1, 4]$。",
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow [2, 3]$, ② $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$, ③ $\\rightarrow (-\\infty, 2) \\cup (3, +\\infty)$, ④ $\\rightarrow [1, 4]$"
      },
      {
        "key": "B",
        "text": "① $\\rightarrow [1, 4]$, ② $\\rightarrow (-\\infty, 2) \\cup (3, +\\infty)$, ③ $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$, ④ $\\rightarrow [2, 3]$"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow [2, 3]$, ② $\\rightarrow [1, 4]$, ③ $\\rightarrow (-\\infty, 2) \\cup (3, +\\infty)$, ④ $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$"
      },
      {
        "key": "D",
        "text": "① $\\rightarrow (-\\infty, 2) \\cup (3, +\\infty)$, ② $\\rightarrow [1, 4]$, ③ $\\rightarrow [2, 3]$, ④ $\\rightarrow (-\\infty, 1) \\cup (4, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P36",
    "type": "plotting",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與不等式綜合",
    "chapter": "高中數學必修第一冊",
    "topic": "一元二次不等式與分式不等式求解集規範步驟",
    "stem": "在直角坐標系中，通過交互式畫板繪製單項冪函數圖象，並精確點選公共基準點 (1, 1)。",
    "hint": "① 4；② 4；③ -3；④ 4",
    "explanation": "通分得 $\\frac{x - 4}{x + 3} \\le 0 \\iff (x - 4)(x + 3) \\le 0$ 且 $x \\ne -3$。解集為 $(-3, 4]$。",
    "target_point": [
      1,
      1
    ],
    "targetPoint": "(1, 1)",
    "coordinates": {
      "x": 1,
      "y": 1
    },
    "options": [
      {
        "key": "A",
        "text": "$(1, 1)$"
      },
      {
        "key": "B",
        "text": "$(0, 1)$"
      },
      {
        "key": "C",
        "text": "$(1, 0)$"
      },
      {
        "key": "D",
        "text": "$(2, 1)$"
      },
      {
        "key": "E",
        "text": "$(1, 2)$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P37",
    "type": "ordering",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與不等式綜合",
    "chapter": "高中數學必修第一冊",
    "topic": "一元二次不等式與分式不等式求解集規範步驟",
    "stem": "【步驟排序題】求解一元二次不等式 $x^2 - 10x + 24 \\le 0$ 的規範求解步驟如下：<br>① 求對應方程 $x^2 - 10x + 24 = 0$ 的兩實數根 $x_1 = 4, x_2 = 6$<br>② 結合二次函數圖象（開口向上）確定正負分佈<br>③ 依據不等號 $\\le 0$ 確定非正區間在兩根之間<br>④ 規範寫出不等式的解集為 $[4, 6]$<br>請選出正確的求解步驟順序及最終解集：",
    "hint": "因式分解求根 -> 結合圖象分析符號 -> 確定解區間 -> 寫出解集",
    "explanation": "因式分解得 $(x - 4)(x - 6) \\le 0$，解集為 $[4, 6]$。",
    "steps": [
      {
        "id": 1,
        "text": "求對應方程 $x^2 - 10x + 24 = 0$ 的兩實數根 $x_1 = 4, x_2 = 6$"
      },
      {
        "id": 2,
        "text": "結合二次函數圖象（開口向上）確定正負分佈"
      },
      {
        "id": 3,
        "text": "依據不等號 $\\le 0$ 確定非正區間在兩根之間"
      },
      {
        "id": 4,
        "text": "規範寫出不等式的解集為 $[4, 6]$"
      }
    ],
    "correctOrder": [
      1,
      2,
      3,
      4
    ],
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow$ ② $\\rightarrow$ ③ $\\rightarrow$ ④（解集為 $[4, 6]$）"
      },
      {
        "key": "B",
        "text": "② $\\rightarrow$ ① $\\rightarrow$ ③ $\\rightarrow$ ④（解集為 $(-\\infty, 4] \\cup [6, +\\infty)$）"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow$ ③ $\\rightarrow$ ② $\\rightarrow$ ④（解集為 $(4, 6)$）"
      },
      {
        "key": "D",
        "text": "④ $\\rightarrow$ ③ $\\rightarrow$ ② $\\rightarrow$ ①（解集為 $[4, 6]$）"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P38",
    "type": "ordering",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "二次函數與不等式綜合",
    "chapter": "高中數學必修第一冊",
    "topic": "一元二次不等式與分式不等式求解集規範步驟",
    "stem": "【步驟排序題】求解一元二次不等式 $4x^2 - 10x + 6 \\le 0$ 的規範求解步驟如下：<br>① 兩邊同除以 2 化簡為 $2x^2 - 5x + 3 \\le 0$，因式分解求出兩實根 $x_1 = 1, x_2 = 1.5$<br>② 結合二次函數圖象（開口向上）確定正負分佈<br>③ 依據不等號 $\\le 0$ 確定非正區間在兩根之間<br>④ 規範寫出不等式的解集為 $[1, 1.5]$<br>請選出正確的求解步驟順序及最終解集：",
    "hint": "化簡求根 -> 結合圖象分析符號 -> 確定解區間 -> 寫出解集",
    "explanation": "兩邊除以 $2$ 得 $2x^2 - 5x + 3 \\le 0 \\implies (2x - 3)(x - 1) \\le 0$。解集為 $[1, 1.5]$。",
    "steps": [
      {
        "id": 1,
        "text": "兩邊同除以 2 化簡為 $2x^2 - 5x + 3 \\le 0$，因式分解求出兩實根 $x_1 = 1, x_2 = 1.5$"
      },
      {
        "id": 2,
        "text": "結合二次函數圖象（開口向上）確定正負分佈"
      },
      {
        "id": 3,
        "text": "依據不等號 $\\le 0$ 確定非正區間在兩根之間"
      },
      {
        "id": 4,
        "text": "規範寫出不等式的解集為 $[1, 1.5]$"
      }
    ],
    "correctOrder": [
      1,
      2,
      3,
      4
    ],
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow$ ② $\\rightarrow$ ③ $\\rightarrow$ ④（解集為 $[1, 1.5]$）"
      },
      {
        "key": "B",
        "text": "② $\\rightarrow$ ① $\\rightarrow$ ③ $\\rightarrow$ ④（解集為 $(-\\infty, 1] \\cup [1.5, +\\infty)$）"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow$ ③ $\\rightarrow$ ② $\\rightarrow$ ④（解集為 $(1, 1.5)$）"
      },
      {
        "key": "D",
        "text": "④ $\\rightarrow$ ③ $\\rightarrow$ ② $\\rightarrow$ ①（解集為 $[1, 1.5]$）"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P39",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "解析式記為 $f(x) = \\frac{\\sqrt{2x + 6}}{x - 1} + (x - 3)^0$。(1) 求解自變量 $x$ 的允許區間範圍；(2) 評估數值 $f(5)$：（　　）",
    "hint": "① 被開方數非負 $2x+6 \\ge 0 \\implies x \\ge -3$；② 分母 $x-1 \\ne 0 \\implies x \\ne 1$；③ 零次冪底數 $x-3 \\ne 0 \\implies x \\ne 3$；④ 代入 $x=5$ 計算。",
    "explanation": "由 $2x+6 \\ge 0$ 得 $x \\ge -3$；分母要求 $x \\ne 1$；零次冪要求底數非零 $x \\ne 3$。故定義域為 $[-3, 1) \\cup (1, 3) \\cup (3, +\\infty)$。代入 $x=5$ 得 $f(5) = \\frac{\\sqrt{16}}{4} + (5-3)^0 = \\frac{4}{4} + 1 = 2$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "定義域為 $[-3, 1) \\cup (1, 3) \\cup (3, +\\infty)$；$f(5) = 2$"
      },
      {
        "key": "B",
        "text": "定義域為 $[-3, +\\infty)$；$f(5) = 2$"
      },
      {
        "key": "C",
        "text": "定義域為 $(-3, 1) \\cup (1, 3)$；$f(5) = 1$"
      },
      {
        "key": "D",
        "text": "定義域為 $[-3, 1) \\cup (1, +\\infty)$；$f(5) = 3$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P40",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "設表達式 $f(x) = \\frac{\\sqrt{2x + 6}}{x - 1} + (x - 3)^0$ 以及 $g(t) = t^2 - 2t + 3$。計算嵌套數值 $g(f(0))$：（　　）",
    "hint": "【公式背誦建議 §3.1.1】：先計算內層 $f(0) = \\frac{\\sqrt{6}}{-1} + 1 = 1 - \\sqrt{6}$，再代入外層 $g(t)$ 計算。",
    "explanation": "代入 $x=0$ 得 $f(0) = \\frac{\\sqrt{6}}{0-1} + (0-3)^0 = -\\sqrt{6} + 1 = 1 - \\sqrt{6}$。代入 $g(t)$ 得 $g(1-\\sqrt{6}) = (1-\\sqrt{6})^2 - 2(1-\\sqrt{6}) + 3 = (1 - 2\\sqrt{6} + 6) - (2 - 2\\sqrt{6}) + 3 = 7 - 2\\sqrt{6} - 2 + 2\\sqrt{6} + 3 = 8$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$8$"
      },
      {
        "key": "B",
        "text": "$1 - \\sqrt{6}$"
      },
      {
        "key": "C",
        "text": "$6$"
      },
      {
        "key": "D",
        "text": "$10$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P41",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "【配對題】針對表達式 $f(x) = \\frac{\\sqrt{2x + 12}}{x - 2} + (x - 6)^0$，請將下列定義域限制條件與其正確結果進行配對：<br>① 根式有意義條件（被開方數非負）<br>② 分母有意義條件（分母非零）<br>③ 零次冪有意義條件（底數非零）<br>④ 函數 $f(x)$ 完整定義域",
    "hint": "① 被開方數非負 $2x+12 \\ge 0$；② 分母非零 $x-2 \\ne 0$；③ 零次冪底數非零 $x-6 \\ne 0$；④ 代入 $x=10$。",
    "explanation": "由 $2x+12 \\ge 0 \\implies x \\ge -6$；$x-2 \\ne 0 \\implies x \\ne 2$；$x-6 \\ne 0 \\implies x \\ne 6$。自變量允許區間為 $[-6, 2) \\cup (2, 6) \\cup (6, +\\infty)$。代入 $x=10$ 得 $f(10) = \\frac{\\sqrt{32}}{8} + (10-6)^0 = \\frac{4\\sqrt{2}}{8} + 1 = \\frac{\\sqrt{2}}{2} + 1$。",
    "pairs": [
      {
        "left": "根式有意義條件（被開方數非負）",
        "right": "$x \\ge -6$"
      },
      {
        "left": "分母有意義條件（分母非零）",
        "right": "$x \\ne 2$"
      },
      {
        "left": "零次冪有意義條件（底數非零）",
        "right": "$x \\ne 6$"
      },
      {
        "left": "函數 $f(x)$ 完整定義域",
        "right": "$[-6, 2) \\cup (2, 6) \\cup (6, +\\infty)$"
      }
    ],
    "leftItems": [
      "根式有意義條件（被開方數非負）",
      "分母有意義條件（分母非零）",
      "零次冪有意義條件（底數非零）",
      "函數 $f(x)$ 完整定義域"
    ],
    "rightItems": [
      "$x \\ge -6$",
      "$x \\ne 2$",
      "$x \\ne 6$",
      "$[-6, 2) \\cup (2, 6) \\cup (6, +\\infty)$"
    ],
    "options": [
      {
        "key": "A",
        "text": "① $\\rightarrow x \\ge -6$, ② $\\rightarrow x \\ne 2$, ③ $\\rightarrow x \\ne 6$, ④ $\\rightarrow [-6, 2) \\cup (2, 6) \\cup (6, +\\infty)$"
      },
      {
        "key": "B",
        "text": "① $\\rightarrow x \\ge -6$, ② $\\rightarrow x = 2$, ③ $\\rightarrow x = 6$, ④ $\\rightarrow [-6, +\\infty)$"
      },
      {
        "key": "C",
        "text": "① $\\rightarrow x > -6$, ② $\\rightarrow x \\ne 2$, ③ $\\rightarrow x \\ne 6$, ④ $\\rightarrow (-6, 2) \\cup (2, 6)$"
      },
      {
        "key": "D",
        "text": "① $\\rightarrow x \\ge 0$, ② $\\rightarrow x \\ne 2$, ③ $\\rightarrow x \\ne 6$, ④ $\\rightarrow [0, 2) \\cup (2, 6) \\cup (6, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P42",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "復合函數定義域、零次冪限制與換元求值",
    "stem": "探究式子 $f(x) = \\frac{\\sqrt{x + 3}}{2x - 1} + (2x - 3)^0$ 能正常計算的所有輸入值集。",
    "hint": "① 被開方數非負 $x+3 \\ge 0$；② 分母非零 $2x-1 \\ne 0$；③ 零次冪底數非零 $2x-3 \\ne 0$。",
    "explanation": "由 $x + 3 \\ge 0 \\implies x \\ge -3$；$2x - 1 \\ne 0 \\implies x \\ne 0.5$；$2x - 3 \\ne 0 \\implies x \\ne 1.5$。定義域為 $[-3, 0.5) \\cup (0.5, 1.5) \\cup (1.5, +\\infty)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$x \\ge -3$ 且 $x \\ne 0.5, 1.5$。區間為 $[-3, 0.5) \\cup (0.5, 1.5) \\cup (1.5, +\\infty)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P43",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "給出分式關係 $f(x) = \\frac{2}{x + 1}$。(1) 依據五步作差規範，論證其在 $[0, 3]$ 上具備嚴格下降趨勢；(2) 指出該曲線在該封閉路徑上的波峰與波谷高度。",
    "hint": "① >；② 0；③ 3",
    "explanation": "(1) 任取 $0 \\le x_1 < x_2 \\le 3$，作差通分得 $f(x_1) - f(x_2) = \\frac{2(x_2 - x_1)}{(x_1 + 1)(x_2 + 1)} > 0$，故單調遞減。(2) 最大值 $f(0) = 2$，最小值 $f(3) = 0.5$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "(1) 作差通分定號得 $f(x_1) > f(x_2)$，單調遞減。(2) 最大值 $f(0) = 2$，最小值 $f(3) = 0.5$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P44",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "設曲線方程為 $h(x) = \\frac{4}{2x + 2}$。闡明該曲線在 $[0, 3]$ 內一路走低，並給出高度覆蓋範圍。",
    "hint": "① 0.5；② 2",
    "explanation": "化簡得 $h(x) = \\frac{2}{x + 1}$，在 $[0, 3]$ 上單調遞減。值域為 $[h(3), h(0)] = [0.5, 2]$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "遞減性同上，覆蓋高度即值域為 $[0.5, 2]$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P45",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "針對關係 $f(x) = \\frac{4}{x + 1}$。論證其在 $[0, 3]$ 上的降序規律，並計算其最高及最低數值。",
    "hint": "① 4；② 1",
    "explanation": "在 $[0, 3]$ 上單調遞減。最大值為 $f(0) = 4$，最小值為 $f(3) = 1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "最大值為 $f(0) = 4$，最小值為 $f(3) = 1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P46",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "定義法證明單調性五步法與閉區間最值求解",
    "stem": "考察映射 $f(x) = \\frac{1}{x + 1}$ 在閉區間 $[0, 3]$ 邊界上的極端數值。",
    "hint": "① 1；② 0.25",
    "explanation": "在 $[0, 3]$ 上單調遞減。最大值為 $f(0) = 1$，最小值為 $f(3) = 0.25$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "最大值 $1$，最小值 $0.25$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P47",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "代數定義法論證函數奇偶性（定義域對稱+f(-x)）",
    "stem": "研判式子 $f(x) = x^3 - \\frac{4}{x}$ 關於坐標原點或縱軸的對稱屬性，並給出嚴密的論據。",
    "hint": "① 0；② -；③ 奇",
    "explanation": "定義域為 ${x \\in \\mathbb{R} \\mid x \\ne 0}$ 關於原點對稱。$f(-x) = (-x)^3 - \\frac{4}{-x} = -x^3 + \\frac{4}{x} = -f(x)$，故為奇函數。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(-x) = -x^3 + \\frac{4}{x} = -f(x)$，為奇函數。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P48",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "代數定義法論證函數奇偶性（定義域對稱+f(-x)）",
    "stem": "分段對稱式 $g(x) = \\begin{cases} x^2 + 2x, & x > 0 \\\\ 0, & x = 0 \\\\ -x^2 + 2x, & x < 0 \\end{cases}$，試研判其是否具備原點旋轉不變特徵。",
    "hint": "① -；② 奇",
    "explanation": "當 $x > 0$ 時，$g(-x) = -(-x)^2 + 2(-x) = -(x^2 + 2x) = -g(x)$；$g(0) = 0$。各分段均滿足 $g(-x) = -g(x)$，故為奇函數。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "各分段均滿足 $g(-x) = -g(x)$，故為奇函數。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P49",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "代數定義法論證函數奇偶性（定義域對稱+f(-x)）",
    "stem": "論證表達式 $f(x) = 2x^3 - \\frac{8}{x}$ 的空間鏡像或中心反轉特徵。",
    "hint": "① -f(x)",
    "explanation": "定義域關於原點對稱。$f(-x) = 2(-x)^3 - \\frac{8}{-x} = -(2x^3 - \\frac{8}{x}) = -f(x)$，故為奇函數。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(-x) = -f(x)$，為奇函數。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P50",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "代數定義法論證函數奇偶性（定義域對稱+f(-x)）",
    "stem": "考察多項式折半式 $f(x) = \\frac{1}{2}x^3 - \\frac{2}{x}$ 的中心對稱表現。",
    "hint": "① 0",
    "explanation": "定義域關於原點對稱。$f(-x) = -f(x)$，為奇函數，關於坐標原點中心對稱。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "滿足奇函數定義。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P51",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "由奇偶性求對稱區間解析式（設x<0）與零點",
    "stem": "奇對稱映射 $f(x)$ 覆蓋全實數軸，於正向側為 $f(x) = x^2 - 4x + 3$。(1) 推求零點值 $f(0)$ 及負向側公式；(2) 尋找方程 $f(x) = 0$ 的所有實根。",
    "hint": "① 0；② $-x^2 - 4x - 3$",
    "explanation": "(1) 奇函數在原點有定義，故 $f(0) = 0$；當 $x < 0$ 時，$-x > 0$，$f(x) = -f(-x) = -x^2 - 4x - 3$。(2) 實根為 $0, \\pm 1, \\pm 3$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "(1) $f(0) = 0$；$x < 0$ 時 $f(x) = -x^2 - 4x - 3$。(2) 根為 $0, \\pm 1, \\pm 3$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P52",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "由奇偶性求對稱區間解析式（設x<0）與零點",
    "stem": "已知奇性規律 $f(x)$ 在右側為 $x^2 - 4x + 3$，將其拓展書寫為定義在全軸的三段式規範表達。",
    "hint": "① 0；② $-x^2 - 4x - 3$",
    "explanation": "由奇函數性質，$f(0) = 0$；當 $x < 0$ 時，$f(x) = -f(-x) = -x^2 - 4x - 3$。故 $f(x) = \\begin{cases} x^2 - 4x + 3, & x > 0 \\\\ 0, & x = 0 \\\\ -x^2 - 4x - 3, & x < 0 \\end{cases}$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = \\begin{cases} x^2 - 4x + 3, & x > 0 \\\\ 0, & x = 0 \\\\ -x^2 - 4x - 3, & x < 0 \\end{cases}$"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P53",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "由奇偶性求對稱區間解析式（設x<0）與零點",
    "stem": "全軸奇映射 $f(x)$ 於正半區為 $2x^2 - 8x + 6$，求解負半區公式與其正零點。",
    "hint": "① $2x^2 + 8x + 6$",
    "explanation": "當 $x < 0$ 時，$f(x) = -f(-x) = -2x^2 - 8x - 6$；正根為 $1$ 和 $3$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "負半區為 $-2x^2 - 8x - 6$；正根為 $1$ 和 $3$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P54",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "由奇偶性求對稱區間解析式（設x<0）與零點",
    "stem": "奇對稱函數於正側為 $\\frac{1}{2}x^2 - 2x + 1.5$，導出其在負半側的具體算式。",
    "hint": "① $-0.5x^2 - 2x - 1.5$",
    "explanation": "當 $x < 0$ 時，$f(x) = -f(-x) = -0.5x^2 - 2x - 1.5$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(x) = -0.5x^2 - 2x - 1.5$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P55",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參二次函數對稱軸與閉區間最值分類討論",
    "stem": "含參二次曲線 $f(x) = x^2 - 2ax + 2$。(1) 令 $a = 2$，測算其在 $[0, 3]$ 範圍內的界限端值；(2) 若曲線在 $[1, 4]$ 保持單向升降不變，確定 $a$ 之取值。",
    "hint": "① 2；② -2；③ 2；④ 1；⑤ 4",
    "explanation": "(1) 對稱軸為 $x = 2 \\in [0, 3]$，開口向上，最小值為 $f(2) = -2$；端點最大值為 $f(0) = 2$。(2) 對稱軸在區間外：$a \\le 1$ 或 $a \\ge 4$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "(1) 頂點在 $2$，最小值 $-2$；端點最大值 $2$。(2) 對稱軸在區間外：$a \\le 1$ 或 $a \\ge 4$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P56",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參二次函數對稱軸與閉區間最值分類討論",
    "stem": "設曲線 $f(x) = x^2 - 2ax + 2$ 於 $[1, 4]$ 始終維持爬升狀態，評估 $a$ 之約束界限。",
    "hint": "① 1",
    "explanation": "開口向上，需對稱軸 $a \\le 1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "開口向上，需對稱軸 $a \\le 1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P57",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參二次函數對稱軸與閉區間最值分類討論",
    "stem": "二次表達式 $f(x) = x^2 - 4ax + 2$ 在區間 $[2, 8]$ 不改變走勢方向，探尋參數 $a$ 的許可域。",
    "hint": "① 2；② 8",
    "explanation": "$2a \\le 2 \\implies a \\le 1$ 或 $2a \\ge 8 \\implies a \\ge 4$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$2a \\le 2 \\implies a \\le 1$ 或 $2a \\ge 8 \\implies a \\ge 4$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P58",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參二次函數對稱軸與閉區間最值分類討論",
    "stem": "考察曲線 $f(x) = x^2 - ax + 2$ 在區段 $[0.5, 2]$ 維持單向走勢時參數 $a$ 的取值。",
    "hint": "① 0.5；② 2",
    "explanation": "$\\frac{a}{2} \\le 0.5 \\implies a \\le 1$ 或 $\\frac{a}{2} \\ge 2 \\implies a \\ge 4$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{a}{2} \\le 0.5 \\implies a \\le 1$ 或 $\\frac{a}{2} \\ge 2 \\implies a \\ge 4$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P59",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參一元二次不等式分類討論（二次項係數與根大小）",
    "stem": "針對含參關係 $ax^2 - (a + 1)x + 1 > 0$。(1) 設 $a = 2$，求成立的自變量區間；(2) 設 $a = 0$，求相應區間；(3) 設 $a < 0$，求相應區間。",
    "hint": "① 0.5；② 1",
    "explanation": "(1) $(-\\infty, 0.5) \\cup (1, +\\infty)$；(2) $(-\\infty, 1)$；(3) $\\left(\\frac{1}{a}, 1\\right)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "(1) $(-\\infty, 0.5) \\cup (1, +\\infty)$；(2) $(-\\infty, 1)$；(3) $\\left(\\frac{1}{a}, 1\\right)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P60",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參一元二次不等式分類討論（二次項係數與根大小）",
    "stem": "當設定常數 $a = 3$ 時，探求式子 $ax^2 - (a + 1)x + 1 > 0$ 的成立區間。",
    "hint": "① 1",
    "explanation": "$\\left(-\\infty, \\frac{1}{3}\\right) \\cup (1, +\\infty)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$\\left(-\\infty, \\frac{1}{3}\\right) \\cup (1, +\\infty)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P61",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參一元二次不等式分類討論（二次項係數與根大小）",
    "stem": "設含參多項式 $x^2 - (m + 2)x + 2m < 0$。(1) 當 $m = 3$ 時，求自變量區間；(2) 分類研討實數 $m$ 之不同狀況。",
    "hint": "① m；② 空集",
    "explanation": "(1) $(2, 3)$。(2) $m > 2$ 時 $(2, m)$；$m = 2$ 時 $\\emptyset$；$m < 2$ 時 $(m, 2)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "(1) $(2, 3)$。(2) $m > 2$ 時 $(2, m)$；$m = 2$ 時 $\\emptyset$；$m < 2$ 時 $(m, 2)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P62",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "含參一元二次不等式分類討論（二次項係數與根大小）",
    "stem": "若二次式 $kx^2 - 2x + 1 > 0$ 永遠處於正向水準，評定 $k$ 的取值全集。",
    "hint": "① 0；② 0",
    "explanation": "$k > 0$ 且 $\\Delta = 4 - 4k < 0 \\implies k > 1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$k > 0$ 且 $\\Delta < 0 \\implies k > 1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P63",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "二次函數恆為正充要條件（a>0且Δ<0，含參首項討論）",
    "stem": "假定在全體實數域上，拋物線 $y = mx^2 + 6x + 3m$ 均高於水平坐標軸，確定參數 $m$ 的區間界限。",
    "hint": "① 0；② 3",
    "explanation": "$m > 0$ 且 $\\Delta = 36 - 12m^2 < 0 \\implies m > \\sqrt{3}$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$m > 0$ 且 $\\Delta = 36 - 12m^2 < 0 \\implies m > \\sqrt{3}$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P64",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "二次函數恆為正充要條件（a>0且Δ<0，含參首項討論）",
    "stem": "若關係式 $mx^2 + 4x + m > 0$ 對實數 $x$ 恆定生效，計算界限常數並求 $m$ 範圍。",
    "hint": "① 2",
    "explanation": "恆正要求二次項係數 $m > 0$ 且判別式 $\\Delta = 16 - 4m^2 < 0 \\implies m^2 > 4 \\implies m > 2$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$m > 2$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P65",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "二次函數恆為正充要條件（a>0且Δ<0，含參首項討論）",
    "stem": "探究式子 $f(x) = (a - 1)x^2 + 2(a - 1)x - 4$ 對所有自變量恆處於地下（值為負）之 $a$ 集合。",
    "hint": "① 1；② 1",
    "explanation": "$a = 1$ 符合；$a \\ne 1$ 時 $-3 < a < 1$。並集為 $(-3, 1]$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$a = 1$ 符合；$a \\ne 1$ 時 $-3 < a < 1$。並集為 $(-3, 1]$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P66",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "抽象函數遞推賦值、等差型遞推求解特定項值",
    "stem": "某映射規則滿足等式 $f(x) = f(x + 1) + 1$。已知起點值 $f(0) = 16$，測算第 15 步目標值 $f(15)$。",
    "hint": "① 1",
    "explanation": "移項得 $f(x + 1) = f(x) - 1$，為公差 $-1$ 的等差結構，$f(15) = f(0) - 15 = 16 - 15 = 1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(15) = 16 - 15 = 1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P67",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "抽象函數遞推賦值、等差型遞推求解特定項值",
    "stem": "抽象等式 $f(x) = f(x + 1) + 1$ 伴隨初值 $f(0) = 17$，求數值 $f(15)$。",
    "hint": "① 2",
    "explanation": "移項得 $f(x + 1) = f(x) - 1$，為公差 $-1$ 的等差結構，$f(15) = f(0) - 15 = 17 - 15 = 2$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(15) = 2$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P68",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "抽象函數遞推賦值、等差型遞推求解特定項值",
    "stem": "遞推公式滿足 $f(x + 1) = f(x) - 1$。若測得 $f(15) = 1$，倒推尋找初始量 $f(0)$。",
    "hint": "① 16",
    "explanation": "由等差數列通項 $f(15) = f(0) - 15 \\implies 1 = f(0) - 15 \\implies f(0) = 16$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(0) = 16$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P69",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "抽象函數遞推賦值、等差型遞推求解特定項值",
    "stem": "全實數函數 $g(x)$ 具備反號跳躍特徵 $g(x + 2) = -g(x)$。若已知 $g(1) = 3$，求高位項 $g(2025)$ 之值。",
    "hint": "① 4；② 3",
    "explanation": "由 $g(x + 4) = -g(x + 2) = g(x)$ 得週期為 $4$。$2025 = 4 \\times 506 + 1$，故 $g(2025) = g(1) = 3$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "週期為 $4$，故 $g(2025) = g(1) = 3$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P70",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "給定分段映射 $f(x) = \\begin{cases} -8x, & 0 < x \\le 4 \\\\ x^2 - 8x + 17, & x > 4 \\end{cases}$。求解關係式 $f\\left(\\frac{1}{2} - 3|x|\\right) + f(5) < 0$ 的對稱解區間。",
    "hint": "① 2；② $\\frac{1}{12}$",
    "explanation": "計算 $f(5) = 5^2 - 8(5) + 17 = 2$。不等式化為 $f\\left(\\frac{1}{2} - 3|x|\\right) < -2$。由 $0 < \\frac{1}{2} - 3|x| \\le 4$ 時 $-8\\left(\\frac{1}{2} - 3|x|\\right) < -2 \\implies -4 + 24|x| < -2 \\implies 24|x| < 2 \\implies |x| < \\frac{1}{12}$。解集為 $\\left(-\\frac{1}{12}, \\frac{1}{12}\\right)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "解集為 $\\left(-\\frac{1}{12}, \\frac{1}{12}\\right)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P71",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "針對兩段規律 $f(x) = \\begin{cases} -8x, & 0 < x \\le 4 \\\\ x^2 - 8x + 17, & x > 4 \\end{cases}$，核算合成量 $f(2) + f(5)$。",
    "hint": "① -16；② 2",
    "explanation": "$f(2) = -8(2) = -16$，$f(5) = 5^2 - 8(5) + 17 = 2$，故 $f(2) + f(5) = -16 + 2 = -14$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$-16 + 2 = -14$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P72",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "分段折線 $f(x) = \\begin{cases} 2x - 1, & x \\le 1 \\\\ -x + 2, & x > 1 \\end{cases}$，找出使其非負的覆蓋區段。",
    "hint": "① 2",
    "explanation": "當 $x \\le 1$ 時，$2x - 1 \\ge 0 \\implies 0.5 \\le x \\le 1$；當 $x > 1$ 時，$-x + 2 \\ge 0 \\implies 1 < x \\le 2$。併集為 $[0.5, 2]$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$[0.5, 2]$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P73",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "分段函數求值、定義域限制與對數不等式求解",
    "stem": "兩段式 $f(x) = \\begin{cases} x^2 - 1, & x < 0 \\\\ 2x + 1, & x \\ge 0 \\end{cases}$。若輸出高度為 3，尋找其前置自變量。",
    "hint": "① -2；② 1",
    "explanation": "當 $x < 0$ 時，$x^2 - 1 = 3 \\implies x = -2$；當 $x \\ge 0$ 時，$2x + 1 = 3 \\implies x = 1$。故 $x = -2$ 或 $x = 1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$a = -2$ 或 $a = 1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P74",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "偶函數性質、單調性轉化與指數/對數/冪大小比較",
    "stem": "設偶對稱映射 $f(x)$ 於負半軸單調下降。考察量 $a = f\\left(2^{-\\frac{7}{3}}\\right)$，$b = f\\left(3^{-\\frac{4}{7}}\\right)$，$c = f(-1)$，試辨析三者從小至大的秩序並陳述依據。",
    "hint": "① 遞增；② a < b < c",
    "explanation": "由偶函數性質，正半軸單調遞增。比較自變量大小：$0 < 2^{-\\frac{7}{3}} < 3^{-\\frac{4}{7}} < 1$，故 $a < b < c$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "正半軸遞增，自變量越小函數值越小，故 $a < b < c$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P75",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "偶函數性質、單調性轉化與指數/對數/冪大小比較",
    "stem": "已知偶性函數 $f(x)$ 於正向區間攀升。對比項 $f(-2)$ 與 $f(3)$ 之高低。",
    "hint": "① <",
    "explanation": "由偶函數性質 $f(-2) = f(2)$。又正半軸單調遞增，故 $f(-2) = f(2) < f(3)$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$f(-2) = f(2) < f(3)$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P76",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "偶函數性質、單調性轉化與指數/對數/冪大小比較",
    "stem": "奇對稱映射 $f(x)$ 於非負半側嚴格遞增。若關係式 $f(x - 1) + f(2) < 0$ 成立，探尋自變量範圍。",
    "hint": "① -2；② -1",
    "explanation": "由奇函數性質，全軸單調遞增。$f(x - 1) < -f(2) = f(-2) \\implies x - 1 < -2 \\implies x < -1$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "全軸遞增，故 $x - 1 < -2 \\implies x < -1$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  },
  {
    "id": "P77",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "函數概念與冪函數",
    "chapter": "高中數學必修第一冊",
    "topic": "偶函數性質、單調性轉化與指數/對數/冪大小比較",
    "stem": "偶性曲線於正側維持上升走勢。若 $f(2x - 1) \\le f(3)$，求解其可行區域。",
    "hint": "① 3；② -1；③ 2",
    "explanation": "由偶函數及單調性得 $|2x - 1| \\le 3 \\implies -1 \\le x \\le 2$。故選 A。",
    "options": [
      {
        "key": "A",
        "text": "$|2x - 1| \\le 3 \\implies -1 \\le x \\le 2$。"
      },
      {
        "key": "B",
        "text": "無解"
      },
      {
        "key": "C",
        "text": "$(-1, 1)$"
      },
      {
        "key": "D",
        "text": "$[0, +\\infty)$"
      },
      {
        "key": "E",
        "text": "以上皆非"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ]
  }
]
};
