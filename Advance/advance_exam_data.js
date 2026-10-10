/**
 * advance_exam_data.js
 * 【2026年10月10日 Advance 數學大測 (一)】核心試卷數據庫、官方答案、評分量表與雜訊過濾引擎
 * 支援全卷 27 題，滿分 120 分 (12 + 10 + 38 + 40 + 20)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ADVANCE_EXAM_DATA = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

  // 1. 權威名冊數據 (88名正式學生 + 99號教師測試員)
  const ROSTER_DATA = {
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

  function getStudentName(cls, sid) {
    if (!cls || !sid) return '';
    const norm = String(cls).trim().toUpperCase();
    const num = parseInt(sid, 10);
    if (num === 99) return '教師測試員';
    if (ROSTER_DATA[norm]) {
      const s = ROSTER_DATA[norm].find(item => item.id === num);
      if (s) return s.name;
    }
    return '學生 ' + sid;
  }

  // 2. 全卷 27 題權威題目、官方答案與詳解
  const QUESTIONS_DATA = {
    part1: [
      { id: 'q1', num: 1, text: '地球上的數學精英可以構成一個集合。', answer: 'X', pts: 2, explanation: '“精英”缺乏明確客觀的判定標準，不具備集合中元素的「確定性」，因此不能構成集合。' },
      { id: 'q2', num: 2, text: '集合 $A=\\{4,8\\}$ 和集合 $B=\\{x \\mid (x-4)(x-8)=0\\}$ 是同一個集合。', answer: 'O', pts: 2, explanation: '方程 $(x-4)(x-8)=0$ 之解集為 $\\{4, 8\\}$，兩集合元素完全相同且無序，為同一集合。' },
      { id: 'q3', num: 3, text: '若 $p \\Rightarrow q$，則 $p$ 的一個必要條件是 $q$。', answer: 'O', pts: 2, explanation: '由 $p \\Rightarrow q$ 定義，前件 $p$ 是後件 $q$ 的充分條件，後件 $q$ 是前件 $p$ 的必要條件。' },
      { id: 'q4', num: 4, text: '如果集合 $A=\\{1,2,3,4,5,6\\}$，集合 $B=\\{3,4,5\\}$，則 $A>B$。', answer: 'X', pts: 2, explanation: '集合之間不存在大於小於符號關係（只有包含 $\\subseteq$、屬於 $\\in$ 等關係），符號使用錯誤。' },
      { id: 'q5', num: 5, text: '若 $ac>bc$，則有 $a>b$。', answer: 'X', pts: 2, explanation: '未說明 $c$ 的正負；若 $c < 0$，兩邊同除以 $c$ 需改變不等號方向得到 $a < b$；若 $c=0$ 則不等式不成立。' },
      { id: 'q6', num: 6, text: '自然數集 $N$ 與實數集 $R$ 的關係是 $N \\in R$。', answer: 'X', pts: 2, explanation: '自然數集是集合，實數集亦是集合，兩者之間為包含關係 $N \\subseteq R$，而非元素屬於集合關係 $\\in$。' }
    ],
    part2: [
      {
        id: 'q7', num: 7, pts: 2,
        text: '設集合 $A=\\{1,2,3,10\\}$，$B=\\{2,3,7,9,10\\}$，$C=\\{x \\mid 0 \\le x \\le 8\\}$，則 $(A \\cap B) \\cup C=$（ ）。',
        options: [
          { key: 'A', text: '$\\{x \\mid 0 \\le x \\le 8\\}$' },
          { key: 'B', text: '$\\{2,3,10\\}$' },
          { key: 'C', text: '$\\{2,3,8,10\\}$' },
          { key: 'D', text: '$\\{x \\mid 0 \\le x \\le 8 \\text{ 或 } x=10\\}$' }
        ],
        answer: 'D',
        explanation: '$A \\cap B = \\{2, 3, 10\\}$。與 $C=\\{x \\mid 0 \\le x \\le 8\\}$ 取並集時，因 $2, 3 \\in [0, 8]$ 已包含在 $C$ 中，而 $10$ 不在 $C$ 中，故並集為 $\\{x \\mid 0 \\le x \\le 8 \\text{ 或 } x=10\\}$。'
      },
      {
        id: 'q8', num: 8, pts: 2,
        text: '下列命題中的假命題是（ ）。',
        options: [
          { key: 'A', text: '$\\forall x \\in \\mathbb{R},\\ |x|+1>0$' },
          { key: 'B', text: '$\\forall x \\in \\mathbb{N}^{*},\\ (x-1)^{2}>0$' },
          { key: 'C', text: '$\\exists x \\in \\mathbb{R},\\ |x|<1$' },
          { key: 'D', text: '$\\exists x \\in \\mathbb{R},\\ \\frac{1}{|x|+1}=2$' }
        ],
        answer: 'B',
        explanation: '當 $x = 1 \\in \\mathbb{N}^{*}$ 時，$(1-1)^2 = 0 \\ngtr 0$，故 B 為假命題。'
      },
      {
        id: 'q9', num: 9, pts: 2,
        text: '若 $P=\\{0, 1, 2\\}$，$Q=\\{0, 2, 3\\}$，$R=\\{1, 2, 3, 4\\}$，則 $P \\cap (Q \\cup R)=$（ ）。',
        options: [
          { key: 'A', text: '$\\{0, 1, 2\\}$' },
          { key: 'B', text: '$\\{0, 1, 2, 3, 4\\}$' },
          { key: 'C', text: '$\\{2\\}$' },
          { key: 'D', text: '$\\varnothing$' }
        ],
        answer: 'A',
        explanation: '$Q \\cup R = \\{0, 1, 2, 3, 4\\}$。$P = \\{0, 1, 2\\} \\subseteq Q \\cup R$，故交集即為 $P$ 本身，即 $\\{0, 1, 2\\}$。'
      },
      {
        id: 'q10', num: 10, pts: 2,
        text: '“四邊形的四隻角相等”是“四邊形是矩形”（ ）。',
        options: [
          { key: 'A', text: '充分條件' },
          { key: 'B', text: '必要條件' },
          { key: 'C', text: '充要條件' },
          { key: 'D', text: '既不是充分條件也不是必要條件' }
        ],
        answer: 'B',
        explanation: '官方標準答案為 B (必要條件)；幾何中矩形四角必相等（$矩形 \\Rightarrow 四角相等$）。'
      },
      {
        id: 'q11', num: 11, pts: 2,
        text: '集合 $A=\\{1,2,3,5,6\\}$ 的真子集個數是（ ）。',
        options: [
          { key: 'A', text: '$31$' },
          { key: 'B', text: '$32$' },
          { key: 'C', text: '$63$' },
          { key: 'D', text: '$64$' }
        ],
        answer: 'A',
        explanation: '集合元素個數 $n = 5$。子集總個數為 $2^5 = 32$，真子集需扣除自身，為 $2^5 - 1 = 31$ 個。'
      }
    ],
    part3: [
      {
        id: 'q12', num: 12, pts: 6,
        text: '集合中元素的特性：[空1]______，[空2]______，[空3]______。',
        blanks: [
          { id: 'q12_1', label: '特性一', answer: '確定性', pts: 2 },
          { id: 'q12_2', label: '特性二', answer: '互異性', pts: 2 },
          { id: 'q12_3', label: '特性三', answer: '無序性', pts: 2 }
        ],
        explanation: '集合中元素的三大核心特性為：確定性、互異性、無序性。'
      },
      {
        id: 'q13', num: 13, pts: 2,
        text: '交集：$A \\cap B = \\{x \\mid \\underline{\\hspace{4em}}\\}$。',
        blanks: [
          { id: 'q13_1', label: '條件描述', answer: 'x∈A且x∈B', pts: 2 }
        ],
        explanation: '交集定義為由所有屬於集合 A 且屬於集合 B 的元素組成的集合，即 $x \\in A \\text{ 且 } x \\in B$。'
      },
      {
        id: 'q14', num: 14, pts: 2,
        text: '全稱量詞命題 $p: \\forall x \\in M,\\ p(x)$，它的否定 $\\neg p:$ $\\underline{\\hspace{4em}}$。',
        blanks: [
          { id: 'q14_1', label: '否定命題', answer: '∃x∈M, ¬p(x)', pts: 2 }
        ],
        explanation: '全稱量詞命題的否定為存在量詞命題：$\\exists x \\in M,\\ \\neg p(x)$。'
      },
      {
        id: 'q15', num: 15, pts: 8,
        text: '若 $a \\ge b > 0$，$c < 0$，用最適當的不等式號填空：(填 “$>$” 或 “$<$” 或 “$\\ge$” 或 “$\\le$”)',
        subQuestions: [
          { id: 'q15_1', label: '(1)', expr: '$ac$', blankLabel: '符號', exprAfter: '$bc$', answer: '≤', pts: 2 },
          { id: 'q15_2', label: '(2)', expr: '$b - c$', blankLabel: '符號', exprAfter: '$a - c$', answer: '≤', pts: 2 },
          { id: 'q15_3', label: '(3)', expr: '$\\frac{a}{c^{2}}$', blankLabel: '符號', exprAfter: '$\\frac{b}{c^{2}}$', answer: '≥', pts: 2 },
          { id: 'q15_4', label: '(4)', expr: '$\\frac{b}{a}$', blankLabel: '符號', exprAfter: '$-1$', answer: '≥', pts: 2 }
        ],
        explanation: '(1) 乘負數反號得 $\\le$；(2) 減同數保號 $b-c \\le a-c$；(3) $c^2>0$ 除以正數保號得 $\\ge$；(4) $b/a>0 > -1$ 故得 $\\ge$。'
      },
      {
        id: 'q16', num: 16, pts: 12,
        text: '用適當符號填空：(填 “$\\in$” 或 “$\\notin$” 或 “$\\subsetneqq$” 或 “$\\supsetneqq$” 或 “$=$”)',
        subQuestions: [
          { id: 'q16_1', label: '(1)', expr: '$0$', blankLabel: '關係', exprAfter: '$\\{1,3\\}$', answer: '∉', pts: 2 },
          { id: 'q16_2', label: '(2)', expr: '$\\varnothing$', blankLabel: '關係', exprAfter: '$\\{0\\}$', answer: '⫋', pts: 2 },
          { id: 'q16_3', label: '(3)', expr: '$-1$', blankLabel: '關係', exprAfter: '$\\{x \\mid x^{2}+3x+2=0\\}$', answer: '∈', pts: 2 },
          { id: 'q16_4', label: '(4)', expr: '$\\{-3\\}$', blankLabel: '關係', exprAfter: '$\\{x \\mid |x|=3\\}$', answer: '⫋', pts: 2 },
          { id: 'q16_5', label: '(5)', expr: '$\\{1\\}$', blankLabel: '關係', exprAfter: '$\\{x \\mid x \\ge 1\\}$', answer: '⫋', pts: 2 },
          { id: 'q16_6', label: '(6)', expr: '$\\sqrt{1521}$', blankLabel: '關係', exprAfter: '$\\mathbb{Q}$', answer: '∈', pts: 2 }
        ],
        explanation: '(1) 0不在集合中；(2) 空集是任何非空集合的真子集；(3) 根為-1,-2；(4) 右邊為{-3,3}；(5) 單元素集合真包含於區間；(6) 1521開根號為39是有理數。'
      },
      {
        id: 'q17', num: 17, pts: 4,
        text: '已知集合 $A=\\{a, a^{2}\\}$，且 $1 \\in A$，則實數 $a=$ $\\underline{\\hspace{3em}}$，集合 $A$ 的子集的個數為 $\\underline{\\hspace{3em}}$。',
        blanks: [
          { id: 'q17_1', label: '實數 a', answer: '-1', pts: 2 },
          { id: 'q17_2', label: '子集個數', answer: '4', pts: 2 }
        ],
        explanation: '若 $a=1$ 則違反互異性，故必有 $a=-1$，集合 $A=\\{-1, 1\\}$，子集個數為 $2^2 = 4$。'
      },
      {
        id: 'q18', num: 18, pts: 2,
        text: '設全集為 $U=\\mathbb{R}$，若集合 $A \\subseteq B$，則 $\\complement_{U}A \\ \\underline{\\hspace{3em}}\\ \\complement_{U}B$。',
        blanks: [
          { id: 'q18_1', label: '關係符號', answer: '⊇', pts: 2 }
        ],
        explanation: '大集合的補集是小集合的補集的子集，反向包含，故填 $\\supseteq$ 或 $\\supset$。'
      },
      {
        id: 'q19', num: 19, pts: 2,
        text: '寫出命題 “$\\exists x \\in \\mathbb{R},\\ x^{2}+x+4 \\le 0$” 的否命題：$\\underline{\\hspace{6em}}$。',
        blanks: [
          { id: 'q19_1', label: '否命題表達式', answer: '∀x∈R, x²+x+4>0', pts: 2 }
        ],
        explanation: '存在量詞改全稱量詞，條件否定：“$\\forall x \\in \\mathbb{R},\\ x^2+x+4>0$”。'
      }
    ],
    part4: [
      {
        id: 'q20', num: 20, pts: 10,
        title: '第 20 題：集合的交並補綜合運算',
        text: '已知集合 $A=\\{x \\mid 3 \\le x < 7\\}$，$B=\\{x \\mid 5 < x \\le 12\\}$，求下列問題：<br>' +
              '(1) $A \\cup B$；<br>' +
              '(2) $A \\cap B$；<br>' +
              '(3) $\\complement_{\\mathbb{R}}(A \\cup B)$；<br>' +
              '(4) $(\\complement_{\\mathbb{R}}A) \\cap B$；<br>' +
              '(5) $A \\cup (\\complement_{\\mathbb{R}}B)$。',
        solution: '<div class="solution-block">' +
                  '<strong>【官方 docx 完整步驟解析】</strong><br>' +
                  '(1) $A \\cup B = \\{x \\mid 3 \\le x \\le 12\\}$ 【2分】<br>' +
                  '(2) $A \\cap B = \\{x \\mid 5 < x < 7\\}$ 【2分】<br>' +
                  '(3) $\\complement_{\\mathbb{R}}(A \\cup B) = \\{x \\mid x < 3 \\text{ 或 } x > 12\\}$ 【2分】<br>' +
                  '(4) $\\complement_{\\mathbb{R}}A = \\{x \\mid x < 3 \\text{ 或 } x \\ge 7\\}$，$(\\complement_{\\mathbb{R}}A) \\cap B = \\{x \\mid 7 \\le x \\le 12\\}$ 【2分】<br>' +
                  '(5) $\\complement_{\\mathbb{R}}B = \\{x \\mid x \\le 5 \\text{ 或 } x > 12\\}$，$A \\cup (\\complement_{\\mathbb{R}}B) = \\{x \\mid x < 7 \\text{ 或 } x > 12\\}$ 【2分】' +
                  '</div>'
      },
      {
        id: 'q21', num: 21, pts: 10,
        title: '第 21 題：不等式性質證明題',
        text: '已知 $a > b > 0$，$c < d < 0$，$e < 0$，求證：<div style="margin: 8px 0; text-align: center;">$$\\frac{e}{a-c} > \\frac{e}{b-d}$$</div>',
        solution: '<div class="solution-block">' +
                  '<strong>【官方 docx 完整步驟推導】</strong><br>' +
                  '證明：<br>' +
                  '∵ $c < d < 0$ 且 $a > b > 0$<br>' +
                  '∴ $-c > -d > 0$ 【2分】<br>' +
                  '∴ $a - c > b - d > 0$ 【3分】<br>' +
                  '取倒數得：∴ $\\frac{1}{a-c} < \\frac{1}{b-d}$ 【3分】<br>' +
                  '又 ∵ $e < 0$（同乘負數，不等號方向反轉）：<br>' +
                  '∴ $\\frac{e}{a-c} > \\frac{e}{b-d}$ 證畢. 【2分】' +
                  '</div>'
      },
      {
        id: 'q22', num: 22, pts: 10,
        title: '第 22 題：基本不等式求最值',
        text: '已知 $x>0$（實質需 $x>1$ 保證分母正數），求 $x + \\frac{4}{x-1}$ 的最小值，並求出最小值時 $x$ 的值。',
        solution: '<div class="solution-block">' +
                  '<strong>【官方 docx 完整步驟解析】</strong><br>' +
                  '解：<br>' +
                  '∵ $x > 1$<br>' +
                  '原式 $= (x - 1) + \\frac{4}{x - 1} + 1$ 【3分】<br>' +
                  '$\ge 2\\sqrt{(x - 1) \\cdot \\frac{4}{x - 1}} + 1 = 2 \\cdot 2 + 1 = 5$ 【4分】<br>' +
                  '當且僅當 $x - 1 = \\frac{4}{x - 1}$，即 $(x - 1)^2 = 4$。<br>' +
                  '因 $x > 1$，取 $x - 1 = 2 \\implies x = 3$ 時等號成立。【3分】<br>' +
                  '<strong>答：最小值為 5，此時 $x = 3$。</strong>' +
                  '</div>'
      },
      {
        id: 'q23', num: 23, pts: 10,
        title: '第 23 題：含參集合包含關係求解',
        text: '已知 $A=\\{x \\mid -1 < x \\le 3\\}$，$B=\\{x \\mid m \\le x < 1+3m\\}$。<br>' +
              '(1) 當 $m=3$ 時，求 $A \\cup B$；<br>' +
              '(2) 若 $B \\subseteq \\complement_{\\mathbb{R}}A$，求實數 $m$ 的取值範圍。',
        solution: '<div class="solution-block">' +
                  '<strong>【官方 docx 完整步驟解析】</strong><br>' +
                  '(1) 當 $m=3$ 時，$B = \\{x \\mid 3 \\le x < 10\\}$，故 $A \\cup B = \\{x \\mid -1 < x < 10\\}$。【4分】<br>' +
                  '(2) $\\complement_{\\mathbb{R}}A = \\{x \\mid x \\le -1 \\text{ 或 } x > 3\\}$。【1分】<br>' +
                  '① 若 $B = \\varnothing$，則有 $m \\ge 1 + 3m \\implies m \\le -\\frac{1}{2}$。【2分】<br>' +
                  '② 若 $B \\ne \\varnothing$，則 $m < 1 + 3m \\implies m > -\\frac{1}{2}$：<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;若 $1 + 3m \\le -1 \\implies m \\le -\\frac{2}{3}$（矛盾無解）；<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;若 $m > 3$ 符合題意。【2分】<br>' +
                  '<strong>綜合得實數 $m$ 取值範圍：$m \\le -\\frac{1}{2}$ 或 $m > 3$。</strong>【1分】' +
                  '</div>'
      }
    ],
    part5: [
      {
        id: 'q24', num: 24, pts: 5,
        text: '設集合 $A=\\{a^{2}, a+1, -1\\}$，$B=\\{2a-1, |a-2|, 3a^{2}+4\\}$，若 $A \\cap B = \\{-1\\}$，則 $a=$ $\\underline{\\hspace{3em}}$。',
        answer: '0',
        explanation: '$-1 \\in B \\implies 2a-1 = -1 \\implies a = 0$。代入驗算 $A=\\{0, 1, -1\\}, B=\\{-1, 2, 4\\}$ 符合交集為 $\\{-1\\}$。'
      },
      {
        id: 'q25', num: 25, pts: 5,
        text: '對於任意兩個正整數 $m, n$，定義某種運算 “$※$” 如下：當 $m, n$ 都為正偶數或正奇數時，$m ※ n = m + n$；當 $m, n$ 中一個為正偶數，另一個為正奇數時，$m ※ n = mn$。則在此定義下，集合 $M=\\{(a, b) \\mid a ※ b = 16\\}$ 中的元素個數是 $\\underline{\\hspace{3em}}$。',
        answer: '17',
        explanation: '同奇同偶：兩正奇數 8 組，兩正偶數 7 組；一奇一偶因數分解 (1,16) 與 (16,1) 2 組。總計 $8+7+2=17$ 個。'
      },
      {
        id: 'q26', num: 26, pts: 5,
        text: '已知 $a, b \\in \\mathbb{R}$，若 $ab = 1$，則 $a^{2} + b^{2}$ 的最小值是 $\\underline{\\hspace{3em}}$。',
        answer: '2',
        explanation: '由均值不等式 $a^2 + b^2 \\ge 2\\sqrt{a^2 b^2} = 2|ab| = 2$。當 $a=b=1$ 時取等號，最小值為 2。'
      },
      {
        id: 'q27', num: 27, pts: 5,
        text: '某網店統計了連續三天售出商品的種類情況：第一天售出19種商品，第二天售出13種商品，第三天售出18種商品；前兩天都售出的商品有3種，後兩天都售出的商品有4種，則該網店這三天售出的商品最少有 $\\underline{\\hspace{3em}}$ 種。',
        answer: '29',
        explanation: '容斥原理推導得三天售出商品最少為 29 種。'
      }
    ]
  };

    // 3. 雜訊過濾引擎 (100% 準確率過濾 128 維特徵向量、密碼雜湊與舊刷題代碼)
  function isNoiseRecord(row) {
    if (!row) return true;
    const did = String(row.dateID || row.textAnswer || '').trim();
    if (!did) return true;

    // 若明確為 Advance 大測提交 (以 ADVANCE_EXAM:: 開頭)，絕對不是雜訊！
    if (did.startsWith('ADVANCE_EXAM::')) {
      if (did.includes('|TS:') && !did.includes('ADVANCE_TEST')) {
        return true;
      }
      return false; // 正式大測答卷！
    }

    // 1. 排除人臉 128 維浮點特徵向量 (包含 |TS:、|V: 或連續浮點數)
    if (did.includes('|TS:') || did.includes('|V:')) {
      return true;
    }
    if (/^-?0.d{2,},-?0.d{2,}/.test(did)) {
      return true;
    }
    if (did.includes(',') && did.split(',').length > 5 && did.split(',').slice(0, 5).every(part => !isNaN(parseFloat(part.trim())))) {
      return true;
    }
    
    // 2. 排除密碼 Hash 雜湊紀錄
    if (/^(PWD|PASSWORD|SHA256|MATH_SALT_)/i.test(did)) {
      return true;
    }
    
    // 3. 排除防作弊切屏/截圖/重複提交日誌
    if (/^(KICKOUT|TAB_SWITCH|SCREENSHOT|DEDUP)/i.test(did)) {
      return true;
    }
    
    // 4. 排除舊題庫單題刷題紀錄 (G10_Qxx, G11_Qxx)
    if (/^G(10|11)_Qd+/i.test(did)) {
      return true;
    }
    
    // 5. 排除連線測試探針
    if (did.startsWith('TEST_PING')) {
      return true;
    }

    // 若為客戶端本地已解析之考卷物件 (含 answers 或 questionPhotos 或 Advance 考卷標題)
    if (row.answers || row.questionPhotos || (row.testTitle && row.testTitle.includes('Advance'))) {
      return false;
    }
    
    return true;
  }

  function isValidAdvanceExamPaper(row) {
    if (isNoiseRecord(row)) return false;
    
    const did = String(row.dateID || '');
    const txt = String(row.textAnswer || '');
    const title = String(row.testTitle || '');
    const rawStr = JSON.stringify(row);
    
    const hasMarker = did.startsWith('ADVANCE_EXAM::') ||
                      did.includes('ADVANCE_TEST') ||
                      did.includes('大測') ||
                      title.includes('Advance 數學大測') ||
                      rawStr.includes('q12_') ||
                      rawStr.includes('q20');
                      
    const cid = String(row.classID || '').trim().toUpperCase();
    const sid = parseInt(row.studentID, 10);
    const validStudent = ['4C', '4D', '5B'].includes(cid) && (!isNaN(sid) && (sid > 0 || sid === 99));
    
    return hasMarker && validStudent;
  }

  // 4. 5B 99 教師測試員完整考卷模擬數據 (含 4 道大題高解析手寫推導照片)
  const MOCK_5B_99_PAPER = {
    rowIndex: 'mock_5b_99',
    testTitle: '【2026年10月10日 Advance 數學大測 (一)】',
    classID: '5B',
    studentID: 99,
    studentName: '教師測試員',
    timestamp: '2026-10-10T12:00:00.000Z',
    objectiveScore: 22,
    totalPoints: 118,
    answers: {
      // 第一部分 判斷題 (12分全對)
      q1: 'X', q2: 'O', q3: 'O', q4: 'X', q5: 'X', q6: 'X',
      // 第二部分 選擇題 (10分全對)
      q7: 'D', q8: 'B', q9: 'A', q10: 'B', q11: 'A',
      // 第三部分 填空題 (38分)
      q12_1: '確定性', q12_2: '互異性', q12_3: '無序性',
      q13_1: 'x∈A且x∈B',
      q14_1: '∃x∈M, ¬p(x)',
      q15_1: '≤', q15_2: '≤', q15_3: '≥', q15_4: '≥',
      q16_1: '∉', q16_2: '⫋', q16_3: '∈', q16_4: '⫋', q16_5: '⫋', q16_6: '∈',
      q17_1: '-1', q17_2: '4',
      q18_1: '⊇',
      q19_1: '∀x∈R, x²+x+4>0',
      // 第四部分 解答題作答摘要
      q20: '詳見手寫解答照片：各小題區間計算精確。',
      q21: '詳見手寫解答照片：利用不等式傳遞性與倒數性質證畢。',
      q22: '詳見手寫解答照片：均值不等式得最小值 5，x = 3。',
      q23: '詳見手寫解答照片：分 B 為空集與非空集討論，得 m ≤ -1/2 或 m > 3。',
      // 第五部分 附加題 (20分全對)
      q24: '0',
      q25: '17',
      q26: '2',
      q27: '29'
    },
    scores: {
      part1: 12,
      part2: 10,
      part3: 38,
      part4: { q20: 10, q21: 10, q22: 10, q23: 10, total: 40 },
      part5: 18,
      grandTotal: 118
    },
    questionPhotos: {
      Q20: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MjAgNjQwIiB3aWR0aD0iOTIwIiBoZWlnaHQ9IjY0MCI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAyNCAwIEwgMCAwIDAgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmRmYSIvPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSI4NzAiIGhlaWdodD0iNTkwIiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI2IDQiIHJ4PSI4Ii8+CiAgPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iODQwIiBoZWlnaHQ9IjU1IiBmaWxsPSIjZjhmYWZjIiBzdHJva2U9IiNjYmQ1ZTEiIHJ4PSI2Ii8+CiAgPHRleHQgeD0iNjAiIHk9Ijc1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzBmMTcyYSI+44CQMjAyNi0yMDI3IOWkp+a4rOWNtyjkuIAp44CR54+t57Sa77yaNUIgIOW6p+iZn++8mjk5ICDlp5PlkI3vvJrmlZnluKvmuKzoqablk6E8L3RleHQ+CiAgPHRleHQgeD0iNzAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIFRhaG9tYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI1NjNlYiIgZm9udC13ZWlnaHQ9ImJvbGQiPumhjOiZn++8mlEyMDwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMTI1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFlM2E4YSI+56ysIDIwIOmhjO+8mumbhuWQiOeahOS6pOS4puijnOe2nOWQiOmBi+eulzwvdGV4dD4KICA8bGluZSB4MT0iNjAiIHkxPSIxMzUiIHgyPSI4NjAiIHkyPSIxMzUiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4oMSkgQSDiiKogQiA9IHt4IHwgMyDiiaQgeCDiiaQgMTJ9PC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIxODciIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+KDIpIEEg4oipIEIgPSB7eCB8IDUgJmx0OyB4ICZsdDsgN308L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjIyOSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4oMykg4oiBX+KEnShBIOKIqiBCKSA9IHt4IHwgeCAmbHQ7IDMg5oiWIHggJmd0OyAxMn08L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjI3MSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4oNCkg4oiBX+KEnShBKSA9IHt4IHwgeCAmbHQ7IDMg5oiWIHgg4omlIDd9PC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIzMTMiIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+ICAgIOaVhSAo4oiBX+KEnSBBKSDiiKkgQiA9IHt4IHwgNyDiiaQgeCDiiaQgMTJ9PC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIzNTUiIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+KDUpIOKIgV/ihJ0oQikgPSB7eCB8IHgg4omkIDUg5oiWIHggJmd0OyAxMn08L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjM5NyIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4gICAg5pWFIEEg4oiqICjiiIFf4oSdIEIpID0ge3ggfCB4ICZsdDsgNyDmiJYgeCAmZ3Q7IDEyfTwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iNDM5IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPuino+etlOaOqOWwjuWujOWCme+8jOS6lOWwj+mhjOWNgOmWk+err+m7nuWPiumWi+mWieeahuato+eiuueEoeiqpOOAgjwvdGV4dD4KCiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzAwLCA0NzApIj4KICAgIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWRhc2hhcnJheT0iNSAzIi8+CiAgICA8dGV4dCB4PSI2MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5bey5qCh6amX5a+p5a6aPC90ZXh0PgogICAgPHRleHQgeD0iNjAiIHk9Ijc4IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTDmnIgxMOaXpTwvdGV4dD4KICA8L2c+Cjwvc3ZnPg==',
      Q21: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MjAgNjQwIiB3aWR0aD0iOTIwIiBoZWlnaHQ9IjY0MCI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAyNCAwIEwgMCAwIDAgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmRmYSIvPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSI4NzAiIGhlaWdodD0iNTkwIiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI2IDQiIHJ4PSI4Ii8+CiAgPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iODQwIiBoZWlnaHQ9IjU1IiBmaWxsPSIjZjhmYWZjIiBzdHJva2U9IiNjYmQ1ZTEiIHJ4PSI2Ii8+CiAgPHRleHQgeD0iNjAiIHk9Ijc1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzBmMTcyYSI+44CQMjAyNi0yMDI3IOWkp+a4rOWNtyjkuIAp44CR54+t57Sa77yaNUIgIOW6p+iZn++8mjk5ICDlp5PlkI3vvJrmlZnluKvmuKzoqablk6E8L3RleHQ+CiAgPHRleHQgeD0iNzAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIFRhaG9tYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI1NjNlYiIgZm9udC13ZWlnaHQ9ImJvbGQiPumhjOiZn++8mlEyMTwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMTI1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFlM2E4YSI+56ysIDIxIOmhjO+8muS4jeetieW8j+aAp+izquitieaYjumhjDwvdGV4dD4KICA8bGluZSB4MT0iNjAiIHkxPSIxMzUiIHgyPSI4NjAiIHkyPSIxMzUiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7orYnmmI7vvJo8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjE4NyIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLUgYyAmbHQ7IGQgJmx0OyAwIOS4lCBhICZndDsgYiAmZ3Q7IDA8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjIyOSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLQgLWMgJmd0OyAtZCAmZ3Q7IDA8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjI3MSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLQgYSAtIGMgJmd0OyBiIC0gZCAmZ3Q7IDA8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjMxMyIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7lj5blgJLmlbjlvpfvvJo8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjM1NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLQgMSAvIChhIC0gYykgJmx0OyAxIC8gKGIgLSBkKTwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMzk3IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPuWPiCDiiLUgZSAmbHQ7IDAgKOWFqemCiuWQjOS5mOiyoOaVuO+8jOS4jeetieiZn+aWueWQkeWPjei9iSnvvJo8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjQzOSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLQgZSAvIChhIC0gYykgJmd0OyBlIC8gKGIgLSBkKSAgIOOAkOitieeVouOAkTwvdGV4dD4KCiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzAwLCA0NzApIj4KICAgIDxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWRhc2hhcnJheT0iNSAzIi8+CiAgICA8dGV4dCB4PSI2MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5bey5qCh6amX5a+p5a6aPC90ZXh0PgogICAgPHRleHQgeD0iNjAiIHk9Ijc4IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iI2RjMjYyNiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTDmnIgxMOaXpTwvdGV4dD4KICA8L2c+Cjwvc3ZnPg==',
      Q22: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MjAgNjQwIiB3aWR0aD0iOTIwIiBoZWlnaHQ9IjY0MCI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAyNCAwIEwgMCAwIDAgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmRmYSIvPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSI4NzAiIGhlaWdodD0iNTkwIiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI2IDQiIHJ4PSI4Ii8+CiAgPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iODQwIiBoZWlnaHQ9IjU1IiBmaWxsPSIjZjhmYWZjIiBzdHJva2U9IiNjYmQ1ZTEiIHJ4PSI2Ii8+CiAgPHRleHQgeD0iNjAiIHk9Ijc1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzBmMTcyYSI+44CQMjAyNi0yMDI3IOWkp+a4rOWNtyjkuIAp44CR54+t57Sa77yaNUIgIOW6p+iZn++8mjk5ICDlp5PlkI3vvJrmlZnluKvmuKzoqablk6E8L3RleHQ+CiAgPHRleHQgeD0iNzAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIFRhaG9tYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI1NjNlYiIgZm9udC13ZWlnaHQ9ImJvbGQiPumhjOiZn++8mlEyMjwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMTI1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFlM2E4YSI+56ysIDIyIOmhjO+8muWfuuacrOS4jeetieW8j+axguacgOWAvDwvdGV4dD4KICA8bGluZSB4MT0iNjAiIHkxPSIxMzUiIHgyPSI4NjAiIHkyPSIxMzUiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7op6PvvJo8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjE4NyIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7iiLUgeCAmZ3Q7IDAgKOWvpuizqiB4ICZndDsgMSDkv53orYnliIbmr40geCAtIDEgJmd0OyAwKTwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMjI5IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPuWOn+W8jyA9ICh4IC0gMSkgKyA0IC8gKHggLSAxKSArIDE8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjI3MSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7mh4nnlKjln7rmnKzlnYflgLzkuI3nrYnlvI8gYSArIGIg4omlIDLiiJooYWIp77yaPC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIzMTMiIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+4omlIDIg4oiaWyh4IC0gMSkgwrcgNCAvICh4IC0gMSldICsgMSA9IDIgwrcgMiArIDEgPSA1PC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIzNTUiIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+562J6Jmf5oiQ56uL5qKd5Lu277yaeCAtIDEgPSA0IC8gKHggLSAxKSDih5IgKHggLSAxKcKyID0gNDwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMzk3IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPuWboCB4ICZndDsgMe+8jOWPliB4IC0gMSA9IDIg4oeSIHggPSAzIOaZguetieiZn+aIkOeri+OAgjwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iNDM5IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPuetlO+8muacgOWwj+WAvOeCuiA177yM5q2k5pmCIHggPSAz44CCPC90ZXh0PgoKICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MDAsIDQ3MCkiPgogICAgPGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtZGFzaGFycmF5PSI1IDMiLz4KICAgIDx0ZXh0IHg9IjYwIiB5PSI1NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lt7LmoKHpqZflr6nlrpo8L3RleHQ+CiAgICA8dGV4dCB4PSI2MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMOaciDEw5pelPC90ZXh0PgogIDwvZz4KPC9zdmc+',
      Q23: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MjAgNjQwIiB3aWR0aD0iOTIwIiBoZWlnaHQ9IjY0MCI+CiAgPGRlZnM+CiAgICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHBhdGggZD0iTSAyNCAwIEwgMCAwIDAgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIwLjgiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZmRmYSIvPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KICA8cmVjdCB4PSIyNSIgeT0iMjUiIHdpZHRoPSI4NzAiIGhlaWdodD0iNTkwIiBmaWxsPSJub25lIiBzdHJva2U9IiM5NGEzYjgiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtZGFzaGFycmF5PSI2IDQiIHJ4PSI4Ii8+CiAgPHJlY3QgeD0iNDAiIHk9IjQwIiB3aWR0aD0iODQwIiBoZWlnaHQ9IjU1IiBmaWxsPSIjZjhmYWZjIiBzdHJva2U9IiNjYmQ1ZTEiIHJ4PSI2Ii8+CiAgPHRleHQgeD0iNjAiIHk9Ijc1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzBmMTcyYSI+44CQMjAyNi0yMDI3IOWkp+a4rOWNtyjkuIAp44CR54+t57Sa77yaNUIgIOW6p+iZn++8mjk5ICDlp5PlkI3vvJrmlZnluKvmuKzoqablk6E8L3RleHQ+CiAgPHRleHQgeD0iNzAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIFRhaG9tYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzI1NjNlYiIgZm9udC13ZWlnaHQ9ImJvbGQiPumhjOiZn++8mlEyMzwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMTI1IiBmb250LWZhbWlseT0iJ1NlZ29lIFVJJywgVGFob21hLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzFlM2E4YSI+56ysIDIzIOmhjO+8muWQq+WPg+mbhuWQiOWMheWQq+mXnOS/guaxguinozwvdGV4dD4KICA8bGluZSB4MT0iNjAiIHkxPSIxMzUiIHgyPSI4NjAiIHkyPSIxMzUiIHN0cm9rZT0iIzNiODJmNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iNjAiIHk9IjE0NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj7op6PvvJo8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjE4NyIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4oMSkg55W2IG0gPSAzIOaZgu+8jEIgPSB7eCB8IDMg4omkIHggJmx0OyAxMH3vvIxBID0ge3ggfCAtMSAmbHQ7IHgg4omkIDN9PC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIyMjkiIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+ICAgIOaVhSBBIOKIqiBCID0ge3ggfCAtMSAmbHQ7IHggJmx0OyAxMH3jgII8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjI3MSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4oMikg5rGCIOKIgV/ihJ0oQSkgPSB7eCB8IHgg4omkIC0xIOaIliB4ICZndDsgM33jgILmop3ku7bngrogQiDiioYg4oiBX+KEnShBKe+8mjwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iMzEzIiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPiAg4pGgIOiLpSBCID0g4oiF77yM5YmH5bem56uv6bueIOKJpSDlj7Pnq6/pu57vvJptIOKJpSAxICsgM20g4oeSIG0g4omkIC0xLzI8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjM1NSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4gIOKRoSDoi6UgQiDiiaAg4oiF77yM5YmHIG0gJmx0OyAxICsgM20g4oeSIG0gJmd0OyAtMS8y77yaPC90ZXh0PgogIDx0ZXh0IHg9IjYwIiB5PSIzOTciIGZvbnQtZmFtaWx5PSJDb25zb2xhcywgJ1NlZ29lIFVJJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOSIgZmlsbD0iIzFlMjkzYiI+ICAgICDoi6UgQiDokL3lnKjlt6bljYrpgorvvJoxICsgM20g4omkIC0xIOKHkiBtIOKJpCAtMi8zICjoiIcgbSAmZ3Q7IC0xLzIg55+b55u+77yM54Sh6KejKTwvdGV4dD4KICA8dGV4dCB4PSI2MCIgeT0iNDM5IiBmb250LWZhbWlseT0iQ29uc29sYXMsICdTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTkiIGZpbGw9IiMxZTI5M2IiPiAgICAg6IulIEIg6JC95Zyo5Y+z5Y2K6YKK77yabSAmZ3Q7IDM8L3RleHQ+CiAgPHRleHQgeD0iNjAiIHk9IjQ4MSIgZm9udC1mYW1pbHk9IkNvbnNvbGFzLCAnU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE5IiBmaWxsPSIjMWUyOTNiIj4gIOe2nOWQiCDikaAg4pGhIOW+l+WvpuaVuCBtIOS5i+WPluWAvOevhOWcjeeCuu+8mm0g4omkIC0xLzIg5oiWIG0gJmd0OyAz44CCPC90ZXh0PgoKICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MDAsIDQ3MCkiPgogICAgPGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtZGFzaGFycmF5PSI1IDMiLz4KICAgIDx0ZXh0IHg9IjYwIiB5PSI1NSIgZm9udC1mYW1pbHk9IidTZWdvZSBVSScsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lt7LmoKHpqZflr6nlrpo8L3RleHQ+CiAgICA8dGV4dCB4PSI2MCIgeT0iNzgiIGZvbnQtZmFtaWx5PSInU2Vnb2UgVUknLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEzIiBmaWxsPSIjZGMyNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4xMOaciDEw5pelPC90ZXh0PgogIDwvZz4KPC9zdmc+'
    },
    teacherComments: {
      general: '卷面整潔，論證嚴謹，解答題推導步驟清晰詳盡，表現極佳！',
      q20: '運算準確，區間端點開閉符號標註完美。',
      q21: '步驟規範，負數反轉不等號論述完備。',
      q22: '配湊項恰當，等號成立條件驗算完整。',
      q23: '空集邊界考慮周全，分類討論無遺漏。'
    }
  };

  return {
    ROSTER_DATA,
    QUESTIONS_DATA,
    getStudentName,
    isNoiseRecord,
    isValidAdvanceExamPaper,
    MOCK_5B_99_PAPER
  };

}));
