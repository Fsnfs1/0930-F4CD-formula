/**
 * build_exam_page.js
 * Generator script for authentic 27-question Advance Mathematics Exam Platform
 * Writes: advance_test.html
 */

const fs = require('fs');
const path = require('path');

// Load canonical roster data
const rosterModulePath = path.join(__dirname, '..', 'js', 'roster.js');
let ROSTER_DATA = null;
if (fs.existsSync(rosterModulePath)) {
  const RosterModule = require(rosterModulePath);
  ROSTER_DATA = RosterModule.ROSTER_DATA;
} else {
  console.warn('Warning: roster.js not found at relative path, using embedded roster data');
}

// Ensure ROSTER_DATA fallback if needed
if (!ROSTER_DATA) {
  ROSTER_DATA = {
    "4C": [
      { id: 1, name: "古永晴", grade: 10, classID: "4C" },
      { id: 2, name: "王嘉熙", grade: 10, classID: "4C" },
      { id: 3, name: "宋榛", grade: 10, classID: "4C" },
      { id: 4, name: "周子謙", grade: 10, classID: "4C" },
      { id: 5, name: "李藝彤", grade: 10, classID: "4C" },
      { id: 6, name: "谷雨", grade: 10, classID: "4C" },
      { id: 7, name: "冼周蔚", grade: 10, classID: "4C" },
      { id: 8, name: "林國榮", grade: 10, classID: "4C" },
      { id: 9, name: "林晨欣", grade: 10, classID: "4C" },
      { id: 10, name: "徐浟", grade: 10, classID: "4C" },
      { id: 11, name: "曹爵先", grade: 10, classID: "4C" },
      { id: 12, name: "梁寶娟", grade: 10, classID: "4C" },
      { id: 14, name: "莫芷瑤", grade: 10, classID: "4C" },
      { id: 15, name: "陳子豪", grade: 10, classID: "4C" },
      { id: 16, name: "陳心怡", grade: 10, classID: "4C" },
      { id: 17, name: "陳芷澄", grade: 10, classID: "4C" },
      { id: 18, name: "陳穎彤", grade: 10, classID: "4C" },
      { id: 19, name: "陸恩希", grade: 10, classID: "4C" },
      { id: 20, name: "麥曉楠", grade: 10, classID: "4C" },
      { id: 21, name: "溫愛嫦", grade: 10, classID: "4C" },
      { id: 22, name: "葉峰", grade: 10, classID: "4C" },
      { id: 23, name: "趙政熹", grade: 10, classID: "4C" },
      { id: 24, name: "劉卓盈", grade: 10, classID: "4C" },
      { id: 25, name: "蔡清琰", grade: 10, classID: "4C" },
      { id: 26, name: "謝嘉瑩", grade: 10, classID: "4C" },
      { id: 27, name: "譚梓鈞", grade: 10, classID: "4C" },
      { id: 28, name: "譚志坤", grade: 10, classID: "4C" },
      { id: 29, name: "譚欣", grade: 10, classID: "4C" },
      { id: 30, name: "羅清璋", grade: 10, classID: "4C" }
    ],
    "4D": [
      { id: 1, name: "洪佳佳", grade: 10, classID: "4D" },
      { id: 2, name: "王偉德", grade: 10, classID: "4D" },
      { id: 3, name: "王煜鑫", grade: 10, classID: "4D" },
      { id: 4, name: "甘俊誠", grade: 10, classID: "4D" },
      { id: 5, name: "余浩賢", grade: 10, classID: "4D" },
      { id: 6, name: "李青霞", grade: 10, classID: "4D" },
      { id: 7, name: "李語鵑", grade: 10, classID: "4D" },
      { id: 8, name: "李樂瞳", grade: 10, classID: "4D" },
      { id: 9, name: "李穎欣", grade: 10, classID: "4D" },
      { id: 10, name: "李臻斌", grade: 10, classID: "4D" },
      { id: 11, name: "周梓霖", grade: 10, classID: "4D" },
      { id: 12, name: "林川雲", grade: 10, classID: "4D" },
      { id: 13, name: "施舒晨", grade: 10, classID: "4D" },
      { id: 14, name: "徐芷瑤", grade: 10, classID: "4D" },
      { id: 15, name: "翁淮洋", grade: 10, classID: "4D" },
      { id: 16, name: "馬雨彤", grade: 10, classID: "4D" },
      { id: 17, name: "張博聰", grade: 10, classID: "4D" },
      { id: 18, name: "曾浚恩", grade: 10, classID: "4D" },
      { id: 19, name: "黃悅軒", grade: 10, classID: "4D" },
      { id: 20, name: "黃梓建", grade: 10, classID: "4D" },
      { id: 21, name: "黃嫣然", grade: 10, classID: "4D" },
      { id: 22, name: "董清霞", grade: 10, classID: "4D" },
      { id: 23, name: "劉付穎", grade: 10, classID: "4D" },
      { id: 24, name: "劉泳欣", grade: 10, classID: "4D" },
      { id: 25, name: "鄭佩芝", grade: 10, classID: "4D" },
      { id: 26, name: "鄭東沅", grade: 10, classID: "4D" },
      { id: 27, name: "盧肇琪", grade: 10, classID: "4D" },
      { id: 28, name: "賴君華", grade: 10, classID: "4D" },
      { id: 29, name: "譚佩泳", grade: 10, classID: "4D" },
      { id: 30, name: "鄭梓浩", grade: 10, classID: "4D" },
      { id: 31, name: "鄭國樺", grade: 10, classID: "4D" }
    ],
    "5B": [
      { id: 1, name: "吳鎂澄", grade: 11, classID: "5B" },
      { id: 2, name: "蘇子恩", grade: 11, classID: "5B" },
      { id: 3, name: "李潤歌", grade: 11, classID: "5B" },
      { id: 4, name: "李曉熹", grade: 11, classID: "5B" },
      { id: 5, name: "周鈺燕", grade: 11, classID: "5B" },
      { id: 6, name: "林煜皓", grade: 11, classID: "5B" },
      { id: 7, name: "林穎豪", grade: 11, classID: "5B" },
      { id: 8, name: "柯鈺鑫", grade: 11, classID: "5B" },
      { id: 9, name: "洪泳棋", grade: 11, classID: "5B" },
      { id: 10, name: "高尚禮", grade: 11, classID: "5B" },
      { id: 11, name: "張啟赫", grade: 11, classID: "5B" },
      { id: 12, name: "張嘉城", grade: 11, classID: "5B" },
      { id: 13, name: "梁泳心", grade: 11, classID: "5B" },
      { id: 14, name: "梁芷韻", grade: 11, classID: "5B" },
      { id: 15, name: "梁偉烽", grade: 11, classID: "5B" },
      { id: 16, name: "姚皓然", grade: 11, classID: "5B" },
      { id: 17, name: "陳施攸", grade: 11, classID: "5B" },
      { id: 18, name: "陳柏琳", grade: 11, classID: "5B" },
      { id: 19, name: "陳國良", grade: 11, classID: "5B" },
      { id: 20, name: "陳紫涵", grade: 11, classID: "5B" },
      { id: 21, name: "陳鑫源", grade: 11, classID: "5B" },
      { id: 22, name: "彭婷婷", grade: 11, classID: "5B" },
      { id: 23, name: "黃少彬", grade: 11, classID: "5B" },
      { id: 24, name: "黃卓琳", grade: 11, classID: "5B" },
      { id: 25, name: "黃婉瑜", grade: 11, classID: "5B" },
      { id: 26, name: "葉棨釗", grade: 11, classID: "5B" },
      { id: 27, name: "潘子聰", grade: 11, classID: "5B" },
      { id: 28, name: "黎宛旻", grade: 11, classID: "5B" }
    ]
  };
}

