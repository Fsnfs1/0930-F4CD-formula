import os, time, socket, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

PROJECT_ROOT = r"d:\2627\WEB+\math_platform"

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_ROOT, **kwargs)

with socket.socket() as s:
    s.bind(('127.0.0.1', 0))
    port = s.getsockname()[1]

httpd = ThreadingHTTPServer(('127.0.0.1', port), CustomHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

opts = Options()
opts.add_argument('--headless=new')
opts.add_argument('--window-size=1280,960')
opts.add_argument('--use-fake-ui-for-media-stream')
opts.add_argument('--use-fake-device-for-media-stream')
driver = webdriver.Chrome(options=opts)
try:
    driver.get(f'http://127.0.0.1:{port}/auth_gate.html')
    time.sleep(1)
    with open('dump_page.html', 'w', encoding='utf-8') as f:
        f.write(driver.page_source)
    print("Page dumped successfully. Length:", len(driver.page_source))
finally:
    driver.quit()
    httpd.shutdown()
