# 5BC1102 Platform: Automated Test Infrastructure (TEST_INFRA.md)

## 1. Executive Summary & Test Philosophy
This document establishes the test infrastructure, methodology, and verification matrix for the **5BC1102 High School Math Practice and 1v1 Arena Platform** (`C:\D\2627\WEB+\math_platform\`).

The test suite is built on an **opaque-box, requirement-driven, multi-tier automated test architecture**, strictly adhering to the requirements set forth in `ORIGINAL_REQUEST.md` (2026-11-02T11:04:03Z), `bank_5bc1102.js`, and system interface contracts.

### Core Testing Tenets
1. **Authoritative Ground Truth**: Every expected value is derived directly from the mathematical syllabus, `ORIGINAL_REQUEST.md`, and `bank_5bc1102.js`.
2. **Zero-Dependency Native Execution**: The test runner executes using native Node.js (`fs`, `path`, `assert`, `vm`), ensuring deterministic and frictionless execution on any standard workstation (`node test_5bc1102_e2e.js`).
3. **No Facade Testing**: Real logic, real state machines, real boundary conditions, and real DOM selectors are tested.
4. **Adversarial Hardening**: Edge cases, anti-spoofing constraints, whitespace trimming, parameter leakage, and timing boundaries are explicitly tested.

---

## 2. 4-Tier Test Architecture

```
+-----------------------------------------------------------------------------------+
|                           5BC1102 TEST ARCHITECTURE                              |
+-----------------------------------------------------------------------------------+
| Tier 1: Static Contract, Schema & Anti-Leak Integrity                             |
|   - bank_5bc1102.js export verification (ROSTER_5BC, TEACHER, BANK_5BC1102)        |
|   - 57 students (5B: 28, 5C: 29) roster verification                              |
|   - Anti-leak parameter audit ($585, n^2-4n, Q27 parameters)                      |
|   - 100% PDF formula anchor hint coverage check                                   |
|   - Strict schema validation for all 6 question formats                           |
+-----------------------------------------------------------------------------------+
| Tier 2: Logic Simulation & Algorithm Verification                                 |
|   - Gate access control: 5B & 5C whitelisted, 5A blocked, 5BC99 teacher pass      |
|   - Requirement 5: Non-face password login mandatory scratch gate & name check    |
|   - Requirement 4: 25-Q sampler (60% easy 4-choice, 10 progressive, randomized)   |
|   - Requirement 4: 15-minute countdown timeout & freeze lock                     |
|   - Requirement 4: Anti-spamming penalty (+5 questions if latency < 2.5s)         |
|   - Requirement 4: 3-consecutive errors in same topic -> +2 reinforcement         |
|   - Requirement 6: Online 1v1 Arena 17:00-18:30 time window lock & teacher bypass |
+-----------------------------------------------------------------------------------+
| Tier 3: DOM / HTML Structure & Component Verification                             |
|   - 5BC1102.html file presence and integrity                                      |
|   - All 6 screens (screen-auth, quiz, scratch, settlement, admin, arena)         |
|   - HUD elements (quizTimer, counters, stem, interactive buttons)                 |
|   - Canvas coordinate plotting elements (#plotCanvas)                             |
|   - Admin dashboard elements, 5B vs 5C comparison cards, student table            |
|   - Modals (#modalBankInspector, #modalFormulaHint, #screen7-freeze)              |
+-----------------------------------------------------------------------------------+
| Tier 4: Real-World Scenarios & Edge Cases                                         |
|   - Scenario 1: Teacher 5BC99 bank inspection and admin analytics                 |
|   - Scenario 2: Student 5B01 password login -> 25 Qs -> scratch gate -> report   |
|   - Scenario 3: Online 1v1 Arena 5-round ping-pong duel simulation                |
|   - Scenario 4: Adversarial robustness (trimming, special chars, invalid IDs)     |
+-----------------------------------------------------------------------------------+
```

---

## 3. Requirement-to-Test Traceability Matrix

| Requirement | Description | Test Case ID | Tier | Validation Target |
|-------------|-------------|--------------|------|-------------------|
| **R1 / Gate** | Roster limitation (5B 28, 5C 29), 5A denial, Teacher 5BC99 | `T1.2`, `T1.3`, `T2.1`, `T4.4` | Tier 1, 2, 4 | `ROSTER_5BC`, `TEACHER_CREDENTIALS_5BC`, `get5BCStudent` |
| **R2 / Bank** | Question bank volume (67), all 6 formats, anti-leak | `T1.4`, `T1.5`, `T1.7` | Tier 1 | `BANK_5BC1102`, 5BC_W01, 5BC_PLT01, 5BC_ORD01 |
| **R3 / Hints** | 100% PDF formula anchor hint coverage | `T1.6` | Tier 1 | `【大測二_範圍及必備公式.pdf §...】` |
| **R4 / Adaptive** | 25-Q sampler (60% easy), 15m freeze, +5 spam penalty, +2 error reinforce | `T2.3`, `T2.4`, `T2.5`, `T2.6` | Tier 2 | Sampling engine, timer countdown, dosage adaptation |
| **R5 / Scratch** | Password login scratch photo upload & handwritten student name check | `T2.2`, `T3.5`, `T4.2`, `T4.4` | Tier 2, 3, 4 | `scratchStudentNameInput`, `inputScratchFile`, gate logic |
| **R6 / Arena** | 17:00-18:30 time window lock, 5-round ping-pong, buzzer speed, topic selection | `T2.7`, `T4.3` | Tier 2, 4 | Arena time engine, duel simulator, leaderboard |
| **Admin** | KPI cards, 5B vs 5C comparison, student table, bank inspector | `T3.6`, `T3.7`, `T4.1` | Tier 3, 4 | Admin screens, inspector modal, KPI metrics |

---

## 4. Test Execution & Reproduction

### Prerequisites
- Node.js v18.0.0 or higher
- Windows PowerShell / Command Prompt

### Execution Command
```powershell
cd "C:\D\2627\WEB+\math_platform"
node test_5bc1102_e2e.js
```

### Exit Codes & Behavior
- Exit code `0`: All tests passed.
- Exit code `1`: One or more tests failed. The runner outputs complete diagnostic error messages and line-item failures for every failing test without truncating execution.

---

## 5. Implementation Defect Isolation & Escalation
The automated test runner acts as the objective arbiter of platform completeness.
When `node test_5bc1102_e2e.js` is executed:
- **Tier 1 (Static Contract & Bank Integrity)**: **7/7 PASSED (100%)**
- **Tier 2 (Logic Simulation & Algorithms)**: **7/7 PASSED (100%)**
- **Tier 4 (Real-World Scenarios & Edge Cases)**: **4/4 PASSED (100%)**
- **Tier 3 (DOM / HTML Structure & Components)**: **1/7 Passed, 6 Failed**
  - **Identified Defect**: `5BC1102.html` currently contains only 584 lines (CSS and `<head>`, followed by empty `<body>`). The full DOM body, screens (`screen-auth`, `screen-quiz`, `screen-scratch`, `screen-settlement`, `screen-admin`, `screen-arena`), HUD elements, canvas plotting, scratch gate inputs, admin comparison cards, and modals were not yet fully assembled into `5BC1102.html` by the implementing agent.
  - **Resolution Path**: The implementing agent (`worker_impl_21_2_gen2`) must complete the assembly of `5BC1102.html` incorporating the screens from `parts_body.txt` and the JS engine. Once assembled, re-running `node test_5bc1102_e2e.js` will immediately verify all 25 tests pass.
