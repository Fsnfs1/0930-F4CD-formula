# -*- coding: utf-8 -*-
"""
tests/test_adversarial_reviewer_round2.py
Adversarial Verification Suite for Review Round 2.

Focus Areas:
1. GAS Drive HTTP 200 with {success: false} application error handling in uploadDrivePhoto and flushQueue.
2. startCamera stream cleanup preventing dangling MediaStream tracks on repeated calls.
3. Dropdown reset and demo mode camera shutdown in face_admin.html.
4. History deduplication and 10-item bounding in saveStudentProfile.
5. Exact timestamp, version, and folderId synchronization in index.html registration.
6. Browser E2E multi-round consecutive re-registration (v1 -> v2 -> v3) across face_admin.html and index.html.
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


class TestAdversarialUnitContract(unittest.TestCase):
    """Unit and static contracts for Round 2 robustness fixes."""

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

    def test_upload_drive_photo_checks_data_success(self):
        """A1: uploadDrivePhoto must inspect data.success to avoid treating GAS HTTP 200 errors as successful."""
        self.assertIn("data.success === false", self.persistence_js)

    def test_flush_queue_checks_data_success_for_drive(self):
        """A2: OfflineSyncManager.flushQueue must inspect data.success so failed Drive uploads are preserved for retry."""
        flush_idx = self.persistence_js.find("flushQueue: async function")
        self.assertNotEqual(flush_idx, -1)
        flush_section = self.persistence_js[flush_idx:flush_idx + 2500]
        self.assertIn("data.success === false", flush_section)

    def test_start_camera_stops_existing_active_stream(self):
        """A3: startCamera must invoke stopCamera on activeMediaStream to prevent leaking video tracks."""
        start_idx = self.face_auth_js.find("function startCamera")
        self.assertNotEqual(start_idx, -1)
        start_section = self.face_auth_js[start_idx:start_idx + 800]
        self.assertIn("stopCamera(videoElement)", start_section)

    def test_face_admin_dropdown_reset_and_demo_camera_stop(self):
        """A4: face_admin.html must stop camera when resetting student dropdown and toggling demo mode."""
        self.assertIn("window.stopCamera(webcamVideo)", self.face_admin_html)
        # Check student dropdown empty value handling
        self.assertIn("!this.value", self.face_admin_html)

    def test_index_html_initial_registration_photo_timestamp(self):
        """A5: index.html registration must pass timestamp, version, and folderId to uploadDrivePhoto."""
        up_idx = self.index_html.find("window.uploadDrivePhoto")
        self.assertNotEqual(up_idx, -1)
        up_section = self.index_html[up_idx:up_idx + 400]
        self.assertIn("timestamp: regTimestamp", up_section)
        self.assertIn("version: 1", up_section)
        self.assertIn("folderId:", up_section)

    def test_history_deduplication_and_bounding_in_persistence(self):
        """A6: saveStudentProfile must deduplicate history by version and cap at 10 items."""
        self.assertIn("seenVersions", self.persistence_js)
        self.assertIn("historyList.slice(-10)", self.persistence_js)


class TestBrowserAdversarialE2E(unittest.TestCase):
    """End-to-end browser execution attacking edge cases and failure paths."""

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

    def test_gas_application_error_fallback_to_queue_in_browser(self):
        """A7: When GAS returns HTTP 200 with {success: false}, uploadDrivePhoto enqueues and UI card shows queued."""
        driver = self.driver
        admin_url = f"file:///{FACE_ADMIN_HTML_PATH}"
        driver.get(admin_url)
        time.sleep(0.5)

        # Mock window.fetch for DRIVE channel to return HTTP 200 with { success: false, error: "Quota exceeded" }
        res = driver.execute_script("""
          var originalFetch = window.fetch;
          window.fetch = async function(url, options) {
            if (typeof url === 'string' && url.includes('exec')) {
              return {
                ok: true,
                status: 200,
                json: async function() {
                  return { success: false, error: "Mock GAS storage quota exceeded" };
                }
              };
            }
            return originalFetch.apply(this, arguments);
          };

          // Test calling uploadDrivePhoto directly with non-placeholder URL
          var uploadRes = await window.uploadDrivePhoto({
            classID: "4D",
            studentID: 5,
            studentName: "余浩賢",
            imageBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
            gasUrl: "https://script.google.com/macros/s/AKfy_mock_real_uploader/exec"
          });

          var queue = window.OfflineSyncManager.getQueue();
          return {
            uploadRes: uploadRes,
            queueLen: queue.length,
            lastItemChannel: queue.length > 0 ? queue[queue.length - 1].channel : null
          };
        """)

        self.assertFalse(res["uploadRes"]["success"], "Upload should return success: false on GAS application error")
        self.assertTrue(res["uploadRes"]["queued"], "Upload must be queued on GAS application error")
        self.assertGreaterEqual(res["queueLen"], 1, "Queue must contain the enqueued item")
        self.assertEqual(res["lastItemChannel"], "DRIVE")

    def test_multi_generation_reregistration_isolation(self):
        """A8: Re-registering across 3 generations (v1 -> v2 -> v3) strictly enforces latest version and rejects older."""
        driver = self.driver
        admin_url = f"file:///{FACE_ADMIN_HTML_PATH}"
        index_url = f"file:///{INDEX_HTML_PATH}"

        driver.get(admin_url)
        time.sleep(0.5)

        # Clean storage for 4C student #5 (李藝彤)
        driver.execute_script("localStorage.removeItem('math_student_profile_4C_5');")

        # Select 4C 5
        class_sel = Select(driver.find_element(By.ID, "classSelect"))
        class_sel.select_by_value("4C")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("5")

        # Enable demo mode
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        wait = WebDriverWait(driver, 5)

        # Round 1: Initial Register (v1)
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())
        btn_confirm = driver.find_element(By.ID, "btnConfirmReRegistration")
        driver.execute_script("arguments[0].click();", btn_confirm)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        # Round 2: Re-register (v2)
        driver.find_element(By.ID, "btnResetForNext").click()
        class_sel.select_by_value("4C")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("5")
        time.sleep(0.1)
        driver.execute_script("arguments[0].click();", driver.find_element(By.ID, "btnCaptureFace"))
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())
        driver.execute_script("arguments[0].click();", driver.find_element(By.ID, "btnConfirmReRegistration"))
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        # Round 3: Re-register (v3)
        driver.find_element(By.ID, "btnResetForNext").click()
        class_sel.select_by_value("4C")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("5")
        time.sleep(0.1)
        driver.execute_script("arguments[0].click();", driver.find_element(By.ID, "btnCaptureFace"))
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())
        driver.execute_script("arguments[0].click();", driver.find_element(By.ID, "btnConfirmReRegistration"))
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        # Inspect persisted profile
        raw = driver.execute_script("return localStorage.getItem('math_student_profile_4C_5');")
        data = json.loads(raw)
        self.assertEqual(data["version"], 3, "Active version must be 3")
        self.assertEqual(len(data["history"]), 2, "History must contain exactly 2 archived versions (v1 and v2)")
        history_versions = [h["version"] for h in data["history"]]
        self.assertEqual(history_versions, [1, 2], "History versions must be [1, 2] without duplicates")

        # Now test verification in index.html
        driver.get(index_url)
        time.sleep(0.5)

        test_results = driver.execute_script("""
          var prof = window.getStudentProfile('4C', 5);
          var v1Vec = window.getDemoDescriptor('4C', 5, false, 1);
          var v2Vec = window.getDemoDescriptor('4C', 5, false, 2);
          var v3Vec = window.getDemoDescriptor('4C', 5, false, 3);
          return {
            v1_match: window.verifyFace(v1Vec, prof.vector, 0.85).isMatch,
            v2_match: window.verifyFace(v2Vec, prof.vector, 0.85).isMatch,
            v3_match: window.verifyFace(v3Vec, prof.vector, 0.85).isMatch,
            profVersion: prof.version
          };
        """)

        self.assertFalse(test_results["v1_match"], "Historical v1 must FAIL against active v3")
        self.assertFalse(test_results["v2_match"], "Historical v2 must FAIL against active v3")
        self.assertTrue(test_results["v3_match"], "Latest v3 must PASS")
        self.assertEqual(test_results["profVersion"], 3)


if __name__ == '__main__':
    unittest.main()
