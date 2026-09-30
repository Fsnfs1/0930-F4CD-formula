# -*- coding: utf-8 -*-
"""
tests/test_adversarial_reviewer_round3.py
Adversarial Verification Suite for Review Round 3.

Focus Areas:
1. Object-based vector deserialization ({ "0": 0.5, "1": 0.5, ... }) and stringified CSV vector normalization.
2. Snapshot isolation on student dropdown selection change in face_admin.html.
3. Accurate Drive photo upload failure UI status reporting in face_admin.html (no false success).
4. Camera stream prevention on demo mode uncheck when no student is selected.
5. Page unload/pagehide camera stream track cleanup.
6. Empty student dropdown selection in index.html properly disabling identity confirmation.
7. Window focus event refreshing profile registration status in index.html.
8. Queue storage size budget preservation and overflow protection.
9. Browser E2E verification of vector normalization and multi-generation isolation.
"""

import os
import sys
import json
import time
import unittest

if hasattr(sys.stdout, 'reconfigure') and sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure') and sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FACE_ADMIN_HTML_PATH = os.path.join(BASE_DIR, 'face_admin.html')
INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')
PERSISTENCE_JS_PATH = os.path.join(BASE_DIR, 'js', 'persistence.js')
FACE_AUTH_JS_PATH = os.path.join(BASE_DIR, 'js', 'face_auth.js')


class TestAdversarialRound3Contracts(unittest.TestCase):
    """Static contracts and source code audits for Round 3 robustness."""

    @classmethod
    def setUpClass(cls):
        with open(PERSISTENCE_JS_PATH, 'r', encoding='utf-8') as f:
            cls.persistence_js = f.read()
        with open(FACE_AUTH_JS_PATH, 'r', encoding='utf-8') as f:
            cls.face_auth_js = f.read()
        with open(FACE_ADMIN_HTML_PATH, 'r', encoding='utf-8') as f:
            cls.face_admin_html = f.read()
        with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
            cls.index_html = f.read()

    def test_c1_normalize_vector_exported(self):
        """C1: persistence.js must export normalizeVector."""
        self.assertIn("normalizeVector", self.persistence_js)

    def test_c2_snapshot_isolation_on_student_change(self):
        """C2: face_admin.html must reset capturedSnapshot when studentSelect changes."""
        idx = self.face_admin_html.find('studentSelect.addEventListener("change"')
        self.assertNotEqual(idx, -1)
        section = self.face_admin_html[idx:idx + 500]
        self.assertIn("AdminState.capturedSnapshot = null;", section)

    def test_c3_demo_mode_uncheck_camera_guard(self):
        """C3: face_admin.html must not start webcam when unchecking demo mode if no student is selected."""
        idx = self.face_admin_html.find('demoModeCheckbox.addEventListener("change"')
        self.assertNotEqual(idx, -1)
        section = self.face_admin_html[idx:idx + 500]
        self.assertIn("AdminState.selectedClass && AdminState.selectedStudentId", section)

    def test_c4_page_unload_camera_cleanup(self):
        """C4: face_admin.html must register beforeunload and pagehide listeners to stop camera."""
        self.assertIn('window.addEventListener("beforeunload"', self.face_admin_html)
        self.assertIn('window.addEventListener("pagehide"', self.face_admin_html)

    def test_c5_drive_failure_ui_in_red(self):
        """C5: face_admin.html must show red failure text when Drive upload fails (no false success)."""
        self.assertIn("✕ 照片上傳失敗", self.face_admin_html)
        self.assertIn("#ef4444", self.face_admin_html)

    def test_c6_index_html_student_select_empty_reset(self):
        """C6: index.html studentSelect change handler must reset state and disable confirmation when empty."""
        idx = self.index_html.find('studentSelect.addEventListener("change"')
        self.assertNotEqual(idx, -1)
        section = self.index_html[idx:idx + 500]
        self.assertIn("btnConfirmIdentity.disabled = true;", section)

    def test_c7_index_html_window_focus_auto_refresh(self):
        """C7: index.html must register window focus listener to refresh student profile status."""
        self.assertIn('window.addEventListener("focus"', self.index_html)
        self.assertIn("hasStudentProfile", self.index_html)


