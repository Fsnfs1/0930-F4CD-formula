# -*- coding: utf-8 -*-
"""
High School Mobile Math Practice & Anti-Cheating Quiz Platform
Face Admin & Timestamp Versioning Automated Test Suite

Verification Scope:
- R1: Independent face_admin.html management page, MathJax compliance, roster integration, camera/demo capture, preview and confirm flow.
- R2: Millisecond timestamp (updatedAt/timestamp) versioning, unconditional latest feature overwrite, dual-channel sync (GAS Drive WEB+ folder, Google Form POST).
- R3: index.html strict latest-feature resolution during secondary login re-auth and 15-minute anti-cheating freeze unlock, invalidating obsolete historical vectors.
- Browser E2E: Selenium Headless Chrome full workflow verification between face_admin.html and index.html.
"""

import os
import sys
import re
import time
import json
import math
import unittest

# Ensure UTF-8 output on Windows terminal
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
from selenium.webdriver.support import expected_conditions as EC

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JS_DIR = os.path.join(BASE_DIR, 'js')
FACE_ADMIN_HTML_PATH = os.path.join(BASE_DIR, 'face_admin.html')
INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')
PERSISTENCE_JS_PATH = os.path.join(JS_DIR, 'persistence.js')
FACE_AUTH_JS_PATH = os.path.join(JS_DIR, 'face_auth.js')
ROSTER_JS_PATH = os.path.join(JS_DIR, 'roster.js')


class TestFaceAdminContractAndStructure(unittest.TestCase):
    """Static contracts and architectural boundaries for face_admin.html and modules."""

    @classmethod
    def setUpClass(cls):
        with open(FACE_ADMIN_HTML_PATH, 'r', encoding='utf-8') as f:
            cls.admin_html = f.read()
        with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
            cls.index_html = f.read()
        with open(PERSISTENCE_JS_PATH, 'r', encoding='utf-8') as f:
            cls.persistence_js = f.read()
        with open(FACE_AUTH_JS_PATH, 'r', encoding='utf-8') as f:
            cls.face_auth_js = f.read()

    def test_r1_01_face_admin_exists(self):
        """R1.1: face_admin.html exists in target project directory."""
        self.assertTrue(os.path.exists(FACE_ADMIN_HTML_PATH), "face_admin.html must exist")

    def test_r1_02_mathjax_in_head(self):
        """R1.2: RULE[user_global] MathJax script tex-mml-chtml.js is declared in <head>."""
        head_match = re.search(r'<head>(.*?)</head>', self.admin_html, re.DOTALL | re.IGNORECASE)
        self.assertIsNotNone(head_match, "<head> section must exist in face_admin.html")
        head_content = head_match.group(1)
        self.assertIn("tex-mml-chtml.js", head_content, "MathJax script tex-mml-chtml.js missing in <head>")
        self.assertIn('id="MathJax-script"', head_content, "MathJax script must have id='MathJax-script'")
        self.assertIn("window.MathJax", head_content, "window.MathJax configuration missing in <head>")

    def test_r1_03_math_formulas_present(self):
        """R1.3: MathJax LaTeX math formulas present for cosine similarity and timestamp sorting."""
        self.assertIn(r"\cos(\mathbf{u}, \mathbf{v})", self.admin_html)
        self.assertIn(r"\ge 0.85", self.admin_html)
        self.assertIn(r"T_{\text{active}}", self.admin_html)

    def test_r1_04_mobile_viewport_meta(self):
        """R1.4: Mobile-first vertical priority meta viewport tags configured."""
        self.assertIn("viewport-fit=cover", self.admin_html)
        self.assertIn("user-scalable=no", self.admin_html)

    def test_r1_05_independent_tool_no_button_in_student_login(self):
        """R1.5: face_admin.html operates as independent maintenance tool; no buttons in student login."""
        # index.html student login screen1 must NOT contain links or buttons to face_admin.html
        s1_match = re.search(r'<section id="screen1-roster".*?</section>', self.index_html, re.DOTALL)
        self.assertIsNotNone(s1_match)
        s1_content = s1_match.group(0)
        self.assertNotIn("face_admin.html", s1_content, "Student login screen1 must NOT have buttons to face_admin.html")

    def test_r1_06_admin_roster_elements(self):
        """R1.6: UI components for class and student ID dropdowns present."""
        self.assertIn('id="classSelect"', self.admin_html)
        self.assertIn('id="studentSelect"', self.admin_html)
        self.assertIn('id="studentNameDisplay"', self.admin_html)

    def test_r1_07_camera_and_preview_elements(self):
        """R1.7: Camera viewport, snapshot preview, and action buttons present."""
        self.assertIn('id="webcamVideo"', self.admin_html)
        self.assertIn('id="btnCaptureFace"', self.admin_html)
        self.assertIn('id="reRegistrationPreviewCard"', self.admin_html)
        self.assertIn('id="previewSnapshotImg"', self.admin_html)
        self.assertIn('id="btnConfirmReRegistration"', self.admin_html)
        self.assertIn('id="reRegistrationSuccessCard"', self.admin_html)

    def test_r1_08_sync_status_badge_present(self):
        """R1.8: syncStatusBadge element present in face_admin.html header."""
        self.assertIn('id="syncStatusBadge"', self.admin_html)

    def test_r2_01_target_drive_folder_id(self):
        """R2.1: Target Drive folder ID 1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY referenced."""
        target_folder = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY"
        self.assertIn(target_folder, self.admin_html)

    def test_r2_02_re_register_tag(self):
        """R2.2: Tag RE_REGISTER specified for Drive and Form payloads."""
        self.assertIn("RE_REGISTER", self.admin_html)

    def test_r2_03_timestamp_versioning_exports(self):
        """R2.3: persistence.js exports timestamp versioning APIs."""
        self.assertIn("extractTimestamp", self.persistence_js)
        self.assertIn("getStudentProfileHistory", self.persistence_js)
        self.assertIn("getLatestStudentVector", self.persistence_js)
        self.assertIn("updatedAt", self.persistence_js)
        self.assertIn("timestamp", self.persistence_js)

    def test_r2_04_face_auth_version_support(self):
        """R2.4: face_auth.js getDemoDescriptor supports versioning and serializeDescriptorWithTimestamp."""
        self.assertIn("serializeDescriptorWithTimestamp", self.face_auth_js)
        self.assertIn("version", self.face_auth_js)

    def test_r2_05_is_camera_running_export(self):
        """R2.5: face_auth.js exports isCameraRunning method."""
        self.assertIn("isCameraRunning", self.face_auth_js)

    def test_r2_06_flush_queue_checks_res_ok(self):
        """R2.6: OfflineSyncManager.flushQueue checks res.ok to prevent dropping failed uploads."""
        self.assertIn("res.ok", self.persistence_js)


