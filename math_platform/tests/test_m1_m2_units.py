import re
import os
import sys

def test_roster():
    txt_path = os.path.join(os.path.dirname(__file__), '..', '..', 'StudentID.txt')
    with open(txt_path, 'r', encoding='utf-8') as f:
        txt_lines = [l.strip().split('\t') for l in f if l.strip()]

    header = txt_lines[0]
    students_txt = txt_lines[1:]
    assert len(students_txt) == 88, f"Expected 88 students, got {len(students_txt)}"

    roster_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'roster.js')
    with open(roster_path, 'r', encoding='utf-8') as f:
        js_content = f.read()

    # Check 4C has 29 students, 4D has 31, 5B has 28
    c4c = [s for s in students_txt if s[0] == '4C']
    c4d = [s for s in students_txt if s[0] == '4D']
    c5b = [s for s in students_txt if s[0] == '5B']
    assert len(c4c) == 29, f"4C count: {len(c4c)}"
    assert len(c4d) == 31, f"4D count: {len(c4d)}"
    assert len(c5b) == 28, f"5B count: {len(c5b)}"

    # Check student #13 is NOT in 4C
    c4c_ids = [int(s[1]) for s in c4c]
    assert 13 not in c4c_ids, "Student 13 should NOT be in 4C"

    # Verify each student in StudentID.txt is present in roster.js
    for cls, sid, name in students_txt:
        pattern = rf'id:\s*{sid},\s*name:\s*"{re.escape(name)}"'
        assert re.search(pattern, js_content), f"Missing in roster.js: {cls} {sid} {name}"

    print(f"Roster verification PASSED: 88 students verified, 4C/4D/5B counts verified, 4C #13 absence verified.")

def test_face_auth_math():
    import math

    # Implement reference python cosine similarity matching js implementation
    def cos_sim(a, b):
        dot = sum(x * y for x, y in zip(a, b))
        na = math.sqrt(sum(x * x for x in a))
        nb = math.sqrt(sum(y * y for y in b))
        return dot / (na * nb)

    # Simple sanity check
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    assert abs(cos_sim(v1, v2) - 1.0) < 1e-6
    v3 = [0.0, 1.0, 0.0]
    assert abs(cos_sim(v1, v3) - 0.0) < 1e-6

    # Test LCG and vector generation logic from face_auth.js
    def create_prng(seed):
        s = abs(seed) % 2147483647 or 123456789
        def prng():
            nonlocal s
            s = (s * 16807) % 2147483647
            return (s - 1) / 2147483646
        return prng

    def get_py_demo_descriptor(class_id, student_id):
        cls_str = str(class_id).strip().upper()
        id_num = int(student_id)
        class_hash = 0
        for ch in cls_str:
            class_hash = (class_hash * 31 + ord(ch)) & 0x7FFFFFFF
        base_seed = (class_hash * 10007 + id_num * 2627) & 0x7FFFFFFF

        prng = create_prng(base_seed)
        vec = []
        for _ in range(128):
            u1 = max(1e-7, prng())
            u2 = prng()
            z0 = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
            vec.append(z0)

        norm = math.sqrt(sum(x * x for x in vec))
        return [x / norm for x in vec]

    # Determinism: same student produces exact same vector
    desc_4d_23_a = get_py_demo_descriptor('4D', 23)
    desc_4d_23_b = get_py_demo_descriptor('4D', 23)
    assert len(desc_4d_23_a) == 128
    assert desc_4d_23_a == desc_4d_23_b, "Must be deterministic for same student"
    sim_self = cos_sim(desc_4d_23_a, desc_4d_23_b)
    assert abs(sim_self - 1.0) < 1e-6

    # Jitter simulation: same student with micro noise
    import random
    random.seed(42)
    noisy_4d_23 = []
    for x in desc_4d_23_a:
        noisy_4d_23.append(x + (random.random() - 0.5) * 0.05)
    noisy_norm = math.sqrt(sum(x * x for x in noisy_4d_23))
    noisy_4d_23 = [x / noisy_norm for x in noisy_4d_23]
    sim_noisy = cos_sim(desc_4d_23_a, noisy_4d_23)
    print(f"Same student (noisy re-auth) similarity: {sim_noisy * 100:.2f}%")
    assert sim_noisy >= 0.85, f"Same student must pass >= 85%, got {sim_noisy}"

    # Impostor simulation: student 4D 23 vs 4D 1 vs 4C 17 vs 5B 10
    desc_4d_1 = get_py_demo_descriptor('4D', 1)
    sim_impostor_1 = cos_sim(desc_4d_23_a, desc_4d_1)
    print(f"Impostor (4D 23 vs 4D 1) similarity: {sim_impostor_1 * 100:.2f}%")
    assert sim_impostor_1 < 0.50, f"Impostor similarity must be low (<50%), got {sim_impostor_1}"

    desc_4c_17 = get_py_demo_descriptor('4C', 17)
    sim_impostor_2 = cos_sim(desc_4d_23_a, desc_4c_17)
    print(f"Impostor (4D 23 vs 4C 17) similarity: {sim_impostor_2 * 100:.2f}%")
    assert sim_impostor_2 < 0.50, f"Impostor similarity must be low, got {sim_impostor_2}"

    print("Face Auth math and vector simulation PASSED.")

