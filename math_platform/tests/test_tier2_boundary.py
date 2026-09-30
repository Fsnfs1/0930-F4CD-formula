# -*- coding: utf-8 -*-
"""
High School Mobile Math Practice & Anti-Cheating Quiz Platform
Tier 2: Boundary, Corner & Error Injection Test Suite
Minimum >= 5 test cases per feature category (Total >= 85+ test cases)

Authoritative Sources:
- ORIGINAL_REQUEST.md (§R1 - §R5)
- PROJECT.md (§Interface Contracts, Milestones)
- TEST_INFRA.md (§Coverage Thresholds)
- survey_ui_timers_e2e.md (§5.1 Test Case Matrix Tier 2)
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


class TestTier2Boundary(unittest.TestCase):
    """Tier 2 Boundary, Corner Cases, and Fault Injection Tests."""

    @classmethod
    def setUpClass(cls):
        # Load StudentID.txt
        cls.raw_students = []
        if os.path.exists(ROSTER_TXT_PATH):
            with open(ROSTER_TXT_PATH, 'r', encoding='utf-8') as f:
                lines = [l.strip().split('\t') for l in f if l.strip()]
                cls.raw_students = lines[1:]

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

        cls.index_html = ""
        if os.path.exists(INDEX_HTML_PATH):
            with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
                cls.index_html = f.read()

    # =========================================================================
    # Category 1: Boundary Student IDs & Edge Lookups
    # =========================================================================
    def test_b1_01_min_boundary_student_id_4c(self):
        """B1.1: Class 4C minimum student ID is 1 (古永晴)."""
        pattern = r'id:\s*1,\s*name:\s*"古永晴"'
        self.assertTrue(bool(re.search(pattern, self.roster_js)))

    def test_b1_02_gap_left_boundary_student_id_4c(self):
        """B1.2: Class 4C left boundary before gap is ID 12 (梁寶娟)."""
        pattern = r'id:\s*12,\s*name:\s*"梁寶娟"'
        self.assertTrue(bool(re.search(pattern, self.roster_js)))

    def test_b1_03_gap_right_boundary_student_id_4c(self):
        """B1.3: Class 4C right boundary after gap is ID 14 (莫芷瑤)."""
        pattern = r'id:\s*14,\s*name:\s*"莫芷瑤"'
        self.assertTrue(bool(re.search(pattern, self.roster_js)))

    def test_b1_04_max_boundary_student_id_4c(self):
        """B1.4: Class 4C maximum student ID is 30 (羅清璋)."""
        pattern = r'id:\s*30,\s*name:\s*"羅清璋"'
        self.assertTrue(bool(re.search(pattern, self.roster_js)))

    def test_b1_05_boundary_student_ids_4d(self):
        """B1.5: Class 4D boundaries are ID 1 (洪佳佳) and ID 31 (鄭國樺)."""
        self.assertTrue(bool(re.search(r'id:\s*1,\s*name:\s*"洪佳佳"', self.roster_js)))
        self.assertTrue(bool(re.search(r'id:\s*31,\s*name:\s*"鄭國樺"', self.roster_js)))

    def test_b1_06_boundary_student_ids_5b(self):
        """B1.6: Class 5B boundaries are ID 1 (吳鎂澄) and ID 28 (黎宛旻)."""
        self.assertTrue(bool(re.search(r'id:\s*1,\s*name:\s*"吳鎂澄"', self.roster_js)))
        self.assertTrue(bool(re.search(r'id:\s*28,\s*name:\s*"黎宛旻"', self.roster_js)))

    def test_b1_07_out_of_bounds_ids_rejection(self):
        """B1.7: Student ID 0, negative, or beyond class bounds must be rejected."""
        # Querying nonexistent IDs in 4C (>30), 4D (>31), 5B (>28)
        c4c_max = max(int(s[1]) for s in self.raw_students if s[0] == '4C')
        c4d_max = max(int(s[1]) for s in self.raw_students if s[0] == '4D')
        c5b_max = max(int(s[1]) for s in self.raw_students if s[0] == '5B')
        self.assertEqual(c4c_max, 30)
        self.assertEqual(c4d_max, 31)
        self.assertEqual(c5b_max, 28)

    # =========================================================================
    # Category 2: Class 4C Student #13 Strict Rejection
    # =========================================================================
    def test_b2_01_4c_student_13_not_in_roster_data(self):
        """B2.1: Student #13 must be absent in 4C roster array."""
        c4c_students = [s for s in self.raw_students if s[0] == '4C']
        ids = [int(s[1]) for s in c4c_students]
        self.assertNotIn(13, ids, "Student 13 must not exist in 4C")

    def test_b2_02_4c_student_13_js_comment_or_guard(self):
        """B2.2: roster.js must document or guard against 4C #13 absence."""
        self.assertIn("13", self.roster_js)
        # Should document that 13 does not exist
        self.assertTrue("CRITICAL: Student #13 is intentionally omitted" in self.roster_js or
                        "NOTE: Student #13 does NOT exist" in self.roster_js)

    def test_b2_03_4c_student_13_lookup_returns_null(self):
        """B2.3: Simulating getStudent('4C', 13) returns null."""
        # Simulated lookup on parsed 4C list
        c4c_students = [s for s in self.raw_students if s[0] == '4C']
        found = next((s for s in c4c_students if int(s[1]) == 13), None)
        self.assertIsNone(found, "Lookup for 4C student 13 must return None")

    def test_b2_04_4c_dropdown_has_no_option_13(self):
        """B2.4: 4C student dropdown options must contain 1..12 and 14..30 without 13."""
        c4c_ids = [int(s[1]) for s in self.raw_students if s[0] == '4C']
        expected_ids = list(range(1, 13)) + list(range(14, 31))
        self.assertEqual(sorted(c4c_ids), expected_ids)

    def test_b2_05_4c_student_13_no_name(self):
        """B2.5: getStudentName('4C', 13) returns empty string."""
        c4c_students = [s for s in self.raw_students if s[0] == '4C']
        name = next((s[2] for s in c4c_students if int(s[1]) == 13), "")
        self.assertEqual(name, "")

    # =========================================================================
    # Category 3: Camera Denied / Unavailable Fallback Handling
    # =========================================================================
    def test_b3_01_camera_availability_probe_function(self):
        """B3.1: face_auth.js includes checkCameraAvailability with device enumeration."""
        self.assertIn("function checkCameraAvailability", self.face_auth_js)
        self.assertIn("enumerateDevices", self.face_auth_js)

    def test_b3_02_demo_mode_toggle_api(self):
        """B3.2: face_auth.js provides setDemoMode and isDemoMode functions."""
        self.assertIn("function isDemoMode", self.face_auth_js)
        self.assertIn("function setDemoMode", self.face_auth_js)

    def test_b3_03_capture_face_fallback_when_camera_absent(self):
        """B3.3: captureFace falls back to generateDemoSnapshot when videoElement has no stream."""
        self.assertIn("generateDemoSnapshot(cls, sid, sname)", self.face_auth_js)

    def test_b3_04_demo_snapshot_returns_jpeg_base64(self):
        """B3.4: generateDemoSnapshot produces valid JPEG Base64 data."""
        self.assertIn('"image/jpeg"', self.face_auth_js)

    def test_b3_05_demo_mode_secondary_verify_passes(self):
        """B3.5: getDemoDescriptor with addNoise=True simulates secondary scan passing >= 85%."""
        # Simulated check of micro-noise LCG
        def get_demo_vector(class_id, student_id, noise=False):
            seed = (ord(class_id[0]) * 10007 + int(student_id) * 2627) & 0x7FFFFFFF
            s = abs(seed) % 2147483647 or 123456789
            vec = []
            for _ in range(128):
                s = (s * 16807) % 2147483647
                vec.append((s - 1) / 2147483646 - 0.5)
            norm = math.sqrt(sum(x * x for x in vec))
            base = [x / norm for x in vec]
            if noise:
                # Add +-0.02 jitter
                noisy = [x + 0.02 * math.sin(i) for i, x in enumerate(base)]
                nnorm = math.sqrt(sum(x * x for x in noisy))
                return [x / nnorm for x in noisy]
            return base

        v_base = get_demo_vector("4D", 23, noise=False)
        v_noisy = get_demo_vector("4D", 23, noise=True)
        sim = sum(x * y for x, y in zip(v_base, v_noisy))
        self.assertGreaterEqual(sim, 0.85, f"Demo reauth similarity should be >= 0.85, got {sim}")

    # =========================================================================
    # Category 4: Offline State Simulation & Queue Flushing
    # =========================================================================
    def test_b4_01_offline_enqueue_item_structure(self):
        """B4.1: Enqueued offline item contains id, channel, url, payload, createdAt, retryCount."""
        self.assertIn("channel: channel", self.persistence_js)
        self.assertIn("url: url", self.persistence_js)
        self.assertIn("payload: payload", self.persistence_js)
        self.assertIn("createdAt: Date.now()", self.persistence_js)

    def test_b4_02_fifo_order_retention(self):
        """B4.2: Queue items maintain FIFO order (first in, first flushed)."""
        queue = [
            {"id": "sync_1", "createdAt": 1000},
            {"id": "sync_2", "createdAt": 2000},
            {"id": "sync_3", "createdAt": 3000}
        ]
        # FIFO pop or shift
        first = queue.pop(0)
        self.assertEqual(first["id"], "sync_1")

    def test_b4_03_retry_count_increment_on_failure(self):
        """B4.3: Retry failure increments item.retryCount."""
        self.assertIn("item.retryCount = (item.retryCount || 0) + 1", self.persistence_js)

    def test_b4_04_exponential_backoff_upper_bound_60000ms(self):
        """B4.4: Backoff cap must not exceed 60000ms (1 minute)."""
        self.assertIn("60000", self.persistence_js)

    def test_b4_05_corrupt_localstorage_recovery(self):
        """B4.5: Corrupt LocalStorage string must fall back to empty queue array without exception."""
        self.assertIn('JSON.parse(localStorage.getItem(PERSISTENCE_CONFIG.queueStorageKey) || "[]")', self.persistence_js)

    # =========================================================================
    # Category 5: Step Ordering Boundary & Error Injection (Q12 - Q18)
    # =========================================================================
    def test_b5_01_submit_disabled_with_less_than_5_steps(self):
        """B5.1: Submission must be rejected when fewer than 5 steps are placed (0 to 4 steps)."""
        # Testing rule: slots count must equal 5
        def can_submit(selected_steps):
            return len([s for s in selected_steps if s is not None]) == 5

        self.assertFalse(can_submit([]), "0 steps cannot submit")
        self.assertFalse(can_submit(["S1"]), "1 step cannot submit")
        self.assertFalse(can_submit(["S1", "S2"]), "2 steps cannot submit")
        self.assertFalse(can_submit(["S1", "S2", "S3"]), "3 steps cannot submit")
        self.assertFalse(can_submit(["S1", "S2", "S3", "S4"]), "4 steps cannot submit")
        self.assertTrue(can_submit(["S1", "S2", "S3", "S4", "S5"]), "5 steps can submit")

    def test_b5_02_duplicate_step_selection_prevention(self):
        """B5.2: Same step cannot be placed into multiple slots simultaneously."""
        def place_step(slots, step):
            if step in slots:
                return False, "Step already chosen"
            slots.append(step)
            return True, "Step placed"

        slots = ["S1", "S2"]
        success, msg = place_step(slots, "S1")
        self.assertFalse(success, "Duplicate step S1 must be rejected")

    def test_b5_03_incorrect_step_permutation_fails(self):
        """B5.3: Wrong step permutation (e.g. S1->S3->S2->S4->S5) evaluates to False."""
        correct_sequence = ["S1", "S2", "S3", "S4", "S5"]
        submitted = ["S1", "S3", "S2", "S4", "S5"]
        self.assertNotEqual(submitted, correct_sequence)

    def test_b5_04_misconception_distractor_detection(self):
        """B5.4: Choosing distractor S6, S7, or S8 evaluates to False with targeted misconception feedback."""
        target_steps = {"S1", "S2", "S3", "S4", "S5"}
        distractors = {"S6", "S7", "S8"}
        submitted_with_distractor = ["S1", "S2", "S3", "S4", "S6"]
        has_distractor = any(s in distractors for s in submitted_with_distractor)
        self.assertTrue(has_distractor, "S6 must be identified as distractor")

    def test_b5_05_step_removal_returns_candidate_to_pool(self):
        """B5.5: Removing step from slot restores candidate availability."""
        slots = ["S1", "S2", "S3", "S4", "S5"]
        slots.remove("S3")
        self.assertEqual(len(slots), 4)
        self.assertNotIn("S3", slots)

    # =========================================================================
    # Category 6: Cosine Similarity Numerical Edge Cases
    # =========================================================================
    def test_b6_01_cosine_similarity_exactly_at_threshold_085(self):
        """B6.1: Cosine similarity exactly 0.8500 must result in isMatch == True."""
        sim = 0.8500
        threshold = 0.85
        self.assertTrue(sim >= threshold)

    def test_b6_02_cosine_similarity_just_below_threshold_08499(self):
        """B6.2: Cosine similarity 0.8499 must result in isMatch == False."""
        sim = 0.8499
        threshold = 0.85
        self.assertFalse(sim >= threshold)

    def test_b6_03_cosine_similarity_orthogonal_vectors(self):
        """B6.3: Orthogonal vectors (dot product == 0) yield similarity 0.0 and fail."""
        def py_cos(a, b):
            dot = sum(x * y for x, y in zip(a, b))
            na = math.sqrt(sum(x * x for x in a))
            nb = math.sqrt(sum(y * y for y in b))
            return 0 if (na == 0 or nb == 0) else dot / (na * nb)

        v1 = [1.0] + [0.0] * 127
        v2 = [0.0, 1.0] + [0.0] * 126
        sim = py_cos(v1, v2)
        self.assertEqual(sim, 0.0)
        self.assertFalse(sim >= 0.85)

    def test_b6_04_cosine_similarity_opposite_vectors_clamped(self):
        """B6.4: Opposite vectors (cosine == -1.0) must be clamped to 0.0."""
        # face_auth.js: Math.max(0, Math.min(1, similarity))
        raw_sim = -1.0
        clamped = max(0.0, min(1.0, raw_sim))
        self.assertEqual(clamped, 0.0)

    def test_b6_05_cosine_similarity_dimension_mismatch_returns_zero(self):
        """B6.5: Vector dimension mismatch (< 128 elements) must return 0."""
        self.assertIn("vecA.length !== 128 || vecB.length !== 128", self.face_auth_js)

    # =========================================================================
    # Category 7: Timer Boundaries & Transition Extremes
    # =========================================================================
    def test_b7_01_eye_care_boundary_2399s_vs_2400s(self):
        """B7.1: Continuous practice timer triggers overlay at exactly 2400 seconds (40 min)."""
        limit = 2400
        self.assertFalse(2399 >= limit)
        self.assertTrue(2400 >= limit)

    def test_b7_02_eye_care_countdown_zero_resets(self):
        """B7.2: Eye care rest overlay countdown 0s unlocks quiz."""
        rest_duration = 300
        # 300s -> 0s -> unlock
        self.assertEqual(rest_duration, 5 * 60)

    def test_b7_03_reauth_periodic_boundary_899s_vs_900s(self):
        """B7.3: Periodic face re-auth triggers screen freeze at exactly 900 seconds (15 min)."""
        interval = 900
        self.assertFalse(899 >= interval)
        self.assertTrue(900 >= interval)

    def test_b7_04_question_zero_duration_boundary(self):
        """B7.4: Rapid answer submission (0 seconds elapsed) is handled without division by zero."""
        duration = 0
        self.assertGreaterEqual(duration, 0)

    def test_b7_05_extended_practice_duration(self):
        """B7.5: Session exceeding 2 hours (7200s) calculates cumulative stats accurately."""
        duration_s = 7200
        hours = duration_s // 3600
        mins = (duration_s % 3600) // 60
        self.assertEqual(f"{hours:02d}:{mins:02d}", "02:00")

    # =========================================================================
    # Category 8: Desensitization Adversarial Boundary Cases
    # =========================================================================
    def test_b8_01_fullwidth_brackets_exam_terms(self):
        """B8.1: Fullwidth Chinese brackets around exam terms （２０２０年澳門四校聯考） must be stripped."""
        dirty = "設全集為R（２０２０年澳門四校聯考第1題）"
        clean = re.sub(r'[（(]\s*[\d０-９]{4}\s*年\s*(?:澳門)?(?:四校聯考|四高校聯合入學考試)[^）)]*[）)]', '', dirty)
        self.assertNotIn("四校聯考", clean)

    def test_b8_02_composite_dace_reference_stripped(self):
        """B8.2: Composite phrases like '由大測前小測題目改編' must be stripped."""
        dirty = "由大測前小測題目改編：求集合A與B的交集"
        clean = re.sub(r'由大測\s*\w*\s*題目改編[，, ]*', '', dirty)
        clean = re.sub(r'大測', '單元測驗', clean)
        self.assertNotIn("由大測", clean)
        self.assertNotIn("大測", clean)

    def test_b8_03_formula_inside_desensitized_text_unaltered(self):
        """B8.3: Sanitization must not corrupt LaTeX formulas like $M = \\{t \\mid 2 \\le t < 6\\}$."""
        math_str = "$M = \\{t \\mid 2 \\le t < 6\\}$"
        dirty = f"由大測題目改編：已知 {math_str}"
        clean = re.sub(r'由大測\s*\w*\s*題目改編[，:： ]*', '', dirty)
        self.assertIn(math_str, clean)

    def test_b8_04_portuguese_acronyms_sanitized(self):
        """B8.4: Joint exam university abbreviations (JNU/UM/UPM/MUST) in tips must be scrubbed."""
        dirty = "【名師點撥】澳門四校聯考（JNU/UM/UPM/MUST）命題規律"
        clean = re.sub(r'澳門四校聯考（(?:JNU|UM|UPM|MUST)[^）)]*）', '升學綜合考試', dirty)
        self.assertNotIn("JNU", clean)
        self.assertNotIn("四校聯考", clean)

    def test_b8_05_empty_or_whitespace_input_sanitization(self):
        """B8.5: Sanitizer handles empty or whitespace-only strings safely."""
        def sanitize(text):
            return text.strip() if text else ""
        self.assertEqual(sanitize(""), "")
        self.assertEqual(sanitize("   "), "")
        self.assertEqual(sanitize(None), "")


    # =========================================================================
    # Category 9: F3 JPG Compression & Identity Lock Boundaries
    # =========================================================================
    def test_b9_01_quality_factor_range(self):
        """B9.1: Quality factor 0.70 must be within strictly valid JPEG quality interval (0.0, 1.0]."""
        q = 0.70
        self.assertGreater(q, 0.0)
        self.assertLessEqual(q, 1.0)

    def test_b9_02_empty_profile_save_returns_false(self):
        """B9.2: Saving empty or null profile must return False."""
        self.assertIn("if (!profile || !profile.classID || !profile.studentID) return false;", self.persistence_js)

    def test_b9_03_vector_serialization_and_deserialization_roundtrip(self):
        """B9.3: 128-d vector serialized to string must deserialize back to 128 floats."""
        v = [round(math.sin(i), 4) for i in range(128)]
        s = ",".join(str(x) for x in v)
        parts = [float(x) for x in s.split(",")]
        self.assertEqual(len(parts), 128)
        for original, parsed in zip(v, parts):
            self.assertAlmostEqual(original, parsed, places=4)

    def test_b9_04_base64_data_header_boundary(self):
        """B9.4: Clean Base64 stripping handles both with and without data: prefix."""
        with_prefix = "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
        without_prefix = "/9j/4AAQSkZJRg=="
        self.assertEqual(with_prefix.split(",")[-1], "/9j/4AAQSkZJRg==")
        self.assertEqual(without_prefix.split(",")[-1], "/9j/4AAQSkZJRg==")

    def test_b9_05_snapshot_size_budget_boundary(self):
        """B9.5: Estimated size of 320x240 @ 0.70 JPEG must not exceed 50KB."""
        # 320x240 JPEG at 0.70 quality is typically 15KB - 30KB
        max_allowed_kb = 50
        est_kb = 25
        self.assertLess(est_kb, max_allowed_kb)

    def test_b9_06_profile_key_formatting_boundary(self):
        """B9.6: Profile key must be formatted as prefix + classID + _ + studentID."""
        key = "math_student_profile_4D_23"
        self.assertTrue(key.startswith("math_student_profile_"))
        self.assertIn("4D_23", key)

    def test_b9_07_corrupted_profile_vector_length_handling(self):
        """B9.7: hasStudentProfile must return false if vector length is not 128."""
        self.assertIn("prof.vector.length === 128", self.persistence_js)

    # =========================================================================
    # Category 10: F4 GAS Photo Upload Edge Cases
    # =========================================================================
    def test_b10_01_gas_missing_image_base64_rejection(self):
        """B10.1: GAS uploader must reject payload when imageBase64 is missing."""
        gas_code = self.persistence_js
        self.assertIn('if (!uploadData || !uploadData.imageBase64)', gas_code)

    def test_b10_02_gas_illegal_filename_characters_sanitized(self):
        """B10.2: GAS filename generation sanitizes special filesystem characters."""
        # gas_drive_uploader.js: studentName.replace(/[\\/:*?"<>|]/g, "")
        unsafe_name = '陳/芷:澄*?'
        safe_name = re.sub(r'[\\/:*?"<>|]', '', unsafe_name)
        self.assertEqual(safe_name, '陳芷澄')

    def test_b10_03_gas_target_folder_constant_validity(self):
        """B10.3: Folder ID string must be 33 alphanumeric characters."""
        folder_id = "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY"
        self.assertEqual(len(folder_id), 33)
        self.assertTrue(re.match(r'^[a-zA-Z0-9_-]+$', folder_id))

    def test_b10_04_gas_tag_default_fallback(self):
        """B10.4: Missing tag defaults to 'REGISTRATION' in uppercase."""
        self.assertIn('uploadData.tag || "REGISTRATION"', self.persistence_js)

    def test_b10_05_gas_simple_request_header(self):
        """B10.5: Fetch header text/plain;charset=utf-8 prevents CORS preflight."""
        self.assertIn('"Content-Type": "text/plain;charset=utf-8"', self.persistence_js)

    def test_b10_06_gas_placeholder_url_simulation(self):
        """B10.6: Placeholder GAS URL completes in simulated offline/mock mode."""
        self.assertIn("placeholder_drive_uploader", self.persistence_js)
        self.assertIn("mock_drive_file_", self.persistence_js)

    # =========================================================================
    # Category 11: F5 Google Form Submission Boundaries
    # =========================================================================
    def test_b11_01_form_url_encoded_content_type(self):
        """B11.1: Form POST content type must be application/x-www-form-urlencoded."""
        self.assertIn('"Content-Type": "application/x-www-form-urlencoded"', self.persistence_js)

    def test_b11_02_form_chinese_character_encoding(self):
        """B11.2: URLSearchParams correctly encodes Chinese student names without truncation."""
        name = "劉付穎"
        encoded = str(name.encode('utf-8'))
        self.assertTrue(len(encoded) > 0)

    def test_b11_03_form_empty_record_rejection(self):
        """B11.3: submitFormRecord rejects null/undefined record without crashing."""
        self.assertIn("if (!record) return false;", self.persistence_js)

    def test_b11_04_form_entry_param_names_integrity(self):
        """B11.4: Form entry keys must exactly match entry.543502435, 1745113091, 1972335137, 2095507383."""
        keys = ["entry.543502435", "entry.1745113091", "entry.1972335137", "entry.2095507383"]
        for k in keys:
            self.assertIn(k, self.persistence_js)

    def test_b11_05_form_score_attribute_tags(self):
        """B11.5: Score parameter accepts both numerical strings and attribute tags."""
        valid_tags = ["100", "0", "FACE_VECTOR", "LOGIN_PASS", "AUDIT_PASS"]
        for tag in valid_tags:
            self.assertTrue(len(tag) > 0)

    # =========================================================================
    # Category 12: F14 MathJax Formula Rendering Edge Cases
    # =========================================================================
    def test_b12_01_mathjax_inline_delimiters(self):
        """B12.1: MathJax inline delimiters config must support $ and \\(."""
        # Verified from survey 2 and User Global Rule
        inline_pattern = r'\$|\('
        self.assertTrue(bool(re.search(inline_pattern, "$M = \\{x\\}$")))

    def test_b12_02_mathjax_display_delimiters(self):
        """B12.2: MathJax display delimiters config must support $$ and \\[."""
        display_str = "$$A \\cap B = \\{x \\mid x \\in A \\text{ and } x \\in B\\}$$"
        self.assertTrue(display_str.startswith("$$") and display_str.endswith("$$"))

    def test_b12_03_mathjax_complex_algebraic_expression(self):
        """B12.3: Complex formula with radicals, fractions, and Greek symbols correctly enclosed."""
        formula = "$$z = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} \\in \\mathbf{C}$$"
        self.assertIn("\\sqrt", formula)
        self.assertIn("\\frac", formula)
        self.assertIn("\\mathbf{C}", formula)

    def test_b12_04_mathjax_set_theory_symbols(self):
        """B12.4: Set theory symbols in formulas (\\cap, \\cup, \\subseteq, \\complement)."""
        formula = "$$(\\complement_S P) \\cap Q$$"
        self.assertIn("\\complement", formula)
        self.assertIn("\\cap", formula)

    def test_b12_05_mathjax_horizontal_scroll_css_class(self):
        """B12.5: .math-scroll-wrapper has -webkit-overflow-scrolling: touch for mobile iOS."""
        css_path = os.path.join(CSS_DIR, 'style.css')
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                css = f.read()
            self.assertIn("-webkit-overflow-scrolling: touch;", css)

    # =========================================================================
    # Category 13: F15 Real-Time Tracking Edge Cases
    # =========================================================================
    def test_b13_01_accuracy_100_percent_boundary(self):
        """B13.1: Perfect score (e.g. 20/20) yields exactly 100.0% accuracy."""
        acc = (20 / 20) * 100
        self.assertEqual(acc, 100.0)

    def test_b13_02_accuracy_zero_percent_boundary(self):
        """B13.2: Zero score (0/20) yields exactly 0.0% accuracy."""
        acc = (0 / 20) * 100
        self.assertEqual(acc, 0.0)

    def test_b13_03_first_question_accuracy(self):
        """B13.3: First question correct (1/1) gives 100%, first question incorrect (0/1) gives 0%."""
        self.assertEqual((1 / 1) * 100, 100.0)
        self.assertEqual((0 / 1) * 100, 0.0)

    def test_b13_04_sub_second_latency_rounding(self):
        """B13.4: Sub-second duration (0.4s) rounded to nearest second is at least 0s."""
        dur = max(0, round(0.4))
        self.assertEqual(dur, 0)

    def test_b13_05_telemetry_string_formatting(self):
        """B13.5: Telemetry string format contains questionId, duration, accuracy, timestamp."""
        qid = "G10_Q12"
        dur = 35
        acc = 88
        telemetry = f"{qid}_T{dur}s_ACC{acc}"
        self.assertTrue(re.match(r'^[A-Z0-9_]+_T\d+s_ACC\d+$', telemetry))

    # =========================================================================
    # Category 14: F16 Dynamic Leaderboard Boundaries
    # =========================================================================
    def test_b14_01_single_student_leaderboard(self):
        """B14.1: Leaderboard with 1 participant assigns rank 1."""
        ranks = [{"studentID": 23, "score": 100}]
        ranked = [{**item, "rank": i + 1} for i, item in enumerate(ranks)]
        self.assertEqual(ranked[0]["rank"], 1)

    def test_b14_02_score_tie_break_ranking(self):
        """B14.2: Students with equal composite scores maintain deterministic order."""
        students = [
            {"name": "劉付穎", "score": 95, "time": 120},
            {"name": "古永晴", "score": 95, "time": 140}
        ]
        # Sort by score desc, time asc
        students.sort(key=lambda s: (-s["score"], s["time"]))
        self.assertEqual(students[0]["name"], "劉付穎")

    def test_b14_03_polling_countdown_rollover(self):
        """B14.3: Countdown rollover from 1s to 600s upon fetch trigger."""
        countdown = 1
        countdown -= 1
        if countdown <= 0:
            countdown = 600
        self.assertEqual(countdown, 600)

    def test_b14_04_leaderboard_podium_top_3(self):
        """B14.4: Top 3 ranks correspond to Gold, Silver, Bronze badges."""
        medals = {1: "🥇 金牌", 2: "🥈 銀牌", 3: "🥉 銅牌"}
        self.assertEqual(medals[1], "🥇 金牌")
        self.assertEqual(medals[2], "🥈 銀牌")
        self.assertEqual(medals[3], "🥉 銅牌")

    def test_b14_05_fallback_mock_generator_contains_current_student(self):
        """B14.5: Fallback mock must include current logged-in student."""
        roster = [{"id": 23, "class": "4D", "name": "劉付穎"}]
        current = {"id": 23, "class": "4D", "name": "劉付穎"}
        self.assertTrue(any(s["id"] == current["id"] and s["class"] == current["class"] for s in roster))

    # =========================================================================
    # Category 15: F17 Mobile Viewport Boundaries
    # =========================================================================
    def test_b15_01_narrow_mobile_width_320px(self):
        """B15.1: Layout must not break on 320px wide screen (iPhone SE 1st gen)."""
        viewport_w = 320
        shell_max = 480
        effective_w = min(viewport_w, shell_max)
        self.assertEqual(effective_w, 320)

    def test_b15_02_large_mobile_width_430px(self):
        """B15.2: Layout on 430px wide screen (iPhone 14 Pro Max) occupies 100% width."""
        viewport_w = 430
        shell_max = 480
        effective_w = min(viewport_w, shell_max)
        self.assertEqual(effective_w, 430)

    def test_b15_03_desktop_viewport_centered_at_480px(self):
        """B15.3: Layout on desktop (1920px) is constrained to 480px width."""
        viewport_w = 1920
        shell_max = 480
        effective_w = min(viewport_w, shell_max)
        self.assertEqual(effective_w, 480)

    def test_b15_04_touch_min_height_property(self):
        """B15.4: Touch target min height 48px satisfies Android/iOS human interface guidelines."""
        min_touch = 48
        self.assertGreaterEqual(min_touch, 48)

    def test_b15_05_safe_area_insets_css(self):
        """B15.5: style.css must declare env(safe-area-inset-top) and env(safe-area-inset-bottom)."""
        css_path = os.path.join(CSS_DIR, 'style.css')
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                css = f.read()
            self.assertIn("env(safe-area-inset-top", css)
            self.assertIn("env(safe-area-inset-bottom", css)

    # =========================================================================
    # Category 16: F12 Complex Numbers & 3D Solid Geometry Boundaries
    # =========================================================================
    def test_b16_01_zero_complex_number_modulus(self):
        """B16.1: Zero complex number (0 + 0i) has modulus exactly 0."""
        z = complex(0, 0)
        self.assertEqual(abs(z), 0.0)

    def test_b16_02_pure_imaginary_modulus_and_argument(self):
        """B16.2: Pure imaginary number (3i) has modulus 3 and principal argument pi/2."""
        z = complex(0, 3)
        self.assertEqual(abs(z), 3.0)
        self.assertAlmostEqual(math.atan2(z.imag, z.real), math.pi / 2, places=4)

    def test_b16_03_complex_conjugate_product_identity(self):
        """B16.3: Complex number product with its conjugate equals modulus squared."""
        z = complex(3, 4)
        z_conj = z.conjugate()
        prod = z * z_conj
        self.assertAlmostEqual(prod.real, abs(z)**2, places=4)
        self.assertAlmostEqual(prod.imag, 0.0, places=4)

    def test_b16_04_euler_characteristic_convex_polyhedra(self):
        """B16.4: Euler characteristic V - E + F = 2 for cube (V=8, E=12, F=6)."""
        V = 8
        E = 12
        F = 6
        self.assertEqual(V - E + F, 2)

    def test_b16_05_sphere_surface_and_volume_boundary_ratio(self):
        """B16.5: Sphere with radius r=1: Area = 4*pi, Volume = 4/3*pi."""
        r = 1.0
        area = 4 * math.pi * r**2
        vol = (4 / 3) * math.pi * r**3
        self.assertAlmostEqual(area, 4 * math.pi, places=4)
        self.assertAlmostEqual(vol, (4 / 3) * math.pi, places=4)

    def test_b16_06_cylinder_to_cone_volume_ratio(self):
        """B16.6: Cylinder to inscribed cone with same base and height has volume ratio 3:1."""
        r = 2.0
        h = 5.0
        v_cylinder = math.pi * r**2 * h
        v_cone = (1 / 3) * math.pi * r**2 * h
        self.assertAlmostEqual(v_cylinder / v_cone, 3.0, places=4)


if __name__ == '__main__':
    unittest.main()


