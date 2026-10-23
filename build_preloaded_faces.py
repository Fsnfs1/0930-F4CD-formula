import urllib.request, json, os, re

url = 'https://script.google.com/macros/s/AKfycbwNAQNxmNsNa8rWGp48qnYRrjA2WFLGIzKqSel2r8MilRp59s3ZfBJjeKXIrUfoS-Zp-g/exec'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Fetched {len(data)} rows from live Google Sheet")
except Exception as e:
    print('Failed to fetch from sheet:', e)
    data = []

# Fallback: also load from raw_data_latest.json
if os.path.exists('d:/2627/web+/math_platform/raw_data_latest.json'):
    backup = json.load(open('d:/2627/web+/math_platform/raw_data_latest.json', encoding='utf-8'))
    data = data + backup

# Load roster names
roster_names = {}
if os.path.exists('d:/2627/web+/math_platform/js/roster.js'):
    txt = open('d:/2627/web+/math_platform/js/roster.js', encoding='utf-8').read()
    pattern = re.compile(r'id:\s*(\d+),\s*name:\s*["\']([^"\']+)["\'],\s*grade:\s*\d+,\s*classID:\s*["\']([^"\']+)["\']')
    for m in pattern.finditer(txt):
        sid = m.group(1)
        name = m.group(2)
        cid = m.group(3)
        roster_names[f"{cid}_{sid}"] = name

students_map = {}
for r in data:
    did = str(r.get('dateID', ''))
    if '|TS:' in did and not did.startswith('FACE|') and not did.startswith('PWD|'):
        cid = str(r.get('classID', '')).strip().upper()
        sid = r.get('studentID')
        if not cid or sid is None:
            continue
        try:
            sid = int(sid)
        except:
            continue
        ts = 0
        if '|TS:' in did:
            try:
                ts = int(did.split('|TS:')[1].split('|')[0])
            except:
                pass
        k = f"{cid}_{sid}"
        if k not in students_map or ts > students_map[k]['ts']:
            vec_part = did.split('|TS:')[0]
            vals = [float(x.strip()) for x in vec_part.split(',') if x.strip()]
            if len(vals) == 128:
                sname = roster_names.get(k, f"學生 {sid}")
                students_map[k] = {
                    'classID': cid,
                    'studentID': sid,
                    'name': sname,
                    'vector': vals,
                    'ts': ts
                }

print('Compiled unique student faces count:', len(students_map))

output_path = 'd:/2627/web+/math_platform/js/preloaded_faces.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('/**\n * preloaded_faces.js - Pre-synchronized Facial Vectors from 1010 Platform\n')
    f.write(' * Contains all registered student face vectors from Google Sheets\n */\n\n')
    f.write('window.PRELOADED_STUDENT_FACES = ')
    json.dump(students_map, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print('Saved to', output_path)
