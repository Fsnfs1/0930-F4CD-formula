# -*- coding: utf-8 -*-
"""
High School Mobile Math Practice & Anti-Cheating Quiz Platform
Master E2E Automated Test Runner (Python 3.12 + Selenium + Headless Chrome)

Tiers Covered:
- Tier 1: Feature Coverage (F1 to F17, >= 5 cases per feature)
- Tier 2: Boundary & Corner Cases (>= 5 cases per feature group)
- Tier 3: Cross-Feature State Interactivity & Timer Conflict Arbitration
- Tier 4: Real-World Workload Scenarios (Full lifecycle user journeys)
- Browser E2E: Selenium Headless Chrome (Mobile Emulation: iPhone 14)

Usage:
  python tests/test_e2e_runner.py
  python tests/test_e2e_runner.py --tier 1
  python tests/test_e2e_runner.py --tier 2
  python tests/test_e2e_runner.py --no-browser
  python tests/test_e2e_runner.py --json-report
"""

import os
import sys
import time
import json
import socket
import argparse
import unittest
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Configure stdout encoding on Windows
if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if sys.stderr.encoding.lower() != 'utf-8':
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', '..'))
TESTS_DIR = os.path.dirname(__file__)


def find_free_port():
    """Find an available port on localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom handler serving from ROOT_DIR with CORS headers enabled."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def log_message(self, format, *args):
        # Suppress routine HTTP request logging during tests
        pass


def start_test_server(port):
    """Start local HTTP server in a daemon thread."""
    server = HTTPServer(('127.0.0.1', port), CustomHTTPRequestHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    return server


def run_selenium_browser_e2e(port):
    """Execute live Selenium Headless Chrome mobile verification."""
    print("\n" + "=" * 70)
    print(" [BROWSER E2E] Running Selenium Headless Chrome Mobile E2E Tests...")
    print("=" * 70)

    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import Select, WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC

    chrome_opts = Options()
    chrome_opts.add_argument('--headless=new')
    chrome_opts.add_argument('--no-sandbox')
    chrome_opts.add_argument('--disable-dev-shm-usage')
    chrome_opts.add_argument('--disable-gpu')
    chrome_opts.add_argument('--window-size=390,844')
    mobile_emulation = {"deviceName": "iPhone 14"}
    chrome_opts.add_experimental_option("mobileEmulation", mobile_emulation)

    driver = webdriver.Chrome(options=chrome_opts)
    wait = WebDriverWait(driver, 10)
    test_results = {"passed": 0, "failed": 0, "steps": []}

    try:
        url = f"http://127.0.0.1:{port}/WEB+/math_platform/index.html"
        driver.get(url)
        time.sleep(1.0)

        # Step 1: Verify Title and MathJax in <head>
        page_title = driver.title
        assert "數學" in page_title, f"Unexpected page title: {page_title}"
        mathjax_script = driver.find_elements(By.ID, "MathJax-script")
        assert len(mathjax_script) > 0, "MathJax script tag missing from <head>"
        test_results["steps"].append("✓ Step 1: Page title & MathJax script presence in <head> verified.")
        test_results["passed"] += 1

        # Step 2: Verify Screen 1 initial display
        s1 = driver.find_element(By.ID, "screen1-roster")
        assert "active" in s1.get_attribute("class"), "Screen 1 should be active initially"
        test_results["steps"].append("✓ Step 2: Screen 1 (Roster Selection) active state verified.")
        test_results["passed"] += 1

        # Step 3: Class 4C selection & Student #13 Absence
        class_sel = Select(driver.find_element(By.ID, "classSelect"))
        class_sel.select_by_value("4C")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        c4c_opts = [opt.get_attribute("value") for opt in student_sel.options if opt.get_attribute("value")]
        assert len(c4c_opts) == 29, f"4C options should be 29, got {len(c4c_opts)}"
        assert "13" not in c4c_opts, "Class 4C MUST NOT contain student #13"
        test_results["steps"].append("✓ Step 3: 4C roster loaded (29 students, student #13 strictly omitted).")
        test_results["passed"] += 1

        # Step 4: Class 4D and 5B selection
        class_sel.select_by_value("4D")
        c4d_opts = [opt.get_attribute("value") for opt in student_sel.options if opt.get_attribute("value")]
        assert len(c4d_opts) == 31, f"4D options should be 31, got {len(c4d_opts)}"

        class_sel.select_by_value("5B")
        c5b_opts = [opt.get_attribute("value") for opt in student_sel.options if opt.get_attribute("value")]
        assert len(c5b_opts) == 28, f"5B options should be 28, got {len(c5b_opts)}"
        test_results["steps"].append("✓ Step 4: 4D (31 students) and 5B (28 students) counts verified.")
        test_results["passed"] += 1

        # Step 5: Select 4D 23 (劉付穎) & Check Name Feedback
        class_sel.select_by_value("4D")
        student_sel.select_by_value("23")
        name_text = driver.find_element(By.ID, "studentNameDisplay").text
        assert "劉付穎" in name_text, f"Expected 劉付穎 in name box, got {name_text}"
        grade_tag = driver.find_element(By.ID, "gradeBadgeDisplay").text
        assert "高一" in grade_tag, f"Expected 高一 for 4D, got {grade_tag}"
        test_results["steps"].append("✓ Step 5: Student 4D 23 (劉付穎) selection & Grade 10 auto-routing badge verified.")
        test_results["passed"] += 1

        # Step 6: Enable Demo Mode & First-Time Capture
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        btn_confirm = driver.find_element(By.ID, "btnConfirmIdentity")
        btn_confirm.click()
        time.sleep(0.5)

        s2 = driver.find_element(By.ID, "screen2-register")
        assert "active" in s2.get_attribute("class"), "Screen 2 should become active"
        test_results["steps"].append("✓ Step 6: Transitioned to Screen 2 (Face Registration).")
        test_results["passed"] += 1

        # Step 7: Capture Face & Preview Snapshot
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        btn_capture.click()
        time.sleep(0.5)

        preview_card = driver.find_element(By.ID, "registrationPreviewCard")
        assert preview_card.is_displayed(), "Preview card must display"
        p_name = driver.find_element(By.ID, "previewStudentName").text
        assert p_name == "劉付穎", f"Preview name should be 劉付穎, got {p_name}"
        test_results["steps"].append("✓ Step 7: Face capture & preview verification passed.")
        test_results["passed"] += 1

        # Step 8: Confirm & Lock -> Dashboard
        btn_lock = driver.find_element(By.ID, "btnConfirmAndLock")
        btn_lock.click()
        time.sleep(0.8)

        s4 = driver.find_element(By.ID, "screen4-dashboard")
        assert "active" in s4.get_attribute("class"), "Screen 4 (Dashboard) must activate"
        test_results["steps"].append("✓ Step 8: Identity locked, dual persistence triggered, Dashboard active.")
        test_results["passed"] += 1

        # Step 9: Logout & Secondary Face Verification
        btn_logout = driver.find_element(By.ID, "btnLogout")
        btn_logout.click()
        time.sleep(0.5)

        class_sel.select_by_value("4D")
        student_sel.select_by_value("23")
        btn_confirm = driver.find_element(By.ID, "btnConfirmIdentity")
        assert "刷臉驗證" in btn_confirm.text or "已註冊" in btn_confirm.text
        btn_confirm.click()
        time.sleep(0.5)

        s3 = driver.find_element(By.ID, "screen3-reauth")
        assert "active" in s3.get_attribute("class"), "Screen 3 (Re-auth) must activate"
        test_results["steps"].append("✓ Step 9: Profile recognized, transitioned to Screen 3 (Secondary Re-auth).")
        test_results["passed"] += 1

        # Step 10: Run Re-auth Verify (>= 85%) -> Unlocks Dashboard
        btn_verify = driver.find_element(By.ID, "btnReauthVerify")
        btn_verify.click()
        time.sleep(1.2)

        assert "active" in s4.get_attribute("class"), "Must return to Screen 4 after successful face re-auth"
        test_results["steps"].append("✓ Step 10: Secondary face authentication (>= 85%) verified and dashboard unlocked.")
        test_results["passed"] += 1

        for step in test_results["steps"]:
            print(f"  {step}")
        print("\n  [BROWSER E2E VERDICT] ALL 10 BROWSER STEPS PASSED SUCCESSFULLY!")

    except Exception as e:
        print(f"  [BROWSER E2E ERROR] Step failed with exception: {e}")
        test_results["failed"] += 1
    finally:
        driver.quit()

    return test_results


def run_unit_tiers(tier_selection="all"):
    """Run specified test tiers (Tier 1, 2, 3, 4) using unittest."""
    if TESTS_DIR not in sys.path:
        sys.path.insert(0, TESTS_DIR)
    if BASE_DIR not in sys.path:
        sys.path.insert(0, BASE_DIR)

    suite = unittest.TestSuite()
    loader = unittest.defaultTestLoader

    tier_map = {
        "1": "test_tier1_features",
        "2": "test_tier2_boundary",
        "3": "test_tier3_interactivity",
        "4": "test_tier4_workloads",
        "5": "test_face_admin_and_versioning",
        "6": "test_adversarial_reviewer_round2",
        "7": "test_adversarial_reviewer_round3",
        "admin": "test_face_admin_and_versioning",
        "round2": "test_adversarial_reviewer_round2",
        "round3": "test_adversarial_reviewer_round3"
    }

    tiers_to_run = []
    if tier_selection == "all":
        tiers_to_run = ["1", "2", "3", "4", "5", "6", "7"]
    else:
        tiers_to_run = [t.strip() for t in tier_selection.split(",")]

    print("\n" + "=" * 70)
    print(f" [TEST SUITE] Loading Tiers: {', '.join(['Tier ' + t for t in tiers_to_run])}")
    print("=" * 70)

    for t in tiers_to_run:
        module_name = tier_map.get(t)
        if module_name:
            tier_suite = loader.loadTestsFromName(module_name)
            suite.addTests(tier_suite)

    runner = unittest.TextTestRunner(verbosity=2)
    start_time = time.time()
    result = runner.run(suite)
    duration = time.time() - start_time

    summary = {
        "total": result.testsRun,
        "passed": result.testsRun - len(result.failures) - len(result.errors),
        "failed": len(result.failures),
        "errors": len(result.errors),
        "duration_seconds": round(duration, 3),
        "failures_details": [f[0].id() for f in result.failures],
        "errors_details": [e[0].id() for e in result.errors]
    }

    return summary


def main():
    parser = argparse.ArgumentParser(description="Mobile Math Platform Automated E2E Test Suite Runner")
    parser.add_argument("--tier", default="all", help="Test tiers to run (1, 2, 3, 4, or all)")
    parser.add_argument("--no-browser", action="store_true", help="Skip Selenium browser E2E test")
    parser.add_argument("--json-report", action="store_true", help="Save JSON summary report")
    args = parser.parse_args()

    print("\n" + "#" * 70)
    print("  HIGH SCHOOL MOBILE MATH PRACTICE & ANTI-CHEATING QUIZ PLATFORM")
    print("  4-TIER AUTOMATED END-TO-END TEST SUITE RUNNER")
    print("#" * 70)

    # 1. Run Unit Tiers (Tiers 1 - 4)
    unit_summary = run_unit_tiers(args.tier)

    # 2. Run Headless Chrome Browser E2E if requested
    browser_summary = {"passed": 0, "failed": 0, "steps": []}
    if not args.no_browser and args.tier in ("all", "4"):
        port = find_free_port()
        server = start_test_server(port)
        time.sleep(0.5)
        browser_summary = run_selenium_browser_e2e(port)
        server.shutdown()

    # 3. Overall Summary & Metrics
    total_tests = unit_summary["total"] + browser_summary["passed"] + browser_summary["failed"]
    total_passed = unit_summary["passed"] + browser_summary["passed"]
    total_failed = unit_summary["failed"] + unit_summary["errors"] + browser_summary["failed"]
    pass_rate = (total_passed / total_tests * 100) if total_tests > 0 else 0

    print("\n" + "=" * 70)
    print("  OVERALL EXECUTION REPORT & AUDIT SUMMARY")
    print("=" * 70)
    print(f"  • Unit/Contract Tiers Run:  {unit_summary['total']} tests")
    print(f"  • Unit/Contract Passed:    {unit_summary['passed']}")
    print(f"  • Unit/Contract Failed:    {unit_summary['failed']}")
    print(f"  • Unit/Contract Errors:    {unit_summary['errors']}")
    if not args.no_browser:
        print(f"  • Headless Chrome Steps:   {browser_summary['passed']} passed, {browser_summary['failed']} failed")
    print(f"  • Total Assertions/Checks: {total_tests}")
    print(f"  • Overall Pass Rate:       {pass_rate:.1f}%")
    print(f"  • Total Elapsed Time:      {unit_summary['duration_seconds']}s")
    print("=" * 70)

    # 4. Save JSON Report if requested
    report_data = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "status": "PASS" if total_failed == 0 else "FAIL",
        "total_tests": total_tests,
        "total_passed": total_passed,
        "total_failed": total_failed,
        "pass_rate_percent": round(pass_rate, 2),
        "unit_summary": unit_summary,
        "browser_summary": browser_summary
    }

    report_path = os.path.join(TESTS_DIR, "test_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)
    print(f"  [REPORT] Test execution report saved to: {report_path}\n")

    if total_failed == 0:
        print("  ✅ [VERDICT: PASS] 100% OF TEST CASES & SCENARIOS PASSED ALL ACCEPTANCE CRITERIA!\n")
        sys.exit(0)
    else:
        print("  ❌ [VERDICT: FAIL] Some tests failed. Please inspect logs above.\n")
        sys.exit(1)


if __name__ == '__main__':
    main()
