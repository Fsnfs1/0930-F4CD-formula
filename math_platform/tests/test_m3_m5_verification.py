# -*- coding: utf-8 -*-
"""
Verification Script for Milestone 3 & 5 Deliverables
Validates timers.js, quiz_engine.js, leaderboard.js, index.html, style.css
in both static analysis and live Selenium Headless Chrome mobile simulation.
"""

import os
import re
import sys
import time
import socket
import unittest
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JS_DIR = os.path.join(BASE_DIR, 'js')
CSS_DIR = os.path.join(BASE_DIR, 'css')
INDEX_HTML = os.path.join(BASE_DIR, 'index.html')


class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def log_message(self, format, *args):
        pass


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


class TestM3M5Deliverables(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with open(INDEX_HTML, 'r', encoding='utf-8') as f:
            cls.index_html = f.read()

        with open(os.path.join(JS_DIR, 'timers.js'), 'r', encoding='utf-8') as f:
            cls.timers_js = f.read()

        with open(os.path.join(JS_DIR, 'quiz_engine.js'), 'r', encoding='utf-8') as f:
            cls.quiz_engine_js = f.read()

        with open(os.path.join(JS_DIR, 'leaderboard.js'), 'r', encoding='utf-8') as f:
            cls.leaderboard_js = f.read()

        with open(os.path.join(CSS_DIR, 'style.css'), 'r', encoding='utf-8') as f:
            cls.style_css = f.read()

    def test_01_script_tags_in_index_html(self):
        """Verify all required module scripts are included in index.html."""
        modules = [
            'js/roster.js',
            'js/face_auth.js',
            'js/persistence.js',
            'js/questions_g10.js',
            'js/questions_g11.js',
            'js/timers.js',
            'js/quiz_engine.js',
            'js/leaderboard.js'
        ]
        for mod in modules:
            self.assertIn(f'src="{mod}"', self.index_html, f"Missing script tag for {mod}")

    def test_02_mathjax_global_rule_compliance(self):
        """Verify MathJax in <head> and typesetPromise in quiz_engine.js."""
        self.assertIn('<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>', self.index_html)
        self.assertIn('MathJax.typesetPromise', self.quiz_engine_js)

    def test_03_strict_desensitization_audit(self):
        """Verify 100% absence of sensitive terms across all owned files."""
        forbidden = ["大測", "四校聯考", "原解答題", "原題考點", "ESCOLA SUN WAH"]
        files_to_check = {
            "timers.js": self.timers_js,
            "quiz_engine.js": self.quiz_engine_js,
            "leaderboard.js": self.leaderboard_js,
            "index.html": self.index_html,
            "style.css": self.style_css
        }
        for fname, content in files_to_check.items():
            for word in forbidden:
                self.assertNotIn(word, content, f"Sensitive term '{word}' leaked in {fname}")

    def test_04_timers_module_api(self):
        """Verify Timers module structure and constants."""
        self.assertIn('EYE_PROTECTION_THRESHOLD_SECONDS = 2400', self.timers_js)
        self.assertIn('EYE_PROTECTION_REST_SECONDS = 300', self.timers_js)
        self.assertIn('ANTI_CHEAT_INTERVAL_SECONDS = 900', self.timers_js)
        self.assertIn('REAUTH_SIMILARITY_THRESHOLD = 0.85', self.timers_js)
        self.assertIn('onQuestionAnswered', self.timers_js)
        self.assertIn('triggerEyeProtection', self.timers_js)
        self.assertIn('triggerReauth', self.timers_js)
        self.assertIn('resolveReauth', self.timers_js)

    def test_05_quiz_engine_8_choose_5_step_ordering(self):
        """Verify QuizEngine step ordering implementation."""
        self.assertIn('step_order', self.quiz_engine_js)
        self.assertIn('renderStepOrderingUI', self.quiz_engine_js)
        self.assertIn('slotsCountBadge', self.quiz_engine_js)
        self.assertIn('targetSlotsList', self.quiz_engine_js)
        self.assertIn('candidatePoolList', self.quiz_engine_js)
        self.assertIn('distractorReason', self.quiz_engine_js)
        self.assertIn('shuffleArray', self.quiz_engine_js)

    def test_06_leaderboard_module_api(self):
        """Verify Leaderboard module structure and polling logic."""
        self.assertIn('AKfycbyPw0okf43HwFuX6ur5uWy5GSbQnBtx8G-kfQnT9cCbU44xYuuYHV96Ih994wHouBNu', self.leaderboard_js)
        self.assertIn('startPolling', self.leaderboard_js)
        self.assertIn('generateFallbackMock', self.leaderboard_js)
        self.assertIn('renderLeaderboardUI', self.leaderboard_js)
        self.assertIn('sticky-my-rank', self.leaderboard_js)

    def test_07_css_mobile_first_rules(self):
        """Verify CSS mobile viewport and touch rules."""
        self.assertIn('min-height: 100dvh;', self.style_css)
        self.assertIn('--touch-min-height: 48px;', self.style_css)
        self.assertIn('.math-scroll-wrapper', self.style_css)
        self.assertIn('.target-slot-item', self.style_css)
        self.assertIn('.candidate-step-card', self.style_css)
        self.assertIn('.podium-container', self.style_css)
        self.assertIn('.sticky-my-rank', self.style_css)


def run_mobile_browser_m3_m5_test():
    """Live mobile Selenium Headless Chrome test of Quiz Engine, Timers, and Leaderboard."""
    print("\n--- Starting Live Mobile Browser M3_M5 Verification ---")
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import Select

    port = find_free_port()
    server = HTTPServer(('127.0.0.1', port), CustomHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()

    chrome_opts = Options()
    chrome_opts.add_argument('--headless=new')
    chrome_opts.add_argument('--no-sandbox')
    chrome_opts.add_argument('--disable-dev-shm-usage')
    chrome_opts.add_argument('--disable-gpu')
    chrome_opts.add_argument('--window-size=390,844')
    mobile_emulation = {"deviceName": "iPhone 14"}
    chrome_opts.add_experimental_option("mobileEmulation", mobile_emulation)

    driver = webdriver.Chrome(options=chrome_opts)
    try:
        url = f"http://127.0.0.1:{port}/index.html"
        driver.get(url)
        time.sleep(1.0)

        # 1. Login with demo mode as 4D 23 (劉付穎)
        Select(driver.find_element(By.ID, "classSelect")).select_by_value("4D")
        Select(driver.find_element(By.ID, "studentSelect")).select_by_value("23")
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        driver.find_element(By.ID, "btnConfirmIdentity").click()
        time.sleep(0.5)

        # In Screen 2 (First register) or Screen 3 (Secondary login)
        s2 = driver.find_element(By.ID, "screen2-register")
        s3 = driver.find_element(By.ID, "screen3-reauth")
        if "active" in s2.get_attribute("class"):
            driver.find_element(By.ID, "btnCaptureFace").click()
            time.sleep(0.5)
            driver.find_element(By.ID, "btnConfirmAndLock").click()
            time.sleep(0.8)
        elif "active" in s3.get_attribute("class"):
            driver.find_element(By.ID, "btnReauthVerify").click()
            time.sleep(1.2)

        # Now on Screen 4 Dashboard
        s4 = driver.find_element(By.ID, "screen4-dashboard")
        assert "active" in s4.get_attribute("class"), "Must be on Screen 4"
        print("✓ Verified Screen 4 Dashboard active.")

        # 2. Test Leaderboard navigation & display
        btn_board = driver.find_element(By.ID, "btnViewLeaderboard")
        btn_board.click()
        time.sleep(0.5)

        s8 = driver.find_element(By.ID, "screen8-leaderboard")
        assert "active" in s8.get_attribute("class"), "Screen 8 Leaderboard must activate"
        for entry in driver.get_log('browser'):
            print("Browser log:", entry)
        print("s8 text:", repr(s8.text))
        assert "4D" in s8.text
        assert "23" in s8.text
        print("✓ Verified Screen 8 Leaderboard display with current student.")

        # Return to Dashboard
        driver.find_element(By.ID, "btnBackToDashboard").click()
        time.sleep(0.3)
        assert "active" in s4.get_attribute("class")
        print("✓ Returned to Dashboard.")

        # 3. Start Quiz Practice -> Screen 5
        btn_start = driver.find_element(By.ID, "btnStartPractice")
        btn_start.click()
        time.sleep(0.5)

        s5 = driver.find_element(By.ID, "screen5-quiz")
        assert "active" in s5.get_attribute("class"), "Screen 5 Quiz must activate"
        print("✓ Verified Screen 5 Interactive Quiz active.")

        # Check question prompt and HUD
        progress_text = driver.find_element(By.ID, "quizProgressText").text
        assert "第 1 /" in progress_text
        print(f"✓ Quiz HUD initialized: {progress_text}")

        # 4. Test Eye Protection Timer trigger via JS API
        driver.execute_script("window.AntiCheatTimers.triggerEyeProtection();")
        time.sleep(0.5)
        s6 = driver.find_element(By.ID, "screen6-eyecare")
        assert "active" in s6.get_attribute("class")
        cd_text = driver.find_element(By.ID, "eyeCareCountdown").text
        assert "05:00" in cd_text or "04:59" in cd_text
        print(f"✓ Eye Protection overlay triggered successfully with countdown: {cd_text}")

        driver.execute_script("window.AntiCheatTimers.endEyeProtection();")
        time.sleep(0.5)
        assert "active" not in s6.get_attribute("class")
        print("✓ Eye Protection rest ended and practice screen unlocked.")

        # 5. Test Periodic Re-auth Freeze trigger via JS API
        driver.execute_script("window.AntiCheatTimers.triggerReauth();")
        time.sleep(0.5)
        s7 = driver.find_element(By.ID, "screen7-freeze")
        assert "active" in s7.get_attribute("class")
        print("✓ 15-min Anti-Cheating Freeze overlay activated.")

        btn_unlock = driver.find_element(By.ID, "btnReauthUnlock")
        btn_unlock.click()
        time.sleep(0.8)
        assert "active" not in s7.get_attribute("class")
        print("✓ Face re-auth unlock passed and practice screen unfreezed.")

        print("\n🎉 ALL LIVE MOBILE BROWSER M3_M5 CHECKS PASSED SUCCESSFULLY!")
    finally:
        driver.quit()
        server.shutdown()


if __name__ == '__main__':
    # Run unit assertions
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestM3M5Deliverables)
    res = unittest.TextTestRunner(verbosity=2).run(suite)
    if not res.wasSuccessful():
        sys.exit(1)

    # Run mobile browser verification
    run_mobile_browser_m3_m5_test()
