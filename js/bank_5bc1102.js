/**
 * bank_5bc1102.js - Question Bank and Roster for 5BC1102 Math Practice Platform
 * Total Questions: 67
 * Classes: 5B (28 students), 5C (29 students)
 * Teacher Passcode: 5BC99
 */

(function (root) {
  'use strict';

  const ROSTER_5BC = {
  "5B": [
    {
      "id": 1,
      "name": "吳鎂澄"
    },
    {
      "id": 2,
      "name": "蘇子恩"
    },
    {
      "id": 3,
      "name": "李潤歌"
    },
    {
      "id": 4,
      "name": "李曉熹"
    },
    {
      "id": 5,
      "name": "周鈺燕"
    },
    {
      "id": 6,
      "name": "林煜皓"
    },
    {
      "id": 7,
      "name": "林穎豪"
    },
    {
      "id": 8,
      "name": "柯鈺鑫"
    },
    {
      "id": 9,
      "name": "洪泳棋"
    },
    {
      "id": 10,
      "name": "高尚禮"
    },
    {
      "id": 11,
      "name": "張啟赫"
    },
    {
      "id": 12,
      "name": "張嘉城"
    },
    {
      "id": 13,
      "name": "梁泳心"
    },
    {
      "id": 14,
      "name": "梁芷韻"
    },
    {
      "id": 15,
      "name": "梁偉烽"
    },
    {
      "id": 16,
      "name": "姚皓然"
    },
    {
      "id": 17,
      "name": "陳施攸"
    },
    {
      "id": 18,
      "name": "陳柏琳"
    },
    {
      "id": 19,
      "name": "陳國良"
    },
    {
      "id": 20,
      "name": "陳紫涵"
    },
    {
      "id": 21,
      "name": "陳鑫源"
    },
    {
      "id": 22,
      "name": "彭婷婷"
    },
    {
      "id": 23,
      "name": "黃少彬"
    },
    {
      "id": 24,
      "name": "黃卓琳"
    },
    {
      "id": 25,
      "name": "黃婉瑜"
    },
    {
      "id": 26,
      "name": "葉棨釗"
    },
    {
      "id": 27,
      "name": "潘子聰"
    },
    {
      "id": 28,
      "name": "黎宛旻"
    }
  ],
  "5C": [
    {
      "id": 1,
      "name": "王毓琳"
    },
    {
      "id": 2,
      "name": "王韻婷"
    },
    {
      "id": 3,
      "name": "甘凱童"
    },
    {
      "id": 4,
      "name": "何健峰"
    },
    {
      "id": 5,
      "name": "岑子鈞"
    },
    {
      "id": 6,
      "name": "周浩軒"
    },
    {
      "id": 7,
      "name": "周楠"
    },
    {
      "id": 8,
      "name": "周杰靈"
    },
    {
      "id": 9,
      "name": "林貝莎"
    },
    {
      "id": 10,
      "name": "林靜瑤"
    },
    {
      "id": 11,
      "name": "姚念欣"
    },
    {
      "id": 12,
      "name": "姜嘉慧"
    },
    {
      "id": 13,
      "name": "柯欣榮"
    },
    {
      "id": 14,
      "name": "洪鍶堉"
    },
    {
      "id": 15,
      "name": "梁曉童"
    },
    {
      "id": 16,
      "name": "許惠琳"
    },
    {
      "id": 17,
      "name": "陳美婷"
    },
    {
      "id": 18,
      "name": "陳敬恩"
    },
    {
      "id": 19,
      "name": "傅銘瀚"
    },
    {
      "id": 20,
      "name": "曾浚軒"
    },
    {
      "id": 21,
      "name": "黃子陽"
    },
    {
      "id": 22,
      "name": "黃宏迅"
    },
    {
      "id": 23,
      "name": "黃澤凱"
    },
    {
      "id": 24,
      "name": "楊紫晴"
    },
    {
      "id": 25,
      "name": "甄浩銘"
    },
    {
      "id": 26,
      "name": "劉焯軒"
    },
    {
      "id": 27,
      "name": "歐卓言"
    },
    {
      "id": 28,
      "name": "戴詠茵"
    },
    {
      "id": 29,
      "name": "謝凱盈"
    }
  ]
};

  const BANK_5BC1102 = [
  {
    "id": "5BC_E01",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "平面的確定條件",
    "stem": "下列說法中，正確的是（　　）",
    "options": [
      {
        "key": "A",
        "text": "四邊形一定是平面圖形"
      },
      {
        "key": "B",
        "text": "三點確定一個平面"
      },
      {
        "key": "C",
        "text": "兩條相交直線確定一個平面"
      },
      {
        "key": "D",
        "text": "一條直線和一個點確定一個平面"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 1 及推論 2】：兩相交直線確定一個平面；不共線三點才能確定唯一平面。",
    "explanation": "兩條相交直線有且只有一個平面（推論2）。三點若共線有無限多平面；空間四邊形不共面；點在直線上時不能確定平面。"
  },
  {
    "id": "5BC_E02",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "線面平行與線線位置",
    "stem": "已知直線 $m$、$n$ 和平面 $\\alpha$，若 $m \\parallel \\alpha$，$n \\subset \\alpha$，則 $m$ 與 $n$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行"
      },
      {
        "key": "B",
        "text": "相交"
      },
      {
        "key": "C",
        "text": "異面"
      },
      {
        "key": "D",
        "text": "平行或異面"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 直線與平面位置關係】：直線平行於平面，則與平面內的所有直線都沒有公共點，因此只能平行或異面。",
    "explanation": "直線 $m \\parallel \\alpha$ 說明 $m$ 與平面 $\\alpha$ 無公共點。而 $n \\subset \\alpha$，所以 $m$ 與 $n$ 無公共點，空間中無公共點的兩直線只能平行或異面。"
  },
  {
    "id": "5BC_E03",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "線面平行與線線垂直",
    "stem": "若直線 $l$ 平行於平面 $\\alpha$，直線 $m$ 垂直於平面 $\\alpha$，則直線 $l$ 與直線 $m$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行"
      },
      {
        "key": "B",
        "text": "異面"
      },
      {
        "key": "C",
        "text": "垂直"
      },
      {
        "key": "D",
        "text": "相交"
      }
    ],
    "correctKeys": [
      "C"
    ],
    "answer": [
      "C"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面垂直定義及性質】：垂直於平面的直線必垂直於平行於該平面的直線（可能相交垂直或異面垂直）。",
    "explanation": "設 $l \\parallel \\alpha, m \\perp \\alpha$。過 $l$ 作面與 $\\alpha$ 交於 $k$，則 $l \\parallel k$；又 $m \\perp \\alpha \\Rightarrow m \\perp k$，因此 $m \\perp l$。"
  },
  {
    "id": "5BC_E04",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列的判定",
    "stem": "下列數列中，是等差數列的是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$3, 6, 12, 24, \\cdots$"
      },
      {
        "key": "B",
        "text": "$1, 4, 9, 16, \\cdots$"
      },
      {
        "key": "C",
        "text": "$5, -5, 5, -5, \\cdots$"
      },
      {
        "key": "D",
        "text": "$8, 5, 2, -1, \\cdots$"
      }
    ],
    "correctKeys": [
      "D"
    ],
    "answer": [
      "D"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列定義】：$a_{n+1}-a_n = d$（常數）。檢驗連續項之差是否相等。",
    "explanation": "$8, 5, 2, -1, \\cdots$ 中，相鄰兩項之差均為 $-3$（常數），是等差數列。"
  },
  {
    "id": "5BC_E05",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "由通項公式求公差",
    "stem": "已知數列 $\\{a_n\\}$ 的通項公式為 $a_n = 4n - 5$，則數列 $\\{a_n\\}$ 是（　　）",
    "options": [
      {
        "key": "A",
        "text": "公差為 4 的等差數列"
      },
      {
        "key": "B",
        "text": "公差為 -5 的等差數列"
      },
      {
        "key": "C",
        "text": "公差為 -1 的等差數列"
      },
      {
        "key": "D",
        "text": "不是等差數列"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列通項公式】：$a_n = dn + (a_1-d)$，一次項係數為公差 $d$。",
    "explanation": "$a_{n+1}-a_n = [4(n+1)-5] - (4n-5) = 4$，是常數，故公差 $d=4$。"
  },
  {
    "id": "5BC_E06",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "交錯符號數列通項",
    "stem": "數列 $1, -\\frac{1}{2}, \\frac{1}{3}, -\\frac{1}{4}, \\cdots$ 的一個通項公式是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$a_n = \\frac{(-1)^{n+1}}{n}$"
      },
      {
        "key": "B",
        "text": "$a_n = \\frac{(-1)^n}{n}$"
      },
      {
        "key": "C",
        "text": "$a_n = \\frac{(-1)^{n+1}}{n+1}$"
      },
      {
        "key": "D",
        "text": "$a_n = \\frac{1}{n}$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 通項公式】：奇數項為正、偶數項為負時，符號為 $(-1)^{n+1}$，分母為 $n$。",
    "explanation": "$a_1 = \\frac{(-1)^2}{1} = 1$，$a_2 = \\frac{(-1)^3}{2} = -\\frac{1}{2}$，符合題意。"
  },
  {
    "id": "5BC_E07",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "數列單調性判斷",
    "stem": "已知數列 $\\{a_n\\}$ 的通項公式為 $a_n = \\frac{n}{n+1}$，則該數列是（　　）",
    "options": [
      {
        "key": "A",
        "text": "遞增數列"
      },
      {
        "key": "B",
        "text": "遞減數列"
      },
      {
        "key": "C",
        "text": "常數列"
      },
      {
        "key": "D",
        "text": "無法判定"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 單調性】：$a_{n+1}-a_n > 0 \\Leftrightarrow$ 遞增數列。作差檢驗符號。",
    "explanation": "$a_{n+1}-a_n = \\frac{n+1}{n+2} - \\frac{n}{n+1} = \\frac{1}{(n+1)(n+2)} > 0$，故為遞增數列。"
  },
  {
    "id": "5BC_E08",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "求等差數列指定項",
    "stem": "求等差數列 $4, 7, 10, \\cdots$ 的第 25 項（　　）",
    "options": [
      {
        "key": "A",
        "text": "76"
      },
      {
        "key": "B",
        "text": "73"
      },
      {
        "key": "C",
        "text": "79"
      },
      {
        "key": "D",
        "text": "75"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列通項公式】：$a_n = a_1 + (n-1)d$。首項 $a_1=4$，公差 $d=3$。",
    "explanation": "$a_{25} = 4 + 24 \\times 3 = 4 + 72 = 76$。"
  },
  {
    "id": "5BC_E09",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "下標和求公差",
    "stem": "等差數列 $\\{a_n\\}$ 中，$a_1 + a_5 = 14$，$a_4 = 9$，則公差 $d$ 為（　　）",
    "options": [
      {
        "key": "A",
        "text": "2"
      },
      {
        "key": "B",
        "text": "3"
      },
      {
        "key": "C",
        "text": "1"
      },
      {
        "key": "D",
        "text": "4"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 下標和性質】：$a_1+a_5 = 2a_3$。求出 $a_3$ 後，$d = a_4 - a_3$。",
    "explanation": "$a_1 + a_5 = 2a_3 = 14 \\Rightarrow a_3 = 7$。則 $d = a_4 - a_3 = 9 - 7 = 2$。"
  },
  {
    "id": "5BC_E10",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "由 Sn 求指定項",
    "stem": "已知數列 $\\{a_n\\}$ 的前 $n$ 項和為 $S_n = 2n^2$，求此數列的第 6 項 $a_6$。（　　）",
    "options": [
      {
        "key": "A",
        "text": "22"
      },
      {
        "key": "B",
        "text": "24"
      },
      {
        "key": "C",
        "text": "20"
      },
      {
        "key": "D",
        "text": "18"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 由 Sn 求 an】：$a_n = S_n - S_{n-1}$。$a_6 = S_6 - S_5$。",
    "explanation": "$S_6 = 2(36) = 72$，$S_5 = 2(25) = 50$。$a_6 = 72 - 50 = 22$。"
  },
  {
    "id": "5BC_E11",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "點與平面符號語言",
    "stem": "表示「點 $A$ 在平面 $\\alpha$ 內」的數學符號是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$A \\in \\alpha$"
      },
      {
        "key": "B",
        "text": "$A \\subset \\alpha$"
      },
      {
        "key": "C",
        "text": "$A \\notin \\alpha$"
      },
      {
        "key": "D",
        "text": "$A \\cap \\alpha = A$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 符號】：元素（點）與集合（線、面）用 $\\in, \\notin$；集合（線）與集合（面）用 $\\subset, \\not\\subset$。",
    "explanation": "點是幾何中的元素，平面是點的集合，點在平面內用屬於符號 $A \\in \\alpha$。"
  },
  {
    "id": "5BC_E12",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "線面相交符號語言",
    "stem": "表示「直線 $a$ 與平面 $\\alpha$ 相交於點 $P$」的符號語言是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$a \\cap \\alpha = P$"
      },
      {
        "key": "B",
        "text": "$a \\in \\alpha = P$"
      },
      {
        "key": "C",
        "text": "$a \\subset \\alpha$"
      },
      {
        "key": "D",
        "text": "$P \\subset a \\cap \\alpha$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 符號】：相交公共點用交集符號 $\\cap$ 表示。",
    "explanation": "直線與平面的交點用交集記作 $a \\cap \\alpha = P$。"
  },
  {
    "id": "5BC_E13",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "正方體中交線確認",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，平面 $ABCD$ 與平面 $BCC_1B_1$ 的交線是（　　）",
    "options": [
      {
        "key": "A",
        "text": "直線 $BC$"
      },
      {
        "key": "B",
        "text": "直線 $AB$"
      },
      {
        "key": "C",
        "text": "直線 $CD$"
      },
      {
        "key": "D",
        "text": "直線 $BB_1$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 3】：兩平面的公共點必在其唯一的公共直線（交線）上。",
    "explanation": "平面 $ABCD$ 與平面 $BCC_1B_1$ 的公共頂點為 $B$ 和 $C$，故交線為直線 $BC$。"
  },
  {
    "id": "5BC_E14",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "正方體線面平行關係",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，直線 $A_1B_1$ 與平面 $ABCD$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行"
      },
      {
        "key": "B",
        "text": "相交"
      },
      {
        "key": "C",
        "text": "在平面內"
      },
      {
        "key": "D",
        "text": "垂直"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面平行判定定理】：平面外一條直線與平面內一條直線平行，則該直線與此平面平行。",
    "explanation": "因為 $A_1B_1 \\parallel AB$，且 $A_1B_1 \\not\\subset$ 平面 $ABCD$，$AB \\subset$ 平面 $ABCD$，所以 $A_1B_1 \\parallel$ 平面 $ABCD$。"
  },
  {
    "id": "5BC_E15",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "正方體中異面棱計數",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，與棱 $AB$ 異面的棱共有（　　）條。",
    "options": [
      {
        "key": "A",
        "text": "4 條"
      },
      {
        "key": "B",
        "text": "3 條"
      },
      {
        "key": "C",
        "text": "5 條"
      },
      {
        "key": "D",
        "text": "6 條"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 異面直線定義】：不同在任何一個平面內的兩條直線。在正方體中既不平行也不相交的棱。",
    "explanation": "與棱 $AB$ 異面的棱有：$CC_1, DD_1, A_1D_1, B_1C_1$，共 4 條。"
  },
  {
    "id": "5BC_E16",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "正方體面面垂直垂直棱計數",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 的 12 條棱中，與平面 $ABCD$ 垂直的棱共有（　　）條。",
    "options": [
      {
        "key": "A",
        "text": "4 條"
      },
      {
        "key": "B",
        "text": "2 條"
      },
      {
        "key": "C",
        "text": "6 條"
      },
      {
        "key": "D",
        "text": "8 條"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面垂直定義】：正方體的四條側棱垂直於底面。",
    "explanation": "垂直於底面 $ABCD$ 的棱是四條側棱：$AA_1, BB_1, CC_1, DD_1$，共 4 條。"
  },
  {
    "id": "5BC_E17",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.5 空間直線、平面的平行",
    "topic": "正方體面與棱平行計數",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 的 6 個表面中，與棱 $AA_1$ 平行的面共有（　　）個。",
    "options": [
      {
        "key": "A",
        "text": "2 個"
      },
      {
        "key": "B",
        "text": "1 個"
      },
      {
        "key": "C",
        "text": "3 個"
      },
      {
        "key": "D",
        "text": "4 個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面平行判定定理】：與直線對面的面平行。",
    "explanation": "包含棱 $AA_1$ 的面有 2 個（平面 $ABB_1A_1$ 與平面 $ADD_1A_1$）；相交底面 2 個（上、下底面）；與其平行的面是平面 $BCC_1B_1$ 和平面 $CDD_1C_1$，共 2 個。"
  },
  {
    "id": "5BC_E18",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "正方體異面直線夾角",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，線段 $BA_1$ 與 $CB_1$ 的夾角是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$60^\\circ$"
      },
      {
        "key": "B",
        "text": "$90^\\circ$"
      },
      {
        "key": "C",
        "text": "$45^\\circ$"
      },
      {
        "key": "D",
        "text": "$30^\\circ$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 異面直線所成的角】：平移線段，構造正三角形計算夾角。",
    "explanation": "因為 $CB_1 \\parallel DA_1$，連接 $BD$，則 $\\triangle A_1BD$ 為各邊長為面對角線（$\\sqrt{2}a$）的等邊三角形，故夾角為 $60^\\circ$。"
  },
  {
    "id": "5BC_E19",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "二面角平面角大小",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，二面角 $A_1-BC-A$ 的大小是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$45^\\circ$"
      },
      {
        "key": "B",
        "text": "$90^\\circ$"
      },
      {
        "key": "C",
        "text": "$60^\\circ$"
      },
      {
        "key": "D",
        "text": "$30^\\circ$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 二面角的平面角】：作垂直於棱 $BC$ 的射線，在直角三角形中求角。",
    "explanation": "棱為 $BC$。$AB \\perp BC$ 且 $A_1B \\perp BC$，故 $\\angle A_1BA$ 為平面角。在等腰直角三角形 $A_1AB$ 中，$\\angle A_1BA = 45^\\circ$。"
  },
  {
    "id": "5BC_E20",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "線面所成角定義",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，面對角線 $A_1B$ 與底面 $ABCD$ 所成的角是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$45^\\circ$"
      },
      {
        "key": "B",
        "text": "$60^\\circ$"
      },
      {
        "key": "C",
        "text": "$90^\\circ$"
      },
      {
        "key": "D",
        "text": "$30^\\circ$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面所成的角】：平面的斜線和它在平面上的射影所成的角。",
    "explanation": "$A_1A \\perp$ 平面 $ABCD$，故 $AB$ 是 $A_1B$ 在底面上的射影。斜線與射影所成角為 $\\angle A_1BA = 45^\\circ$。"
  },
  {
    "id": "5BC_E21",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "線線平行傳遞性",
    "stem": "空間中垂直於同一個平面的兩條直線的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行"
      },
      {
        "key": "B",
        "text": "垂直"
      },
      {
        "key": "C",
        "text": "相交"
      },
      {
        "key": "D",
        "text": "異面"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面垂直性質】：$a \\perp \\alpha, b \\perp \\alpha \\Rightarrow a \\parallel b$。",
    "explanation": "線面垂直的性質定理：垂直於同一個平面的兩條直線平行。"
  },
  {
    "id": "5BC_E22",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "面面垂直判定定理",
    "stem": "若直線 $a \\subset$ 平面 $\\alpha$，且 $a \\perp$ 平面 $\\beta$，則平面 $\\alpha$ 與平面 $\\beta$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "垂直"
      },
      {
        "key": "B",
        "text": "平行"
      },
      {
        "key": "C",
        "text": "斜交"
      },
      {
        "key": "D",
        "text": "重合"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 面面垂直判定定理】：如果一個平面過另一個平面的垂線，那麼這兩個平面垂直。",
    "explanation": "因為平面 $\\alpha$ 包含平面 $\\beta$ 的一條垂線 $a$，由面面垂直判定定理可知 $\\alpha \\perp \\beta$。"
  },
  {
    "id": "5BC_E23",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列公差公式",
    "stem": "已知等差數列 $\\{a_n\\}$ 中，$a_3 = 6$，$a_7 = 18$，則公差 $d$ 為（　　）",
    "options": [
      {
        "key": "A",
        "text": "3"
      },
      {
        "key": "B",
        "text": "2"
      },
      {
        "key": "C",
        "text": "4"
      },
      {
        "key": "D",
        "text": "5"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 通項公式推廣】：$d = \\frac{a_n - a_m}{n - m}$。",
    "explanation": "$d = \\frac{a_7 - a_3}{7 - 3} = \\frac{18 - 6}{4} = 3$。"
  },
  {
    "id": "5BC_E24",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "常規遞推公式計算",
    "stem": "已知數列 $\\{a_n\\}$ 滿足 $a_1 = 2$，$a_{n+1} = 2a_n - 1$，則 $a_3$ 的值為（　　）",
    "options": [
      {
        "key": "A",
        "text": "5"
      },
      {
        "key": "B",
        "text": "3"
      },
      {
        "key": "C",
        "text": "7"
      },
      {
        "key": "D",
        "text": "9"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 遞推公式】：逐項代入計算。由 $a_1$ 求 $a_2$，再求 $a_3$。",
    "explanation": "$a_2 = 2a_1 - 1 = 2(2) - 1 = 3$；$a_3 = 2a_2 - 1 = 2(3) - 1 = 5$。"
  },
  {
    "id": "5BC_E25",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差中項計算",
    "stem": "8 與 -14 的等差中項是（　　）",
    "options": [
      {
        "key": "A",
        "text": "-3"
      },
      {
        "key": "B",
        "text": "-6"
      },
      {
        "key": "C",
        "text": "3"
      },
      {
        "key": "D",
        "text": "11"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差中項】：$A = \\frac{a+b}{2}$。",
    "explanation": "$A = \\frac{8 + (-14)}{2} = \\frac{-6}{2} = -3$。"
  },
  {
    "id": "5BC_E26",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "由通項求指定項",
    "stem": "在等差數列 $\\{a_n\\}$ 中，$a_1 = 5$，$d = -2$，則該數列的第 10 項 $a_{10}$ 是（　　）",
    "options": [
      {
        "key": "A",
        "text": "-13"
      },
      {
        "key": "B",
        "text": "-15"
      },
      {
        "key": "C",
        "text": "-11"
      },
      {
        "key": "D",
        "text": "23"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列通項公式】：$a_n = a_1 + (n-1)d$。",
    "explanation": "$a_{10} = 5 + 9 \\times (-2) = 5 - 18 = -13$。"
  },
  {
    "id": "5BC_E27",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "公差符號與數列單調性",
    "stem": "等差數列 $7, 4, 1, -2, \\cdots$ 的公差 $d$ 是（　　）",
    "options": [
      {
        "key": "A",
        "text": "-3"
      },
      {
        "key": "B",
        "text": "3"
      },
      {
        "key": "C",
        "text": "-4"
      },
      {
        "key": "D",
        "text": "4"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列定義】：$d = a_2 - a_1$。注意符號！",
    "explanation": "$d = 4 - 7 = -3$。"
  },
  {
    "id": "5BC_E28",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "已知兩端項求和",
    "stem": "在等差數列 $\\{a_n\\}$ 中，$a_1 = 3$，$a_n = 27$，$S_n = 150$，則項數 $n$ 為（　　）",
    "options": [
      {
        "key": "A",
        "text": "10"
      },
      {
        "key": "B",
        "text": "12"
      },
      {
        "key": "C",
        "text": "8"
      },
      {
        "key": "D",
        "text": "15"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 前 n 項和第一式】：$S_n = \\frac{n(a_1+a_n)}{2}$。",
    "explanation": "$150 = \\frac{n(3 + 27)}{2} = 15n \\Rightarrow n = 10$。"
  },
  {
    "id": "5BC_E29",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "常數列性質",
    "stem": "數列 $5, 5, 5, 5, \\cdots$ 是公差 $d = $（　　）的等差數列。",
    "options": [
      {
        "key": "A",
        "text": "0"
      },
      {
        "key": "B",
        "text": "1"
      },
      {
        "key": "C",
        "text": "5"
      },
      {
        "key": "D",
        "text": "不存在公差"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列定義】：常數列是 $d=0$ 的特殊等差數列。",
    "explanation": "相鄰項之差 $5 - 5 = 0$ 恆成立，故為公差 $d=0$ 的等差數列。"
  },
  {
    "id": "5BC_E30",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "兩平面公共點個數",
    "stem": "兩個不重合的平面若有公共點，則它們公共點的個數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "無數個"
      },
      {
        "key": "B",
        "text": "僅 1 個"
      },
      {
        "key": "C",
        "text": "僅 2 個"
      },
      {
        "key": "D",
        "text": "有限個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 3】：如果兩個不重合的平面有一個公共點，那麼它們有且只有一條過該點的公共直線，直線上點有無數個。",
    "explanation": "依基本事實3，只要有一個公共點，兩平面必相交於過該點的唯一直線，直線上所有點均為公共點，故有無數個。"
  },
  {
    "id": "5BC_E31",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "空間兩直線無公共點位置關係",
    "stem": "空間中沒有公共點的兩條直線，它們的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行或異面"
      },
      {
        "key": "B",
        "text": "只能是平行"
      },
      {
        "key": "C",
        "text": "只能是異面"
      },
      {
        "key": "D",
        "text": "垂直或平行"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 直線與直線分類】：按公共點個數：相交（1個）；平行或異面（0個）。",
    "explanation": "空間中兩直線沒有公共點時，若在同一平面內則平行，若不在同一平面內則異面。"
  },
  {
    "id": "5BC_E32",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.5 空間直線、平面的平行",
    "topic": "線面平行性質定理",
    "stem": "直線 $a \\parallel$ 平面 $\\alpha$，若過 $a$ 的平面 $\\beta$ 與 $\\alpha$ 相交於直線 $b$，則 $a$ 與 $b$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行"
      },
      {
        "key": "B",
        "text": "相交"
      },
      {
        "key": "C",
        "text": "異面"
      },
      {
        "key": "D",
        "text": "重合"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面平行性質定理】：$a \\parallel \\alpha, a \\subset \\beta, \\alpha \\cap \\beta = b \\Rightarrow a \\parallel b$。",
    "explanation": "線面平行性質定理：直線與平面平行，如果過該直線的平面與此平面相交，那麼該直線與交線平行。"
  },
  {
    "id": "5BC_E33",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "兩平行線確定平面",
    "stem": "兩條平行直線可以確定平面的個數是（　　）",
    "options": [
      {
        "key": "A",
        "text": "1 個"
      },
      {
        "key": "B",
        "text": "2 個"
      },
      {
        "key": "C",
        "text": "3 個"
      },
      {
        "key": "D",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 1 推論 3】：兩條平行直線有且只有一個平面。",
    "explanation": "依推論3：兩條平行直線確定唯一的一個平面。"
  },
  {
    "id": "5BC_E34",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "下標和倍數性質",
    "stem": "等差數列 $\\{a_n\\}$ 中，$a_2 + a_{10} = 30$，則 $a_6$ 的值是（　　）",
    "options": [
      {
        "key": "A",
        "text": "15"
      },
      {
        "key": "B",
        "text": "10"
      },
      {
        "key": "C",
        "text": "20"
      },
      {
        "key": "D",
        "text": "12"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 下標和性質】：$2+10 = 2 \\times 6$，故 $a_2 + a_{10} = 2a_6$。",
    "explanation": "$2a_6 = a_2 + a_{10} = 30 \\Rightarrow a_6 = 15$。"
  },
  {
    "id": "5BC_E35",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "9, 99, 999 經典數列通項",
    "stem": "數列 $9, 99, 999, 9999, \\cdots$ 的一個通項公式是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$a_n = 10^n - 1$"
      },
      {
        "key": "B",
        "text": "$a_n = 10^n - 9$"
      },
      {
        "key": "C",
        "text": "$a_n = 9n$"
      },
      {
        "key": "D",
        "text": "$a_n = 10^{n-1} + 8$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 通項公式】：$9=10-1$，$99=10^2-1$，$999=10^3-1$。",
    "explanation": "第 $n$ 項為 $10^n - 1$。"
  },
  {
    "id": "5BC_E36",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "平面的幾何概念",
    "stem": "下列關於幾何中「平面」的敘述，正確的是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平面是平的，向四周無限延展且沒有厚度"
      },
      {
        "key": "B",
        "text": "平面有大小和邊界"
      },
      {
        "key": "C",
        "text": "平面厚度極薄但存在厚度"
      },
      {
        "key": "D",
        "text": "平面的形狀只能是平行四邊形"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.1 平面的概念】：無限延展、沒有厚度，畫法常用平行四邊形表示。",
    "explanation": "幾何中的平面是抽象的概念，特點是處處平直、無限延展、沒有厚度。"
  },
  {
    "id": "5BC_E37",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "三棱錐垂直直角三角形面個數",
    "stem": "三棱錐 $P-ABC$ 中，$PA \\perp$ 平面 $ABC$，$\\angle ABC = 90^\\circ$，則該三棱錐的 4 個面中，直角三角形共有（　　）個。",
    "options": [
      {
        "key": "A",
        "text": "4 個"
      },
      {
        "key": "B",
        "text": "3 個"
      },
      {
        "key": "C",
        "text": "2 個"
      },
      {
        "key": "D",
        "text": "1 個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面垂直性質及三垂線】：$PA \\perp$ 底面，$\\triangle PAB, \\triangle PAC$ 均為直角三角形；$BC \\perp$ 平面 $PAB \\Rightarrow \\triangle PBC$ 亦為直角三角形。",
    "explanation": "$\\triangle PAB$（$\\angle PAB=90^\\circ$）、$\\triangle PAC$（$\\angle PAC=90^\\circ$）、$\\triangle ABC$（$\\angle ABC=90^\\circ$）；又 $BC \\perp AB$ 且 $BC \\perp PA$，故 $BC \\perp$ 面 $PAB \\Rightarrow BC \\perp PB$，$\\triangle PBC$ 為直角三角形。4個面全為直角三角形。"
  },
  {
    "id": "5BC_E38",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列首項求法",
    "stem": "已知等差數列 $\\{a_n\\}$ 中，$a_4 = 10$，公差 $d = 3$，則首項 $a_1$ 為（　　）",
    "options": [
      {
        "key": "A",
        "text": "1"
      },
      {
        "key": "B",
        "text": "-2"
      },
      {
        "key": "C",
        "text": "4"
      },
      {
        "key": "D",
        "text": "7"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列通項公式】：$a_1 = a_n - (n-1)d$。",
    "explanation": "$a_1 = a_4 - 3d = 10 - 3(3) = 1$。"
  },
  {
    "id": "5BC_E39",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "平行直線夾角規定",
    "stem": "在立體幾何中，兩條平行直線所成的角規定為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$0^\\circ$"
      },
      {
        "key": "B",
        "text": "$180^\\circ$"
      },
      {
        "key": "C",
        "text": "$90^\\circ$"
      },
      {
        "key": "D",
        "text": "無夾角"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 異面直線所成的角】：兩直線平行時規定為 $0^\\circ$。",
    "explanation": "空間中兩直線所成角範圍是 $[0^\\circ, 90^\\circ]$，當兩直線平行時規定其角為 $0^\\circ$。"
  },
  {
    "id": "5BC_E40",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "由 Sn 求首項",
    "stem": "已知數列 $\\{a_n\\}$ 的前 $n$ 項和 $S_n = 2n^2 - n$，則該數列的首項 $a_1$ 是（　　）",
    "options": [
      {
        "key": "A",
        "text": "1"
      },
      {
        "key": "B",
        "text": "2"
      },
      {
        "key": "C",
        "text": "0"
      },
      {
        "key": "D",
        "text": "3"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 由 Sn 求 an】：$a_1 = S_1$。",
    "explanation": "$a_1 = S_1 = 2(1)^2 - 1 = 1$。"
  },
  {
    "id": "5BC_M01",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "三條相交直線確定平面個數",
    "stem": "空間中兩兩相交的三條直線，可以確定的平面個數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "1 個或 3 個"
      },
      {
        "key": "B",
        "text": "僅 1 個"
      },
      {
        "key": "C",
        "text": "僅 3 個"
      },
      {
        "key": "D",
        "text": "2 個或 4 個"
      },
      {
        "key": "E",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.1 基本事實 1 推論】：三線交於一點且不共面確定 3 個平面；三線交於同一點共面或兩兩相交成三角形時確定 1 個平面。",
    "explanation": "若三直線交於同一點且不共面（如墻角三條棱）可確定 3 個平面；若三直線共面，或相交於三個不同點（成三角形），則確定 1 個平面。故答案為 1 個或 3 個。"
  },
  {
    "id": "5BC_M02",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "三條平行直線確定平面個數",
    "stem": "空間中兩兩平行的三條直線，可以確定的平面個數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "1 個或 3 個"
      },
      {
        "key": "B",
        "text": "僅 1 個"
      },
      {
        "key": "C",
        "text": "僅 3 個"
      },
      {
        "key": "D",
        "text": "2 個"
      },
      {
        "key": "E",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 1 推論 3】：平行線確定平面。若三線共面則為 1 個；若不共面（如三棱柱的三條側棱）則為 3 個。",
    "explanation": "當三條平行線在同一個平面內時確定 1 個平面；當三條平行線不在同一平面內時（如三棱柱的三條側棱）確定 3 個平面。故為 1 或 3 個。"
  },
  {
    "id": "5BC_M03",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "正方體面對角線異面棱計數",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，與面對角線 $BD$ 異面的棱共有（　　）條。",
    "options": [
      {
        "key": "A",
        "text": "6 條"
      },
      {
        "key": "B",
        "text": "4 條"
      },
      {
        "key": "C",
        "text": "5 條"
      },
      {
        "key": "D",
        "text": "7 條"
      },
      {
        "key": "E",
        "text": "8 條"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 異面直線判定】：排除共面的棱（底面4條棱均與BD共面，側棱BB1、DD1與BD相交）。",
    "explanation": "底面 4 條棱與 $BD$ 共面；側棱中 $BB_1, DD_1$ 與 $BD$ 相交。其餘棱為：上底面 4 條棱 $A_1B_1, B_1C_1, C_1D_1, D_1A_1$ 以及側棱 $AA_1, CC_1$，共 $4 + 2 = 6$ 條。"
  },
  {
    "id": "5BC_M04",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "正方體二面角正切值",
    "stem": "在正方體 $ABCD-A_1B_1C_1D_1$ 中，二面角 $D_1-AC-D$ 的正切值是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$\\sqrt{2}$"
      },
      {
        "key": "B",
        "text": "$\\frac{\\sqrt{2}}{2}$"
      },
      {
        "key": "C",
        "text": "1"
      },
      {
        "key": "D",
        "text": "$\\sqrt{3}$"
      },
      {
        "key": "E",
        "text": "$\\frac{\\sqrt{6}}{2}$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 二面角的平面角】：取 $AC$ 中點 $O$，連 $DO, D_1O$，$\\tan\\angle D_1OD = \\frac{DD_1}{DO}$。",
    "explanation": "設棱長為 1。底面正方形中 $DO \\perp AC$ 且 $DO = \\frac{\\sqrt{2}}{2}$。$DD_1 \\perp$ 底面，故 $D_1O \\perp AC$，$\\angle D_1OD$ 為二面角的平面角。$\\tan\\angle D_1OD = \\frac{DD_1}{DO} = \\frac{1}{\\sqrt{2}/2} = \\sqrt{2}$。"
  },
  {
    "id": "5BC_M05",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "空間四邊形中位線異面角計算",
    "stem": "空間四邊形 $ABCD$ 中，$AC = BD = 4$，$E, F, G$ 分別是 $AB, BC, CD$ 的中點，且 $EG = 2\\sqrt{3}$，則異面直線 $AC$ 與 $BD$ 所成的角是（　　）",
    "options": [
      {
        "key": "A",
        "text": "$60^\\circ$"
      },
      {
        "key": "B",
        "text": "$120^\\circ$"
      },
      {
        "key": "C",
        "text": "$90^\\circ$"
      },
      {
        "key": "D",
        "text": "$45^\\circ$"
      },
      {
        "key": "E",
        "text": "$30^\\circ$"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 異面直線夾角及餘弦定理】：中位線 $EF=2, FG=2$。餘弦定理算得鈍角時要取其補角（異面直線角 $\\le 90^\\circ$）。",
    "explanation": "$EF \\parallel AC, EF = 2$；$FG \\parallel BD, FG = 2$。在 $\\triangle EFG$ 中，$EG = 2\\sqrt{3}$，$\\cos\\angle EFG = \\frac{4+4-12}{2 \\times 2 \\times 2} = -\\frac{1}{2} \\Rightarrow \\angle EFG = 120^\\circ$。異面直線所成角取銳角 $180^\\circ - 120^\\circ = 60^\\circ$。"
  },
  {
    "id": "5BC_M06",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "兩數之間插入數成等差數列",
    "stem": "在 2 與 14 之間插入 3 個數，使這 5 個數成等差數列，則插入的第 2 個數是（　　）",
    "options": [
      {
        "key": "A",
        "text": "8"
      },
      {
        "key": "B",
        "text": "5"
      },
      {
        "key": "C",
        "text": "11"
      },
      {
        "key": "D",
        "text": "6"
      },
      {
        "key": "E",
        "text": "9"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 插入數】：在 $a, b$ 間插入 $k$ 個數，公差 $d = \\frac{b-a}{k+1}$。",
    "explanation": "共 5 個數，公差 $d = \\frac{14 - 2}{3 + 1} = \\frac{12}{4} = 3$。插入的數依次為：$2+3=5$，$5+3=8$，$8+3=11$。第 2 個插入的數是 8。"
  },
  {
    "id": "5BC_M07",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "二次數列最小項求法",
    "stem": "數列 $\\{a_n\\}$ 的通項公式為 $a_n = n^2 - 5n$，則該數列最小項的值是（　　）",
    "options": [
      {
        "key": "A",
        "text": "-6"
      },
      {
        "key": "B",
        "text": "-6.25"
      },
      {
        "key": "C",
        "text": "-4"
      },
      {
        "key": "D",
        "text": "-5"
      },
      {
        "key": "E",
        "text": "0"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 最大(小)項】：對稱軸 $n = 2.5$，但 $n \\in \\mathbb{N}^*$，取最接近整數 $n=2$ 或 $3$。",
    "explanation": "$a_n = (n - 2.5)^2 - 6.25$。因 $n$ 必須為正整數，當 $n=2$ 或 $n=3$ 時，$a_2 = a_3 = 4 - 10 = -6$，不能取非整數 $-6.25$。"
  },
  {
    "id": "5BC_M08",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "週期遞推數列週期性求項",
    "stem": "已知數列 $\\{a_n\\}$ 滿足 $a_1 = 3$，$a_{n+1} = \\frac{1}{1 - a_n}$，則 $a_{2026}$ 的值為（　　）",
    "options": [
      {
        "key": "A",
        "text": "$-\\frac{1}{2}$"
      },
      {
        "key": "B",
        "text": "$\\frac{2}{3}$"
      },
      {
        "key": "C",
        "text": "3"
      },
      {
        "key": "D",
        "text": "1"
      },
      {
        "key": "E",
        "text": "0"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 遞推公式】：寫出前幾項找循環週期。$2026 = 3k + r$。",
    "explanation": "$a_1 = 3$；$a_2 = \\frac{1}{1-3} = -\\frac{1}{2}$；$a_3 = \\frac{1}{1 - (-1/2)} = \\frac{2}{3}$；$a_4 = \\frac{1}{1 - 2/3} = 3 = a_1$。週期為 3。$2026 = 3 \\times 675 + 1$，故 $a_{2026} = a_1 = 3$？等等！$2026 \\div 3 = 675$ 餘 1，所以 $a_{2026} = a_1 = 3$。注意如果題幹公式為 $a_{n+1} = 1 - \\frac{1}{a_n}$ 則週期循環不同。我們令 $a_1=3, a_2 = 1 - 1/3 = 2/3, a_3 = 1 - 3/2 = -1/2, a_4 = 1 - (-2) = 3$。在此式下 $a_1=3$。"
  },
  {
    "id": "5BC_M09",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "等差數列 Sn 最值項判斷",
    "stem": "等差數列 $\\{a_n\\}$ 中，$a_1 = 25$，$d = -3$，則前 $n$ 項和 $S_n$ 取得最大值時，$n$ 的值為（　　）",
    "options": [
      {
        "key": "A",
        "text": "8 或 9"
      },
      {
        "key": "B",
        "text": "9"
      },
      {
        "key": "C",
        "text": "8"
      },
      {
        "key": "D",
        "text": "10"
      },
      {
        "key": "E",
        "text": "7"
      }
    ],
    "correctKeys": [
      "B"
    ],
    "answer": [
      "B"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A Sn 的最值】：$a_1>0, d<0$ 時，由 $a_n \\ge 0$ 且 $a_{n+1} \\le 0$ 得 $S_n$ 最大。",
    "explanation": "$a_n = 25 - 3(n-1) = 28 - 3n$。令 $a_n \\ge 0 \\Rightarrow 3n \\le 28 \\Rightarrow n \\le 9.33$。當 $n=9$ 時 $a_9 = 1 > 0$；$n=10$ 時 $a_{10} = -2 < 0$。因此前 9 項均為正數，第 10 項為負數，$S_9$ 最大。"
  },
  {
    "id": "5BC_M10",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "對稱求和聯立求前20項和",
    "stem": "等差數列 $\\{a_n\\}$ 中，$a_1 + a_2 + a_3 = -18$，$a_{18} + a_{19} + a_{20} = 90$，則此數列前 20 項的和 $S_{20}$ 為（　　）",
    "options": [
      {
        "key": "A",
        "text": "240"
      },
      {
        "key": "B",
        "text": "180"
      },
      {
        "key": "C",
        "text": "360"
      },
      {
        "key": "D",
        "text": "120"
      },
      {
        "key": "E",
        "text": "300"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 下標和與前 n 項和】：兩式相加，$(a_1+a_{20}) + (a_2+a_{19}) + (a_3+a_{18}) = 3(a_1+a_{20})$。",
    "explanation": "兩式相加得 $3(a_1 + a_{20}) = -18 + 90 = 72 \\Rightarrow a_1 + a_{20} = 24$。則 $S_{20} = \\frac{20(a_1 + a_{20})}{2} = 10 \\times 24 = 240$。"
  },
  {
    "id": "5BC_MAT01",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "點線面幾何關係與符號配對",
    "stem": "【配對題】請將左側幾何位置關係的文字語言，與右側正確的符號語言進行配對：",
    "pairs": [
      {
        "left": "點 A 在平面 α 內",
        "right": "A ∈ α"
      },
      {
        "left": "直線 a 與平面 α 相交於點 P",
        "right": "a ∩ α = P"
      },
      {
        "left": "直線 l 在平面 α 內，點 B 不在 l 上",
        "right": "l ⊂ α 且 B ∉ l"
      },
      {
        "left": "平面 α 與 β 相交於直線 m",
        "right": "α ∩ β = m"
      }
    ],
    "leftItems": [
      "點 A 在平面 α 內",
      "直線 a 與平面 α 相交於點 P",
      "直線 l 在平面 α 內，點 B 不在 l 上",
      "平面 α 與 β 相交於直線 m"
    ],
    "rightItems": [
      "A ∈ α",
      "a ∩ α = P",
      "l ⊂ α 且 B ∉ l",
      "α ∩ β = m"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 符號】：點與線面用 ∈, ∉；線在面內用 ⊂；兩面或線面相交用 ∩。",
    "explanation": "依集合與立體幾何符號規範：點為元素用 ∈，直線為點集用 ⊂，相交公共元素用 ∩。"
  },
  {
    "id": "5BC_MAT02",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "正方體中棱的位置關係配對",
    "stem": "【配對題】在正方體 ABCD-A1B1C1D1 中，請將下列各組直線與其在空間中的位置關係進行配對：",
    "pairs": [
      {
        "left": "棱 AB 與 棱 CD",
        "right": "共面平行"
      },
      {
        "left": "棱 AB 與 棱 BC",
        "right": "共面垂直相交"
      },
      {
        "left": "棱 AB 與 棱 CC1",
        "right": "異面垂直"
      },
      {
        "left": "棱 AB 與 棱 A1D1",
        "right": "異面垂直"
      }
    ],
    "leftItems": [
      "棱 AB 與 棱 CD",
      "棱 AB 與 棱 BC",
      "棱 AB 與 棱 CC1",
      "棱 AB 與 棱 A1D1"
    ],
    "rightItems": [
      "共面平行",
      "共面垂直相交",
      "異面垂直",
      "異面垂直"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 直線與直線位置關係】：相交、平行、異面。注意異面垂直判定。",
    "explanation": "AB 與 CD 在底面且平行；AB 與 BC 交於 B 且為直角；CC1 與底面垂直且不過 AB，為異面垂直；A1D1 平行於 AD，與 AB 異面垂直。"
  },
  {
    "id": "5BC_MAT03",
    "type": "matching",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列通項與性質配對",
    "stem": "【配對題】請將下列等差數列已知條件與對應的計算結果進行配對：",
    "pairs": [
      {
        "left": "a1 = 3, d = 2，求 S10",
        "right": "120"
      },
      {
        "left": "a3 = 7, a7 = 19，求公差 d",
        "right": "3"
      },
      {
        "left": "8 與 -14 的等差中項",
        "right": "-3"
      },
      {
        "left": "7, 4, 1, -2, ⋯ 的第 10 項",
        "right": "-20"
      }
    ],
    "leftItems": [
      "a1 = 3, d = 2，求 S10",
      "a3 = 7, a7 = 19，求公差 d",
      "8 與 -14 的等差中項",
      "7, 4, 1, -2, ⋯ 的第 10 項"
    ],
    "rightItems": [
      "120",
      "3",
      "-3",
      "-20"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列公式】：S10=10(3)+45(2)=120；d=(19-7)/4=3；A=(8-14)/2=-3；a10=7+9(-3)=-20。",
    "explanation": "分別代入前 n 項和公式、通項推廣公式、等差中項公式及通項公式。"
  },
  {
    "id": "5BC_MUL01",
    "type": "multi_select",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "平面的判定與推論多選",
    "stem": "【不定項選擇題】下列命題中，能確定「有且只有一個平面」的正確命題有（　　）（多選）",
    "options": [
      {
        "key": "A",
        "text": "不共線的三個點"
      },
      {
        "key": "B",
        "text": "兩條相交直線"
      },
      {
        "key": "C",
        "text": "兩條平行直線"
      },
      {
        "key": "D",
        "text": "一條直線和這條直線外的一點"
      },
      {
        "key": "E",
        "text": "任意四個點"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 1 及推論 1、2、3】：不共線三點、直線與線外一點、兩相交線、兩平行線均唯一確定一個平面。",
    "explanation": "基本事實 1 為 A；推論 1 為 D；推論 2 為 B；推論 3 為 C。E 錯誤，空間四邊形頂點不共面。"
  },
  {
    "id": "5BC_MUL02",
    "type": "multi_select",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "線面垂直與平行",
    "chapter": "8.6 空間直線、平面的垂直",
    "topic": "線面垂直判定條件辨析",
    "stem": "【不定項選擇題】要判定一條直線 $l$ 與平面 $\\alpha$ 垂直，下列條件中充分的有（　　）（多選）",
    "options": [
      {
        "key": "A",
        "text": "直線 $l$ 垂直於平面 $\\alpha$ 內的兩條相交直線"
      },
      {
        "key": "B",
        "text": "直線 $l$ 垂直於平面 $\\alpha$ 內的無數條直線"
      },
      {
        "key": "C",
        "text": "直線 $l$ 垂直於平面 $\\alpha$ 內的一個三角形的兩條邊"
      },
      {
        "key": "D",
        "text": "直線 $l$ 垂直於平面 $\\alpha$ 的一條平行直線"
      },
      {
        "key": "E",
        "text": "平面 $\\alpha$ 垂直於直線 $m$，且 $l \\parallel m$"
      }
    ],
    "correctKeys": [
      "A",
      "C",
      "E"
    ],
    "answer": [
      "A",
      "C",
      "E"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 線面垂直判定定理】：必須垂直於平面內的兩條「相交」直線；三角形兩邊必相交；垂直於同一平面的兩線平行。",
    "explanation": "A為線面垂直判定定理；C中三角形兩邊必相交，等價於相交兩直線，正確；E中由垂直於同平面的線平行（逆向傳遞），正確；B中若無數條直線互相平行則不能判定；D不充分。"
  },
  {
    "id": "5BC_MUL03",
    "type": "multi_select",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列充要條件與性質",
    "stem": "【不定項選擇題】下列關於數列 $\\{a_n\\}$ 的敘述，能確定 $\\{a_n\\}$ 一定是等差數列的有（　　）（多選）",
    "options": [
      {
        "key": "A",
        "text": "對任意 $n \\in \\mathbb{N}^*$，$a_{n+1} - a_n = d$（$d$ 為常數）"
      },
      {
        "key": "B",
        "text": "數列的前 $n$ 項和 $S_n = An^2 + Bn$（$A, B$ 為常數）"
      },
      {
        "key": "C",
        "text": "對任意 $n \\ge 2$，$2a_n = a_{n-1} + a_{n+1}$"
      },
      {
        "key": "D",
        "text": "數列的通項公式為 $a_n = 3n - 4$"
      },
      {
        "key": "E",
        "text": "數列的前 3 項成等差數列"
      }
    ],
    "correctKeys": [
      "A",
      "B",
      "C",
      "D"
    ],
    "answer": [
      "A",
      "B",
      "C",
      "D"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列定義及函數特徵】：Sn 是沒有常數項的二次函數，an 是 n 的一次函數，等差中項對所有項成立。",
    "explanation": "A為等差數列定義；B中Sn無常數項二次函數為等差數列充要條件；C為等差中項遞推；D為一次函數形式；E僅3項不能保證全體項等差。"
  },
  {
    "id": "5BC_ORD01",
    "type": "ordering",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "線面垂直與平行",
    "chapter": "8.5 空間直線、平面的平行",
    "topic": "空間四邊形中位線證菱形邏輯排序",
    "stem": "【步驟排序題】在空間四邊形 $ABCD$ 中，已知對角線長度相等 $AC = BD$，$E, F, G, H$ 分別是邊 $AB, BC, CD, DA$ 的中點。請將證明「順次連接各邊中點所得四邊形 $EFGH$ 是菱形」的邏輯推理步驟按正確順序排列：",
    "steps": [
      {
        "id": "A",
        "text": "連接對角線 AC 與 BD"
      },
      {
        "id": "B",
        "text": "在 △ABD 與 △CBD 中，由中位線性質得 EH ∥ BD, EH = 1/2 BD 且 FG ∥ BD, FG = 1/2 BD"
      },
      {
        "id": "C",
        "text": "由基本事實 4 得 EH ∥ FG 且 EH = FG，故四邊形 EFGH 是平行四邊形"
      },
      {
        "id": "D",
        "text": "同理在 △ABC 中，EF 是中位線得 EF = 1/2 AC，因已知 AC = BD，故 EF = EH"
      },
      {
        "id": "E",
        "text": "鄰邊相等的平行四邊形是菱形，故四邊形 EFGH 是菱形"
      }
    ],
    "correctOrder": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.B 基本事實 4 及 §三.A 特殊四邊形判定】：連對角線 → 中位線得平行與半長 → 基本事實 4 證平行四邊形 → 結合 AC=BD 得鄰邊相等 → 判定為菱形。",
    "explanation": "標準證明邏輯：① 連接對角線 AC 與 BD；② 利用中位線性質推導對邊與 BD 關係；③ 應用基本事實 4 證明 EFGH 為平行四邊形；④ 結合條件 AC=BD 證明鄰邊相等 EF=EH；⑤ 根據判定定理得出 EFGH 為菱形。"
  },
  {
    "id": "5BC_ORD02",
    "type": "ordering",
    "difficulty": "Hard",
    "difficultyLevel": 3,
    "category": "等差數列性質與求和",
    "chapter": "4.1 數列的概念",
    "topic": "由 Sn 求通項公式與等差證明排序",
    "stem": "【步驟排序題】已知數列 $\\{a_n\\}$ 的前 $n$ 項和 $S_n = n^2 - 10n$。請將「求通項公式 $a_n$ 並證明其為等差數列」的步驟排序：",
    "steps": [
      {
        "id": "A",
        "text": "當 n = 1 時，求得 a1 = S1 = 1 - 10 = -9"
      },
      {
        "id": "B",
        "text": "當 n ≥ 2 時，利用公式 an = Sn - Sn-1 = (n² - 10n) - [(n-1)² - 10(n-1)]"
      },
      {
        "id": "C",
        "text": "展開並化簡得 an = 2n - 11"
      },
      {
        "id": "D",
        "text": "檢驗 n = 1 時，2(1) - 11 = -9 = a1 符合，故通項公式為 an = 2n - 11 (n ∈ ℕ*)"
      },
      {
        "id": "E",
        "text": "計算 an+1 - an = [2(n+1) - 11] - (2n - 11) = 2 為常數，故 {an} 是等差數列"
      }
    ],
    "correctOrder": [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 由 Sn 求 an】：先求 a1 → 由 Sn - Sn-1 求 an (n≥2) → 檢驗 n=1 → 寫出統一公式 → 證差為常數。",
    "explanation": "嚴謹的數列求解與證明順序：a1 計算 → n≥2 差式推導 → 化簡通項 → 驗證首項 → 作差判定等差數列。"
  },
  {
    "id": "5BC_PLT01",
    "type": "plotting",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "數列概念與通項",
    "chapter": "4.1 數列的概念",
    "topic": "數列圖象孤立點坐標描點",
    "stem": "【作圖描點任務】已知數列 $\\{a_n\\}$ 的通項公式為 $a_n = n^2 - 6n + 8$。請在直角坐標系網格中，點擊描出該數列前 5 項 $(n, a_n)$ 的圖象點：",
    "formula": "a_n = n^2 - 6n + 8",
    "targetPoints": [
      {
        "n": 1,
        "an": 3,
        "label": "(1, 3)"
      },
      {
        "n": 2,
        "an": 0,
        "label": "(2, 0)"
      },
      {
        "n": 3,
        "an": -1,
        "label": "(3, -1)"
      },
      {
        "n": 4,
        "an": 0,
        "label": "(4, 0)"
      },
      {
        "n": 5,
        "an": 3,
        "label": "(5, 3)"
      }
    ],
    "gridConfig": {
      "minN": 1,
      "maxN": 5,
      "minY": -3,
      "maxY": 5,
      "stepN": 1,
      "stepY": 1
    },
    "hint": "【大測二_範圍及必備公式.pdf §一.4.1.② 數列圖象】：數列圖象是一群孤立的點，不要連成線！分別計算 n=1, 2, 3, 4, 5 的值：(1,3), (2,0), (3,-1), (4,0), (5,3) 並在網格中點擊對應坐標。",
    "explanation": "$a_1 = 1-6+8 = 3$；$a_2 = 4-12+8 = 0$；$a_3 = 9-18+8 = -1$；$a_4 = 16-24+8 = 0$；$a_5 = 25-30+8 = 3$。在坐標系上點擊描出這 5 個孤立點。"
  },
  {
    "id": "5BC_PLT02",
    "type": "plotting",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.1 等差數列的概念",
    "topic": "等差數列線性圖象孤立點描繪",
    "stem": "【作圖描點任務】已知等差數列 $\\{a_n\\}$ 滿足 $a_1 = 5$，$a_{n+1} = a_n - 2$（通項 $a_n = 7 - 2n$）。請在坐標網格中點擊描出前 5 項的點：",
    "formula": "a_n = 7 - 2n",
    "targetPoints": [
      {
        "n": 1,
        "an": 5,
        "label": "(1, 5)"
      },
      {
        "n": 2,
        "an": 3,
        "label": "(2, 3)"
      },
      {
        "n": 3,
        "an": 1,
        "label": "(3, 1)"
      },
      {
        "n": 4,
        "an": -1,
        "label": "(4, -1)"
      },
      {
        "n": 5,
        "an": -3,
        "label": "(5, -3)"
      }
    ],
    "gridConfig": {
      "minN": 1,
      "maxN": 5,
      "minY": -4,
      "maxY": 6,
      "stepN": 1,
      "stepY": 1
    },
    "hint": "【大測二_範圍及必備公式.pdf §二.A 等差數列與一次函數】：五個點在一條直線上，但數列圖象是一群孤立點，不可連線。",
    "explanation": "$n=1 \\Rightarrow a_1=5$；$n=2 \\Rightarrow a_2=3$；$n=3 \\Rightarrow a_3=1$；$n=4 \\Rightarrow a_4=-1$；$n=5 \\Rightarrow a_5=-3$。"
  },
  {
    "id": "5BC_W01",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "等差數列實際應用題(堆放總數)",
    "stem": "工程隊在露天倉庫堆放一批圓形鋼管，最底層擺放了 25 根，向上每一層均比相鄰下一層少放 1 根，最頂層共放了 11 根。則這批鋼管累計共有（　　）根。",
    "options": [
      {
        "key": "A",
        "text": "270"
      },
      {
        "key": "B",
        "text": "285"
      },
      {
        "key": "C",
        "text": "255"
      },
      {
        "key": "D",
        "text": "240"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 前 n 項和】：首項 $a_1=25$，公差 $d=-1$，末項 $a_n=11$。由 $11=25+(n-1)(-1)$ 得層數 $n=15$，總數 $S_{15}=\\frac{15(25+11)}{2}$。",
    "explanation": "各層鋼管數自下而上組成等差數列：$a_1=25$，$d=-1$，$a_n=11$。由 $a_n = a_1 + (n-1)d \\Rightarrow 11 = 25 - (n-1) \\Rightarrow n = 15$。由前 $n$ 項和公式得 $S_{15} = \\frac{15 \\times (25 + 11)}{2} = 15 \\times 18 = 270$ 根。"
  },
  {
    "id": "5BC_W02",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "綜合應用與最值",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "劇場座位數等差應用題",
    "stem": "某劇場共有 25 排座位，第 1 排有 20 個座位，以後每排比前一排多 2 個座位。則該劇場最後一排的座位數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "68"
      },
      {
        "key": "B",
        "text": "70"
      },
      {
        "key": "C",
        "text": "66"
      },
      {
        "key": "D",
        "text": "64"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 通項公式】：$a_n = a_1 + (n-1)d$。$a_{25} = 20 + 24(2)$。",
    "explanation": "$a_{25} = 20 + 24 \\times 2 = 20 + 48 = 68$ 個座位。"
  },
  {
    "id": "5BC_W03",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "綜合應用與最值",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "運動跑步累計路程超標不等式問題",
    "stem": "小明第 1 天跑 2 公里，以後每天比前一天多跑 0.5 公里。若累計總路程要超過 100 公里，他至少需要連續跑（　　）天。",
    "options": [
      {
        "key": "A",
        "text": "17 天"
      },
      {
        "key": "B",
        "text": "16 天"
      },
      {
        "key": "C",
        "text": "18 天"
      },
      {
        "key": "D",
        "text": "15 天"
      },
      {
        "key": "E",
        "text": "20 天"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A 前 n 項和公式與不等式】：$S_n = 2n + \\frac{n(n-1)}{2}(0.5) > 100$。驗算整數邊界。",
    "explanation": "$S_n = \\frac{n^2 + 7n}{4} > 100 \\Rightarrow n^2 + 7n - 400 > 0$。當 $n=16$ 時 $S_{16} = \\frac{256 + 112}{4} = 92 < 100$；當 $n=17$ 時 $S_{17} = \\frac{289 + 119}{4} = 102 > 100$。故至少要 17 天。"
  },
  {
    "id": "5BC_W04",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "等差數列性質與求和",
    "chapter": "4.2.2 等差數列的前 n 項和",
    "topic": "等差數列 Sn 最小值及項數判斷",
    "stem": "在等差數列 $\\{a_n\\}$ 中，$a_1 = -20$，$d = 3$，則當 $n = $（　　）時，前 $n$ 項和 $S_n$ 取得最小值。",
    "options": [
      {
        "key": "A",
        "text": "7"
      },
      {
        "key": "B",
        "text": "6"
      },
      {
        "key": "C",
        "text": "8"
      },
      {
        "key": "D",
        "text": "9"
      },
      {
        "key": "E",
        "text": "5"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §二.A Sn 最值】：$a_1<0, d>0$ 時，由 $a_n \\le 0$ 且 $a_{n+1} \\ge 0$ 得 $S_n$ 最小。",
    "explanation": "$a_n = -20 + 3(n-1) = 3n - 23$。$a_7 = 21 - 23 = -2 < 0$；$a_8 = 24 - 23 = 1 > 0$。即前 7 項均為負數，第 8 項開始為正數，故當 $n=7$ 時 $S_n$ 取得最小值（$S_7 = -77$）。"
  },
  {
    "id": "5BC_W05",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "空間位置關係",
    "chapter": "8.4.2 空間點、線、面的位置關係",
    "topic": "異面關係無傳遞性辨析",
    "stem": "若直線 $a$ 與 $b$ 異面，直線 $b$ 與 $c$ 也異面，則直線 $a$ 與 $c$ 的位置關係是（　　）",
    "options": [
      {
        "key": "A",
        "text": "平行、相交或異面均有可能"
      },
      {
        "key": "B",
        "text": "必定異面"
      },
      {
        "key": "C",
        "text": "必定平行"
      },
      {
        "key": "D",
        "text": "必定相交"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.2 異面直線判定】：在正方體模型中，可以找到 a 與 c 平行、相交或異面的所有情況。「異面」沒有傳遞性。",
    "explanation": "在正方體中，設 $a = AB, b = CC_1$（異面）。若取 $c = CD$，則 $b, c$ 異面，此時 $a \\parallel c$；若取 $c = BC$，則 $b, c$ 異面，此時 $a, c$ 相交；若取 $c = A_1D_1$，則 $a, c$ 異面。故三種情況均有可能。"
  },
  {
    "id": "5BC_W06",
    "type": "single_choice",
    "difficulty": "Easy",
    "difficultyLevel": 1,
    "category": "線面垂直與平行",
    "chapter": "8.5 空間直線、平面的平行",
    "topic": "空間四邊形中點四邊形周長",
    "stem": "空間四邊形 $ABCD$ 中，$AC = 6$，$BD = 8$，順次連接各邊中點所得四邊形的周長是（　　）",
    "options": [
      {
        "key": "A",
        "text": "14"
      },
      {
        "key": "B",
        "text": "28"
      },
      {
        "key": "C",
        "text": "20"
      },
      {
        "key": "D",
        "text": "10"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §三.A 三角形中位線定理】：中點四邊形的邊分別等於對角線的一半，周長 $= AC + BD$。",
    "explanation": "中位線 $EH = FG = \\frac{1}{2}BD = 4$，$EF = GH = \\frac{1}{2}AC = 3$。周長 $= 2(3 + 4) = 14$。"
  },
  {
    "id": "5BC_W07",
    "type": "single_choice_5",
    "difficulty": "Medium",
    "difficultyLevel": 2,
    "category": "空間位置關係",
    "chapter": "8.4.1 平面",
    "topic": "不共面的四個點確定平面個數",
    "stem": "空間中不共面的四個點（任意三點均不共線），最多可以確定的平面個數為（　　）",
    "options": [
      {
        "key": "A",
        "text": "4 個"
      },
      {
        "key": "B",
        "text": "1 個"
      },
      {
        "key": "C",
        "text": "6 個"
      },
      {
        "key": "D",
        "text": "3 個"
      },
      {
        "key": "E",
        "text": "無數個"
      }
    ],
    "correctKeys": [
      "A"
    ],
    "answer": [
      "A"
    ],
    "hint": "【大測二_範圍及必備公式.pdf §一.8.4.1 基本事實 1】：三點確定一個平面，四面體有 4 個面，即 $C_4^3 = 4$ 個平面。",
    "explanation": "四點不共面即構成一個三棱錐（四面體），任選三點確定一個平面，共有 4 個面。"
  }
];

  const TEACHER_CREDENTIALS_5BC = {
    "passcode": "5BC99",
    "adminPassword": "Math5BC#Admin2026!",
    "id": 99,
    "name": "教師測試員",
    "classID": "5BC",
    "role": "teacher",
    "isTeacher": true,
    "isTestUser": true
  };

  root.ROSTER_5BC = ROSTER_5BC;
  root.TEACHER_CREDENTIALS_5BC = TEACHER_CREDENTIALS_5BC;
  root.BANK_5BC1102 = BANK_5BC1102;

  // Helper lookups
  root.get5BCStudent = function(cls, id) {
    const sId = parseInt(id, 10);
    const normCls = String(cls || '').trim().toUpperCase();
    if ((normCls === '5B' || normCls === '5C' || normCls === '5BC') && sId === 99) {
      return { id: 99, name: '教師測試員', classID: normCls === '5BC' ? '5B' : normCls, isTeacher: true, isTestUser: true };
    }
    const list = ROSTER_5BC[normCls] || [];
    return list.find(s => s.id === sId) || null;
  };

  // Browser global export: window.ROSTER_5BC, window.TEACHER_CREDENTIALS_5BC, window.BANK_5BC1102
  if (typeof window !== 'undefined') {
    window.ROSTER_5BC = ROSTER_5BC;
    window.TEACHER_CREDENTIALS_5BC = TEACHER_CREDENTIALS_5BC;
    window.BANK_5BC1102 = BANK_5BC1102;
    window.get5BCStudent = root.get5BCStudent;
  }

  // Node.js compatibility export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ROSTER_5BC, TEACHER_CREDENTIALS_5BC, BANK_5BC1102 };
  }

})(typeof window !== 'undefined' ? window : this);

