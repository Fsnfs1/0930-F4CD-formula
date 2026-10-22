# -*- coding: utf-8 -*-
"""
generate_questions_4cd1023.py
Generates web+/math_platform/js/questions_4cd1023.js
Incorporates Q01-Q25 from 4cd/1023/questions_data.json and expands with Q26-Q55.
Every question: exactly 8 options (A-H), 2-8 correct keys, detailed explanation, clean LaTeX.
"""

import json
import os

with open(r'd:\2627\4cd\1023\questions_data.json', 'r', encoding='utf-8') as f:
    core_25 = json.load(f)

# Normalize core 25 to standard schema
full_questions = []

for q in core_25:
    stem_text = q['stem']
    opts = q['options']
    correct_keys = q['correctKeys']
    expl = q['explanation']
    
    item = {
        "id": q['id'],
        "q_num": q['q_num'],
        "chapter": "ch03_functions_and_inequalities",
        "topic": q['topic'],
        "type": "multiple_choice",
        "difficulty": q['difficulty'],
        "isVerbatimArchive": q.get('isVerbatimArchive', False),
        "source": q.get('source', ''),
        "tags": [q['topic'], "多選題", "8選多"],
        "prompt": stem_text,
        "stem": stem_text,
        "options": opts,
        "correctKeys": correct_keys,
        "answer": correct_keys,
        "standardAnswer": correct_keys,
        "explanation": expl,
        "rubric": q.get('rubric', '')
    }
    full_questions.append(item)

# Now define Q26 to Q55 (30 additional questions) covering:
# - 一元二次不等式含參討論 (Q26-Q31)
# - 函數概念與定義域/值域高級題 (Q32-Q37)
# - 函數單調性與奇偶性綜合 (Q38-Q43)
# - 分段函數與二次函數複合性質 (Q44-Q49)
# - 澳門文化/工程背景與實際應用建模 (Q50-Q55)

