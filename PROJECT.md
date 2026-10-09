# Project: High School Math Practice Platform Upgrade (R1-R5)

## Architecture
- **Client Frontend**: Single-page application in `index.html`, vanilla ES6+, Bootstrap 5 + custom mobile styling (`css/style.css`), MathJax v3 rendering (`MathJax.typesetPromise`).
- **Face Biometrics**: `@vladmandic/face-api` (TinyFaceDetector, FaceLandmark68TinyNet, FaceRecognitionNet). 128-dimensional embedding vectors, Eye Aspect Ratio (EAR) blink liveness detection.
- **Backend / Telemetry**: Google Apps Script (GAS) Drive uploader (`gas_drive_uploader.js`), Google Forms vector submission (`mode: 'no-cors'`), Google Sheets roster lookup.
- **Offline / Local Persistence**: LocalStorage for student biometrics (`math_student_profile_<cls>_<id>`), active quiz progress preservation (`MATH_ACTIVE_QUIZ_PROGRESS`), wrong answer review cache (`math_last_round_wrong_<cls>_<id>`), and offline upload queue (`MATH_OFFLINE_QUEUE_V1`).
- **Batch Resets Architecture**: 88 standalone static HTML pages located in `resets/` with non-linear HMAC-SHA256 hex filenames, immutable pre-bound student identities, zero technical jargon, and root-relative resource imports (`../css/`, `../js/`). Cataloged via `student_face_reset_mapping.csv`.
- **E2E Test Architecture**: Python 3.12 `unittest` + Selenium Headless Chrome (`test_e2e_runner.py`), Category-Partition + BVA + Pairwise + Real-World Workload Testing across Tiers 1-5.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Wrong Question LocalStorage Schema | Record wrong answers to `math_last_round_wrong_${cls}_${id}` upon quiz completion / answer evaluation | M3 | R1 |
| F2 | Review UI in Dashboard | Add "上一輪錯題溫習" button in Dashboard and `#screen9-wrong-review` review interface | M3 | R1 |
| F3 | Question Details Display | Display stem, options with user-wrong/correct highlights, standard answer, explanation, thought steps | M3 | R1 |
| F4 | Re-test on Wrong Questions | `QuizEngine.startRetest()` to re-test wrong questions with real-time statistics update | M3 | R1 |
| F5 | MathJax Typesetting Compliance | MathJax typesetPromise on review cards ensuring LaTeX formula rendering compliance | M3 | R1 / Rule |
| F6 | StudentID Roster Audit | Parse all 88 students from `D:\2627\WEB+\StudentID.txt` (4C: 29 students excluding #13, 4D: 31, 5B: 28) | M1 | R2 |
| F7 | 88 Non-linear Reset HTMLs | Generate 88 standalone HTMLs in `resets/` with 32-hex HMAC non-linear filenames | M1 | R2 |
| F8 | Pre-bound Immutable Identity | Display class, seat number, name statically; zero dropdowns; tamper-proof | M1 | R2 |
| F9 | Pure Reset Page Appearance | 100% pure appearance: zero "128維", zero admin rules, zero demo mode toggles | M1 | R2 |
| F10 | Dual-Channel GAS Upload | Full capture, vector extraction, timestamp overwrite, and upload to Drive & Form | M1 | R2 |
| F11 | Student Reset Mapping CSV | Output `student_face_reset_mapping.csv` (班別, 學號, 姓名, 專屬重設 HTML 檔名, 相對路徑) | M1 | R2 |
| F12 | Remove Face Reset from index.html | Delete `#btnClearCurrentProfile` button and reset handlers from student interface | M2 | R3 |
| F13 | Eradicate Demo Mode from index.html | Delete `#demoModeCheckbox` and all 4 camera bypass fallback branches | M2 | R3 |
| F14 | Purify Technical Jargon | Replace all technical terms (≥85%餘弦相似度, 防作弊認證, etc.) with natural "身分驗證" | M2 | R3 |
| F15 | Floating Global Refresh Button | Floating button saving `MATH_ACTIVE_QUIZ_PROGRESS` to LocalStorage and restoring on reload | M2 | R3 |
| F16 | Google Connectivity Pre-flight Probe | Rapid pre-login probe racing Google endpoints with 3500ms timeout | M4 | R4 |
| F17 | Macau Network Signal Lock Modal | Unclosable fullscreen `#screen0-macau-lock` modal with prompt "網絡未連接到澳門，需要使用澳門網絡的信號答題" | M4 | R4 |
| F18 | Retry & Auto-Unlock Mechanism | Retry button on lock modal and auto-unlock once probe succeeds | M4 | R4 |
| F19 | 68-Landmark EAR Blink Detection | Eye Aspect Ratio algorithm on landmarks (left: 36-41, right: 42-47) | M5 | R5 |
| F20 | Blink Guidance UI & 4-State FSM | Prompt "請眨眨眼" with 4-state state machine (WAIT_OPEN -> WAIT_CLOSE -> WAIT_REOPEN -> CONFIRMED) | M5 | R5 |
| F21 | Blink Liveness on Secondary Login | Integrate blink liveness into Screen 3 face verification | M5 | R5 |
| F22 | Blink Liveness on 15-Min Freeze | Integrate blink liveness into Screen 7 periodic freeze verification | M5 | R5 |
| F23 | E2E Test Suite (Tiers 1-4) | Comprehensive requirement-driven opaque-box test suite & `TEST_READY.md` | M6 | Quality |
| F24 | Tier 5 Adversarial Hardening | White-box adversarial testing and code coverage stress hardening | M6 | Quality |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | R2: 88 Student Face Reset Pages & CSV Mapping | Parse StudentID.txt, generate 88 reset HTMLs in `resets/`, generate `student_face_reset_mapping.csv` | none | DONE |
| M2 | R3: Platform Purification & Global Refresh Button | Remove reset button & demo mode from `index.html`, purge jargon, add floating refresh & state resume | none | PLANNED |
| M3 | R1: Previous Round Wrong Answers Review Module | LocalStorage schema, review UI, re-test flow, live stats HUD, MathJax compliance | M2 | PLANNED |
| M4 | R4: Google Macau Connectivity Precheck & Lock | Google probe, unclosable lock modal, Macau signal warning, retry/auto-unlock | M2 | PLANNED |
| M5 | R5: Blink Liveness Detection (EAR & 68 Landmarks) | Landmark EAR calculation, "請眨眨眼" guidance, integrate to Screen 3 and Screen 7 | M2 | PLANNED |
| M6 | Final Verification: 100% E2E Pass & Tier 5 Hardening | Fix test runner bugs, run full E2E test suite (Tiers 1-4), adversarial coverage hardening (Tier 5) | M1, M3, M4, M5 | PLANNED |

## Interface Contracts

### M1 (Resets) ↔ Core Platform
- **File Output**: `d:/2627/WEB+/math_platform/resets/reset_<32hex>.html`
- **CSV Output**: `d:/2627/WEB+/math_platform/student_face_reset_mapping.csv`
- **Asset Contract**: `../css/style.css`, `../js/roster.js`, `../js/face_auth.js`, `../js/persistence.js`
- **LocalStorage Key Contract**: Updates `math_student_profile_${classID}_${studentID}`
- **MathJax Requirement**: Must include `<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>`

### M2 (Platform Purification) ↔ M3 (R1 Wrong Answers)
- **LocalStorage Key for Active Progress**: `MATH_ACTIVE_QUIZ_PROGRESS`
  - Fields: `{ classID, studentID, studentName, currentIndex, questionIds, totalAnswered, totalCorrect, sessionHistory, timerState }`
- **LocalStorage Key for Wrong Answers**: `math_last_round_wrong_${classID}_${studentID}`
  - Array of: `{ id, stem, userAnswer, standardAnswer, isCorrect, explanation, retested, retestCorrect }`

### M4 (Macau Lock) ↔ Platform Lifecycle
- **DOM Container**: `#screen0-macau-lock` (`z-index: 100000`, fixed fullscreen, unclosable)
- **Entry Point**: `probeMacauNetwork()` executed at `DOMContentLoaded` before `showScreen('screen1-login')`

### M5 (Blink Liveness) ↔ Face Auth Lifecycle
- **Blink Detector API**: `window.BlinkDetector = { start(videoElement, onBlinkConfirmed, onUpdateStatus), stop() }`
- **Thresholds**: EAR open > 0.24, EAR closed < 0.18, min frames closed = 1, timeout = 15s.

## Code Layout
- `d:/2627/WEB+/math_platform/index.html`: Main SPA application
- `d:/2627/WEB+/math_platform/resets/*.html`: 88 standalone reset pages
- `d:/2627/WEB+/math_platform/student_face_reset_mapping.csv`: Reset pages mapping table
- `d:/2627/WEB+/math_platform/js/face_auth.js`: Face biometric models & blink liveness
- `d:/2627/WEB+/math_platform/js/quiz_engine.js`: Quiz evaluation, review mode, re-test flow
- `d:/2627/WEB+/math_platform/js/timers.js`: Timers and 15-minute freeze logic
- `d:/2627/WEB+/math_platform/js/persistence.js`: GAS Drive uploader & Form submitter
- `d:/2627/WEB+/math_platform/css/style.css`: Styling, review screen, floating refresh button, lock modal
- `d:/2627/WEB+/math_platform/tests/`: Comprehensive E2E test suites (Tiers 1-5)
