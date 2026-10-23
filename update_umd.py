with open('d:/2627/web+/math_platform/js/preloaded_faces.js', 'r', encoding='utf-8') as f:
    content = f.read()

old_prefix = 'window.PRELOADED_STUDENT_FACES = {'
new_prefix = '(function(root) {\n  const faces = {'
new_suffix = '  root.PRELOADED_STUDENT_FACES = faces;\n})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : this);\n'

if old_prefix in content:
    content = content.replace(old_prefix, new_prefix)
    if content.endswith('};\n'):
        content = content[:-3] + '};\n' + new_suffix
    elif content.endswith('};'):
        content = content[:-2] + '};\n' + new_suffix

with open('d:/2627/web+/math_platform/js/preloaded_faces.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated preloaded_faces.js with UMD wrapper.')