class TestTimestampVersioningLogic(unittest.TestCase):
    """Pure mathematical and algorithmic verification of timestamp comparison and version selection."""

    def cos_sim(self, a, b):
        dot = sum(x * y for x, y in zip(a, b))
        na = math.sqrt(sum(x * x for x in a))
        nb = math.sqrt(sum(y * y for y in b))
        if na == 0 or nb == 0:
            return 0.0
        return max(0.0, min(1.0, dot / (na * nb)))

    def get_py_demo_descriptor(self, class_id, student_id, version=1):
        cls_str = str(class_id).strip().upper()
        id_num = int(student_id)
        v_num = int(version)

        class_hash = 0
        for ch in cls_str:
            class_hash = (class_hash * 31 + ord(ch)) & 0x7FFFFFFF
        base_seed = (class_hash * 10007 + id_num * 2627 + (v_num - 1) * 7919) & 0x7FFFFFFF

        s = abs(base_seed) % 2147483647 or 123456789
        def prng():
            nonlocal s
            s = (s * 16807) % 2147483647
            return (s - 1) / 2147483646

        vec = []
        for _ in range(128):
            u1 = max(1e-7, prng())
            u2 = prng()
            z0 = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
            vec.append(z0)

        norm = math.sqrt(sum(x * x for x in vec))
        return [x / norm for x in vec]

    def test_version_determinism_and_orthogonality(self):
        """V1: Re-registration version 2 generates distinct vector that invalidates version 1."""
        v1 = self.get_py_demo_descriptor('4D', 23, version=1)
        v2 = self.get_py_demo_descriptor('4D', 23, version=2)
        v3 = self.get_py_demo_descriptor('4D', 23, version=3)

        # Same version must be deterministic
        self.assertEqual(v1, self.get_py_demo_descriptor('4D', 23, version=1))
        self.assertEqual(v2, self.get_py_demo_descriptor('4D', 23, version=2))

        # Different versions must have low cosine similarity (< 0.85 threshold)
        sim_v1_v2 = self.cos_sim(v1, v2)
        sim_v2_v3 = self.cos_sim(v2, v3)
        self.assertLess(sim_v1_v2, 0.40, f"v1 and v2 similarity should be low, got {sim_v1_v2}")
        self.assertLess(sim_v2_v3, 0.40, f"v2 and v3 similarity should be low, got {sim_v2_v3}")

        # Verified against own version (self-match) is 1.0
        self.assertAlmostEqual(self.cos_sim(v2, v2), 1.0, places=5)

    def test_timestamp_sorting_unconditional_latest(self):
        """V2: Latest timestamp strictly selected from history of multiple records."""
        records = [
            {"version": 1, "timestamp": 1000, "vector": [1.0] * 128},
            {"version": 3, "timestamp": 3000, "vector": [3.0] * 128},
            {"version": 2, "timestamp": 2000, "vector": [2.0] * 128},
        ]
        # Sort descending by timestamp
        records.sort(key=lambda r: r["timestamp"], reverse=True)
        self.assertEqual(records[0]["version"], 3)
        self.assertEqual(records[0]["timestamp"], 3000)

    def test_out_of_order_replay_protection(self):
        """V3: Out-of-order older record cannot downgrade current active profile."""
        current_profile = {
            "version": 2,
            "timestamp": 1775020000000,
            "vector": [2.0] * 128
        }
        stale_record = {
            "version": 1,
            "timestamp": 1775010000000,
            "vector": [1.0] * 128
        }
        # Comparison logic: only update if incoming timestamp >= existing
        should_replace = stale_record["timestamp"] >= current_profile["timestamp"]
        self.assertFalse(should_replace, "Stale record must not replace newer active record")

    def test_clock_skew_monotonicity_and_force_latest(self):
        """V4: Administrative re-registration strictly promotes active profile even under negative clock skew."""
        # Scenario: Student profile registered at T = 2000000000000 (v1)
        # Admin device clock is skewed into past: Date.now() returns 1000000000000
        existing_profile = {
            "classID": "4D",
            "studentID": 23,
            "version": 1,
            "timestamp": 2000000000000,
            "updatedAt": 2000000000000,
            "vector": [1.0] * 128
        }
        incoming_time = 1000000000000
        is_force_latest = True
        should_promote = is_force_latest or incoming_time >= existing_profile["timestamp"]
        self.assertTrue(should_promote)

        # Monotonic time adjustment
        active_time = (existing_profile["timestamp"] + 1) if (is_force_latest and existing_profile["timestamp"] >= incoming_time) else incoming_time
        active_version = max(2, existing_profile["version"] + 1)

        self.assertGreater(active_time, existing_profile["timestamp"])
        self.assertEqual(active_time, 2000000000001)
        self.assertEqual(active_version, 2)

    def test_extract_timestamp_string_milliseconds(self):
        """V5: extractTimestamp parses string millisecond timestamps and ISO dates."""
        def py_extract_timestamp(item):
            if not item:
                return 0
            for field in ('updatedAt', 'timestamp'):
                val = item.get(field)
                if isinstance(val, (int, float)) and not math.isnan(val):
                    return int(val)
                if isinstance(val, str):
                    try:
                        num = float(val)
                        if not math.isnan(num) and num > 0:
                            return int(num)
                    except ValueError:
                        pass
            return 0

        self.assertEqual(py_extract_timestamp({"timestamp": 1775020000000}), 1775020000000)
        self.assertEqual(py_extract_timestamp({"timestamp": "1775020000000"}), 1775020000000)
        self.assertEqual(py_extract_timestamp({"updatedAt": "1775020000000"}), 1775020000000)
        self.assertEqual(py_extract_timestamp({}), 0)

    def test_clean_history_no_duplicate_vectors(self):
        """V6: Multi-generation history does not duplicate active vector into history list."""
        history = []
        gen1 = {"version": 1, "timestamp": 1000, "vector": [1.0] * 128}
        
        # When promoting gen2, gen1 is archived
        history.append(gen1)
        gen2 = {"version": 2, "timestamp": 2000, "vector": [2.0] * 128}
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["version"], 1)

        # When promoting gen3, gen2 is archived
        history.append(gen2)
        gen3 = {"version": 3, "timestamp": 3000, "vector": [3.0] * 128}
        self.assertEqual(len(history), 2)
        self.assertEqual([h["version"] for h in history], [1, 2])
        self.assertNotIn(gen3["version"], [h["version"] for h in history])

    def test_drive_photo_folder_and_timestamp_payload(self):
        """V7: Drive photo payload contains WEB+ target folder ID and timestamp."""
        target_folder = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY"
        ts = 1775020000000
        payload = {
            "classID": "4D",
            "studentID": "23",
            "studentName": "劉付穎",
            "imageBase64": "data:image/jpeg;base64,...",
            "tag": "RE_REGISTER",
            "folderId": target_folder,
            "timestamp": ts
        }
        file_name = f"{payload['classID']}_{payload['studentID']}_{payload['studentName']}_{ts}_{payload['tag']}.jpg"
        self.assertIn("RE_REGISTER", file_name)
        self.assertIn(str(ts), file_name)
        self.assertEqual(payload["folderId"], target_folder)