console.log('Roster verified: Classes 4C (' + ROSTER_DATA['4C'].length + '), 4D (' + ROSTER_DATA['4D'].length + '), 5B (' + ROSTER_DATA['5B'].length + ')');

// Define the 27 Questions
const QUESTIONS_DATA = {
  part1: [
    { id: 'q1', num: 1, text: '地球上的數學精英可以構成一個集合。', answer: 'X', pts: 2 },
    { id: 'q2', num: 2, text: '集合 $A=\\{4,8\\}$ 和集合 $B=\\{x \\mid (x-4)(x-8)=0\\}$ 是同一個集合。', answer: 'O', pts: 2 },
    { id: 'q3', num: 3, text: '若 $p \\Rightarrow q$，則 $p$ 的一個必要條件是 $q$。', answer: 'O', pts: 2 },
    { id: 'q4', num: 4, text: '如果集合 $A=\\{1,2,3,4,5,6\\}$，集合 $B=\\{3,4,5\\}$，則 $A>B$。', answer: 'X', pts: 2 },
    { id: 'q5', num: 5, text: '若 $ac>bc$，則有 $a>b$。', answer: 'X', pts: 2 },
    { id: 'q6', num: 6, text: '自然數集 $N$ 與實數集 $R$ 的關係是 $N \\in R$。', answer: 'X', pts: 2 }
  ],
  part2: [
    {
      id: 'q7', num: 7,
      text: '設集合 $A=\\{1,2,3,10\\}$，$B=\\{2,3,7,9,10\\}$，$C=\\{x \\mid 0 \\le x \\le 8\\}$，則 $(A \\cap B) \\cup C=$（ ）。',
      options: [
        { key: 'A', text: '$\\{x \\mid 0 \\le x \\le 8\\}$' },
        { key: 'B', text: '$\\{2,3,10\\}$' },
        { key: 'C', text: '$\\{2,3,8,10\\}$' },
        { key: 'D', text: '$\\{x \\mid 0 \\le x \\le 8 \\text{ 或 } x=10\\}$' }
      ],
      answer: 'D', pts: 2
    },
    {
      id: 'q8', num: 8,
      text: '下列命題中的假命題是（ ）。',
      options: [
        { key: 'A', text: '$\\forall x \\in \\mathbb{R},\\ |x|+1>0$' },
        { key: 'B', text: '$\\forall x \\in \\mathbb{N}^{*},\\ (x-1)^{2}>0$' },
        { key: 'C', text: '$\\exists x \\in \\mathbb{R},\\ |x|<1$' },
        { key: 'D', text: '$\\exists x \\in \\mathbb{R},\\ \\frac{1}{|x|}+1=2$' }
      ],
      answer: 'B', pts: 2
    },
    {
      id: 'q9', num: 9,
      text: '若 $P=\\{0, 1, 2\\}$，$Q=\\{0, 2, 3\\}$，$R=\\{1, 2, 3, 4\\}$，則 $P \\cap (Q \\cup R)=$（ ）。',
      options: [
        { key: 'A', text: '$\\{0, 1, 2\\}$' },
        { key: 'B', text: '$\\{0, 1, 2, 3, 4\\}$' },
        { key: 'C', text: '$\\{2\\}$' },
        { key: 'D', text: '$\\varnothing$' }
      ],
      answer: 'A', pts: 2
    },
    {
      id: 'q10', num: 10,
      text: '“四邊形的四隻角相等”是“四邊形是矩形”（ ）。',
      options: [
        { key: 'A', text: '充分條件' },
        { key: 'B', text: '必要條件' },
        { key: 'C', text: '充要條件' },
        { key: 'D', text: '既不是充分條件也不是必要條件' }
      ],
      answer: 'B', pts: 2
    },
    {
      id: 'q11', num: 11,
      text: '集合 $A=\\{1,2,3,5,6\\}$ 的真子集個數是（ ）。',
      options: [
        { key: 'A', text: '$31$' },
        { key: 'B', text: '$32$' },
        { key: 'C', text: '$63$' },
        { key: 'D', text: '$64$' }
      ],
      answer: 'A', pts: 2
    }
  ],
  part3: [
    {
      id: 'q12', num: 12, pts: 6,
      text: '集合中元素的特性：[空1]______，[空2]______，[空3]______。',
      blanks: [
        { id: 'q12_1', label: '特性一', answer: '確定性' },
        { id: 'q12_2', label: '特性二', answer: '互異性' },
        { id: 'q12_3', label: '特性三', answer: '無序性' }
      ]
    },
    {
      id: 'q13', num: 13, pts: 2,
      text: '交集：$A \\cap B = \\{x \\mid \\underline{\\hspace{4em}}\\}$。',
      blanks: [
        { id: 'q13_1', label: '條件描述', answer: 'x∈A且x∈B' }
      ]
    },
    {
      id: 'q14', num: 14, pts: 2,
      text: '全稱量詞命題 $p: \\forall x \\in M,\\ p(x)$，它的否定 $\\neg p:$ $\\underline{\\hspace{4em}}$。',
      blanks: [
        { id: 'q14_1', label: '否定命題', answer: '∃x∈M, ¬p(x)' }
      ]
    },
    {
      id: 'q15', num: 15, pts: 8,
      text: '若 $a \\ge b > 0$，$c < 0$，用最適當的不等式號填空：(填 “$>$” 或 “$<$” 或 “$\\ge$” 或 “$\\le$”)',
      subQuestions: [
        { id: 'q15_1', label: '(1)', expr: '$ac$', blankLabel: '符號', exprAfter: '$bc$', answer: '≤' },
        { id: 'q15_2', label: '(2)', expr: '$b - c$', blankLabel: '符號', exprAfter: '$a - c$', answer: '≤' },
        { id: 'q15_3', label: '(3)', expr: '$\\frac{a}{c^{2}}$', blankLabel: '符號', exprAfter: '$\\frac{b}{c^{2}}$', answer: '≥' },
        { id: 'q15_4', label: '(4)', expr: '$\\frac{b}{a}$', blankLabel: '符號', exprAfter: '$-1$', answer: '≥' }
      ]
    },
    {
      id: 'q16', num: 16, pts: 12,
      text: '用適當符號填空：(填 “$\\in$” 或 “$\\notin$” 或 “$\\subsetneqq$” 或 “$\\supsetneqq$” 或 “$=$”)',
      subQuestions: [
        { id: 'q16_1', label: '(1)', expr: '$0$', blankLabel: '關係', exprAfter: '$\\{1,3\\}$', answer: '∉' },
        { id: 'q16_2', label: '(2)', expr: '$\\varnothing$', blankLabel: '關係', exprAfter: '$\\{0\\}$', answer: '⫋' },
        { id: 'q16_3', label: '(3)', expr: '$-1$', blankLabel: '關係', exprAfter: '$\\{x \\mid x^{2}+3x+2=0\\}$', answer: '∈' },
        { id: 'q16_4', label: '(4)', expr: '$\\{-3\\}$', blankLabel: '關係', exprAfter: '$\\{x \\mid |x|=3\\}$', answer: '⫋' },
        { id: 'q16_5', label: '(5)', expr: '$\\{1\\}$', blankLabel: '關係', exprAfter: '$\\{x \\mid x \\ge 1\\}$', answer: '⫋' },
        { id: 'q16_6', label: '(6)', expr: '$\\sqrt{1521}$', blankLabel: '關係', exprAfter: '$\\mathbb{Q}$', answer: '∈' }
      ]
    },
    {
      id: 'q17', num: 17, pts: 4,
      text: '已知集合 $A=\\{a, a^{2}\\}$，且 $1 \\in A$，則實數 $a=$ $\\underline{\\hspace{3em}}$，集合 $A$ 的子集的個數為 $\\underline{\\hspace{3em}}$。',
      blanks: [
        { id: 'q17_1', label: '實數 a', answer: '-1' },
        { id: 'q17_2', label: '子集個數', answer: '4' }
      ]
    },
    {
      id: 'q18', num: 18, pts: 2,
      text: '設全集為 $U=\\mathbb{R}$，若集合 $A \\subseteq B$，則 $\\complement_{U}A \\ \\underline{\\hspace{3em}}\\ \\complement_{U}B$。',
      blanks: [
        { id: 'q18_1', label: '關係符號', answer: '⊇' }
      ]
    },
    {
      id: 'q19', num: 19, pts: 2,
      text: '寫出命題 “$\\exists x \\in \\mathbb{R},\\ x^{2}+x+4 \\le 0$” 的否命題：$\\underline{\\hspace{6em}}$。',
      blanks: [
        { id: 'q19_1', label: '否命題表達式', answer: '∀x∈R, x²+x+4>0' }
      ]
    }
  ],
  part4: [
    {
      id: 'q20', num: 20, pts: 10,
      title: '集合的交並補綜合運算',
      text: '已知集合 $A=\\{x \\mid 3 \\le x < 7\\}$，$B=\\{x \\mid 5 < x \\le 12\\}$，求下列問題：<br>' +
            '(1) $A \\cup B$；<br>' +
            '(2) $A \\cap B$；<br>' +
            '(3) $\\complement_{\\mathbb{R}}(A \\cup B)$；<br>' +
            '(4) $(\\complement_{\\mathbb{R}}A) \\cap B$；<br>' +
            '(5) $A \\cup (\\complement_{\\mathbb{R}}B)$。'
    },
    {
      id: 'q21', num: 21, pts: 10,
      title: '不等式性質證明題',
      text: '已知 $a>b>0$，$c<d<0$，$e<0$，求證：$$\\frac{e}{a-c} > \\frac{e}{b-d}$$'
    },
    {
      id: 'q22', num: 22, pts: 10,
      title: '基本不等式求最值',
      text: '已知 $x>0$，求 $x + \\frac{4}{x-1}$ 的最小值，並求出最小值時 $x$ 的值。'
    },
    {
      id: 'q23', num: 23, pts: 10,
      title: '含參集合包含關係求解',
      text: '已知 $A=\\{x \\mid -1 < x \\le 3\\}$，$B=\\{x \\mid m \\le x < 1+3m\\}$。<br>' +
            '(1) 當 $m=3$ 時，求 $A \\cup B$；<br>' +
            '(2) 若 $B \\subseteq \\complement_{\\mathbb{R}}A$，求實數 $m$ 的取值範圍。'
    }
  ],
  part5: [
    {
      id: 'q24', num: 24, pts: 5,
      text: '設集合 $A=\\{a^{2}, a+1, -1\\}$，$B=\\{2a-1, |a-2|, 3a^{2}+4\\}$，若 $A \\cap B = \\{-1\\}$，則 $a=$ $\\underline{\\hspace{3em}}$。',
      label: '實數 a 的值'
    },
    {
      id: 'q25', num: 25, pts: 5,
      text: '對於任意兩個正整數 $m, n$，定義某種運算 “$※$” 如下：當 $m, n$ 都為正偶數或正奇數時，$m ※ n = m + n$；當 $m, n$ 中一個為正偶數，另一個為正奇數時，$m ※ n = mn$。則在此定義下，集合 $M=\\{(a, b) \\mid a ※ b = 16\\}$ 中的元素個數是 $\\underline{\\hspace{3em}}$。',
      label: '元素個數'
    },
    {
      id: 'q26', num: 26, pts: 5,
      text: '已知 $a, b \\in \\mathbb{R}$，若 $ab = 1$，則 $a^{2} + b^{2}$ 的最小值是 $\\underline{\\hspace{3em}}$。',
      label: '最小值'
    },
    {
      id: 'q27', num: 27, pts: 5,
      text: '某網店統計了連續三天售出商品的種類情況：第一天售出19種商品，第二天售出13種商品，第三天售出18種商品；前兩天都售出的商品有3種，後兩天都售出的商品有4種，則該網店這三天售出的商品最少有 $\\underline{\\hspace{3em}}$ 種。',
      label: '最少種類數'
    }
  ]
};

console.log('Question sets ready: Part1 (' + QUESTIONS_DATA.part1.length + '), Part2 (' + QUESTIONS_DATA.part2.length + '), Part3 (' + QUESTIONS_DATA.part3.length + '), Part4 (' + QUESTIONS_DATA.part4.length + '), Part5 (' + QUESTIONS_DATA.part5.length + ') = 27 Questions');

module.exports = {
  ROSTER_DATA,
  QUESTIONS_DATA
};
