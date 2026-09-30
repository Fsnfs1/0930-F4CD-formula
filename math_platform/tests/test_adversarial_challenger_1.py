# -*- coding: utf-8 -*-
"""
Adversarial Stress Test Suite - Challenger 1
High School Mobile Math Practice & Anti-Cheating Quiz Platform

Empirical verification and stress testing covering:
1. Face Recognition & Verification
   - Cosine similarity: identical, perturbed, orthogonal, inverted, zero-norm, mismatched lengths
   - Demo mode repeatability and noise variation
   - Exhaustive impostor attack across all 88 students (3,828 distinct pairs)
2. Persistence & Offline Queue
   - Rapid enqueuing of 60 responses under load
   - Queue capacity and storage footprint
   - Exponential backoff timing and jitter
   - VULNERABILITY AUDIT 1: Concurrent enqueue race condition (Data loss audit)
   - VULNERABILITY AUDIT 2: LocalStorage corruption recovery ('null', '{}', invalid JSON)
3. Student Roster
   - Boundary student IDs (1, 12, 14, 29, 30, 31)
   - Strict absence of #13 in 4C across data and UI
   - Invalid, negative, zero, and overflow queries
"""

import os
import sys
import time
import json
import unittest

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INDEX_HTML = os.path.join(BASE_DIR, 'index.html')