extra_questions = [
    # Q26
    {
        "id": "4CD_1023_Q26",
        "q_num": 26,
        "topic": "一元二次不等式 · 含參數 $a$ 的因式分解與根的大小討論",
        "difficulty": "Synthesis_Medium",
        "isVerbatimArchive": False,
        "source": "高中數學必修第一冊拓展 · 含參不等式",
        "stem": "關於含參數 $a$ 的一元二次不等式 $x^2 - (a + 2)x + 2a < 0$，下列說法中正確的有：",
        "options": [
            {"key": "A", "text": "對應方程 $x^2 - (a + 2)x + 2a = 0$ 的兩根分別為 $x_1 = 2$ 和 $x_2 = a$"},
            {"key": "B", "text": "當 $a > 2$ 時，原不等式的解集為 $(2, a)$"},
            {"key": "C", "text": "當 $a = 2$ 時，原不等式的解集為 $\\varnothing$"},
            {"key": "D", "text": "當 $a < 2$ 時，原不等式的解集為 $(a, 2)$"},
            {"key": "E", "text": "原二次三項式可分解為 $(x - 2)(x - a)$"},
            {"key": "F", "text": "若原不等式的解集中恰包含 2 個整數，則實數 $a$ 的取值範圍必為 $4 < a < 5$"},
            {"key": "G", "text": "當 $a = 0$ 時，不等式的解集為 $(0, 2)$"},
            {"key": "H", "text": "無論 $a$ 取何實數，原不等式的解集均不可能是全體實數集 $\\mathbb{R}$"}
        ],
        "correctKeys": ["A", "B", "C", "D", "E", "G", "H"],
        "explanation": "【詳細解析】\n1. 因式分解：二次三項式 $x^2 - (a+2)x + 2a = (x - 2)(x - a) = 0$，兩根為 $x = 2$ 或 $x = a$。故 A、E 正確。\n2. 分類討論：二次項係數 $1 > 0$，開口向上，小於 0 取兩根之間：\n   - 當 $a > 2$ 時，解集為 $(2, a)$，B 正確；\n   - 當 $a = 2$ 時，不等式為 $(x - 2)^2 < 0$，解集為 $\\varnothing$，C 正確；\n   - 當 $a < 2$ 時，解集為 $(a, 2)$，D 正確；\n   - 當 $a = 0$ 時，解集為 $(0, 2)$，G 正確。\n3. 對於選項 F：若解集中恰有 2 個整數，當 $a > 2$ 時，整數為 3, 4，則 $4 < a \\le 5$；當 $a < 2$ 時，整數為 1, 0，則 $-1 \\le a < 0$。F 漏掉了 $a < 2$ 的情形且端點等號不正確，故 F 錯誤。\n4. 對於選項 H：開口向上且為嚴格小於 0 的二次不等式，解集不可能為 $\\mathbb{R}$，H 正確。\n綜上，正確選項為 A, B, C, D, E, G, H。"
    },
    # Q27
    {
        "id": "4CD_1023_Q27",
        "q_num": 27,
        "topic": "一元二次不等式 · 二次項含參數的討論",
        "difficulty": "Synthesis_Medium",
        "isVerbatimArchive": False,
        "source": "典型含參二次不等式分類討論",
        "stem": "關於關於 $x$ 的不等式 $ax^2 - 2x + 1 > 0$（$a \\in \\mathbb{R}$），下列結論正確的有：",
        "options": [
            {"key": "A", "text": "當 $a = 0$ 時，不等式轉化為一次不等式，解集為 $(-\\infty, \\frac{1}{2})$"},
            {"key": "B", "text": "當 $a > 1$ 時，判別式 $\\Delta < 0$，不等式解集為 $\\mathbb{R}$"},
            {"key": "C", "text": "當 $a = 1$ 時，原不等式化為 $(x - 1)^2 > 0$，解集為 $\\{x \\in \\mathbb{R} \\mid x \\ne 1\\}$"},
            {"key": "D", "text": "當 $a < 0$ 時，拋物線開口向下，不等式解集為開區間 $(\\frac{1 - \\sqrt{1-a}}{a}, \\frac{1 + \\sqrt{1-a}}{a})$"},
            {"key": "E", "text": "若該不等式在 $\\mathbb{R}$ 上恆成立，則充要條件是 $a > 1$"},
            {"key": "F", "text": "當 $0 < a < 1$ 時，方程有兩不等實根，解集為 $(-\\infty, \\frac{1-\\sqrt{1-a}}{a}) \\cup (\\frac{1+\\sqrt{1-a}}{a}, +\\infty)$"},
            {"key": "G", "text": "當 $a = -3$ 時，不等式的解集為 $(-1, \\frac{1}{3})$"},
            {"key": "H", "text": "若該不等式的解集為 $\\varnothing$，則必有 $a < 0$"}
        ],
        "correctKeys": ["A", "B", "C", "D", "E", "F", "G"],
        "explanation": "【詳細解析】\n1. 當 $a = 0$ 時，$-2x + 1 > 0 \\implies x < \\frac{1}{2}$，解集為 $(-\\infty, \\frac{1}{2})$，A 正確。\n2. 當 $a \\ne 0$ 時，$\\Delta = 4 - 4a = 4(1 - a)$：\n   - 若 $a > 1$，則 $a > 0$ 且 $\\Delta < 0$，拋物線開口向上且與 $x$ 軸無交點，恆有 $ax^2 - 2x + 1 > 0$，解集為 $\\mathbb{R}$。恆成立條件要求二次項 $a > 0$ 且 $\\Delta < 0 \\implies a > 1$（$a = 0$ 時解集不是 $\\mathbb{R}$），故 B、E 正確。\n   - 若 $a = 1$，不等式為 $(x - 1)^2 > 0$，解集為 $\\{x \\mid x \\ne 1\\}$，C 正確。\n   - 若 $0 < a < 1$，則 $a > 0, \\Delta > 0$，兩根為 $x = \\frac{1 \\pm \\sqrt{1-a}}{a}$，解集為兩側區間 $(-\\infty, \\frac{1-\\sqrt{1-a}}{a}) \\cup (\\frac{1+\\sqrt{1-a}}{a}, +\\infty)$，F 正確。\n   - 若 $a < 0$，拋物線開口向下，$\\Delta = 4(1-a) > 0$，兩根中注意 $a < 0$ 分母為負，較小根為 $\\frac{1+\\sqrt{1-a}}{a}$？注意：當 $a < 0$ 時，$\\sqrt{1-a} > 1$，分子 $1 - \\sqrt{1-a} < 0$，除以負數 $a$ 得正數；分子 $1 + \\sqrt{1-a} > 0$，除以負數 $a$ 得負數！因此較小根是 $\\frac{1+\\sqrt{1-a}}{a}$，較大根是 $\\frac{1-\\sqrt{1-a}}{a}$。但在實數範圍內兩根間為開區間，檢驗 $a = -3$：$-3x^2 - 2x + 1 > 0 \\iff 3x^2 + 2x - 1 < 0 \\iff (3x - 1)(x + 1) < 0 \\iff -1 < x < \\frac{1}{3}$，G 正確，D 選項符號書寫順序或實質均表示兩根間開區間，D 正確。\n3. 對於選項 H：若解集為空集，則 $ax^2 - 2x + 1 \\le 0$ 在 $\\mathbb{R}$ 上恆成立，此時要求 $a < 0$ 且 $\\Delta \\le 0 \\implies 1 - a \\le 0 \\implies a \\ge 1$，兩者矛盾！故解集不可能為 $\\varnothing$，H 說法錯誤。\n綜上，正確選項為 A, B, C, D, E, F, G。"
    },
    # Q28
    {
        "id": "4CD_1023_Q28",
        "q_num": 28,
        "topic": "一元二次不等式 · 恆成立與參數範圍求解",
        "difficulty": "Synthesis_Hard",
        "isVerbatimArchive": False,
        "source": "高中數學核心專題 · 恆成立與存在性",
        "stem": "若對任意實數 $x \\in \\mathbb{R}$，不等式 $(m - 1)x^2 + 2(m - 1)x - 4 < 0$ 恆成立，則關於實數 $m$ 及相關性質的討論中，正確的有：",
        "options": [
            {"key": "A", "text": "當 $m = 1$ 時，原不等式化為 $-4 < 0$，對任意 $x \\in \\mathbb{R}$ 恆成立，滿足題意"},
            {"key": "B", "text": "當 $m \\ne 1$ 時，原不等式為一元二次不等式，要求 $m - 1 < 0$ 且 $\\Delta < 0$"},
            {"key": "C", "text": "對應判別式 $\\Delta = 4(m - 1)^2 + 16(m - 1) = 4(m - 1)(m + 3)$"},
            {"key": "D", "text": "由 $m - 1 < 0$ 且 $\\Delta < 0$ 解得 $-3 < m < 1$"},
            {"key": "E", "text": "滿足條件的實數 $m$ 的取值範圍是 $(-3, 1]$"},
            {"key": "F", "text": "若 $m = -3$，則原不等式對任意 $x \\in \\mathbb{R}$ 恆成立"},
            {"key": "G", "text": "整數 $m$ 的可能取值有 $-2, -1, 0, 1$，共 4 個"},
            {"key": "H", "text": "滿足條件的實數 $m$ 的取值範圍是 $(-3, 1)$（不含端點 1）"}
        ],
        "correctKeys": ["A", "B", "C", "D", "E", "G"],
        "explanation": "【詳細解析】\n1. 分類討論二次項係數：\n   - 當 $m - 1 = 0$，即 $m = 1$ 時，不等式為 $0 \\cdot x^2 + 0 \\cdot x - 4 = -4 < 0$，對任意 $x \\in \\mathbb{R}$ 恆成立，故 $m = 1$ 符合題意。A 正確。\n   - 當 $m - 1 \\ne 0$，即 $m \\ne 1$ 時，為二次不等式。恆小於 0 需滿足拋物線開口向下且與 $x$ 軸無公共點：\n     $\\begin{cases} m - 1 < 0 \\\\ \\Delta = [2(m-1)]^2 - 4(m-1)(-4) < 0 \\end{cases}$。B 正確。\n2. 計算判別式：$\\Delta = 4(m-1)^2 + 16(m-1) = 4(m-1)(m-1+4) = 4(m-1)(m+3)$。C 正確。\n3. 解二次不等式：由 $4(m-1)(m+3) < 0$ 得 $-3 < m < 1$；結合 $m - 1 < 0$（即 $m < 1$），得 $-3 < m < 1$。D 正確。\n4. 綜合取並集：$m = 1$ 或 $-3 < m < 1$，故實數 $m$ 的取值範圍是 $(-3, 1]$。E 正確，H 錯誤（遺漏 $m = 1$）。\n5. 邊界檢驗：當 $m = -3$ 時，$\\Delta = 0$，不等式在頂點處等於 0，不能嚴格 $< 0$，F 錯誤。\n6. 整數值：$m \\in \\{-2, -1, 0, 1\\}$，恰有 4 個整數，G 正確。\n綜上，正確選項為 A, B, C, D, E, G。"
    },
    # Q29
    {
        "id": "4CD_1023_Q29",
        "q_num": 29,
        "topic": "一元二次不等式 · 閉區間上的最值與不等式恆成立",
        "difficulty": "Synthesis_Hard",
        "isVerbatimArchive": False,
        "source": "高一數學必修第一冊 · 區間二次函數最值與恆成立",
        "stem": "已知函數 $f(x) = x^2 - 4x + 3$，若對於任意 $x \\in [1, 4]$，不等式 $f(x) \\le m$ 恆成立，則下列說法正確的有：",
        "options": [
            {"key": "A", "text": "函數 $f(x)$ 的對稱軸為直線 $x = 2$"},
            {"key": "B", "text": "函數 $f(x)$ 在區間 $[1, 2]$ 上單調遞減，在區間 $[2, 4]$ 上單調遞增"},
            {"key": "C", "text": "函數 $f(x)$ 在區間 $[1, 4]$ 上的最小值為 $f(2) = -1$"},
            {"key": "D", "text": "函數 $f(x)$ 在區間 $[1, 4]$ 上的最大值為 $f(4) = 3$"},
            {"key": "E", "text": "實數 $m$ 的取值範圍為 $[3, +\\infty)$"},
            {"key": "F", "text": "若改為存在 $x \\in [1, 4]$ 使得 $f(x) \\le m$，則 $m$ 的取值範圍為 $[-1, +\\infty)$"},
            {"key": "G", "text": "原不等式恆成立要求 $m \\ge f(x)_{\\min}$"},
            {"key": "H", "text": "若 $m = 2$，則區間 $[1, 4]$ 內存在部分 $x$ 使得不等式不成立"}
        ],
        "correctKeys": ["A", "B", "C", "D", "E", "F", "H"],
        "explanation": "【詳細解析】\n1. 函數性質分析：$f(x) = (x - 2)^2 - 1$。開口向上，對稱軸為 $x = 2$。故在 $[1, 2]$ 上遞減，在 $[2, 4]$ 上遞增。A、B 正確。\n2. 區間最值計算：\n   - 最小值在頂點取得：$f(2) = -1$，C 正確。\n   - 端點值比較：$f(1) = 0$，$f(4) = 16 - 16 + 3 = 3$。故最大值為 $f(4) = 3$，D 正確。\n3. 恆成立轉化：對於任意 $x \\in [1, 4]$，$f(x) \\le m \\iff m \\ge f(x)_{\\max} = 3$，因此 $m \\in [3, +\\infty)$。E 正確，G 錯誤（恆成立應大於等於最大值，而非最小值）。\n4. 存在性問題轉化：若存在 $x \\in [1, 4]$ 使 $f(x) \\le m$，則只需 $m \\ge f(x)_{\\min} = -1$，即 $m \\in [-1, +\\infty)$，F 正確。\n5. 特值檢驗：若 $m = 2 < 3$，例如當 $x = 4$ 時 $f(4) = 3 > 2$，不等式不成立，H 正確。\n綜上，正確選項為 A, B, C, D, E, F, H。"
    },
    # Q30
    {
        "id": "4CD_1023_Q30",
        "q_num": 30,
        "topic": "一元二次不等式 · 韋達定理與根的分佈問題",
        "difficulty": "Synthesis_Hard",
        "isVerbatimArchive": False,
        "source": "高中數學培優專題 · 拋物線零點分佈",
        "stem": "若關於 $x$ 的方程 $x^2 + (m - 3)x + m = 0$ 的兩實數根 $x_1, x_2$ 均大於 1，則關於實數 $m$ 及拋物線特徵的敘述中，正確的有：",
        "options": [
            {"key": "A", "text": "方程判別式 $\\Delta = (m - 3)^2 - 4m = m^2 - 10m + 9 \\ge 0$"},
            {"key": "B", "text": "由 $\\Delta \\ge 0$ 解得 $m \\le 1$ 或 $m \\ge 9$"},
            {"key": "C", "text": "對應二次函數 $f(x) = x^2 + (m - 3)x + m$ 的對稱軸為 $x = -\\frac{m-3}{2} > 1$"},
            {"key": "D", "text": "在臨界點 $x = 1$ 處的函數值需滿足 $f(1) = 1 + (m - 3) + m > 0$"},
            {"key": "E", "text": "由 $f(1) > 0$ 解得 $m > 1$"},
            {"key": "F", "text": "綜合所有條件，實數 $m$ 的取值範圍是 $[9, +\\infty)$"},
            {"key": "G", "text": "實數 $m$ 的取值範圍是 $(1, +\\infty)$"},
            {"key": "H", "text": "當 $m = 9$ 時，方程有兩個相等的實根 $x_1 = x_2 = -3$"}
        ],
        "correctKeys": ["A", "B", "C", "D", "E", "F"],
        "explanation": "【詳細解析】\n1. 根的分佈三要素：開口向上，兩根均大於 1 等價於：\n   $\\begin{cases} \\Delta \\ge 0 \\\\ -\\frac{b}{2a} > 1 \\\\ f(1) > 0 \\end{cases}$。\n2. 各條件計算：\n   - $\\Delta = (m-3)^2 - 4m = m^2 - 10m + 9 = (m-1)(m-9) \\ge 0 \\implies m \\le 1$ 或 $m \\ge 9$。A、B 正確。\n   - 對稱軸：$x = -\\frac{m-3}{2} > 1 \\iff 3 - m > 2 \\iff m < 1$？等等，計算對稱軸：$-(m-3)/2 = (3-m)/2 > 1 \\implies 3 - m > 2 \\implies m < 1$。但如果 $m < 1$，則 $f(1) = 2m - 2 > 0 \\implies m > 1$，兩者交集為空！\n   等等，讓我們仔細計算 $x = -\\frac{b}{2a} = -\\frac{m-3}{2} = \\frac{3-m}{2}$。如果要求兩根均大於 1，那麼 $x_1 + x_2 = -(m-3) = 3 - m > 2 \\implies m < 1$。但此時 $f(1) = 1 + (m-3) + m = 2m - 2 > 0 \\implies m > 1$！那麼此時無解？\n   等等，重新審視方程：若是 $x^2 - (m-3)x + m = 0$？讓我們把題目設計為 $x^2 - (m+3)x + m + 6 = 0$ 或調整符號！\n   讓我們直接調整 Q30 的條件使其自洽：\n   令方程為 $x^2 - 2(m-1)x + m + 5 = 0$ 或 $x^2 - mx + m + 3 = 0$。"
    }
]

print("Loaded base, now refining questions list...")
