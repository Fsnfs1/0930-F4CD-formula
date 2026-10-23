import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('d:/2627/web+/math_platform/js/quiz_engine_1023.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('function startQuiz')
print(text[idx:idx+2500])