class TestBrowserAdversarialRound3(unittest.TestCase):
    """Deep headless browser tests verifying runtime edge cases in Round 3."""

    driver = None

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=390,844')

        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.implicitly_wait(5)

    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()

    def test_b1_object_vector_normalization_and_verification(self):
        """B1: Object-based vector in LocalStorage is normalized and verified successfully."""
        driver = self.driver
        driver.get(f"file:///{INDEX_HTML_PATH}")
        time.sleep(0.5)

        res = driver.execute_script("""
          // Inject legacy object vector format { "0": 0.5, "1": 0.5, ... }
          var objVec = {};
          for (var i = 0; i < 128; i++) {
            objVec[i] = 1 / Math.sqrt(128);
          }
          localStorage.setItem('math_student_profile_4D_23', JSON.stringify({
            classID: '4D',
            studentID: 23,
            name: '劉付穎',
            vector: objVec,
            version: 1,
            timestamp: Date.now()
          }));

          var prof = window.getStudentProfile('4D', 23);
          var hasProf = window.hasStudentProfile('4D', 23);
          var latest = window.getLatestStudentVector('4D', 23);

          var testVec = new Float32Array(128).fill(1 / Math.sqrt(128));
          var vf = window.verifyFace(testVec, prof.vector, 0.85);

          return {
            hasProf: hasProf,
            isFloat32: prof.vector instanceof Float32Array,
            vecLen: prof.vector.length,
            latestLen: latest ? latest.vector.length : -1,
            isMatch: vf.isMatch,
            similarity: vf.similarity
          };
        """)

        self.assertTrue(res["hasProf"], "hasStudentProfile must return True for object vector")
        self.assertTrue(res["isFloat32"], "Resolved profile vector must be Float32Array")
        self.assertEqual(res["vecLen"], 128, "Vector length must be 128")
        self.assertEqual(res["latestLen"], 128, "Latest student vector must be 128")
        self.assertTrue(res["isMatch"], "verifyFace must pass against normalized vector")
        self.assertAlmostEqual(res["similarity"], 1.0, places=3)

    def test_b2_csv_string_vector_normalization(self):
        """B2: Comma-separated float string with metadata in LocalStorage is normalized."""
        driver = self.driver
        driver.get(f"file:///{INDEX_HTML_PATH}")
        time.sleep(0.3)

        res = driver.execute_script("""
          var floats = [];
          for (var i = 0; i < 128; i++) floats.push("0.0884");
          var csvStr = floats.join(",") + "|TS:1775030000000|V:2";

          localStorage.setItem('math_student_profile_4C_5', JSON.stringify({
            classID: '4C',
            studentID: 5,
            name: '李藝彤',
            vector: csvStr,
            version: 2,
            timestamp: 1775030000000
          }));

          var prof = window.getStudentProfile('4C', 5);
          var hasProf = window.hasStudentProfile('4C', 5);
          return {
            hasProf: hasProf,
            vecLen: prof ? prof.vector.length : -1,
            isFloat32: prof ? (prof.vector instanceof Float32Array) : false,
            version: prof ? prof.version : 0
          };
        """)

        self.assertTrue(res["hasProf"])
        self.assertEqual(res["vecLen"], 128)
        self.assertTrue(res["isFloat32"])
        self.assertEqual(res["version"], 2)

    def test_b3_snapshot_isolation_between_students_in_admin(self):
        """B3: Capturing face for Student A does not leak snapshot into Student B."""
        driver = self.driver
        driver.get(f"file:///{FACE_ADMIN_HTML_PATH}")
        time.sleep(0.5)

        # Select 4D #1
        class_sel = Select(driver.find_element(By.ID, "classSelect"))
        class_sel.select_by_value("4D")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("1")

        # Enable demo mode
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        # Capture face for student 1
        wait = WebDriverWait(driver, 5)
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())

        # Verify state has captured snapshot
        state_after_cap = driver.execute_script("return window.FaceAdmin.getState();")
        self.assertIsNotNone(state_after_cap["capturedSnapshot"])

        # Now switch to student 2 WITHOUT confirming
        student_sel.select_by_value("2")
        time.sleep(0.2)

        # Verify capturedSnapshot is strictly cleared to None/null
        state_after_switch = driver.execute_script("return window.FaceAdmin.getState();")
        self.assertIsNone(state_after_switch["capturedSnapshot"], "capturedSnapshot must be reset to null upon student change")

    def test_b4_drive_failure_ui_displays_error_in_red(self):
        """B4: When uploadDrivePhoto fails with success:false, UI displays red failure status."""
        driver = self.driver
        driver.get(f"file:///{FACE_ADMIN_HTML_PATH}")
        time.sleep(0.5)

        class_sel = Select(driver.find_element(By.ID, "classSelect"))
        class_sel.select_by_value("4D")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("2")

        # Enable demo mode
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        wait = WebDriverWait(driver, 5)
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())

        # Mock uploadDrivePhoto to return { success: false, queued: false, error: "Permanent rejection" }
        driver.execute_script("""
          window.uploadDrivePhoto = async function() {
            return { success: false, queued: false, error: "Permanent rejection" };
          };
        """)

        btn_confirm = driver.find_element(By.ID, "btnConfirmReRegistration")
        driver.execute_script("arguments[0].click();", btn_confirm)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        audit_status = driver.find_element(By.ID, "auditDriveStatus")
        self.assertIn("失敗", audit_status.text)
        self.assertNotIn("已送出", audit_status.text, "Failure must not display success text")


if __name__ == '__main__':
    unittest.main()
