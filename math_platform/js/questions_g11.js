/**
 * High School Math Practice Platform - QUESTIONS_G11
 * Auto-generated with strict desensitization and MathJax compliance.
 * Export: window.QUESTIONS_G11
 */
(function (root) {
  'use strict';

  var questionsList = [
  {
    "id": "G11_Q01_COMPLEX_MODULUS",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "複數除法",
      "複數的模"
    ],
    "prompt": "已知複數 $z = \\frac{3+4i}{1-i}$，則其模長 $|z| =$",
    "stem": "已知複數 $z = \\frac{3+4i}{1-i}$，則其模長 $|z| =$",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{5}{2}$"
      },
      {
        "key": "B",
        "text": "$\\frac{5\\sqrt{2}}{2}$"
      },
      {
        "key": "C",
        "text": "$5\\sqrt{2}$"
      },
      {
        "key": "D",
        "text": "$5$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解法一】由商的模長性質 $|\\frac{z_1}{z_2}| = \\frac{|z_1|}{|z_2|}$，分子模長 $|3+4i| = \\sqrt{3^2+4^2} = 5$，分母模長 $|1-i| = \\sqrt{1^2+(-1)^2} = \\sqrt{2}$。因此 $|z| = \\frac{5}{\\sqrt{2}} = \\frac{5\\sqrt{2}}{2}$。\n【解法二】分母實數化：$z = \\frac{(3+4i)(1+i)}{(1-i)(1+i)} = \\frac{3+3i+4i-4}{2} = -\\frac{1}{2} + \\frac{7}{2}i$。模長 $|z| = \\sqrt{(-\\frac{1}{2})^2 + (\\frac{7}{2})^2} = \\sqrt{\\frac{50}{4}} = \\frac{5\\sqrt{2}}{2}$。正確選項為 B。"
  },
  {
    "id": "G11_Q02_OBLIQUE_PROJECTION_SQ",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "斜二測畫法",
      "直觀圖面積比"
    ],
    "prompt": "某水平放置的平面圖形用斜二測畫法畫出的直觀圖是邊長為 $1$ 的正方形，則原平面圖形的面積為",
    "stem": "某水平放置的平面圖形用斜二測畫法畫出的直觀圖是邊長為 $1$ 的正方形，則原平面圖形的面積為",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{\\sqrt{2}}{4}$"
      },
      {
        "key": "B",
        "text": "$2$"
      },
      {
        "key": "C",
        "text": "$4$"
      },
      {
        "key": "D",
        "text": "$2\\sqrt{2}$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】依據斜二測畫法規則，原平面圖形面積 $S$ 與直觀圖面積 $S'$ 滿足固定的比例換算公式：$S = 2\\sqrt{2} S'$。已知直觀圖是邊長為 $1$ 的正方形，其面積 $S' = 1 \\times 1 = 1$。因此原平面圖形的真實面積為 $S = 2\\sqrt{2} \\times 1 = 2\\sqrt{2}$。正確選項為 D。"
  },
  {
    "id": "G11_Q03_COMPLEX_CONJUGATE_QUAD",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "共軛複數",
      "複平面象限"
    ],
    "prompt": "複數 $z = (2-i)^2$ 的共軛複數 $\\bar{z}$ 在複平面內對應的點位於",
    "stem": "複數 $z = (2-i)^2$ 的共軛複數 $\\bar{z}$ 在複平面內對應的點位於",
    "options": [
      {
        "key": "A",
        "text": "第一象限"
      },
      {
        "key": "B",
        "text": "第二象限"
      },
      {
        "key": "C",
        "text": "第三象限"
      },
      {
        "key": "D",
        "text": "第四象限"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】首先展開複數 $z = (2-i)^2 = 4 - 4i + i^2 = 4 - 4i - 1 = 3 - 4i$。則其共軛複數為 $\\bar{z} = 3 + 4i$。在複平面內，$\\bar{z}$ 對應的點坐標為 $(3, 4)$，其橫坐標 $x = 3 > 0$，縱坐標 $y = 4 > 0$，位於第一象限。正確選項為 A。"
  },
  {
    "id": "G11_Q04_POLYHEDRON_DEF",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "多面體概念",
      "稜台特徵",
      "稜柱稜錐"
    ],
    "prompt": "下列關於基本立體圖形的幾何說法中，正確的是",
    "stem": "下列關於基本立體圖形的幾何說法中，正確的是",
    "options": [
      {
        "key": "A",
        "text": "有兩個面互相平行，其餘各面都是四邊形的幾何體必是稜柱"
      },
      {
        "key": "B",
        "text": "稜台的各條側稜延長後必交於同一點"
      },
      {
        "key": "C",
        "text": "有一個面是多邊形，其餘各面都是三角形的幾何體必是稜錐"
      },
      {
        "key": "D",
        "text": "用一個平面去截稜錐，底面與截面之間的部分必是稜台"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】B：稜台是由平行於稜錐底面的平面截稜錐所得，因此其各側稜延長線必交於原稜錐頂點（正確）；A：兩個平行面其餘側面是四邊形但側面不一定平行或相鄰側面交線不一定平行，反例為圓台外接直角四面組合（錯誤）；C：其餘三角形面必須具有公共頂點才是稜錐，否則不一定是稜錐（錯誤）；D：截面必須平行於底面，截出的部分才稱為稜台（錯誤）。正確選項為 B。"
  },
  {
    "id": "G11_Q05_COMPLEX_PARTS",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "複數實部與虛部",
      "代數形式"
    ],
    "prompt": "複數 $z = -5 + 2i$ 的實部和虛部分別是",
    "stem": "複數 $z = -5 + 2i$ 的實部和虛部分別是",
    "options": [
      {
        "key": "A",
        "text": "$-5$ 和 $2$"
      },
      {
        "key": "B",
        "text": "$-5$ 和 $2i$"
      },
      {
        "key": "C",
        "text": "$5$ 和 $2$"
      },
      {
        "key": "D",
        "text": "$2$ 和 $-5$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】形如 $z = a + bi$（$a, b \\in \\mathbf{R}$）的複數，其實部為實數 $a$，虛部為虛數單位 $i$ 的係數 $b$（虛部本身是實數，不包含 $i$）。因此 $z = -5 + 2i$ 的實部為 $-5$，虛部為 $2$。正確選項為 A。"
  },
  {
    "id": "G11_Q06_COMPLEX_REAL",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "實數判斷",
      "虛數單位平方"
    ],
    "prompt": "下列複數中，其值為實數的是",
    "stem": "下列複數中，其值為實數的是",
    "options": [
      {
        "key": "A",
        "text": "$2i$"
      },
      {
        "key": "B",
        "text": "$1+i$"
      },
      {
        "key": "C",
        "text": "$i^2$"
      },
      {
        "key": "D",
        "text": "$\\sqrt{2}i$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】依據虛數單位的定義，$i^2 = -1$，$-1$ 是實數（虛部為 0），故 C 正確；$2i$、$1+i$、$\\sqrt{2}i$ 的虛部均不為 0，皆為虛數。正確選項為 C。"
  },
  {
    "id": "G11_Q07_COMPLEX_MIDPOINT",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "複平面中點",
      "複數加法"
    ],
    "prompt": "已知在複平面內，點 $A$、$B$ 對應的複數分別為 $1+i$ 與 $3+5i$，則線段 $AB$ 的中點對應的複數為",
    "stem": "已知在複平面內，點 $A$、$B$ 對應的複數分別為 $1+i$ 與 $3+5i$，則線段 $AB$ 的中點對應的複數為",
    "options": [
      {
        "key": "A",
        "text": "$1+2i$"
      },
      {
        "key": "B",
        "text": "$4+6i$"
      },
      {
        "key": "C",
        "text": "$2+3i$"
      },
      {
        "key": "D",
        "text": "$2+4i$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】線段中點對應的複數為兩端點複數的算術平均值：$z_M = \\frac{z_A + z_B}{2} = \\frac{(1+i) + (3+5i)}{2} = \\frac{4+6i}{2} = 2+3i$。正確選項為 C。"
  },
  {
    "id": "G11_Q08_REVOLUTION_SOLID",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "旋轉體",
      "直角三角形旋轉"
    ],
    "prompt": "將一個直角三角形繞其斜邊所在直線旋轉一周，所得的幾何體是",
    "stem": "將一個直角三角形繞其斜邊所在直線旋轉一周，所得的幾何體是",
    "options": [
      {
        "key": "A",
        "text": "兩個同底圓錐拼接而成的組合體"
      },
      {
        "key": "B",
        "text": "一個圓錐"
      },
      {
        "key": "C",
        "text": "一個圓台"
      },
      {
        "key": "D",
        "text": "一個圓柱挖去一個圓錐後的組合體"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】直角三角形繞一條直角邊旋轉一周得到一個圓錐；而繞斜邊所在直線旋轉時，斜邊上的高作為旋轉底面半徑，兩條直角邊分別掃出兩個圓錐的側面，形成底面重合、頂點朝向相反的兩個同底圓錐拼接組合體。正確選項為 A。"
  },
  {
    "id": "G11_Q09_SPHERE_SURFACE_AREA",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "球的表面積",
      "度量公式"
    ],
    "prompt": "半徑為 $3$ 的球的表面積是",
    "stem": "半徑為 $3$ 的球的表面積是",
    "options": [
      {
        "key": "A",
        "text": "$9\\pi$"
      },
      {
        "key": "B",
        "text": "$36\\pi$"
      },
      {
        "key": "C",
        "text": "$12\\pi$"
      },
      {
        "key": "D",
        "text": "$108\\pi$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】球的表面積公式為 $S = 4\\pi R^2$。代入半徑 $R = 3$，得 $S = 4\\pi \\times 3^2 = 4\\pi \\times 9 = 36\\pi$。正確選項為 B。"
  },
  {
    "id": "G11_Q10_PRISM_PROPERTIES",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "稜柱元素計數",
      "頂點稜面"
    ],
    "prompt": "一個八稜柱共有頂點數與稜數分別為",
    "stem": "一個八稜柱共有頂點數與稜數分別為",
    "options": [
      {
        "key": "A",
        "text": "$16$ 個頂點，$24$ 條稜"
      },
      {
        "key": "B",
        "text": "$8$ 個頂點，$16$ 條稜"
      },
      {
        "key": "C",
        "text": "$16$ 個頂點，$16$ 條稜"
      },
      {
        "key": "D",
        "text": "$10$ 個頂點，$24$ 條稜"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】$n$ 稜柱具有 $2n$ 個頂點、$3n$ 條稜（上底 $n$ 條、下底 $n$ 條、側稜 $n$ 條）以及 $n+2$ 個面。因此八稜柱（$n=8$）的頂點數為 $2 \\times 8 = 16$ 個，稜數為 $3 \\times 8 = 24$ 條。正確選項為 A。"
  },
  {
    "id": "G11_Q11_COMPLEX_POWER_CYCLIC",
    "chapter": "ch07_complex",
    "section": "7.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "虛數乘方",
      "週期規律"
    ],
    "prompt": "計算虛數單位的乘方：$i^{10} =$",
    "stem": "計算虛數單位的乘方：$i^{10} =$",
    "options": [
      {
        "key": "A",
        "text": "$1$"
      },
      {
        "key": "B",
        "text": "$i$"
      },
      {
        "key": "C",
        "text": "$-i$"
      },
      {
        "key": "D",
        "text": "$-1$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】虛數單位乘方具備週期性（週期為 $4$）：$i^1 = i,\\, i^2 = -1,\\, i^3 = -i,\\, i^4 = 1$。因此 $i^{10} = (i^4)^2 \\cdot i^2 = 1^2 \\cdot (-1) = -1$。正確選項為 D。"
  },
  {
    "id": "G11_Q12_CUBOID_DIAGONAL",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_A",
    "tags": [
      "長方體",
      "體對角線長度"
    ],
    "prompt": "長方體的長、寬、高分別為 $3$、$4$、$12$，則它的體對角線長為",
    "stem": "長方體的長、寬、高分別為 $3$、$4$、$12$，則它的體對角線長為",
    "options": [
      {
        "key": "A",
        "text": "$13$"
      },
      {
        "key": "B",
        "text": "$12$"
      },
      {
        "key": "C",
        "text": "$15$"
      },
      {
        "key": "D",
        "text": "$19$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】長方體的體對角線公式為 $d = \\sqrt{a^2 + b^2 + c^2}$。代入長寬高 $a=3, b=4, c=12$，得 $d = \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{9 + 16 + 144} = \\sqrt{169} = 13$。正確選項為 A。"
  },
  {
    "id": "G11_Q13_PURE_IMAGINARY_PARAM",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "純虛數定義",
      "分類討論",
      "參數方程"
    ],
    "prompt": "若複數 $(m^2-3m) + (m-3)i$（$m \\in \\mathbf{R}$）是純虛數，則實數 $m =$",
    "stem": "若複數 $(m^2-3m) + (m-3)i$（$m \\in \\mathbf{R}$）是純虛數，則實數 $m =$",
    "options": [
      {
        "key": "A",
        "text": "$0$"
      },
      {
        "key": "B",
        "text": "$3$"
      },
      {
        "key": "C",
        "text": "$0$ 或 $3$"
      },
      {
        "key": "D",
        "text": "$1$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】複數 $z = a + bi$ 是純虛數的充要條件是實部等於零且虛部不等於零，即 $\\begin{cases} m^2 - 3m = 0 \\\\ m - 3 \\ne 0 \\end{cases}$。由 $m^2 - 3m = 0$ 解得 $m = 0$ 或 $m = 3$。當 $m = 3$ 時，虛部 $m - 3 = 0$，此時複數為實數 $0$，不合題意必須捨去。因此唯一解為 $m = 0$。正確選項為 A。"
  },
  {
    "id": "G11_Q14_WATER_TANK_CYLINDER",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "圓柱與球",
      "體積等積變形",
      "水位上升"
    ],
    "prompt": "一直立圓柱形水箱的內半徑為 $3\\text{ m}$，高為 $8\\text{ m}$，目前水深 $5\\text{ m}$。若將一個半徑為 $2\\text{ m}$ 的實心球體放入水箱內且完全浸入水中，則水箱中的水位將上升",
    "stem": "一直立圓柱形水箱的內半徑為 $3\\text{ m}$，高為 $8\\text{ m}$，目前水深 $5\\text{ m}$。若將一個半徑為 $2\\text{ m}$ 的實心球體放入水箱內且完全浸入水中，則水箱中的水位將上升",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{2}{3}\\text{ m}$"
      },
      {
        "key": "B",
        "text": "$\\frac{3}{2}\\text{ m}$"
      },
      {
        "key": "C",
        "text": "$1\\text{ m}$"
      },
      {
        "key": "D",
        "text": "$\\frac{32}{27}\\text{ m}$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】球體完全浸入水中後，排開水的體積即等於球體的體積：$V_{\\text{球}} = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\times 2^3 = \\frac{32}{3}\\pi\\text{ m}^3$。圓柱形水箱的底面積為 $S = \\pi r^2 = \\pi \\times 3^2 = 9\\pi\\text{ m}^2$。因此水位上升高度 $\\Delta h = \\frac{V_{\\text{球}}}{S} = \\frac{\\frac{32}{3}\\pi}{9\\pi} = \\frac{32}{27}\\text{ m}$。上升後水深為 $5 + \\frac{32}{27} \\approx 6.19\\text{ m} < 8\\text{ m}$，水未溢出。正確選項為 D。"
  },
  {
    "id": "G11_Q15_IMAGINARY_SUM_2026",
    "chapter": "ch07_complex",
    "section": "7.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "虛數乘方",
      "求和抵消",
      "高次求和"
    ],
    "prompt": "計算高次虛數單位和式：$i + i^2 + i^3 + \\dots + i^{2026} =$",
    "stem": "計算高次虛數單位和式：$i + i^2 + i^3 + \\dots + i^{2026} =$",
    "options": [
      {
        "key": "A",
        "text": "$0$"
      },
      {
        "key": "B",
        "text": "$-1$"
      },
      {
        "key": "C",
        "text": "$i$"
      },
      {
        "key": "D",
        "text": "$-1+i$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】虛數單位每連續四項之和為零：$i^1 + i^2 + i^3 + i^4 = i - 1 - i + 1 = 0$。和式中共有 $2026$ 項，計算項數對 $4$ 取餘：$2026 = 4 \\times 506 + 2$。前 $2024$ 項成組抵消為 $0$，僅剩下最後兩項：$i^{2025} + i^{2026} = i^1 + i^2 = i - 1 = -1 + i$。正確選項為 D。"
  },
  {
    "id": "G11_Q16_TRUNCATED_CONE_METRICS",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "圓台母線",
      "圓台側面積"
    ],
    "prompt": "已知圓台的上、下底面半徑分別為 $3$ 和 $6$，高為 $4$。則它的母線長度與側面積分別為",
    "stem": "已知圓台的上、下底面半徑分別為 $3$ 和 $6$，高為 $4$。則它的母線長度與側面積分別為",
    "options": [
      {
        "key": "A",
        "text": "母線長 $5$，側面積 $36\\pi$"
      },
      {
        "key": "B",
        "text": "母線長 $5$，側面積 $45\\pi$"
      },
      {
        "key": "C",
        "text": "母線長 $7$，側面積 $45\\pi$"
      },
      {
        "key": "D",
        "text": "母線長 $\\sqrt{7}$，側面積 $60\\pi$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】作圓台的軸截面（等腰梯形），母線長 $l$、高 $h=4$ 以及兩底面半徑差 $R-r = 6-3 = 3$ 構成直角三角形。由勾股定理：$l = \\sqrt{h^2 + (R-r)^2} = \\sqrt{4^2 + 3^2} = 5$。圓台側面積公式為 $S_{\\text{側}} = \\pi (r + R) l = \\pi (3 + 6) \\times 5 = 45\\pi$。正確選項為 B。"
  },
  {
    "id": "G11_Q17_COMPLEX_VECTOR_PARALLELOGRAM",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "複平面向量",
      "平行四邊形法則",
      "模長計算"
    ],
    "prompt": "在複平面內，平行四邊形 $OABC$ 的頂點 $O$、$A$、$C$ 對應的複數分別為 $0$、$3+2i$、$-2+4i$。則對角線 $OB$ 的長度為",
    "stem": "在複平面內，平行四邊形 $OABC$ 的頂點 $O$、$A$、$C$ 對應的複數分別為 $0$、$3+2i$、$-2+4i$。則對角線 $OB$ 的長度為",
    "options": [
      {
        "key": "A",
        "text": "$\\sqrt{29}$"
      },
      {
        "key": "B",
        "text": "$5$"
      },
      {
        "key": "C",
        "text": "$\\sqrt{37}$"
      },
      {
        "key": "D",
        "text": "$\\sqrt{41}$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】由平行四邊形向量加法法則：$\\vec{OB} = \\vec{OA} + \\vec{OC}$。因此頂點 $B$ 對應的複數為 $z_B = z_A + z_C = (3+2i) + (-2+4i) = 1+6i$。對角線 $OB$ 的長度即為複數 $z_B$ 的模長：$|OB| = |1+6i| = \\sqrt{1^2 + 6^2} = \\sqrt{1 + 36} = \\sqrt{37}$。正確選項為 C。"
  },
  {
    "id": "G11_Q18_OBLIQUE_TRIANGLE_AREA",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "斜二測畫法",
      "正三角形直觀圖",
      "原面積求解"
    ],
    "prompt": "水平放置的 $\\triangle ABC$ 用斜二測畫法畫出的直觀圖是邊長為 $2$ 的正三角形，則原 $\\triangle ABC$ 的真實面積為",
    "stem": "水平放置的 $\\triangle ABC$ 用斜二測畫法畫出的直觀圖是邊長為 $2$ 的正三角形，則原 $\\triangle ABC$ 的真實面積為",
    "options": [
      {
        "key": "A",
        "text": "$\\sqrt{3}$"
      },
      {
        "key": "B",
        "text": "$2\\sqrt{3}$"
      },
      {
        "key": "C",
        "text": "$2\\sqrt{6}$"
      },
      {
        "key": "D",
        "text": "$\\sqrt{6}$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】直觀圖是邊長為 $a=2$ 的正三角形，其直觀圖面積為 $S' = \\frac{\\sqrt{3}}{4} a^2 = \\frac{\\sqrt{3}}{4} \\times 2^2 = \\sqrt{3}$。根據斜二測畫法面積變換比例定理 $S = 2\\sqrt{2} S'$，原平面圖形面積為 $S = 2\\sqrt{2} \\times \\sqrt{3} = 2\\sqrt{6}$。正確選項為 C。"
  },
  {
    "id": "G11_Q19_CONE_SECTOR_NET",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "圓錐展開圖",
      "扇形弧長與圓心角"
    ],
    "prompt": "已知圓錐的底面半徑為 $3$，側面展開圖（扇形）的圓心角為 $216^\\circ$，則該圓錐的母線長為",
    "stem": "已知圓錐的底面半徑為 $3$，側面展開圖（扇形）的圓心角為 $216^\\circ$，則該圓錐的母線長為",
    "options": [
      {
        "key": "A",
        "text": "$4$"
      },
      {
        "key": "B",
        "text": "$6$"
      },
      {
        "key": "C",
        "text": "$10$"
      },
      {
        "key": "D",
        "text": "$5$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】圓錐底面圓周長為 $c = 2\\pi r = 2\\pi \\times 3 = 6\\pi$。側面展開扇形的弧長等於底面周長，即 $L_{\\text{弧}} = 6\\pi$。設母線長為 $l$，扇形圓心角為 $\\alpha = 216^\\circ$。由弧長公式 $L_{\\text{弧}} = 2\\pi l \\cdot \\frac{216^\\circ}{360^\\circ} = 2\\pi l \\cdot \\frac{3}{5} = \\frac{6}{5}\\pi l$。聯立得 $\\frac{6}{5}\\pi l = 6\\pi$，解得母線長 $l = 5$。正確選項為 D。"
  },
  {
    "id": "G11_Q20_SPHERE_VOLUME_RATIO",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "球體積比例",
      "幾何相似比"
    ],
    "prompt": "若兩個實心球的半徑之比為 $1:2$，則這兩個球的體積之比為",
    "stem": "若兩個實心球的半徑之比為 $1:2$，則這兩個球的體積之比為",
    "options": [
      {
        "key": "A",
        "text": "$1:2$"
      },
      {
        "key": "B",
        "text": "$1:8$"
      },
      {
        "key": "C",
        "text": "$1:4$"
      },
      {
        "key": "D",
        "text": "$1:\\sqrt{2}$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】球的體積公式為 $V = \\frac{4}{3}\\pi R^3$。體積與半徑的三次方成正比，若相似半徑比為 $\\frac{R_1}{R_2} = \\frac{1}{2}$，則體積之比為 $\\frac{V_1}{V_2} = (\\frac{R_1}{R_2})^3 = (\\frac{1}{2})^3 = \\frac{1}{8}$。正確選項為 B。"
  },
  {
    "id": "G11_Q21_QUADRATIC_COMPLEX_ROOTS",
    "chapter": "ch07_complex",
    "section": "7.3",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "複數根",
      "一元二次方程判別式"
    ],
    "prompt": "在複數範圍內，一元二次方程 $x^2 - 4x + 13 = 0$ 的根為",
    "stem": "在複數範圍內，一元二次方程 $x^2 - 4x + 13 = 0$ 的根為",
    "options": [
      {
        "key": "A",
        "text": "$x = 2 \\pm 3i$"
      },
      {
        "key": "B",
        "text": "$x = -2 \\pm 3i$"
      },
      {
        "key": "C",
        "text": "$x = 4 \\pm 6i$"
      },
      {
        "key": "D",
        "text": "$x = 2 \\pm 9i$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】計算判別式：$\\Delta = b^2 - 4ac = (-4)^2 - 4(1)(13) = 16 - 52 = -36 < 0$。在複數範圍內，$\\sqrt{\\Delta} = \\sqrt{-36} = \\sqrt{36 i^2} = \\pm 6i$。由求根公式：$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a} = \\frac{4 \\pm 6i}{2} = 2 \\pm 3i$。正確選項為 A。"
  },
  {
    "id": "G11_Q22_PYRAMID_LATERAL_AREA",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "正四稜錐",
      "斜高與側面積"
    ],
    "prompt": "正四稜錐的底面邊長為 $6$，側稜長為 $5$，則它的斜高與側面積分別為",
    "stem": "正四稜錐的底面邊長為 $6$，側稜長為 $5$，則它的斜高與側面積分別為",
    "options": [
      {
        "key": "A",
        "text": "斜高為 $3$，側面積為 $36$"
      },
      {
        "key": "B",
        "text": "斜高為 $4$，側面積為 $48$"
      },
      {
        "key": "C",
        "text": "斜高為 $4$，側面積為 $24$"
      },
      {
        "key": "D",
        "text": "斜高為 $5$，側面積為 $60$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】正四稜錐的各側面為全等的等腰三角形。底邊長為 $6$，側稜長為 $5$。由頂點向底邊作垂線，垂足平分底邊（半邊長為 $3$）。由勾股定理求側面斜高：$h' = \\sqrt{5^2 - 3^2} = \\sqrt{25 - 9} = 4$。每個側面等腰三角形面積為 $S_{\\triangle} = \\frac{1}{2} \\times 6 \\times 4 = 12$。正四稜錐共有 $4$ 個側面，側面積 $S_{\\text{側}} = 4 \\times 12 = 48$。正確選項為 B。"
  },
  {
    "id": "G11_Q23_COMPLEX_DISTANCE_LOCUS",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "複數兩點間距離",
      "代數方程"
    ],
    "prompt": "若複數 $3+ai$ 與 $1-i$（$a \\in \\mathbf{R}$）在複平面內對應的兩點之間的距離為 $\\sqrt{5}$，則實數 $a =$",
    "stem": "若複數 $3+ai$ 與 $1-i$（$a \\in \\mathbf{R}$）在複平面內對應的兩點之間的距離為 $\\sqrt{5}$，則實數 $a =$",
    "options": [
      {
        "key": "A",
        "text": "$0$ 或 $-2$"
      },
      {
        "key": "B",
        "text": "$2$ 或 $-4$"
      },
      {
        "key": "C",
        "text": "$1$ 或 $-1$"
      },
      {
        "key": "D",
        "text": "$-1$ 或 $3$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】複平面內兩複數差的模長等於兩點間幾何距離：$d = |(3+ai) - (1-i)| = |2 + (a+1)i| = \\sqrt{2^2 + (a+1)^2} = \\sqrt{5}$。兩邊平方得 $4 + (a+1)^2 = 5$，化簡得 $(a+1)^2 = 1$。解得 $a+1 = \\pm 1$，即 $a = 0$ 或 $a = -2$。正確選項為 A。"
  },
  {
    "id": "G11_Q24_TRAPEZOID_REVOLUTION",
    "chapter": "ch08_stereometry",
    "section": "8.1",
    "type": "single_choice",
    "difficulty": "Level_B",
    "tags": [
      "旋轉體組合體",
      "直角梯形旋轉"
    ],
    "prompt": "直角梯形 $ABCD$ 中，$AD \\parallel BC$，$AB \\perp BC$，$AD < BC$。將梯形繞較短底邊所在直線 $AD$ 旋轉一周，所得的幾何體是",
    "stem": "直角梯形 $ABCD$ 中，$AD \\parallel BC$，$AB \\perp BC$，$AD < BC$。將梯形繞較短底邊所在直線 $AD$ 旋轉一周，所得的幾何體是",
    "options": [
      {
        "key": "A",
        "text": "一個圓台"
      },
      {
        "key": "B",
        "text": "一個圓柱"
      },
      {
        "key": "C",
        "text": "一個圓柱與一個圓錐拼接而成的組合體"
      },
      {
        "key": "D",
        "text": "一個圓柱挖去一個圓錐後的組合體"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】過點 $C$ 作 $AD$ 的延長線的垂線，垂足為 $E$。直角梯形可視為矩形 $ABCE$ 挖去直角三角形 $CDE$。當繞直線 $AD$ 旋轉一周時，矩形 $ABCE$ 旋轉形成以 $AB$ 為底半徑、以 $BC$ 為高的圓柱；直角三角形 $CDE$ 旋轉形成以 $CE=AB$ 為底半徑、以 $DE$ 為高的圓錐。因此所得幾何體為一個圓柱挖去一個圓錐後的組合體。正確選項為 D。"
  },
  {
    "id": "G11_Q25_COMPLEX_PROPERTIES_MULTIPLE",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "複數概念辨析",
      "共軛複數性質"
    ],
    "prompt": "下列關於複數的命題中，正確的是",
    "stem": "下列關於複數的命題中，正確的是",
    "options": [
      {
        "key": "A",
        "text": "若 $z_1^2 + z_2^2 = 0$，則 $z_1 = z_2 = 0$"
      },
      {
        "key": "B",
        "text": "若 $|z| = 1$，則 $z = \\pm 1$ 或 $z = \\pm i$"
      },
      {
        "key": "C",
        "text": "若 $\\bar{z} = z$，則 $z$ 必為實數"
      },
      {
        "key": "D",
        "text": "任意兩個複數都可以比較大小"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】C：設 $z = a + bi$（$a, b \\in \\mathbf{R}$），則 $\\bar{z} = a - bi$。若 $\\bar{z} = z$，則 $a - bi = a + bi \\implies 2bi = 0 \\implies b = 0$，此時 $z = a$ 為實數，正確；A：在複數域中反例顯著：取 $z_1 = 1, z_2 = i$，則 $1^2 + i^2 = 1 - 1 = 0$，但兩者均不為 0，A 錯誤；B：單位圓上任意複數模長均為 1，例如 $\\frac{1}{2} + \\frac{\\sqrt{3}}{2}i$，有無限多個解，B 錯誤；D：虛數不能比較大小（沒有全序關係），只有實數才能比較大小，D 錯誤。正確選項為 C。"
  },
  {
    "id": "G11_Q26_BUBBLE_VOLUME_EXPANSION",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "球的面積與體積",
      "百分比增長率"
    ],
    "prompt": "若一個水下氣泡的表面積增加了 $44\\%$，假設氣泡始終保持完美球形，則該氣泡的體積增加了",
    "stem": "若一個水下氣泡的表面積增加了 $44\\%$，假設氣泡始終保持完美球形，則該氣泡的體積增加了",
    "options": [
      {
        "key": "A",
        "text": "$33.1\\%$"
      },
      {
        "key": "B",
        "text": "$44\\%$"
      },
      {
        "key": "C",
        "text": "$72.8\\%$"
      },
      {
        "key": "D",
        "text": "$88\\%$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】球表面積為 $S = 4\\pi R^2$，表面積增加 $44\\%$ 表示膨脹後面積 $S_2 = 1.44 S_1$。因此半徑擴大倍數為 $\\frac{R_2}{R_1} = \\sqrt{\\frac{S_2}{S_1}} = \\sqrt{1.44} = 1.2$。球的體積為 $V = \\frac{4}{3}\\pi R^3$，體積擴大倍數為 $\\frac{V_2}{V_1} = (\\frac{R_2}{R_1})^3 = 1.2^3 = 1.728$。因此體積增長率為 $\\frac{V_2 - V_1}{V_1} = 1.728 - 1 = 0.728 = 72.8\\%$。正確選項為 C。"
  },
  {
    "id": "G11_Q27_COMPLEX_LOCUS_MAX",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "複數幾何意義",
      "軌跡極值",
      "圓與模長"
    ],
    "prompt": "若複數 $z$ 滿足 $|z - 2i| = 1$，則其模長 $|z|$ 的最大值為",
    "stem": "若複數 $z$ 滿足 $|z - 2i| = 1$，則其模長 $|z|$ 的最大值為",
    "options": [
      {
        "key": "A",
        "text": "$3$"
      },
      {
        "key": "B",
        "text": "$2$"
      },
      {
        "key": "C",
        "text": "$1$"
      },
      {
        "key": "D",
        "text": "$5$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】在複平面內，$|z - 2i| = 1$ 表示動點 $Z$ 到定點 $C(0, 2)$（對應複數 $2i$）的距離恆等於 $1$，其幾何軌跡是以 $(0, 2)$ 為圓心、半徑 $r=1$ 的圓。$|z|$ 表示動點 $Z$ 到原點 $O(0, 0)$ 的距離。由平面幾何可知，原點到圓上各點距離的最大值為圓心到原點的距離加半徑：$|z|_{\\max} = |OC| + r = 2 + 1 = 3$（此時 $z = 3i$）。正確選項為 A。"
  },
  {
    "id": "G11_Q28_CYLINDER_CONE_SUBTRACTION",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "組合體計算",
      "圓柱挖錐",
      "表面積與體積"
    ],
    "prompt": "一個零件是由圓柱挖去一個與它同底等高的圓錐而得到的（圓錐底面就是圓柱上底面，錐頂為下底面圓心）。已知圓柱底面半徑為 $5\\text{ cm}$，高為 $12\\text{ cm}$。則這個零件的表面積與體積分別為",
    "stem": "一個零件是由圓柱挖去一個與它同底等高的圓錐而得到的（圓錐底面就是圓柱上底面，錐頂為下底面圓心）。已知圓柱底面半徑為 $5\\text{ cm}$，高為 $12\\text{ cm}$。則這個零件的表面積與體積分別為",
    "options": [
      {
        "key": "A",
        "text": "表面積 $210\\pi\\text{ cm}^2$，體積 $300\\pi\\text{ cm}^3$"
      },
      {
        "key": "B",
        "text": "表面積 $210\\pi\\text{ cm}^2$，體積 $200\\pi\\text{ cm}^3$"
      },
      {
        "key": "C",
        "text": "表面積 $185\\pi\\text{ cm}^2$，體積 $200\\pi\\text{ cm}^3$"
      },
      {
        "key": "D",
        "text": "表面積 $235\\pi\\text{ cm}^2$，體積 $100\\pi\\text{ cm}^3$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】1. 圓錐母線長：$l = \\sqrt{h^2+r^2} = \\sqrt{12^2+5^2} = 13\\text{ cm}$。\n2. 零件表面積：由圓柱側面、圓柱下底面以及內凹的圓錐側面構成（上底面已被挖空），$S_{\\text{表}} = S_{\\text{柱側}} + S_{\\text{下底}} + S_{\\text{錐側}} = 2\\pi(5)(12) + \\pi(5^2) + \\pi(5)(13) = 120\\pi + 25\\pi + 65\\pi = 210\\pi\\text{ cm}^2$。\n3. 零件體積：$V = V_{\\text{柱}} - V_{\\text{錐}} = \\pi(5^2)(12) - \\frac{1}{3}\\pi(5^2)(12) = 300\\pi - 100\\pi = 200\\pi\\text{ cm}^3$。正確選項為 B。"
  },
  {
    "id": "G11_Q29_CUBE_CIRCUMSCRIBED_SPHERE",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "外接球",
      "正方體幾何",
      "體積計算"
    ],
    "prompt": "一個正方體的 $8$ 個頂點都在同一個球面上，若正方體的稜長為 $2$，則這個外接球的體積為",
    "stem": "一個正方體的 $8$ 個頂點都在同一個球面上，若正方體的稜長為 $2$，則這個外接球的體積為",
    "options": [
      {
        "key": "A",
        "text": "$4\\sqrt{3}\\pi$"
      },
      {
        "key": "B",
        "text": "$12\\pi$"
      },
      {
        "key": "C",
        "text": "$\\frac{32}{3}\\pi$"
      },
      {
        "key": "D",
        "text": "$8\\sqrt{2}\\pi$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】正方體外接球的球心為正方體的幾何中心，正方體的體對角線長等於外接球的直徑：$2R = \\sqrt{a^2 + a^2 + a^2} = \\sqrt{3} a$。已知稜長 $a = 2$，得直徑 $2R = 2\\sqrt{3} \\implies R = \\sqrt{3}$。外接球體積公式為 $V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi (\\sqrt{3})^3 = \\frac{4}{3}\\pi \\cdot 3\\sqrt{3} = 4\\sqrt{3}\\pi$。正確選項為 A。"
  },
  {
    "id": "G11_Q30_CYLINDER_SQUARE_UNFOLD",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "圓柱側面展開",
      "表面積與側面積之比"
    ],
    "prompt": "一個圓柱的側面展開圖是邊長為正數的正方形，則這個圓柱的表面積與側面積之比為",
    "stem": "一個圓柱的側面展開圖是邊長為正數的正方形，則這個圓柱的表面積與側面積之比為",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{1+4\\pi}{4\\pi}$"
      },
      {
        "key": "B",
        "text": "$\\frac{1+2\\pi}{\\pi}$"
      },
      {
        "key": "C",
        "text": "$\\frac{1+2\\pi}{2\\pi}$"
      },
      {
        "key": "D",
        "text": "$\\frac{1+4\\pi}{2\\pi}$"
      }
    ],
    "steps": null,
    "answer": "C",
    "explanation": "【解析】設側面展開圖正方形邊長為 $h$。則圓柱的高為 $h$，底面圓周長為 $2\\pi r = h \\implies r = \\frac{h}{2\\pi}$。側面積為正方形面積 $S_{\\text{側}} = h^2$。兩個底面的總面積為 $2 S_{\\text{底}} = 2 \\times \\pi r^2 = 2\\pi (\\frac{h}{2\\pi})^2 = \\frac{h^2}{2\\pi}$。因此圓柱表面積為 $S_{\\text{表}} = S_{\\text{側}} + 2S_{\\text{底}} = h^2 + \\frac{h^2}{2\\pi} = h^2 \\frac{2\\pi+1}{2\\pi}$。兩者之比 $\\frac{S_{\\text{表}}}{S_{\\text{側}}} = \\frac{h^2 \\frac{1+2\\pi}{2\\pi}}{h^2} = \\frac{1+2\\pi}{2\\pi}$。正確選項為 C。"
  },
  {
    "id": "G11_Q31_COMPLEX_EQUATION_CONJUGATE",
    "chapter": "ch07_complex",
    "section": "7.2",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "複數方程",
      "模長與複數",
      "方程組求解"
    ],
    "prompt": "若複數 $z$ 滿足方程 $z + |z| = 2 + i$，則複數 $z =$",
    "stem": "若複數 $z$ 滿足方程 $z + |z| = 2 + i$，則複數 $z =$",
    "options": [
      {
        "key": "A",
        "text": "$\\frac{3}{4} - i$"
      },
      {
        "key": "B",
        "text": "$\\frac{3}{4} + i$"
      },
      {
        "key": "C",
        "text": "$1 + i$"
      },
      {
        "key": "D",
        "text": "$\\frac{5}{4} + i$"
      }
    ],
    "steps": null,
    "answer": "B",
    "explanation": "【解析】設 $z = x + yi$（$x, y \\in \\mathbf{R}$），則模長 $|z| = \\sqrt{x^2+y^2}$ 為實數。原方程變為 $(x + \\sqrt{x^2+y^2}) + yi = 2 + i$。由複數相等的定義：虛部對應相等得 $y = 1$；實部對應相等得 $x + \\sqrt{x^2+1} = 2$。移項得 $\\sqrt{x^2+1} = 2 - x$，兩邊平方得 $x^2 + 1 = 4 - 4x + x^2$。化簡得 $4x = 3 \\implies x = \\frac{3}{4}$（檢驗 $2-x = \\frac{5}{4} > 0$ 合格）。因此複數 $z = \\frac{3}{4} + i$。正確選項為 B。"
  },
  {
    "id": "G11_Q32_COMPLEX_DISTANCE_EXTREMA",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "複數最值",
      "三角不等式",
      "距離極值"
    ],
    "prompt": "已知複數 $z$ 滿足 $|z| = 1$，則 $|z + 3 - 4i|$ 的最小值與最大值分別為",
    "stem": "已知複數 $z$ 滿足 $|z| = 1$，則 $|z + 3 - 4i|$ 的最小值與最大值分別為",
    "options": [
      {
        "key": "A",
        "text": "最小值為 $4$，最大值為 $6$"
      },
      {
        "key": "B",
        "text": "最小值為 $3$，最大值為 $5$"
      },
      {
        "key": "C",
        "text": "最小值為 $2$，最大值為 $8$"
      },
      {
        "key": "D",
        "text": "最小值為 $4$，最大值為 $5$"
      }
    ],
    "steps": null,
    "answer": "A",
    "explanation": "【解析】$|z + 3 - 4i| = |z - (-3+4i)|$，幾何意義為單位圓 $|z|=1$ 上的動點 $Z$ 到定點 $P(-3, 4)$ 的距離。定點 $P$ 到原點的距離為 $|OP| = \\sqrt{(-3)^2 + 4^2} = 5$。由於單位圓半徑為 $r=1$，依據圓的幾何性質：最小距離為 $|OP| - r = 5 - 1 = 4$，最大距離為 $|OP| + r = 5 + 1 = 6$。正確選項為 A。"
  },
  {
    "id": "G11_Q33_COMPLEX_POLYNOMIAL_COEFF",
    "chapter": "ch07_complex",
    "section": "7.3",
    "type": "single_choice",
    "difficulty": "Level_C",
    "tags": [
      "韋達定理",
      "共軛虛根成對",
      "實係數方程"
    ],
    "prompt": "若 $1 + \\sqrt{2}i$ 是實係數一元二次方程 $x^2 + bx + c = 0$（$b, c \\in \\mathbf{R}$）的一個根，則實數 $b$ 與 $c$ 的值分別為",
    "stem": "若 $1 + \\sqrt{2}i$ 是實係數一元二次方程 $x^2 + bx + c = 0$（$b, c \\in \\mathbf{R}$）的一個根，則實數 $b$ 與 $c$ 的值分別為",
    "options": [
      {
        "key": "A",
        "text": "$b = 2,\\, c = 3$"
      },
      {
        "key": "B",
        "text": "$b = -2,\\, c = -1$"
      },
      {
        "key": "C",
        "text": "$b = 2,\\, c = -3$"
      },
      {
        "key": "D",
        "text": "$b = -2,\\, c = 3$"
      }
    ],
    "steps": null,
    "answer": "D",
    "explanation": "【解析】由實係數一元二次方程虛根成對定理，若 $x_1 = 1 + \\sqrt{2}i$ 為根，則其共軛複數 $x_2 = 1 - \\sqrt{2}i$ 也必然是該方程的根。由韋達定理：兩根之和 $x_1 + x_2 = -b \\implies (1+\\sqrt{2}i) + (1-\\sqrt{2}i) = 2 \\implies -b = 2 \\implies b = -2$；兩根之積 $x_1 x_2 = c \\implies (1+\\sqrt{2}i)(1-\\sqrt{2}i) = 1^2 - (\\sqrt{2}i)^2 = 1 - (-2) = 3 \\implies c = 3$。因此 $b = -2, c = 3$。正確選項為 D。"
  },
  {
    "id": "G11_MC01_COMPLEX_CLASSIFICATION",
    "chapter": "ch07_complex",
    "section": "7.1",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "複數分類",
      "參數分析",
      "純虛數與實數"
    ],
    "prompt": "已知複數 $z = (m^2 - 2m - 3) + (m^2 - 1)i$（$m \\in \\mathbf{R}$）。下列命題中正確的選項有",
    "stem": "已知複數 $z = (m^2 - 2m - 3) + (m^2 - 1)i$（$m \\in \\mathbf{R}$）。下列命題中正確的選項有",
    "options": [
      {
        "key": "A",
        "text": "當 $m = -1$ 時，$z = 0$"
      },
      {
        "key": "B",
        "text": "當 $m = 3$ 時，$z$ 是純虛數"
      },
      {
        "key": "C",
        "text": "當 $m \\ne 1$ 且 $m \\ne -1$ 時，$z$ 必是虛數"
      },
      {
        "key": "D",
        "text": "當 $m = 1$ 時，$z$ 是實數"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "【解析】A：$z=0 \\iff m^2-2m-3=0$ 且 $m^2-1=0$。由前者解得 $m=3$ 或 $m=-1$，後者解得 $m=\\pm 1$，公共解為 $m=-1$，A 正確；B：$z$ 為純虛數 $\\iff m^2-2m-3=0$ 且 $m^2-1 \\ne 0$，解得 $m=3$，B 正確；C：$z$ 是虛數 $\\iff$ 虛部不為零，即 $m^2-1 \\ne 0 \\implies m \\ne 1$ 且 $m \\ne -1$，C 正確；D：當 $m=1$ 時，虛部 $1^2-1=0$，實部為 $1-2-3=-4$，故 $z = -4$ 是實數，D 正確。全部選項均正確。"
  },
  {
    "id": "G11_MC02_STEREOMETRY_COMPOSITE",
    "chapter": "ch08_stereometry",
    "section": "8.2",
    "type": "multiple_choice",
    "difficulty": "Level_B",
    "tags": [
      "幾何體綜合性質",
      "立體幾何定理",
      "多項判定"
    ],
    "prompt": "下列關於基本立體圖形度量性質的命題中，正確的選項有",
    "stem": "下列關於基本立體圖形度量性質的命題中，正確的選項有",
    "options": [
      {
        "key": "A",
        "text": "圓柱的體積等於與它同底等高的圓錐體積的 $3$ 倍"
      },
      {
        "key": "B",
        "text": "長方體體對角線長度的平方等於長、寬、高三個維度長度的平方和"
      },
      {
        "key": "C",
        "text": "斜二測畫法中直觀圖的面積與原平面圖形面積之比為 $1 : 2\\sqrt{2}$"
      },
      {
        "key": "D",
        "text": "用一個平行於圓台底面的平面去截圓台，所得截面必為圓面"
      }
    ],
    "steps": null,
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "explanation": "【解析】A：$V_{\\text{柱}} = Sh$，$V_{\\text{錐}} = \\frac{1}{3}Sh$，比值為 3，正確；B：$d^2 = a^2+b^2+c^2$，正確；C：原圖與直觀圖面積比為 $S:S' = 2\\sqrt{2}:1$，故 $S':S = 1:2\\sqrt{2}$，正確；D：圓台由圓錐截得，平行於底面的截面必然與底面相似且同為圓形，正確。全部選項均正確。"
  }
];

  // Attach metadata and helper properties
  questionsList.grade = 11;
  questionsList.bankId = "G11_MATH_BANK_V1";
  questionsList.version = "2026.1";
  questionsList.totalCount = questionsList.length;
  questionsList.questions = questionsList;

  // Export to global window
  if (typeof window !== 'undefined') {
    window.QUESTIONS_G11 = questionsList;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.QUESTIONS_G11 = questionsList;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QUESTIONS_G11: questionsList };
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
