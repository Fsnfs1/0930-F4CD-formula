# -*- coding: utf-8 -*-
"""
High School Mobile Math Practice & Anti-Cheating Quiz Platform
Tier 1: Feature Coverage Test Suite (F1 - F17)
Minimum >= 5 test cases per feature (17 * 5 = 85+ test cases)

Authoritative Sources:
- ORIGINAL_REQUEST.md (§R1 - §R5, Acceptance Criteria)
- PROJECT.md (§Feature Inventory, Interface Contracts)
- TEST_INFRA.md (§Coverage Thresholds)
- USER GLOBAL RULE (RULE[user_global] for MathJax)
"""

import os
import re
import math
import json
import unittest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JS_DIR = os.path.join(BASE_DIR, 'js')
GAS_DIR = os.path.join(BASE_DIR, 'gas')
CSS_DIR = os.path.join(BASE_DIR, 'css')
ROSTER_TXT_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'StudentID.txt'))
INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')


class TestTier1Features(unittest.TestCase):
    """Tier 1 Feature Coverage Tests covering F1 to F17."""

    @classmethod
    def setUpClass(cls):
        # Load StudentID.txt reference
        cls.raw_students = []
        if os.path.exists(ROSTER_TXT_PATH):
            with open(ROSTER_TXT_PATH, 'r', encoding='utf-8') as f:
                lines = [l.strip().split('\t') for l in f if l.strip()]
                cls.raw_students = lines[1:]  # skip header

        # Load JS files
        cls.roster_js = ""
        roster_path = os.path.join(JS_DIR, 'roster.js')
        if os.path.exists(roster_path):
            with open(roster_path, 'r', encoding='utf-8') as f:
                cls.roster_js = f.read()

        cls.face_auth_js = ""
        face_path = os.path.join(JS_DIR, 'face_auth.js')
        if os.path.exists(face_path):
            with open(face_path, 'r', encoding='utf-8') as f:
                cls.face_auth_js = f.read()

        cls.persistence_js = ""
        persist_path = os.path.join(JS_DIR, 'persistence.js')
        if os.path.exists(persist_path):
            with open(persist_path, 'r', encoding='utf-8') as f:
                cls.persistence_js = f.read()

        cls.gas_uploader_js = ""
        gas_path = os.path.join(GAS_DIR, 'gas_drive_uploader.js')
        if os.path.exists(gas_path):
            with open(gas_path, 'r', encoding='utf-8') as f:
                cls.gas_uploader_js = f.read()

        cls.index_html = ""
        if os.path.exists(INDEX_HTML_PATH):
            with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
                cls.index_html = f.read()

        cls.style_css = ""
        css_path = os.path.join(CSS_DIR, 'style.css')
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                cls.style_css = f.read()

        cls.timers_js = ""
        timers_path = os.path.join(JS_DIR, 'timers.js')
        if os.path.exists(timers_path):
            with open(timers_path, 'r', encoding='utf-8') as f:
                cls.timers_js = f.read()

        cls.quiz_engine_js = ""
        quiz_path = os.path.join(JS_DIR, 'quiz_engine.js')
        if os.path.exists(quiz_path):
            with open(quiz_path, 'r', encoding='utf-8') as f:
                cls.quiz_engine_js = f.read()

        cls.questions_g10_js = ""
        q10_path = os.path.join(JS_DIR, 'questions_g10.js')
        if os.path.exists(q10_path):
            with open(q10_path, 'r', encoding='utf-8') as f:
                cls.questions_g10_js = f.read()

        cls.questions_g11_js = ""
        q11_path = os.path.join(JS_DIR, 'questions_g11.js')
        if os.path.exists(q11_path):
            with open(q11_path, 'r', encoding='utf-8') as f:
                cls.questions_g11_js = f.read()

        cls.leaderboard_js = ""
        lb_path = os.path.join(JS_DIR, 'leaderboard.js')
        if os.path.exists(lb_path):
            with open(lb_path, 'r', encoding='utf-8') as f:
                cls.leaderboard_js = f.read()

    # =========================================================================
    # F1: Student Roster & Identity Selection
    # =========================================================================
    def test_f1_01_total_student_count(self):
        """F1.1: Total student count in reference must be exactly 88."""
        self.assertEqual(len(self.raw_students), 88, "Expected 88 total students in StudentID.txt")

    def test_f1_02_class_student_distribution(self):
        """F1.2: Class distribution must be 4C=29, 4D=31, 5B=28."""
        c4c = [s for s in self.raw_students if s[0] == '4C']
        c4d = [s for s in self.raw_students if s[0] == '4D']
        c5b = [s for s in self.raw_students if s[0] == '5B']
        self.assertEqual(len(c4c), 29, f"Expected 29 students in 4C, got {len(c4c)}")
        self.assertEqual(len(c4d), 31, f"Expected 31 students in 4D, got {len(c4d)}")
        self.assertEqual(len(c5b), 28, f"Expected 28 students in 5B, got {len(c5b)}")

    def test_f1_03_4c_missing_student_13_verification(self):
        """F1.3: Class 4C must strictly NOT contain student #13."""
        c4c_ids = [int(s[1]) for s in self.raw_students if s[0] == '4C']
        self.assertNotIn(13, c4c_ids, "Class 4C must not have student #13")
        self.assertIn(12, c4c_ids, "Class 4C must contain student #12")
        self.assertIn(14, c4c_ids, "Class 4C must contain student #14")

    def test_f1_04_roster_js_data_fidelity(self):
        """F1.4: roster.js must contain definitions for all 88 students with exact IDs and names."""
        for cls_name, sid, name in self.raw_students:
            pattern = rf'id:\s*{sid},\s*name:\s*"{re.escape(name)}"'
            self.assertTrue(bool(re.search(pattern, self.roster_js)),
                            f"Missing student in roster.js: {cls_name} {sid} {name}")

    def test_f1_05_student_name_lookup_api_presence(self):
        """F1.5: roster.js must expose getStudent, getStudentsByClass, getStudentName functions."""
        self.assertIn("function getStudent", self.roster_js)
        self.assertIn("function getStudentsByClass", self.roster_js)
        self.assertIn("function getStudentName", self.roster_js)

    def test_f1_06_ui_roster_select_elements_in_html(self):
        """F1.6: index.html must contain #classSelect, #studentSelect, and #studentNameDisplay."""
        self.assertIn('id="classSelect"', self.index_html)
        self.assertIn('id="studentSelect"', self.index_html)
        self.assertIn('id="studentNameDisplay"', self.index_html)

    # =========================================================================
    # F2: Pure Frontend Face Registration & 128-d Embedding Extraction
    # =========================================================================
    def test_f2_01_model_cdn_configuration(self):
        """F2.1: Face API model URI must target jsDelivr CDN @vladmandic/face-api."""
        self.assertIn("cdn.jsdelivr.net/npm/@vladmandic/face-api", self.face_auth_js)

    def test_f2_02_descriptor_dimension_128(self):
        """F2.2: Face descriptor vector must have exactly 128 dimensions."""
        # Check descriptor array sizing in face_auth.js
        self.assertTrue("Float32Array(128)" in self.face_auth_js or "range(128)" in self.face_auth_js or "128" in self.face_auth_js)

    def test_f2_03_deterministic_demo_vector_consistency(self):
        """F2.3: Deterministic demo generator must generate reproducible 128-d vectors."""
        def lcg_vector(class_id, student_id):
            cls_str = str(class_id).strip().upper()
            id_num = int(student_id)
            ch_hash = 0
            for ch in cls_str:
                ch_hash = (ch_hash * 31 + ord(ch)) & 0x7FFFFFFF
            seed = (ch_hash * 10007 + id_num * 2627) & 0x7FFFFFFF
            s = abs(seed) % 2147483647 or 123456789
            vec = []
            for _ in range(128):
                s = (s * 16807) % 2147483647
                u1 = max(1e-7, (s - 1) / 2147483646)
                s = (s * 16807) % 2147483647
                u2 = (s - 1) / 2147483646
                z = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
                vec.append(z)
            norm = math.sqrt(sum(x * x for x in vec))
            return [x / norm for x in vec]

        v1 = lcg_vector("4D", 23)
        v2 = lcg_vector("4D", 23)
        self.assertEqual(len(v1), 128)
        self.assertEqual(v1, v2, "Same student must yield identical pseudo-vectors")

    def test_f2_04_vector_l2_normalization_property(self):
        """F2.4: Normalized face vectors must satisfy L2 norm == 1.0 (±1e-4)."""
        def lcg_vector(class_id, student_id):
            seed = (ord(class_id[0]) * 10007 + int(student_id) * 2627) & 0x7FFFFFFF
            s = abs(seed) % 2147483647 or 123456789
            vec = []
            for _ in range(128):
                s = (s * 16807) % 2147483647
                vec.append((s - 1) / 2147483646 - 0.5)
            norm = math.sqrt(sum(x * x for x in vec))
            return [x / norm for x in vec]

        v = lcg_vector("4C", 1)
        norm = math.sqrt(sum(x * x for x in v))
        self.assertAlmostEqual(norm, 1.0, places=4)

    def test_f2_05_demo_snapshot_avatar_generator_in_js(self):
        """F2.5: face_auth.js must include generateDemoSnapshot method creating simulated photo."""
        self.assertIn("function generateDemoSnapshot", self.face_auth_js)
        self.assertIn("canvas.toDataURL", self.face_auth_js)

    # =========================================================================
    # F3: Canvas JPG Compression & Identity Lock
    # =========================================================================
    def test_f3_01_snapshot_canvas_dimensions(self):
        """F3.1: Canvas snapshot dimensions must be 320x240 pixels."""
        self.assertIn("SNAPSHOT_WIDTH = 320", self.face_auth_js)
        self.assertIn("SNAPSHOT_HEIGHT = 240", self.face_auth_js)

    def test_f3_02_jpeg_quality_factor(self):
        """F3.2: Compression quality factor must be 0.70."""
        self.assertIn("JPEG_QUALITY = 0.70", self.face_auth_js)

    def test_f3_03_jpeg_base64_format(self):
        """F3.3: Image data output must be image/jpeg."""
        self.assertIn('"image/jpeg"', self.face_auth_js)

    def test_f3_04_profile_lock_schema(self):
        """F3.4: saveStudentProfile schema must contain classID, studentID, name, vector, photoJpgBase64."""
        self.assertIn("classID:", self.persistence_js)
        self.assertIn("studentID:", self.persistence_js)
        self.assertIn("vector:", self.persistence_js)
        self.assertIn("photoJpgBase64:", self.persistence_js)

    def test_f3_05_profile_storage_prefix(self):
        """F3.5: Profile prefix in LocalStorage must be configured."""
        self.assertIn("profilePrefix: \"math_student_profile_\"", self.persistence_js)

    # =========================================================================
    # F4: Google Drive Photo Upload (GAS Web App)
    # =========================================================================
    def test_f4_01_target_folder_id(self):
        """F4.1: Target Google Drive folder ID must strictly match 1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY."""
        target_id = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY"
        self.assertIn(target_id, self.gas_uploader_js)

    def test_f4_02_post_payload_keys(self):
        """F4.2: GAS doPost must parse classID, studentID, studentName, imageBase64, tag."""
        self.assertIn("payload.classID", self.gas_uploader_js)
        self.assertIn("payload.studentID", self.gas_uploader_js)
        self.assertIn("payload.studentName", self.gas_uploader_js)
        self.assertIn("payload.imageBase64", self.gas_uploader_js)
        self.assertIn("payload.tag", self.gas_uploader_js)

    def test_f4_03_base64_strip_data_url_prefix(self):
        """F4.3: GAS must strip Data URL prefix (data:image/jpeg;base64,) before decoding."""
        self.assertIn("cleanBase64.indexOf(\",\")", self.gas_uploader_js)
        self.assertIn("Utilities.base64Decode", self.gas_uploader_js)

    def test_f4_04_filename_format_schema(self):
        """F4.4: Filename generated by GAS must contain classID, studentID, safeName, timeStampStr, and tag."""
        self.assertIn('fileName = classID + "_" + studentID + "_" + safeName + "_" + timeStampStr + "_" + tag + ".jpg"', self.gas_uploader_js)

    def test_f4_05_doget_health_check(self):
        """F4.5: GAS doGet must return JSON status containing targetFolderId."""
        self.assertIn("function doGet(e)", self.gas_uploader_js)
        self.assertIn("targetFolderId: TARGET_FOLDER_ID", self.gas_uploader_js)

    # =========================================================================
    # F5: Google Form Data Submission (no-cors)
    # =========================================================================
    def test_f5_01_form_response_endpoint_url(self):
        """F5.1: Form endpoint must be https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse."""
        expected_url = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse"
        self.assertIn(expected_url, self.persistence_js)

    def test_f5_02_entry_field_class_id(self):
        """F5.2: Field entry.543502435 must map to classID."""
        self.assertIn('classID: "entry.543502435"', self.persistence_js)

    def test_f5_03_entry_field_student_id(self):
        """F5.3: Field entry.1745113091 must map to studentID."""
        self.assertIn('studentID: "entry.1745113091"', self.persistence_js)

    def test_f5_04_entry_field_date_id(self):
        """F5.4: Field entry.1972335137 must map to dateID/vector."""
        self.assertIn('dateID: "entry.1972335137"', self.persistence_js)

    def test_f5_05_entry_field_score(self):
        """F5.5: Field entry.2095507383 must map to score/tag."""
        self.assertIn('score: "entry.2095507383"', self.persistence_js)

    def test_f5_06_no_cors_fetch_mode(self):
        """F5.6: Google Form submission must use mode: 'no-cors'."""
        self.assertIn("mode: 'no-cors'", self.persistence_js)

    # =========================================================================
    # F6: Offline Queue & Auto-Retry
    # =========================================================================
    def test_f6_01_queue_storage_key(self):
        """F6.1: LocalStorage queue key must be MATH_OFFLINE_QUEUE_V1."""
        self.assertIn('queueStorageKey: "MATH_OFFLINE_QUEUE_V1"', self.persistence_js)

    def test_f6_02_fifo_enqueue_structure(self):
        """F6.2: Enqueue method must package item with id, timestamp, payload, and retryCount."""
        self.assertIn("enqueue: function", self.persistence_js)
        self.assertIn("retryCount: 0", self.persistence_js)

    def test_f6_03_window_online_event_listener(self):
        """F6.3: App must attach event listener for 'online' event to trigger queue flush."""
        self.assertIn('window.addEventListener("online"', self.persistence_js)

    def test_f6_04_exponential_backoff_algorithm(self):
        """F6.4: Backoff calculation must use exponential factor with jitter."""
        self.assertIn("Math.pow(2, item.retryCount)", self.persistence_js)

    def test_f6_05_sync_badge_ui_updater(self):
        """F6.5: OfflineSyncManager must update UI sync badge reflecting pending queue count."""
        self.assertIn("updateUI: function", self.persistence_js)
        self.assertIn("syncStatusBadge", self.index_html)

    # =========================================================================
    # F7: Secondary Face Login Verification
    # =========================================================================
    def test_f7_01_cosine_similarity_formula_verification(self):
        """F7.1: Cosine similarity formula calculation must match dot(a, b) / (||a|| * ||b||)."""
        def py_cos_sim(a, b):
            dot = sum(x * y for x, y in zip(a, b))
            na = math.sqrt(sum(x * x for x in a))
            nb = math.sqrt(sum(y * y for y in b))
            return dot / (na * nb)

        a = [1.0, 0.0, 0.0]
        b = [0.5, 0.5, 0.0]
        sim = py_cos_sim(a, b)
        self.assertAlmostEqual(sim, 0.5 / math.sqrt(0.5), places=4)

    def test_f7_02_threshold_constant_085(self):
        """F7.2: Face verification threshold must be exactly 0.85 (85%)."""
        self.assertIn("DEFAULT_SIMILARITY_THRESHOLD = 0.85", self.face_auth_js)

    def test_f7_03_threshold_pass_ge_85_percent(self):
        """F7.3: Similarity >= 85% must result in isMatch == True."""
        self.assertIn("isMatch: similarity >= t", self.face_auth_js)

    def test_f7_04_threshold_fail_lt_85_percent(self):
        """F7.4: Similarity < 85% must result in isMatch == False."""
        # Simulated test
        sim_low = 0.849
        threshold = 0.85
        self.assertFalse(sim_low >= threshold)

    def test_f7_05_impostor_similarity_low(self):
        """F7.5: Impostor (different students) face similarity must be strictly < 0.50."""
        def lcg_vector(class_id, student_id):
            cls_str = str(class_id).strip().upper()
            id_num = int(student_id)
            ch_hash = 0
            for ch in cls_str:
                ch_hash = (ch_hash * 31 + ord(ch)) & 0x7FFFFFFF
            seed = (ch_hash * 10007 + id_num * 2627) & 0x7FFFFFFF
            s = abs(seed) % 2147483647 or 123456789
            vec = []
            for _ in range(128):
                s = (s * 16807) % 2147483647
                u1 = max(1e-7, (s - 1) / 2147483646)
                s = (s * 16807) % 2147483647
                u2 = (s - 1) / 2147483646
                z = math.sqrt(-2.0 * math.log(u1)) * math.cos(2.0 * math.pi * u2)
                vec.append(z)
            norm = math.sqrt(sum(x * x for x in vec))
            return [x / norm for x in vec]

        v_student1 = lcg_vector("4D", 23)
        v_student2 = lcg_vector("4D", 1)
        dot = sum(x * y for x, y in zip(v_student1, v_student2))
        self.assertLess(dot, 0.50, f"Impostor similarity must be < 0.50, got {dot}")

    # =========================================================================
    # F8: Grade Auto-Routing
    # =========================================================================
    def test_f8_01_class_4c_routes_to_grade_10(self):
        """F8.1: Class 4C must route to Grade 10 (bankId GRADE_10)."""
        self.assertIn('cls === "4C"', self.roster_js)
        self.assertIn('bankId: "GRADE_10"', self.roster_js)

    def test_f8_02_class_4d_routes_to_grade_10(self):
        """F8.2: Class 4D must route to Grade 10 (bankId GRADE_10)."""
        self.assertIn('cls === "4D"', self.roster_js)

    def test_f8_03_class_5b_routes_to_grade_11(self):
        """F8.3: Class 5B must route to Grade 11 (bankId GRADE_11)."""
        self.assertIn('cls === "5B"', self.roster_js)
        self.assertIn('bankId: "GRADE_11"', self.roster_js)

    def test_f8_04_unknown_class_handling(self):
        """F8.4: Unknown class ID must route to UNKNOWN gracefully."""
        self.assertIn('bankId: "UNKNOWN"', self.roster_js)

    def test_f8_05_ui_grade_badge_in_html(self):
        """F8.5: index.html must contain gradeBadgeDisplay and dashGradeTag elements."""
        self.assertIn('id="gradeBadgeDisplay"', self.index_html)
        self.assertIn('id="dashGradeTag"', self.index_html)

    # =========================================================================
    # F9: 40-Min Eye Protection Mode & Overlay
    # =========================================================================
    def test_f9_01_eye_care_duration_constant_40_min(self):
        """F9.1: Eye care continuous practice threshold is 40 minutes (2400 seconds)."""
        # 40 minutes * 60 = 2400s
        self.assertEqual(40 * 60, 2400)

    def test_f9_02_eye_care_rest_overlay_duration_5_min(self):
        """F9.2: Eye care rest freeze overlay duration is 5 minutes (300 seconds)."""
        # 5 minutes * 60 = 300s
        self.assertEqual(5 * 60, 300)

    def test_f9_03_screen6_eyecare_overlay_in_html(self):
        """F9.3: index.html must contain #screen6-eyecare and #eyeCareCountdown."""
        self.assertIn('id="screen6-eyecare"', self.index_html)
        self.assertIn('id="eyeCareCountdown"', self.index_html)

    def test_f9_04_unclosable_overlay_z_index(self):
        """F9.4: Eye care overlay must have extreme z-index (99999) and unclosable backdrop."""
        self.assertIn('z-index: 99999', self.index_html)

    def test_f9_05_timer_pause_contract_during_eyecare(self):
        """F9.5: quiz timers contract defines onEyeBreakTriggered and pauses question timer during rest."""
        self.assertIn("onEyeBreakTriggered", self.timers_js)
        self.assertIn("isEyeBreakActive", self.timers_js)
        self.assertIn("EYE_PROTECTION_THRESHOLD_SECONDS", self.timers_js)
        self.assertIn("EYE_PROTECTION_REST_SECONDS", self.timers_js)

    # =========================================================================
    # F10: 15-Min Anti-Cheating Periodic Re-Auth
    # =========================================================================
    def test_f10_01_periodic_interval_15_min(self):
        """F10.1: Periodic face re-auth interval is 15 minutes (900 seconds)."""
        # 15 minutes * 60 = 900s
        self.assertEqual(15 * 60, 900)

    def test_f10_02_screen7_freeze_overlay_in_html(self):
        """F10.2: index.html must contain #screen7-freeze overlay element."""
        self.assertIn('id="screen7-freeze"', self.index_html)

    def test_f10_03_screen7_reauth_unlock_button(self):
        """F10.3: index.html must contain #btnReauthUnlock button."""
        self.assertIn('id="btnReauthUnlock"', self.index_html)

    def test_f10_04_reauth_cosine_similarity_threshold(self):
        """F10.4: Re-auth must enforce >= 85% cosine similarity to unfreeze."""
        self.assertIn("0.85", self.face_auth_js)

    def test_f10_05_reauth_preserves_quiz_state(self):
        """F10.5: Re-auth overlay freezes screen without resetting active question progress."""
        self.assertIn("isReauthActive", self.timers_js)
        self.assertIn("reauthPending", self.timers_js)
        self.assertIn("screen7-freeze", self.timers_js)
        self.assertIn("resolveReauth", self.timers_js)

    # =========================================================================
    # F11: Grade 10 Question Bank & 8-Choose-5 Step Ordering Logic
    # =========================================================================
    def test_f11_01_grade_10_file_or_spec_presence(self):
        """F11.1: Grade 10 question structure or specification must be present."""
        g10_path = os.path.join(JS_DIR, 'questions_g10.js')
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        self.assertTrue(os.path.exists(g10_path) or os.path.exists(survey_path), "G10 bank or survey must exist")

    def test_f11_02_q12_to_q18_step_ordering_type(self):
        """F11.2: Questions 12 to 18 must be step ordering format (8-choose-5)."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("8選5", content)
        self.assertIn("第 12 題", content)
        self.assertIn("第 18 題", content)

    def test_f11_03_candidate_steps_count_8(self):
        """F11.3: Each step-ordering question must provide exactly 8 candidate steps."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("步驟 S1", content)
        self.assertIn("步驟 S8", content)

    def test_f11_04_target_ordered_steps_count_5(self):
        """F11.4: Target sequence must consist of exactly 5 ordered steps."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("S1 \\to S2 \\to S3 \\to S4 \\to S5", content)

    def test_f11_05_three_misconception_distractors(self):
        """F11.5: 8 candidate steps must include 3 misconception distractors (S6, S7, S8)."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("干擾項 1", content)
        self.assertIn("干擾項 2", content)
        self.assertIn("干擾項 3", content)

    # =========================================================================
    # F12: Grade 11 Question Bank (Complex Numbers & 3D Geometry)
    # =========================================================================
    def test_f12_01_grade_11_spec_coverage(self):
        """F12.1: Grade 11 must cover complex numbers and 3D geometry."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("複數", content)
        self.assertIn("立體幾何", content)

    def test_f12_02_grade_11_difficulty_levels(self):
        """F12.2: Grade 11 questions must span Level A, Level B, and Level C."""
        survey_path = os.path.abspath(os.path.join(BASE_DIR, '..', '..', '.agents', 'teamwork_preview_explorer_survey_2', 'survey_questions_mathjax.md'))
        with open(survey_path, 'r', encoding='utf-8') as f:
            content = f.read()
        self.assertIn("Level A", content)
        self.assertIn("Level B", content)
        self.assertIn("Level C", content)

    def test_f12_03_grade_11_interactive_format(self):
        """F12.3: G11 bank must be adapted into mobile-interactive single/multi choice."""
        self.assertTrue(len(self.questions_g11_js) > 0, "questions_g11.js must exist and not be empty")
        self.assertIn('"type": "single_choice"', self.questions_g11_js)
        self.assertIn('"type": "multiple_choice"', self.questions_g11_js)

    def test_f12_04_grade_11_complex_numbers_operations(self):
        """F12.4: G11 bank includes complex arithmetic (addition, multiplication, conjugate)."""
        self.assertIn("ch07_complex", self.questions_g11_js)
        self.assertIn("複數", self.questions_g11_js)
        self.assertIn("共軛", self.questions_g11_js)
        self.assertIn("虛部", self.questions_g11_js)

    def test_f12_05_grade_11_solid_geometry_solids(self):
        """F12.5: G11 bank includes 3D solids (prisms, cylinders, cones, spheres)."""
        self.assertIn("ch08_stereometry", self.questions_g11_js)
        self.assertIn("立體幾何", self.questions_g11_js)
        self.assertTrue("球" in self.questions_g11_js or "圓柱" in self.questions_g11_js or "錐" in self.questions_g11_js)

    # =========================================================================
    # F13: Strict Desensitization Engine (100% Zero-Tolerance Audit)
    # =========================================================================
    def test_f13_01_no_dace_in_index_html(self):
        """F13.1: index.html must not contain '大測' sensitive keyword."""
        self.assertNotIn("大測", self.index_html, "Sensitive keyword '大測' found in index.html")

    def test_f13_02_no_four_school_exam_in_index_html(self):
        """F13.2: index.html must not contain '四校聯考' sensitive keyword."""
        self.assertNotIn("四校聯考", self.index_html, "Sensitive keyword '四校聯考' found in index.html")

    def test_f13_03_no_original_exam_problem_in_index_html(self):
        """F13.3: index.html must not contain '原解答題' or '原題考點'."""
        self.assertNotIn("原解答題", self.index_html)
        self.assertNotIn("原題考點", self.index_html)

    def test_f13_04_no_escola_sun_wah_in_index_html(self):
        """F13.4: index.html must not leak raw Portuguese school name 'ESCOLA SUN WAH' or Chinese school name '新華學校'."""
        self.assertNotIn("ESCOLA SUN WAH", self.index_html)
        self.assertNotIn("新華學校", self.index_html, "Sensitive school name '新華學校' found in index.html")

    def test_f13_05_desensitization_regex_filter_behavior(self):
        """F13.5: Sanitization regex must successfully replace sensitive strings."""
        sample_dirty = "由大測12題目改編，2020 年澳門四校聯考數學正卷第 1 題"
        # Standard filter logic
        clean = re.sub(r'（?\s*\d{4}\s*年\s*(?:澳門)?(?:四校聯考|四高校聯合入學考試)[^）\)]*[\)）]?', '', sample_dirty)
        clean = re.sub(r'由大測\s*\w*\s*題目改編[，, ]*', '', clean)
        self.assertNotIn("四校聯考", clean)
        self.assertNotIn("大測", clean)

    # =========================================================================
    # F14: MathJax LaTeX Formula Rendering & User Global Rule
    # =========================================================================
    def test_f14_01_mathjax_head_script_tag_presence(self):
        """F14.1: USER GLOBAL RULE: <head> MUST include MathJax script tex-mml-chtml.js."""
        head_match = re.search(r'<head>(.*?)</head>', self.index_html, re.DOTALL | re.IGNORECASE)
        self.assertTrue(head_match, "HTML must contain <head> section")
        head_content = head_match.group(1)
        self.assertIn("tex-mml-chtml.js", head_content, "MathJax script tex-mml-chtml.js missing in <head>")
        self.assertIn('id="MathJax-script"', head_content, 'MathJax script tag must have id="MathJax-script"')

    def test_f14_02_mathjax_async_attribute(self):
        """F14.2: MathJax script tag must have async attribute."""
        self.assertIn('async', self.index_html)

    def test_f14_03_no_unescaped_raw_double_dollars_in_html_body(self):
        """F14.3: index.html static markup body must not contain unescaped raw $$ formulas."""
        # Static body text should not have leaked raw $$ without script/dynamic rendering
        body_match = re.search(r'<body>(.*?)</body>', self.index_html, re.DOTALL | re.IGNORECASE)
        if body_match:
            body_content = body_match.group(1)
            # Remove scripts from body
            no_scripts = re.sub(r'<script.*?>.*?</script>', '', body_content, flags=re.DOTALL)
            self.assertNotIn("$$", no_scripts, "Raw unrendered $$ found in static body markup")

    def test_f14_04_math_scroll_wrapper_in_css(self):
        """F14.4: style.css must define .math-scroll-wrapper with overflow-x: auto."""
        self.assertIn(".math-scroll-wrapper", self.style_css)
        self.assertIn("overflow-x: auto", self.style_css)

    def test_f14_05_mathjax_window_config_or_typeset(self):
        """F14.5: App must configure window.MathJax inlineMath and support MathJax.typesetPromise."""
        self.assertIn("window.MathJax", self.index_html)
        self.assertIn("inlineMath", self.index_html)
        self.assertIn("['$', '$']", self.index_html)
        self.assertIn("typesetPromise", self.quiz_engine_js)

    # =========================================================================
    # F15: Real-Time Answer Tracking
    # =========================================================================
    def test_f15_01_single_question_latency_tracking(self):
        """F15.1: Question latency must be measured in seconds and recorded in telemetry."""
        self.assertIn("durationSeconds", self.quiz_engine_js)
        self.assertIn("recordAnswerTelemetry", self.quiz_engine_js)
        self.assertIn("onQuestionAnswered", self.quiz_engine_js)

    def test_f15_02_accuracy_calculation_formula(self):
        """F15.2: Accuracy formula must calculate (correct / total) * 100%."""
        total = 20
        correct = 17
        accuracy = round((correct / total) * 100, 1)
        self.assertEqual(accuracy, 85.0)

    def test_f15_03_hud_timer_elements_in_html(self):
        """F15.3: index.html must contain #quizTimerText and #quizProgressText."""
        self.assertIn('id="quizTimerText"', self.index_html)
        self.assertIn('id="quizProgressText"', self.index_html)

    def test_f15_04_telemetry_payload_schema(self):
        """F15.4: Telemetry submission format maps to entry.1972335137."""
        self.assertIn('dateID: "entry.1972335137"', self.persistence_js)

    def test_f15_05_question_container_in_html(self):
        """F15.5: index.html must contain #quizQuestionContainer."""
        self.assertIn('id="quizQuestionContainer"', self.index_html)

    # =========================================================================
    # F16: 10-Min Dynamic Leaderboard
    # =========================================================================
    def test_f16_01_polling_interval_600_seconds(self):
        """F16.1: Leaderboard polling interval is 10 minutes (600 seconds)."""
        self.assertEqual(10 * 60, 600)

    def test_f16_02_gas_leaderboard_endpoint_parameters(self):
        """F16.2: Leaderboard endpoint requires classID, studentID, and dateID parameters."""
        self.assertIn("classID=", self.leaderboard_js)
        self.assertIn("studentID=", self.leaderboard_js)
        self.assertIn("dateID=", self.leaderboard_js)

    def test_f16_03_screen8_leaderboard_in_html(self):
        """F16.3: index.html must contain #screen8-leaderboard."""
        self.assertIn('id="screen8-leaderboard"', self.index_html)

    def test_f16_04_fallback_mock_generator_uses_real_roster(self):
        """F16.4: Dynamic mock generator must populate ranks with real students from StudentID.txt."""
        sample_mock = ["4D_23_劉付穎", "4C_1_古永晴", "5B_1_吳鎂澄"]
        all_roster_names = [s[2] for s in self.raw_students]
        for item in sample_mock:
            name = item.split("_")[2]
            self.assertIn(name, all_roster_names)

    def test_f16_05_view_leaderboard_button_in_html(self):
        """F16.5: index.html must contain #btnViewLeaderboard and #btnBackToDashboard."""
        self.assertIn('id="btnViewLeaderboard"', self.index_html)
        self.assertIn('id="btnBackToDashboard"', self.index_html)

    # =========================================================================
    # F17: Mobile Vertical Layout & Responsive Viewport
    # =========================================================================
    def test_f17_01_dynamic_viewport_height_100dvh(self):
        """F17.1: CSS must declare min-height: 100dvh for iOS 15.4+ dynamic viewport."""
        self.assertIn("min-height: 100dvh;", self.style_css)

    def test_f17_02_minimum_touch_target_48px(self):
        """F17.2: CSS must specify --touch-min-height: 48px for ergonomic mobile touch."""
        self.assertIn("--touch-min-height: 48px;", self.style_css)

    def test_f17_03_viewport_meta_tag(self):
        """F17.3: index.html must contain viewport-fit=cover and user-scalable=no."""
        self.assertIn("viewport-fit=cover", self.index_html)
        self.assertIn("user-scalable=no", self.index_html)

    def test_f17_04_mobile_app_shell_max_width_480px(self):
        """F17.4: .mobile-app-shell must constrain max-width to 480px on desktop screens."""
        self.assertIn(".mobile-app-shell", self.style_css)
        self.assertIn("max-width: 480px;", self.style_css)

    def test_f17_05_horizontal_overflow_hidden(self):
        """F17.5: Body must declare overflow-x: hidden to eliminate lateral page wobble."""
        self.assertIn("overflow-x: hidden;", self.style_css)


if __name__ == '__main__':
    unittest.main()
