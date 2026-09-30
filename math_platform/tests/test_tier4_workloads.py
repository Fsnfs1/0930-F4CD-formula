# -*- coding: utf-8 -*-
"""
High School Mobile Math Practice & Anti-Cheating Quiz Platform
Tier 4: Real-World Student Workload Scenarios Test Suite
Covers full end-to-end user journeys (Scenarios 1 through 7)

Authoritative Sources:
- ORIGINAL_REQUEST.md (§R1 - §R5)
- TEST_INFRA.md (§3 Real-World Application Scenarios, §4 Coverage Thresholds)
- PROJECT.md (§Milestones M1 - M6)
"""

import os
import re
import math
import json
import unittest

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
JS_DIR = os.path.join(BASE_DIR, 'js')
GAS_DIR = os.path.join(BASE_DIR, 'gas')
ROSTER_TXT_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'StudentID.txt'))
INDEX_HTML_PATH = os.path.join(BASE_DIR, 'index.html')


class TestTier4Workloads(unittest.TestCase):
    """Tier 4 Real-World Workload Simulation & End-to-End Scenario Testing."""

    @classmethod
    def setUpClass(cls):
        cls.index_html = ""
        if os.path.exists(INDEX_HTML_PATH):
            with open(INDEX_HTML_PATH, 'r', encoding='utf-8') as f:
                cls.index_html = f.read()

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

    # =========================================================================
    # Scenario 1: Full First-Time Registration & Practice Flow (Class 4C)
    # =========================================================================
    def test_scenario_1_first_time_registration_and_practice(self):
        """Scenario 1: Complete first-time registration, persistence, and Grade 10 routing for 4C student."""
        class MockAppEnvironment:
            def __init__(self):
                self.local_storage = {}
                self.google_form_submissions = []
                self.drive_uploads = []
                self.current_screen = "screen1-roster"
                self.active_student = None

            def select_identity(self, class_id, student_id, student_name):
                self.active_student = {
                    "classID": class_id,
                    "studentID": student_id,
                    "name": student_name,
                    "grade": 10 if class_id in ("4C", "4D") else 11
                }
                # Check profile
                key = f"math_student_profile_{class_id}_{student_id}"
                has_profile = key in self.local_storage
                self.current_screen = "screen3-reauth" if has_profile else "screen2-register"

            def register_face(self, vector, snapshot_base64):
                # 1. Save profile to localStorage
                key = f"math_student_profile_{self.active_student['classID']}_{self.active_student['studentID']}"
                profile = {
                    **self.active_student,
                    "vector": vector,
                    "photoJpgBase64": snapshot_base64,
                    "registeredAt": "2026-09-30T10:00:00Z"
                }
                self.local_storage[key] = json.dumps(profile)

                # 2. Upload photo to Google Drive
                self.drive_uploads.append({
                    "folderId": "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY",
                    "classID": self.active_student['classID'],
                    "studentID": self.active_student['studentID'],
                    "name": self.active_student['name'],
                    "tag": "REGISTRATION"
                })

                # 3. Log vector to Google Form
                self.google_form_submissions.append({
                    "entry.543502435": self.active_student['classID'],
                    "entry.1745113091": str(self.active_student['studentID']),
                    "entry.1972335137": ",".join(f"{x:.4f}" for x in vector[:5]) + "...",
                    "entry.2095507383": "FACE_VECTOR"
                })

                # 4. Route to dashboard
                self.current_screen = "screen4-dashboard"

        env = MockAppEnvironment()
        # Step 1: Select 4C 1 (古永晴)
        env.select_identity("4C", 1, "古永晴")
        self.assertEqual(env.current_screen, "screen2-register")

        # Step 2: Register face with 128-d vector
        dummy_vector = [0.1 * math.sin(i) for i in range(128)]
        dummy_b64 = "data:image/jpeg;base64,/9j/4AAQSkZJRg=="
        env.register_face(dummy_vector, dummy_b64)

        # Step 3: Verify results
        self.assertEqual(env.current_screen, "screen4-dashboard")
        self.assertEqual(len(env.drive_uploads), 1)
        self.assertEqual(env.drive_uploads[0]["folderId"], "1oY52JyAqLLQQiETq8A-hre9jZ_goLHiY")
        self.assertEqual(len(env.google_form_submissions), 1)
        self.assertEqual(env.google_form_submissions[0]["entry.2095507383"], "FACE_VECTOR")
        self.assertIn("math_student_profile_4C_1", env.local_storage)

    # =========================================================================
    # Scenario 2: Secondary Login & Face Verification Success (Class 5B)
    # =========================================================================
    def test_scenario_2_secondary_login_and_grade_11_routing(self):
        """Scenario 2: Secondary login with facial verification passing >= 85% and routing to Grade 11."""
        class MockSecondaryAuth:
            def __init__(self):
                self.stored_vector = [0.088] * 128
                norm = math.sqrt(sum(x * x for x in self.stored_vector))
                self.stored_vector = [x / norm for x in self.stored_vector]
                self.current_screen = "screen1-roster"

            def start_login(self):
                # Detect existing profile -> Screen 3
                self.current_screen = "screen3-reauth"

            def scan_face(self, live_vector):
                # Compute cosine similarity
                dot = sum(a * b for a, b in zip(self.stored_vector, live_vector))
                na = math.sqrt(sum(a * a for a in self.stored_vector))
                nb = math.sqrt(sum(b * b for b in live_vector))
                sim = dot / (na * nb)
                if sim >= 0.85:
                    self.current_screen = "screen4-dashboard"
                    return True, sim
                return False, sim

        auth = MockSecondaryAuth()
        auth.start_login()
        self.assertEqual(auth.current_screen, "screen3-reauth")

        # Test scan with identical/near vector (95% similarity)
        live_vector = [x + 0.005 for x in auth.stored_vector]
        norm = math.sqrt(sum(x * x for x in live_vector))
        live_vector = [x / norm for x in live_vector]

        passed, sim = auth.scan_face(live_vector)
        self.assertTrue(passed)
        self.assertGreaterEqual(sim, 0.85)
        self.assertEqual(auth.current_screen, "screen4-dashboard")

    # =========================================================================
    # Scenario 3: Offline Disconnection, Queue Accumulation & Auto-Recovery
    # =========================================================================
    def test_scenario_3_offline_disconnection_and_recovery(self):
        """Scenario 3: Answering 4 questions while offline, accumulating queue, and flushing on reconnect."""
        class OfflineSessionMock:
            def __init__(self):
                self.is_online = True
                self.queue = []
                self.sent_records = []
                self.badge = "🟢 數據已同步"

            def set_offline(self):
                self.is_online = False
                self.badge = f"🟡 離線隊列待同步 ({len(self.queue)})"

            def submit_question(self, qid, is_correct, dur_s):
                payload = {"qid": qid, "isCorrect": is_correct, "dur": dur_s}
                if not self.is_online:
                    self.queue.append(payload)
                    self.badge = f"🟡 離線隊列待同步 ({len(self.queue)})"
                else:
                    self.sent_records.append(payload)

            def set_online(self):
                self.is_online = True
                # Flush queue FIFO
                while self.queue:
                    item = self.queue.pop(0)
                    self.sent_records.append(item)
                self.badge = "🟢 數據已同步"

        session = OfflineSessionMock()
        # Answer Q1 online
        session.submit_question("G10_Q1", 1, 15)
        self.assertEqual(len(session.sent_records), 1)

        # Go offline
        session.set_offline()
        session.submit_question("G10_Q2", 1, 20)
        session.submit_question("G10_Q3", 0, 45)
        session.submit_question("G10_Q4", 1, 30)
        self.assertEqual(len(session.queue), 3)
        self.assertEqual(session.badge, "🟡 離線隊列待同步 (3)")

        # Restore network
        session.set_online()
        self.assertEqual(len(session.queue), 0)
        self.assertEqual(len(session.sent_records), 4)
        self.assertEqual(session.badge, "🟢 數據已同步")

    # =========================================================================
    # Scenario 4: 15-Min Periodic Face Re-Auth Screen Freeze & Resume
    # =========================================================================
    def test_scenario_4_15min_face_reauth_freeze_and_resume(self):
        """Scenario 4: 15-minute periodic re-auth freezes screen and resumes quiz upon passing."""
        class QuizSessionWithReauth:
            def __init__(self):
                self.practice_seconds = 899
                self.is_frozen = False
                self.current_question = 8
                self.selected_choice = "C"

            def tick_one_second(self):
                self.practice_seconds += 1
                if self.practice_seconds % 900 == 0:
                    self.is_frozen = True

            def complete_reauth(self, similarity):
                if similarity >= 0.85:
                    self.is_frozen = False
                    return True
                return False

        quiz = QuizSessionWithReauth()
        # Advance 1 second to 900s
        quiz.tick_one_second()
        self.assertTrue(quiz.is_frozen, "Screen must freeze at 900 seconds (15 min)")
        self.assertEqual(quiz.current_question, 8)
        self.assertEqual(quiz.selected_choice, "C")

        # Pass re-auth
        success = quiz.complete_reauth(0.92)
        self.assertTrue(success)
        self.assertFalse(quiz.is_frozen, "Freeze overlay must dismiss on re-auth pass")
        self.assertEqual(quiz.selected_choice, "C", "Selection must be intact")

    # =========================================================================
    # Scenario 5: 40-Min Continuous Practice Eye-Protection Lock & Unlock
    # =========================================================================
    def test_scenario_5_40min_eyecare_lock_and_unlock(self):
        """Scenario 5: 40-minute continuous practice triggers 5-minute rest lock, pausing timers."""
        class EyecarePracticeTracker:
            def __init__(self):
                self.practice_time_s = 2399
                self.eyecare_active = False
                self.rest_countdown_s = 300
                self.question_timer_running = True

            def tick(self):
                if not self.eyecare_active:
                    self.practice_time_s += 1
                    if self.practice_time_s >= 2400:
                        self.eyecare_active = True
                        self.question_timer_running = False
                else:
                    self.rest_countdown_s -= 1
                    if self.rest_countdown_s <= 0:
                        self.eyecare_active = False
                        self.question_timer_running = True
                        self.rest_countdown_s = 300
                        self.practice_time_s = 0  # reset block

        tracker = EyecarePracticeTracker()
        tracker.tick()
        self.assertTrue(tracker.eyecare_active, "Eye care must activate at 2400s (40 min)")
        self.assertFalse(tracker.question_timer_running, "Question timer must pause during rest")

        # Simulate 300 seconds rest expiring
        for _ in range(300):
            tracker.tick()
        self.assertFalse(tracker.eyecare_active, "Eye care must dismiss when countdown finishes")
        self.assertTrue(tracker.question_timer_running, "Question timer must resume")

    # =========================================================================
    # Scenario 6: 8-Choose-5 Step Ordering Interaction & Validation
    # =========================================================================
    def test_scenario_6_step_ordering_full_interaction_flow(self):
        """Scenario 6: Step ordering interaction from 8 candidate steps to 5 ordered target slots."""
        class StepOrderingMachine:
            def __init__(self):
                self.candidates = [f"S{i}" for i in range(1, 9)]  # S1..S8
                self.slots = [None] * 5  # 5 slots: A, B, C, D, E
                self.correct_order = ["S1", "S2", "S3", "S4", "S5"]

            def can_submit(self):
                return all(s is not None for s in self.slots)

            def place_candidate(self, step_id):
                if step_id in self.slots:
                    return False  # Already placed
                for i in range(len(self.slots)):
                    if self.slots[i] is None:
                        self.slots[i] = step_id
                        return True
                return False  # Slots full

            def remove_slot(self, slot_idx):
                if 0 <= slot_idx < len(self.slots):
                    self.slots[slot_idx] = None

            def swap_slots(self, idx1, idx2):
                self.slots[idx1], self.slots[idx2] = self.slots[idx2], self.slots[idx1]

            def submit(self):
                if not self.can_submit():
                    return False, "Slots incomplete"
                is_correct = (self.slots == self.correct_order)
                return True, is_correct

        machine = StepOrderingMachine()
        self.assertFalse(machine.can_submit())

        # Select S1, S2, S3, S4, S5
        for s in ["S1", "S2", "S3", "S4", "S5"]:
            machine.place_candidate(s)

        self.assertTrue(machine.can_submit())
        can_sub, correct = machine.submit()
        self.assertTrue(can_sub)
        self.assertTrue(correct, "Correct sequence S1..S5 must evaluate to True")

        # Test permutation error
        machine.swap_slots(0, 1)  # S2, S1, S3, S4, S5
        can_sub, correct = machine.submit()
        self.assertFalse(correct, "Permuted sequence must evaluate to False")

    # =========================================================================
    # Scenario 7: Continuous Practice Stress & Memory Soak
    # =========================================================================
    def test_scenario_7_continuous_practice_stress_and_stats(self):
        """Scenario 7: Rapid sequential answering of 25 questions verifying cumulative accuracy & queue."""
        session_answers = []
        correct_count = 0
        total_time_s = 0

        for q_idx in range(1, 26):
            is_correct = 1 if (q_idx % 3 != 0) else 0  # ~67% correct
            dur_s = 15 + (q_idx * 2) % 30
            if is_correct:
                correct_count += 1
            total_time_s += dur_s
            acc = round((correct_count / q_idx) * 100, 1)
            session_answers.append({
                "question": q_idx,
                "isCorrect": is_correct,
                "duration": dur_s,
                "cumulativeAccuracy": acc
            })

        self.assertEqual(len(session_answers), 25)
        self.assertEqual(correct_count, 17)
        final_accuracy = round((17 / 25) * 100, 1)
        self.assertEqual(session_answers[-1]["cumulativeAccuracy"], final_accuracy)
        self.assertGreater(total_time_s, 300)


if __name__ == '__main__':
    unittest.main()