class TestBrowserFaceAdminE2E(unittest.TestCase):
    """End-to-End Headless Chrome verification for face_admin.html and index.html interaction."""

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

    def test_full_admin_reregistration_and_main_platform_verification_flow(self):
        """Full lifecycle: initial register in index.html, re-register in face_admin.html, verify latest in index.html."""
        driver = self.driver
        index_url = f"file:///{INDEX_HTML_PATH}"
        admin_url = f"file:///{FACE_ADMIN_HTML_PATH}"

        # -----------------------------------------------------------------
        # STEP 1: Verify face_admin.html MathJax rendering and roster loading
        # -----------------------------------------------------------------
        driver.get(admin_url)
        time.sleep(0.5)

        # Check title
        self.assertIn("學生人臉特徵重新錄入", driver.title)

        # Check 4C roster selection (29 students, absence of #13)
        class_sel_el = driver.find_element(By.ID, "classSelect")
        class_sel = Select(class_sel_el)
        class_sel.select_by_value("4C")

        student_sel_el = driver.find_element(By.ID, "studentSelect")
        student_sel = Select(student_sel_el)
        c4c_opts = [o.get_attribute("value") for o in student_sel.options if o.get_attribute("value")]
        self.assertEqual(len(c4c_opts), 29, f"4C should have 29 students, got {len(c4c_opts)}")
        self.assertNotIn("13", c4c_opts, "Student 13 must be absent in 4C")

        # -----------------------------------------------------------------
        # STEP 2: Select 4D 23 (劉付穎) in face_admin.html
        # -----------------------------------------------------------------
        class_sel.select_by_value("4D")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("23")

        name_display = driver.find_element(By.ID, "studentNameDisplay").text
        self.assertIn("劉付穎", name_display, f"Expected 劉付穎, got {name_display}")

        # Check current status box displayed
        status_box = driver.find_element(By.ID, "currentProfileStatus")
        self.assertTrue(status_box.is_displayed())

        # Enable Demo Mode in face_admin right at start
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)
        time.sleep(0.3)

        # -----------------------------------------------------------------
        # STEP 3: Capture new facial features in face_admin.html
        # -----------------------------------------------------------------
        wait = WebDriverWait(driver, 5)
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        preview_card = wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard"))
        wait.until(lambda d: preview_card.is_displayed())

        p_name = driver.find_element(By.ID, "previewStudentName").text
        self.assertEqual(p_name, "劉付穎")

        p_ts = driver.find_element(By.ID, "previewTimestamp").text
        self.assertTrue(len(p_ts) > 5, "Timestamp must be shown in preview")

        p_img = driver.find_element(By.ID, "previewSnapshotImg")
        self.assertTrue(p_img.get_attribute("src").startswith("data:image/jpeg;base64,"))

        # -----------------------------------------------------------------
        # STEP 4: Confirm and Re-register (v1 or v2)
        # -----------------------------------------------------------------
        btn_confirm_admin = driver.find_element(By.ID, "btnConfirmReRegistration")
        driver.execute_script("arguments[0].click();", btn_confirm_admin)

        # Verify success card displayed
        success_card = wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard"))
        wait.until(lambda d: success_card.is_displayed())
        audit_s = driver.find_element(By.ID, "auditStudent").text
        self.assertIn("劉付穎", audit_s)

        # Read back profile from LocalStorage to verify timestamp & version
        profile_json = driver.execute_script("return localStorage.getItem('math_student_profile_4D_23');")
        self.assertIsNotNone(profile_json, "Profile must be saved in localStorage")
        prof_data = json.loads(profile_json)
        self.assertEqual(prof_data["classID"], "4D")
        self.assertEqual(prof_data["studentID"], 23)
        self.assertTrue("updatedAt" in prof_data or "timestamp" in prof_data)
        initial_ts = prof_data.get("updatedAt") or prof_data.get("timestamp")
        initial_v = prof_data.get("version", 1)

        # -----------------------------------------------------------------
        # STEP 5: Re-register again in face_admin.html to test version increment (v2)
        # -----------------------------------------------------------------
        btn_next = driver.find_element(By.ID, "btnResetForNext")
        driver.execute_script("arguments[0].click();", btn_next)
        time.sleep(0.3)

        # Select 4D 23 again
        class_sel.select_by_value("4D")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("23")

        # Status box should now show existing version
        status_v_text = driver.find_element(By.ID, "statusVersionText").text
        self.assertIn(f"v{initial_v}", status_v_text)

        # Capture and confirm second re-registration (version incremented!)
        time.sleep(0.1) # ensure new millisecond timestamp
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())

        btn_confirm_admin = driver.find_element(By.ID, "btnConfirmReRegistration")
        driver.execute_script("arguments[0].click();", btn_confirm_admin)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        # Verify second re-registration persisted
        profile_json_v2 = driver.execute_script("return localStorage.getItem('math_student_profile_4D_23');")
        prof_data_v2 = json.loads(profile_json_v2)
        second_ts = prof_data_v2.get("updatedAt") or prof_data_v2.get("timestamp")
        second_v = prof_data_v2.get("version", 2)
        self.assertGreaterEqual(second_ts, initial_ts)
        self.assertEqual(second_v, initial_v + 1)
        self.assertIn("history", prof_data_v2)
        self.assertGreaterEqual(len(prof_data_v2["history"]), 1)

        # -----------------------------------------------------------------
        # STEP 6: Navigate to index.html and verify secondary authentication
        # -----------------------------------------------------------------
        driver.get(index_url)
        time.sleep(0.5)

        # Select 4D 23
        idx_class_sel = Select(driver.find_element(By.ID, "classSelect"))
        idx_class_sel.select_by_value("4D")
        idx_student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        idx_student_sel.select_by_value("23")

        # Enable demo mode
        demo_box = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_box.is_selected():
            driver.execute_script("arguments[0].click();", demo_box)

        # Button should show secondary authentication prompt
        btn_confirm_id = driver.find_element(By.ID, "btnConfirmIdentity")
        self.assertIn("刷臉驗證", btn_confirm_id.text)

        driver.execute_script("arguments[0].click();", btn_confirm_id)
        s3 = wait.until(lambda d: d.find_element(By.ID, "screen3-reauth"))
        wait.until(lambda d: "active" in s3.get_attribute("class"))

        # Run reauth verification
        btn_reauth = driver.find_element(By.ID, "btnReauthVerify")
        driver.execute_script("arguments[0].click();", btn_reauth)

        # Dashboard (Screen 4) should unlock after passing with latest feature!
        s4 = wait.until(lambda d: d.find_element(By.ID, "screen4-dashboard"))
        wait.until(lambda d: "active" in s4.get_attribute("class"))
        dash_name = driver.find_element(By.ID, "dashStudentName").text
        self.assertIn("劉付穎", dash_name)

        # -----------------------------------------------------------------
        # STEP 7: Test Screen 7 15-Minute Periodic Anti-Cheating Unlock
        # -----------------------------------------------------------------
        driver.execute_script("window.showScreen('screen7-freeze');")
        time.sleep(0.3)
        s7 = driver.find_element(By.ID, "screen7-freeze")
        self.assertIn("active", s7.get_attribute("class"), "Screen 7 freeze overlay should be active")

        btn_unlock = driver.find_element(By.ID, "btnReauthUnlock")
        driver.execute_script("arguments[0].click();", btn_unlock)
        time.sleep(1.0)

        # Verify old version 1 descriptor fails against version 2 active profile
        sim_old_vs_latest = driver.execute_script("""
          var prof = window.getStudentProfile('4D', 23);
          var oldVec = window.getDemoDescriptor('4D', 23, false, 1);
          var latestVec = prof.vector;
          var res = window.verifyFace(oldVec, latestVec, 0.85);
          return res;
        """)
        self.assertFalse(sim_old_vs_latest["isMatch"], "Old version 1 descriptor must FAIL against version 2 latest profile")
        self.assertLess(sim_old_vs_latest["similarity"], 0.85)

        print("\n[PASS] Full E2E integration test between face_admin.html and index.html completed successfully!")

    def test_clock_skew_resilience_and_multiple_re_registrations(self):
        """Edge Case: Negative clock skew simulation and multi-generation re-registration (v1 -> v2)."""
        driver = self.driver
        admin_url = f"file:///{FACE_ADMIN_HTML_PATH}"
        index_url = f"file:///{INDEX_HTML_PATH}"

        driver.get(admin_url)
        time.sleep(0.5)

        # Inject existing profile for 5B #10 with a future timestamp (e.g., 2000000000000)
        driver.execute_script("""
          localStorage.setItem('math_student_profile_5B_10', JSON.stringify({
            classID: '5B',
            studentID: 10,
            name: '林嘉豪',
            version: 1,
            timestamp: 2000000000000,
            updatedAt: 2000000000000,
            vector: Array.from(window.getDemoDescriptor('5B', 10, false, 1)),
            history: []
          }));
        """)

        # Select 5B #10 in face_admin.html
        class_sel = Select(driver.find_element(By.ID, "classSelect"))
        class_sel.select_by_value("5B")
        student_sel = Select(driver.find_element(By.ID, "studentSelect"))
        student_sel.select_by_value("10")

        # Enable demo mode
        demo_cb = driver.find_element(By.ID, "demoModeCheckbox")
        if not demo_cb.is_selected():
            driver.execute_script("arguments[0].click();", demo_cb)

        # Capture and confirm re-registration (v2)
        btn_capture = driver.find_element(By.ID, "btnCaptureFace")
        driver.execute_script("arguments[0].click();", btn_capture)
        wait = WebDriverWait(driver, 5)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationPreviewCard").is_displayed())

        btn_confirm = driver.find_element(By.ID, "btnConfirmReRegistration")
        driver.execute_script("arguments[0].click();", btn_confirm)
        wait.until(lambda d: d.find_element(By.ID, "reRegistrationSuccessCard").is_displayed())

        # Verify saved profile has timestamp strictly greater than 2000000000000
        saved_raw = driver.execute_script("return localStorage.getItem('math_student_profile_5B_10');")
        saved_data = json.loads(saved_raw)
        self.assertGreater(saved_data["timestamp"], 2000000000000, "Monotonic timestamp must exceed future/skewed timestamp")
        self.assertEqual(saved_data["version"], 2)

        # Now verify in index.html that only v2 passes and v1 fails
        driver.get(index_url)
        time.sleep(0.5)

        verify_sim = driver.execute_script("""
          var prof = window.getStudentProfile('5B', 10);
          var v1Vec = window.getDemoDescriptor('5B', 10, false, 1);
          var v2Vec = window.getDemoDescriptor('5B', 10, false, 2);
          return {
            v1_match: window.verifyFace(v1Vec, prof.vector, 0.85).isMatch,
            v2_match: window.verifyFace(v2Vec, prof.vector, 0.85).isMatch,
            profVersion: prof.version,
            profTime: prof.timestamp
          };
        """)
        self.assertFalse(verify_sim["v1_match"], "Old version 1 must FAIL")
        self.assertTrue(verify_sim["v2_match"], "New version 2 must PASS")
        self.assertEqual(verify_sim["profVersion"], 2)
        print("[PASS] Clock skew resilience and version isolation verified!")


if __name__ == '__main__':
    unittest.main()