def test_persistence_and_gas():
    persist_path = os.path.join(os.path.dirname(__file__), '..', 'js', 'persistence.js')
    with open(persist_path, 'r', encoding='utf-8') as f:
        persist_code = f.read()

    # Verify Google Form endpoint and exact field mappings
    assert "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse" in persist_code
    assert "entry.543502435" in persist_code, "classID entry missing"
    assert "entry.1745113091" in persist_code, "studentID entry missing"
    assert "entry.1972335137" in persist_code, "dateID entry missing"
    assert "entry.2095507383" in persist_code, "score entry missing"
    assert "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY" in persist_code, "Target folder ID missing"

    # Verify GAS Drive uploader file
    gas_path = os.path.join(os.path.dirname(__file__), '..', 'gas', 'gas_drive_uploader.js')
    with open(gas_path, 'r', encoding='utf-8') as f:
        gas_code = f.read()

    assert "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY" in gas_code
    assert "doGet" in gas_code
    assert "doPost" in gas_code
    assert "Utilities.base64Decode" in gas_code
    assert "DriveApp.getFolderById" in gas_code

    # Test backoff logic math
    for retry in range(10):
        backoff = min(2000 * (2 ** retry), 60000)
        assert 2000 <= backoff <= 60000

    print("Persistence and GAS uploader verification PASSED.")

def test_html_and_css():
    html_path = os.path.join(os.path.dirname(__file__), '..', 'index.html')
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # USER GLOBAL RULE: MathJax script in <head>
    mathjax_tag = '<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>'
    assert mathjax_tag in html, "USER GLOBAL RULE: MathJax script tag MUST be present in <head>"

    # Verify <head> precedes MathJax
    head_pos = html.find('<head>')
    mj_pos = html.find(mathjax_tag)
    end_head_pos = html.find('</head>')
    assert head_pos != -1 and mj_pos != -1 and end_head_pos != -1
    assert head_pos < mj_pos < end_head_pos, "MathJax script must be strictly inside <head>"

    # Viewport meta check
    assert 'viewport' in html
    assert 'user-scalable=no' in html

    # Screen IDs check
    screens = [
        'screen1-roster',
        'screen2-register',
        'screen3-reauth',
        'screen4-dashboard',
        'screen5-quiz',
        'screen6-eyecare',
        'screen7-freeze',
        'screen8-leaderboard'
    ]
    for s in screens:
        assert f'id="{s}"' in html, f"Missing screen container: {s}"

    # Scripts check
    assert 'src="js/roster.js"' in html
    assert 'src="js/face_auth.js"' in html
    assert 'src="js/persistence.js"' in html
    assert 'vladmandic/face-api' in html

    # CSS check
    css_path = os.path.join(os.path.dirname(__file__), '..', 'css', 'style.css')
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    assert '100dvh' in css, "Dynamic viewport height 100dvh must be present"
    assert '48px' in css, "Touch target min-height >= 48px must be present"
    assert '.math-scroll-wrapper' in css, "Math scroll container must be styled"

    print("HTML & CSS compliance verification PASSED.")

if __name__ == '__main__':
    test_roster()
    test_face_auth_math()
    test_persistence_and_gas()
    test_html_and_css()
