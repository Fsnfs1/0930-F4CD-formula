import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('d:/2627/web+/math_platform/4cd1023.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# Find screen1 (login screen)
s1_start = text.find('id="screen1-face"')
if s1_start != -1:
    s1_end = text.find('id="screen2', s1_start)
    if s1_end == -1:
        s1_end = text.find('id="screen', s1_start + 20)
    print("--- SCREEN 1 ---")
    print(text[s1_start-20:s1_end])

# Also check modalPasswordAuth
mod_pwd = text.find('id="modalPasswordAuth"')
if mod_pwd != -1:
    print("--- MODAL PASSWORD AUTH ---")
    print(text[mod_pwd-20:mod_pwd+800])

# Also check mock / demo buttons in text
print("--- DEMO / MOCK OCCURRENCES ---")
count = 0
for m in re.finditer(r'(demo|mock|模擬|不方便刷臉|不方便)', text, re.IGNORECASE):
    idx = m.start()
    print(text[max(0, idx-50):min(len(text), idx+100)])
    print("-" * 30)
    count += 1
    if count >= 10:
        break