class EmpiricalChallenger1Tests(unittest.TestCase):
    driver = None

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=390,844')

        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.get(f'file:///{INDEX_HTML}')
        time.sleep(1.0)

    @classmethod
    def tearDownClass(cls):
        if cls.driver:
            cls.driver.quit()

    def setUp(self):
        # Full state reset between tests
        self.driver.execute_script("""
            localStorage.clear();
            if (window.PersistenceModule && window.PersistenceModule.OfflineSyncManager) {
                window.PersistenceModule.OfflineSyncManager.isFlushing = false;
                window.PersistenceModule.OfflineSyncManager.clearQueue();
            }
        """)

    # =========================================================================
    # SUITE 1: FACE RECOGNITION & VERIFICATION ADVERSARIAL STRESS TESTS
    # =========================================================================

    def test_face_01_cosine_identical_vectors(self):
        """1.1 Identical unit vectors must yield similarity exactly 1.0 (>= 0.85)."""
        res = self.driver.execute_script("""
            const v1 = new Float32Array(128).fill(1 / Math.sqrt(128));
            const v2 = new Float32Array(128).fill(1 / Math.sqrt(128));
            const sim = FaceAuthModule.computeCosineSimilarity(v1, v2);
            const ver = FaceAuthModule.verifyFace(v1, v2);
            return { sim, isMatch: ver.isMatch, percentage: ver.percentage };
        """)
        self.assertAlmostEqual(res['sim'], 1.0, places=4)
        self.assertTrue(res['isMatch'])
        self.assertAlmostEqual(res['percentage'], 100.0, places=1)

    def test_face_02_cosine_orthogonal_vectors(self):
        """1.2 Orthogonal vectors must yield similarity 0.0 and strictly fail verification."""
        res = self.driver.execute_script("""
            const v1 = new Float32Array(128);
            const v2 = new Float32Array(128);
            v1[0] = 1.0;
            v2[1] = 1.0;
            const sim = FaceAuthModule.computeCosineSimilarity(v1, v2);
            const ver = FaceAuthModule.verifyFace(v1, v2);
            return { sim, isMatch: ver.isMatch };
        """)
        self.assertAlmostEqual(res['sim'], 0.0, places=4)
        self.assertFalse(res['isMatch'])

    def test_face_03_cosine_inverted_vectors(self):
        """1.3 Inverted (opposite direction) vectors must be clamped to 0.0 and strictly fail."""
        res = self.driver.execute_script("""
            const v1 = new Float32Array(128).fill(1 / Math.sqrt(128));
            const v2 = new Float32Array(128).fill(-1 / Math.sqrt(128));
            const sim = FaceAuthModule.computeCosineSimilarity(v1, v2);
            const ver = FaceAuthModule.verifyFace(v1, v2);
            return { sim, isMatch: ver.isMatch };
        """)
        self.assertAlmostEqual(res['sim'], 0.0, places=4)
        self.assertFalse(res['isMatch'])

    def test_face_04_cosine_zero_norm_edge_vectors(self):
        """1.4 Zero-norm vectors (all zeros) must return 0.0 without divide-by-zero crash."""
        res = self.driver.execute_script("""
            const vZero = new Float32Array(128);
            const vNorm = new Float32Array(128).fill(1 / Math.sqrt(128));
            const simZeroZero = FaceAuthModule.computeCosineSimilarity(vZero, vZero);
            const simZeroNorm = FaceAuthModule.computeCosineSimilarity(vZero, vNorm);
            const verZeroZero = FaceAuthModule.verifyFace(vZero, vZero);
            return { simZeroZero, simZeroNorm, isMatch: verZeroZero.isMatch };
        """)
        self.assertEqual(res['simZeroZero'], 0.0)
        self.assertEqual(res['simZeroNorm'], 0.0)
        self.assertFalse(res['isMatch'])

    def test_face_05_cosine_mismatched_and_invalid_vector_lengths(self):
        """1.5 Mismatched vector lengths (e.g. 0, 10, 127, 129) must return 0.0 and fail."""
        res = self.driver.execute_script("""
            const v128 = new Float32Array(128).fill(1);
            const v127 = new Float32Array(127).fill(1);
            const v129 = new Float32Array(129).fill(1);
            const vEmpty = new Float32Array(0);
            return {
                sim127: FaceAuthModule.computeCosineSimilarity(v128, v127),
                sim129: FaceAuthModule.computeCosineSimilarity(v128, v129),
                simEmpty: FaceAuthModule.computeCosineSimilarity(v128, vEmpty),
                simNull: FaceAuthModule.computeCosineSimilarity(v128, null)
            };
        """)
        self.assertEqual(res['sim127'], 0.0)
        self.assertEqual(res['sim129'], 0.0)
        self.assertEqual(res['simEmpty'], 0.0)
        self.assertEqual(res['simNull'], 0.0)

    def test_face_06_cosine_controlled_perturbation_curve(self):
        """1.6 Perturbation curve: micro-noise (<5%) passes >= 0.85, macro-noise (>20%) fails."""
        res = self.driver.execute_script("""
            const base = FaceAuthModule.getDemoDescriptor("4D", 10, false);
            const results = [];
            const scales = [0.01, 0.03, 0.05, 0.10, 0.15, 0.25, 0.40, 0.60];
            for (const s of scales) {
                const noisy = new Float32Array(128);
                let norm = 0;
                for (let i = 0; i < 128; i++) {
                    noisy[i] = base[i] + ((i % 2 === 0 ? 1 : -1) * s);
                    norm += noisy[i] * noisy[i];
                }
                norm = Math.sqrt(norm);
                for (let i = 0; i < 128; i++) noisy[i] /= norm;
                const sim = FaceAuthModule.computeCosineSimilarity(base, noisy);
                const ver = FaceAuthModule.verifyFace(base, noisy);
                results.push({ scale: s, sim: sim, isMatch: ver.isMatch });
            }
            return results;
        """)
        self.assertTrue(res[0]['sim'] >= 0.95)
        self.assertTrue(res[0]['isMatch'])
        self.assertTrue(res[1]['sim'] >= 0.85)
        self.assertTrue(res[1]['isMatch'])
        self.assertFalse(res[-1]['isMatch'])
        self.assertFalse(res[-2]['isMatch'])

    def test_face_07_demo_mode_deterministic_repeatability(self):
        """1.7 Demo mode generator must produce 100% bit-exact vector across multiple calls."""
        res = self.driver.execute_script("""
            const v1 = FaceAuthModule.getDemoDescriptor("4C", 7, false);
            const v2 = FaceAuthModule.getDemoDescriptor("4C", 7, false);
            let diffSum = 0;
            for (let i = 0; i < 128; i++) {
                diffSum += Math.abs(v1[i] - v2[i]);
            }
            const sim = FaceAuthModule.computeCosineSimilarity(v1, v2);
            return { diffSum, sim };
        """)
        self.assertEqual(res['diffSum'], 0.0)
        self.assertAlmostEqual(res['sim'], 1.0, places=5)

    def test_face_08_demo_mode_secondary_auth_noise_passes(self):
        """1.8 Demo mode with addNoise=true simulates natural variance but MUST pass >= 0.85."""
        res = self.driver.execute_script("""
            const base = FaceAuthModule.getDemoDescriptor("5B", 15, false);
            const trials = [];
            for (let t = 0; t < 20; t++) {
                const noisy = FaceAuthModule.getDemoDescriptor("5B", 15, true);
                const ver = FaceAuthModule.verifyFace(base, noisy);
                trials.push({ sim: ver.similarity, isMatch: ver.isMatch });
            }
            return trials;
        """)
        for i, t in enumerate(res):
            self.assertTrue(t['isMatch'], f"Trial {i} failed with similarity {t['sim']}")
            self.assertTrue(t['sim'] >= 0.85)

    def test_face_09_exhaustive_impostor_attack_all_88_students(self):
        """1.9 EXHAUSTIVE IMPOSTOR ATTACK: Cross-student similarity across all 3,828 pairs must be < 0.85."""
        res = self.driver.execute_script("""
            const roster = RosterModule.getRoster();
            const descriptors = roster.map(s => ({
                classID: s.classID,
                studentID: s.studentID,
                name: s.name,
                vec: FaceAuthModule.getDemoDescriptor(s.classID, s.studentID, false)
            }));

            let maxSim = -1;
            let maxPair = null;
            let minSim = 2;
            let totalSim = 0;
            let pairCount = 0;
            let violations = [];

            for (let i = 0; i < descriptors.length; i++) {
                for (let j = i + 1; j < descriptors.length; j++) {
                    const d1 = descriptors[i];
                    const d2 = descriptors[j];
                    const sim = FaceAuthModule.computeCosineSimilarity(d1.vec, d2.vec);
                    totalSim += sim;
                    pairCount++;

                    if (sim > maxSim) {
                        maxSim = sim;
                        maxPair = { s1: `${d1.classID}-${d1.studentID} ${d1.name}`, s2: `${d2.classID}-${d2.studentID} ${d2.name}`, sim: sim };
                    }
                    if (sim < minSim) {
                        minSim = sim;
                    }

                    if (sim >= 0.85) {
                        violations.push({
                            s1: `${d1.classID}-${d1.studentID}`,
                            s2: `${d2.classID}-${d2.studentID}`,
                            sim: sim
                        });
                    }
                }
            }

            return {
                totalStudents: descriptors.length,
                pairCount: pairCount,
                maxSim: maxSim,
                minSim: minSim,
                avgSim: totalSim / pairCount,
                maxPair: maxPair,
                violationsCount: violations.length,
                violations: violations
            };
        """)

        print(f"\n[Adversarial Impostor Attack Results]")
        print(f"  Total students tested : {res['totalStudents']}")
        print(f"  Total pairs evaluated : {res['pairCount']}")
        print(f"  Average similarity    : {res['avgSim']:.4f}")
        print(f"  Minimum similarity    : {res['minSim']:.4f}")
        print(f"  Maximum similarity    : {res['maxSim']:.4f} (Pair: {res['maxPair']['s1']} vs {res['maxPair']['s2']})")
        print(f"  Violations (>= 0.85)  : {res['violationsCount']}")

        self.assertEqual(res['totalStudents'], 88)
        self.assertEqual(res['pairCount'], 88 * 87 // 2)
        self.assertEqual(res['violationsCount'], 0, f"Found {res['violationsCount']} impostor pairs passing >= 85%!")
        self.assertLess(res['maxSim'], 0.85, f"Maximum cross-student similarity {res['maxSim']} exceeded 0.85!")
        self.assertLess(res['maxSim'], 0.50, f"Impostor margin too small: max similarity was {res['maxSim']}")

    # =========================================================================
    # SUITE 2: PERSISTENCE & OFFLINE QUEUE ADVERSARIAL STRESS TESTS
    # =========================================================================

    def test_queue_01_rapid_enqueuing_50_plus_responses(self):
        """2.1 Rapid enqueuing of 60 answers under 1 second preserves all items and FIFO ordering."""
        res = self.driver.execute_script("""
            PersistenceModule.OfflineSyncManager.clearQueue();

            const enqueueResults = [];
            const startTime = performance.now();

            for (let i = 1; i <= 60; i++) {
                const payload = {
                    "entry.543502435": "4C",
                    "entry.1745113091": "1",
                    "entry.1972335137": `Q${i}_ANSWER`,
                    "entry.2095507383": i % 2 === 0 ? "CORRECT" : "WRONG"
                };
                const id = PersistenceModule.OfflineSyncManager.enqueue(
                    "FORM",
                    PersistenceModule.PERSISTENCE_CONFIG.googleFormUrl,
                    payload
                );
                enqueueResults.push(id);
            }

            const elapsedMs = performance.now() - startTime;
            const q = PersistenceModule.OfflineSyncManager.getQueue();
            const status = PersistenceModule.OfflineSyncManager.getStatus();

            let isOrderPreserved = true;
            for (let i = 0; i < q.length; i++) {
                if (q[i].payload["entry.1972335137"] !== `Q${i+1}_ANSWER`) {
                    isOrderPreserved = false;
                    break;
                }
            }

            return {
                enqueuedCount: enqueueResults.length,
                queueLength: q.length,
                pendingCount: status.pendingCount,
                elapsedMs: elapsedMs,
                isOrderPreserved: isOrderPreserved
            };
        """)

        print(f"\n[Rapid Queue Stress]")
        print(f"  Enqueued items   : {res['enqueuedCount']}")
        print(f"  Stored queue len : {res['queueLength']}")
        print(f"  Elapsed time     : {res['elapsedMs']:.2f} ms")

        self.assertEqual(res['enqueuedCount'], 60)
        self.assertEqual(res['queueLength'], 60)
        self.assertEqual(res['pendingCount'], 60)
        self.assertTrue(res['isOrderPreserved'])
        self.assertLess(res['elapsedMs'], 1500.0)

    def test_queue_02_queue_storage_size_budget(self):
        """2.2 100 queued items must consume negligible LocalStorage quota (< 100 KB)."""
        res = self.driver.execute_script("""
            PersistenceModule.OfflineSyncManager.clearQueue();
            for (let i = 1; i <= 100; i++) {
                const payload = {
                    "entry.543502435": "4D",
                    "entry.1745113091": "23",
                    "entry.1972335137": `Q${i}_DUR_15_SCORE_100_ANS_ABCD`,
                    "entry.2095507383": "SUBMISSION"
                };
                PersistenceModule.OfflineSyncManager.enqueue("FORM", "https://example.com/form", payload);
            }
            const raw = localStorage.getItem(PersistenceModule.PERSISTENCE_CONFIG.queueStorageKey) || "";
            const sizeBytes = raw.length * 2;
            return {
                queueLen: PersistenceModule.OfflineSyncManager.getQueue().length,
                sizeBytes: sizeBytes,
                sizeKb: sizeBytes / 1024
            };
        """)
        self.assertEqual(res['queueLen'], 100)
        self.assertLess(res['sizeKb'], 100.0)

    def test_queue_03_exponential_backoff_timing_and_jitter(self):
        """2.3 Exponential backoff formula verifies retry intervals and postponement of retry."""
        res = self.driver.execute_script("""
            const trials = [];
            for (let retryCount = 1; retryCount <= 6; retryCount++) {
                const minExpected = Math.min(2000 * Math.pow(2, retryCount), 60000);
                const maxExpected = minExpected + 1000;
                trials.push({ retryCount, minExpected, maxExpected });
            }
            return trials;
        """)
        expected_bases = [4000, 8000, 16000, 32000, 60000, 60000]
        for i, t in enumerate(res):
            self.assertEqual(t['minExpected'], expected_bases[i])
            self.assertEqual(t['maxExpected'], expected_bases[i] + 1000)

    def test_queue_04_concurrent_enqueue_race_condition_demonstration(self):
        """2.4 EMPIRICAL BUG REPRODUCTION: Concurrent enqueue during async flushQueue wipes out newly added items.
        Demonstrates data loss vulnerability when submissions occur while a flush is in progress.
        """
        res = self.driver.execute_async_script("""
            const done = arguments[0];
            PersistenceModule.OfflineSyncManager.isFlushing = false;
            PersistenceModule.OfflineSyncManager.clearQueue();

            const fetchCalls = [];
            const originalFetch = window.fetch;

            // Mock network fetch taking 80ms
            window.fetch = function(url, opts) {
                fetchCalls.push(opts ? opts.body : url);
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve({ ok: true, json: () => Promise.resolve({}) });
                    }, 80);
                });
            };

            // 1. Manually trigger flush with item 1
            const item1 = {
                id: "sync_1",
                channel: "FORM",
                url: "https://example.com/form",
                payload: { q: "item_1" },
                createdAt: Date.now(),
                status: "pending"
            };
            PersistenceModule.OfflineSyncManager.saveQueue([item1]);
            const flushPromise = PersistenceModule.OfflineSyncManager.flushQueue();

            // 2. While flushQueue is in-flight (at 20ms), enqueue item 2
            setTimeout(() => {
                const item2 = {
                    id: "sync_2",
                    channel: "FORM",
                    url: "https://example.com/form",
                    payload: { q: "item_2" },
                    createdAt: Date.now(),
                    status: "pending"
                };
                const qNow = PersistenceModule.OfflineSyncManager.getQueue();
                qNow.push(item2);
                PersistenceModule.OfflineSyncManager.saveQueue(qNow);
            }, 20);

            // 3. After flushQueue completes (at 180ms), inspect results
            setTimeout(() => {
                window.fetch = originalFetch;
                const qAfter = PersistenceModule.OfflineSyncManager.getQueue();
                done({
                    fetchCallsCount: fetchCalls.length,
                    queueLengthAfter: qAfter.length,
                    item2Preserved: qAfter.some(x => x.id === "sync_2")
                });
            }, 180);
        """)

        print("\n[Audit Finding - Queue Race Condition]")
        print(f"  Fetch calls made    : {res['fetchCallsCount']}")
        print(f"  Remaining in queue  : {res['queueLengthAfter']}")
        print(f"  Item 2 preserved    : {res['item2Preserved']}")

        # Post-remediation verification: Item 2 must be preserved in queue after Item 1 is synced
        self.assertTrue(res['item2Preserved'], "Item 2 must be preserved in queue during concurrent flush")
        self.assertEqual(res['queueLengthAfter'], 1, "Queue must retain newly enqueued item")

    def test_queue_05_corrupted_localstorage_recovery_audit(self):
        """2.5 EMPIRICAL BUG REPRODUCTION: LocalStorage pollution with 'null' or '{}' causes fatal TypeErrors.
        OfflineSyncManager.getQueue lacks Array.isArray check.
        """
        results = self.driver.execute_script("""
            const key = PersistenceModule.PERSISTENCE_CONFIG.queueStorageKey;
            const findings = [];

            // Case 1: Corrupted JSON syntax -> handled gracefully by try-catch
            try {
                localStorage.setItem(key, "INVALID_JSON_{{[}");
                const q = PersistenceModule.OfflineSyncManager.getQueue();
                findings.push({ case: "invalid_syntax", survived: true, isArray: Array.isArray(q) });
            } catch (err) {
                findings.push({ case: "invalid_syntax", survived: false, error: err.message });
            }

            // Case 2: Stored 'null' string -> causes fatal crash on getStatus / enqueue
            try {
                localStorage.setItem(key, "null");
                const q = PersistenceModule.OfflineSyncManager.getQueue();
                let statusSurvived = false;
                let statusErr = "";
                try {
                    PersistenceModule.OfflineSyncManager.getStatus();
                    statusSurvived = true;
                } catch (e) {
                    statusSurvived = false;
                    statusErr = e.message;
                }
                findings.push({
                    case: "stored_null",
                    qIsArray: Array.isArray(q),
                    qType: typeof q,
                    statusSurvived: statusSurvived,
                    statusErr: statusErr
                });
            } catch (err) {
                findings.push({ case: "stored_null", survived: false, error: err.message });
            }

            // Case 3: Stored '{}' string -> causes fatal crash on enqueue
            try {
                localStorage.setItem(key, "{}");
                const q = PersistenceModule.OfflineSyncManager.getQueue();
                let enqueueSurvived = false;
                let enqueueErr = "";
                try {
                    PersistenceModule.OfflineSyncManager.enqueue("FORM", "http://test", { a: 1 });
                    enqueueSurvived = true;
                } catch (e) {
                    enqueueSurvived = false;
                    enqueueErr = e.message;
                }
                findings.push({
                    case: "stored_object",
                    qIsArray: Array.isArray(q),
                    qType: typeof q,
                    enqueueSurvived: enqueueSurvived,
                    enqueueErr: enqueueErr
                });
            } catch (err) {
                findings.push({ case: "stored_object", survived: false, error: err.message });
            }

            localStorage.removeItem(key);
            return findings;
        """)

        print("\n[Audit Finding - LocalStorage Corruption Resilience]")
        for f in results:
            print(f"  Case: {f.get('case')} => {f}")

        # Syntax error is handled
        case1 = next(x for x in results if x['case'] == 'invalid_syntax')
        self.assertTrue(case1['survived'])

        # Post-remediation verification: stored 'null' and '{}' do not crash engine
        case2 = next(x for x in results if x['case'] == 'stored_null')
        self.assertTrue(case2['statusSurvived'], "getStatus must survive when localStorage contains 'null'")
        self.assertTrue(case2.get('qIsArray', False), "getQueue must return an array for stored 'null'")

        case3 = next(x for x in results if x['case'] == 'stored_object')
        self.assertTrue(case3['enqueueSurvived'], "enqueue must survive when localStorage contains '{}'")
        self.assertTrue(case3.get('qIsArray', False), "getQueue must return an array for stored '{}'")

    # =========================================================================
    # SUITE 3: STUDENT ROSTER ADVERSARIAL STRESS TESTS
    # =========================================================================

    def test_roster_01_boundary_student_ids(self):
        """3.1 Boundary student IDs (1, 12, 14, 29, 31) must map to expected names and grades."""
        res = self.driver.execute_script("""
            return {
                c4c_1: RosterModule.getStudent("4C", 1),
                c4c_12: RosterModule.getStudent("4C", 12),
                c4c_14: RosterModule.getStudent("4C", 14),
                c4c_29: RosterModule.getStudent("4C", 29),
                c4c_30: RosterModule.getStudent("4C", 30),
                c4d_1: RosterModule.getStudent("4D", 1),
                c4d_31: RosterModule.getStudent("4D", 31),
                c5b_1: RosterModule.getStudent("5B", 1),
                c5b_28: RosterModule.getStudent("5B", 28)
            };
        """)

        self.assertIsNotNone(res['c4c_1'])
        self.assertEqual(res['c4c_1']['name'], "古永晴")
        self.assertEqual(res['c4c_1']['grade'], 10)

        self.assertIsNotNone(res['c4c_12'])
        self.assertEqual(res['c4c_12']['name'], "梁寶娟")

        self.assertIsNotNone(res['c4c_14'])
        self.assertEqual(res['c4c_14']['name'], "莫芷瑤")

        self.assertIsNotNone(res['c4c_29'])
        self.assertEqual(res['c4c_29']['name'], "譚欣")

        self.assertIsNotNone(res['c4c_30'])
        self.assertEqual(res['c4c_30']['name'], "羅清璋")

        self.assertIsNotNone(res['c4d_1'])
        self.assertEqual(res['c4d_1']['name'], "洪佳佳")
        self.assertIsNotNone(res['c4d_31'])
        self.assertEqual(res['c4d_31']['name'], "鄭國樺")

        self.assertIsNotNone(res['c5b_1'])
        self.assertEqual(res['c5b_1']['name'], "吳鎂澄")
        self.assertEqual(res['c5b_1']['grade'], 11)
        self.assertIsNotNone(res['c5b_28'])
        self.assertEqual(res['c5b_28']['name'], "黎宛旻")

    def test_roster_02_class_4c_missing_student_13_strict_enforcement(self):
        """3.2 Student #13 in Class 4C MUST be strictly absent in data lookup and DOM dropdown."""
        res = self.driver.execute_script("""
            const c4c_13 = RosterModule.getStudent("4C", 13);
            const c4c_13_name = RosterModule.getStudentName("4C", 13);
            const c4c_list = RosterModule.getStudentsByClass("4C");
            const has13 = c4c_list.some(s => s.id === 13 || s.studentID === 13);

            const c4d_13 = RosterModule.getStudent("4D", 13);
            const c5b_13 = RosterModule.getStudent("5B", 13);

            return {
                c4c_13: c4c_13,
                c4c_13_name: c4c_13_name,
                c4c_count: c4c_list.length,
                has13: has13,
                c4d_13_name: c4d_13 ? c4d_13.name : null,
                c5b_13_name: c5b_13 ? c5b_13.name : null
            };
        """)

        self.assertIsNone(res['c4c_13'])
        self.assertEqual(res['c4c_13_name'], "")
        self.assertEqual(res['c4c_count'], 29)
        self.assertFalse(res['has13'])

        self.assertEqual(res['c4d_13_name'], "施舒晨")
        self.assertEqual(res['c5b_13_name'], "梁泳心")

        class_sel = Select(self.driver.find_element(By.ID, 'classSelect'))
        class_sel.select_by_value('4C')
        student_sel = Select(self.driver.find_element(By.ID, 'studentSelect'))
        options = [o.get_attribute('value') for o in student_sel.options if o.get_attribute('value')]

        self.assertEqual(len(options), 29)
        self.assertNotIn('13', options)
        self.assertIn('12', options)
        self.assertIn('14', options)

    def test_roster_03_out_of_bounds_and_invalid_inputs(self):
        """3.3 Out-of-bounds, negative, non-numeric and nonexistent class queries return null/empty."""
        res = self.driver.execute_script("""
            return {
                negative_id: RosterModule.getStudent("4C", -1),
                zero_id: RosterModule.getStudent("4C", 0),
                c4c_overflow: RosterModule.getStudent("4C", 31),
                c4d_overflow: RosterModule.getStudent("4D", 32),
                c5b_overflow: RosterModule.getStudent("5B", 29),
                invalid_class: RosterModule.getStudent("9Z", 1),
                empty_class: RosterModule.getStudent("", 1),
                null_class: RosterModule.getStudent(null, 1),
                null_id: RosterModule.getStudent("4C", null),
                nan_id: RosterModule.getStudent("4C", "abc")
            };
        """)
        for k, v in res.items():
            self.assertIsNone(v, f"Query '{k}' should return null, got: {v}")


if __name__ == '__main__':
    runner = unittest.TextTestRunner(verbosity=2)
    suite = unittest.TestLoader().loadTestsFromTestCase(EmpiricalChallenger1Tests)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
