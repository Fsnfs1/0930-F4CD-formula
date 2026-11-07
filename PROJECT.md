# Project: MathPlatform v2 Modular Refactor & Sustainable Extensibility

## Architecture
- **Core Philosophy (D11, D12, D13, S1–S6)**: Minimalist, sustainable modular architecture ("不折騰、小步快跑、零改動既有數據"). Directly reuses all existing repository data (`js/roster.js`, `js/preloaded_faces.js`, `js/quiz1023_encrypted_store.js`, `quiz_results/*`, `js/bank_*.js`, `js/questions_*.js`, `resets/*`) and existing Google Cloud endpoints (`Google Form`, `GAS Drive Uploader`, `GAS Sheet Reader`) via a central declarative registry (`core/registry.js`) and concise UMD modules in `core/`.
- **Unidirectional Module Dependency Graph (`core/`)**:
  - **Foundation Layer**:
    - `core/config.js` (`window.MathCoreConfig` — already created): Single source of truth for endpoints, sync timers (24h practice, 60s online batch, 3.5s probe, 30s netwatch), crypto params, adaptive defaults, bonus defaults, games catalog, arena schedule, points rules, and storage keys.
    - `core/crypto.js` (`window.MathCoreCrypto` — already created): PBKDF2-HMAC-SHA256 (100k iterations) + AES-256-GCM per-student encryption/decryption, HMAC-SHA256 event batch/submission signing (`sig`, S4), server verifier hash (S3), and `R-xxxxxxxx` deterministic research anonymization (D6).
    - `core/registry.js` (`window.MathPlatformRegistry`): Central declarative registry for `classes`, `extraRoster`, `banks`, `exams`, `scorePacks`, `bonusRules`, and `games`, plus runtime registration helpers (`registerBank`, `registerExam`, `registerScorePack`, `registerBonusRule`, `registerGame`, `registerClass`, `getMergedRoster`, `exportRegistrySnippet`).
    - `core/storage.js` (`window.MathCoreStorage`): IndexedDB (`MathPlatformV2DB` / `interaction_events`) with automatic LocalStorage fallback (`MP_V2_*`), monotonic `seq` counter (`MP_V2_SEQ_COUNTER`), active quiz breakpoint state (`MP_V2_ACTIVE_QUIZ`), wrong question bank (`MP_V2_WRONG_QUESTIONS`), and persistent offline outbox queue (`MP_V2_OUTBOX`).
    - `core/netwatch.js` (`window.MathCoreNetwatch`): Dual-layer network region monitor (30s interval + `online`/`offline` listeners). Layer 1: Google endpoint probe (3.5s timeout). Layer 2 (optional for exam): IP geo `country=MO` check with automatic fallback to Layer 1. Emits 3 states: `🟢` (`online_macau`), `🟡` (`restricted_mainland`), `🔴` (`offline`), logs state transitions, and triggers sequential offline queue flush upon returning to `🟢`.
    - `core/api.js` (`window.MathCoreApi`): Unified gateway for Google Form POST (auto-chunking batches > 40 events), `navigator.sendBeacon` flush on `pagehide`, GAS Drive photo upload, GAS Sheet reader, and `scorePacks` adapters (`quiz1023_store`, `enc_folder` for `F4CD_1030_SECRET_`, and `sheet_live`).
    - `core/sync.js` (`window.MathCoreSync`): Implements D1 sync policies — granular keyboard/click/hint event capture with `clientTs` and `seq`; 24-hour batch sync for Offline Practice (A2); 1-minute micro-batch POST for Online Drill/Exam/Games/Arena with immediate `pagehide`/`sendBeacon` flush on close or submit.
  - **Identity & Security Layer**:
    - `core/auth.js` (`window.MathCoreAuth`): Teacher-issued secret key login (S1/S2), local profile lookup/decryption across `js/roster.js` + `registry.extraRoster`, session token issuance (`MP_V2_SESSION`), first-login Research Informed Consent modal check & withdrawal toggle (D6), and teacher authentication.
    - `core/face.js` (`window.MathCoreFace`): Exam check-in handler at 3 checkpoints (start, random mid-exam, submit) supporting **2-choose-1**: ① Face photo (with optional `js/face_auth.js` / `js/preloaded_faces.js` verification) OR ② Photo of scratch paper with handwritten signature + date uploaded to Drive.
    - `core/guard.js` (`window.MathCoreGuard`): Exam security guards (A4) — server-authoritative countdown timer (default 15 min, auto-submit on expiry, flags offline overtime answers `clientTs > deadline` for teacher review in A9), tab-switch/blur/visibilitychange listener with warning & threshold auto-submit, and Macau network guard integration.
  - **Learning, Economy & Presentation Layer**:
    - `core/content.js` (`window.MathCoreContent` & `window.QuestionTypes`): Normalizes existing question banks (`QUESTIONS_4CD1023`, `BANK_4CD_T2` [`.exam` & `.practice`], `BANK_4CD_1102_ADAPTIVE`, `BANK_5BC1102`) in-memory without modifying `js/*.js` files; standardizes `topic`/`category` -> `topic` and `hint` -> `hints: [...]`; provides pluggable `QuestionTypes.register(type, { render, grade })` for all **7 question types** (`single_choice`, `multi_select`, `matching`, `step_order`, `error_find`, `graph_plot`, ` upload_solution`) + MathJax v3 rendering.
    - `core/engine.js` (`window.MathCoreEngine`): Unified Practice (A2), Online Adaptive Drill (A3), Exam (A4), and Wrong-Question Review/Redo (A5) state machine. Includes the **Unified Adaptive Plugin** (`baseQuota: 25`, `maxQuota: 60`, `tierOrder: [[4,0.5],[6,0.2],[8,0.3]]`, rules: `hasty` <3000ms +5, `wrongStreak` 3 -> +3/+2 same topic/adaptive pool, `malicious` all-8x3 / hasty>=5 / samePatternx4 -> 60, `prevWrong` priority), progressive hints (`hint_use` logging + optional deduction), and teacher-configurable feedback timing (`immediate`, `after_submit`, `after_publish`).
    - `core/bonus.js` (`window.MathCoreBonus`): Automated Bonus Rules Engine (A8) and Points Economy & Mall Ledger (A13) + Network Arena Pairing/Match Controller (A12). Implements `finalScore = Math.max(raw, Math.min(raw + autoBonus + redeemedBonus, capScore))` (default cap 60, shared between A8 auto-bonus and A13 points redemption) and points earning/spending rules with `待入账` offline status.
    - `core/game-bridge.js` (`window.GameBridge`): ~40-line bridge for `games/328.HTML`, `games/2.HTML`, `games/4.html`. Exposes `GameBridge.report({ score, win, durationMs, gameId })`, binds real-name student session, calculates `win_speed` score (`100 + Math.max(0, 60 - durationSec)`) for Nim games (D10), maintains unified Top 10 daily/weekly leaderboard, and enforces 30-min/day server-accumulated anti-addiction timer (5-min warning, lock at 0, points extension).
    - `core/ui.js` (`window.MathCoreUI`): Shared UI components (`showScreen`, `Modal`, `Toast`, `formatMMSS`, network status banner `🟢/🟡/🔴`, pending outbox badge `待提交 N 笔`, leaderboard renderer respecting teacher privacy mode).
- **Clean Experience Entry Points**:
  - `app.html` (and clean modular entry in `index.html` while preserving legacy HTML files untouched or archived per D11/D12): Student unified portal hosting **A1 Gate**, **A2 Practice**, **A3 Drill**, **A4 Exam**, **A5 Review**, **A6 Me (Scores/Bonus/Leaderboard/Consent)**, **A7 Help & Q&A**, **A8 Bonus Rules View**, **A11 Math Games Hall**, **A12 Network Arena**, and **A13 Points & Mall**.
  - `teacher.html`: Strictly isolated Teacher Console (**A9 Teacher**) — score overview, reason-free score fine-tuning with audit log (D3), photo/scratch paper & upload grading, overtime offline submission review, per-exam leaderboard display setting (Section 六), student Q&A reply (D2/A7), Points Mall confirmation & abnormal points revocation (A13), Macau holiday editor (A12), parental consent toggle & `R-xxxxxxxx` Research Anonymized CSV Export (D6), key generator (S1), and visual **Registry Config Generator** (Section 九).
  - `tools/offline_tools.js`: Offline CLI/Node utility (**A10 Tools**) — batch key generation, roster encryption (`data/roster.enc.json`), AI heuristic difficulty tagger (levels 1–3) + weekly IRT calibration calculator (D4), and bank validator.

## Feature Inventory
Every feature from the Survey phase (`spec_miner_survey_1`, `explorer_survey_2`, `explorer_survey_3`) appears below with its assigned milestone. No feature is left unassigned.

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Granular Event Logging & 1-Min Online Batch Sync (D1, S4, S6) | Capture all keyboard/click/hint events to IndexedDB/storage with `clientTs` & monotonic `seq`, HMAC signature `sig`; batch POST every 1 min in online modes; flush immediately via `pagehide` + `sendBeacon`; auto-chunk batches > 40 events | M1 | Survey F1 / Edge E1, E2, E7 |
| F2 | Offline Practice 24-Hour Batch Sync (D1) | Save practice answers immediately to local storage; POST batch to Google Form only when `now - lastPracticeSyncTs >= 24h` and network is `🟢` | M1 | Survey F2 / Edge E3 |
| F3 | Key-Based Auth, Local Decryption & Red-Line Preservation (S1–S4, D11) | Teacher-generated student keys (≥8 chars), PBKDF2 + AES-GCM profile encryption/decryption, HMAC event signing, 100% zero modification to existing `js/*`, `quiz_results/*`, `resets/*` | M1 | Survey F3 / Edge E14 |
| F4 | Gate App (門禁系統 A1) | Unified student login, local profile lookup/decryption, session token, first-login Research Informed Consent modal (D6), network state badge (`🟢/🟡/🔴`), pending offline count (`待提交 N 笔`), registry-driven navigation cards | M3 | Survey F4 / Edge E13 |
| F5 | Offline Practice App (離線練習 A2) | Pure local practice from `registry.banks` (random/sequential), progressive hints, local persistence, ≥24h sync, +1 pending point per correct answer | M3 | Survey F5 |
| F6 | Online Adaptive Drill App (聯網刷題 A3) | Online drill from `registry.exams`, 1-min event batching, unified adaptive engine, configurable feedback mode, +2/+3 points, continues seamlessly in `🟡/🔴` network with auto-submit banner | M3 | Survey F6 |
| F7 | Exam / Quiz App (測驗/考試 A4) | Formal timed exam (default 15m server time), tab-switch/blur guard, 3-point photo check-in (face OR signed+dated scratch paper), breakpoint resume, hint button (D9), configurable feedback timing (`immediate`, `after_submit`, `after_publish`), hides other apps during exam | M3 | Survey F7 / Edge E6, E10 |
| F8 | Wrong Question Review App (錯題回顧 A5) | Aggregates wrong questions across A2–A4, explanations, filter by topic or error type, redo flow (+1 point per correct redo) | M3 | Survey F8 |
| F9 | My Scores & Profile App (我的成績 Me A6) | Displays scores across all `registry.scorePacks` (`quiz1023_store`, `enc_folder` `F4CD_1030_SECRET_`, `sheet_live`), personal trend, bonus breakdown, teacher-configured leaderboard, Q&A replies (D2), pending offline count, consent withdrawal toggle (D6) | M3 | Survey F9 |
| F10 | Help & Teacher Q&A App (求助交流 A7) | In-question progressive hints (`hints: [...]`, logs `hint_use` & optional deduction) + ask teacher with question context/screenshot; reads teacher replies from Sheet once on login (D2) | M3 | Survey F10 |
| F11 | Automated Bonus Rules Engine (加分規則 A8) | Declarative `registry.bonusRules` (e.g., Drill > 80 -> +1 per point), teacher-configurable cap per quiz (default 60), shared cap with points redemption: `max(raw, min(raw + auto + redeemed, cap))`, full source breakdown | M2 | Survey F11 / Edge E9 |
| F12 | Teacher Dashboard App (老師台 A9 — `teacher.html`) | Isolated teacher console: score overview, reason-free score fine-tuning with audit log (D3), photo/scratch/upload grading, overtime offline submission review (E6), per-exam ranking display config, Q&A reply, Points Mall confirmation & revocation, Macau holiday config, parental consent & `R-xxxxxxxx` Research CSV export (D6), key generator, visual **Registry Config Generator** | M4 | Survey F12 |
| F13 | Offline Teacher/Dev Tools (工具 A10 — `tools/offline_tools.js`) | Offline utility for batch key generation (S1), encrypted roster build (`data/roster.enc.json`, S2), AI difficulty auto-tagging (1–3) & weekly IRT calibration (D4), and `.docx`/JSON bank validation | M4 | Survey F13 |
| F14 | Math Games Hub & GameBridge (數學遊戲 A11 & `core/game-bridge.js`) | `core/game-bridge.js` + 1-line hook in `games/328.HTML`, `games/2.HTML`, `games/4.html`; `win_speed` scoring (`100 + max(0, 60 - sec)`) for Nim games (D10); real-name Top 10 leaderboard; 30-min/day server-accumulated anti-addiction timer (5m warning, lock at 0, points extension) | M2, M3 | Survey F14 / Edge E11 |
| F15 | Network Arena App (網絡擂台賽 A12) | Open Mon–Fri 17:00–19:30, Sat/Sun/Macau Holidays 08:00–19:30; student opt-in waiting pool, system random pairing (same grade priority, D7), 1-min dual-confirm window, shared PRNG seed question set, 5s opponent progress poll (stops after 2m lobby wait, zero poll when idle), +10 win / +2 loss points, requires `🟢` network | M2, M4 | Survey F15 / Edge E12 |
| F16 | Points System & Mall App (積分系統 A13) | Append-only Sheet ledger + local `待入账` cache; earns points across A2–A12 with daily cap; spends points on quiz bonus (capped by A8), extra game time, or Points Mall items (teacher confirmed in A9) | M2, M3 | Survey F16 |
| F17 | 7 Pluggable Question Types (`core/content.js`) | `QuestionTypes.register(type, { render, grade })` for: 1. `single_choice` (单选), 2. `multi_select` (多选, all/partial), 3. `matching` (配对 n↔m), 4. `step_order` (步骤排序, exact/LCS ratio), 5. `error_find` (找错题, step pos + error type), 6. `graph_plot` (作图题, coordinate/intersection/endpoint within tolerance), 7. `upload_solution` (解答上传题, camera upload -> A9 grading) | M2 | Survey F17 |
| F18 | Unified Adaptive Question Engine (D8, `core/engine.js`) | Single adaptive engine across all banks (`4CD` & `5BC`): `baseQuota: 25`, `maxQuota: 60`, `tierOrder: [[4,0.5],[6,0.2],[8,0.3]]`, rules for `hasty` (<3s -> +5), `wrongStreak` (3 -> +3/+2 in topic/category/adaptive pool), `malicious` (all8x3 / hasty>=5 / samePatternx4 -> 60), `prevWrong` priority; logs `adaptive_add` events | M2 | Survey F18 / Edge E8 |
| F19 | Dual-Layer Network Region Monitor (`core/netwatch.js`) | 30s interval + online/offline events; Layer 1 Google probe (3.5s timeout) + Layer 2 optional Macau IP geo (`country=MO`, fallback to Layer 1); `🟢/🟡/🔴` states; logs transitions; auto-flushes IndexedDB queue sequentially by `seq` on `🟢` and shows `"已提交 N 笔 ✓"` | M1 | Survey F19 / Edge E4, E5 |
| F20 | Research Ethics Consent & HMAC Anonymized Export (D6) | Macau Law 8/2005 first-login consent modal at A1 (versioned, zero penalty if declined), anytime withdrawal in A6, parental consent flag in A9, `R-` + HMAC-SHA256(sid, secret) anonymized CSV export stripping PII and excluding non-consented students | M1, M4 | Survey F20 / Edge E13 |
| F21 | Central Registry & 5+1 Zero-Code-Change Extension Scenarios (`core/registry.js`) | `window.MathPlatformRegistry` supporting zero-engine-code expansion for: ① new bank/exam, ② new bonus rule, ③ new scorePack (`quiz1023_store`, `enc_folder`, `sheet_live`), ④ new game, ⑤ new class/students (`extraRoster`), ⑥ new question type (`QuestionTypes.register`) | M1 | Survey F21 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Foundation: Registry, Storage, Netwatch, API, Sync & Auth (`core/`) | Implement `core/registry.js`, `core/storage.js`, `core/netwatch.js`, `core/api.js` (including `quiz1023_store`, `enc_folder`, `sheet_live` adapters), `core/sync.js`, `core/auth.js`, `core/ui.js` (F1, F2, F3, F19, F20-core, F21) | none | IN_PROGRESS |
| M2 | Learning, Adaptive, 7 Question Types, Bonus/Points/Arena & GameBridge (`core/`) | Implement `core/content.js` (7 question types + bank normalization), `core/engine.js` (Practice/Drill/Exam/Review + Unified Adaptive Engine), `core/face.js`, `core/guard.js`, `core/bonus.js` (Bonus A8 + Points A13 + Arena A12 logic), `core/game-bridge.js` (F11, F14-core, F15-core, F16-core, F17, F18) | M1 | PLANNED |
| M3 | Student Unified Portal & Games Integration (`index.html`, `games/*`) | Build clean registry-driven student experience in `index.html` covering A1 Gate, A2 Practice, A3 Drill, A4 Exam, A5 Review, A6 Me, A7 Help, A8 Bonus view, A11 Games Hall, A12 Arena UI, A13 Points Mall UI + inject 1-line `GameBridge.report` hook into `games/328.HTML`, `games/2.HTML`, `games/4.html` (F4–F10, F14-ui, F15-ui, F16-ui) | M1, M2 | PLANNED |
| M4 | Teacher Console (`teacher.html`) & Offline Tools (`tools/offline_tools.js`) | Build isolated `teacher.html` (A9: score overview, reason-free fine-tuning, photo/upload grading, overtime review, ranking display config, Q&A reply, Mall approval, Macau holidays, parental consent & `R-xxxxxxxx` Research CSV export, visual Registry Config Generator) and `tools/offline_tools.js` + `data/roster.enc.json` (A10: key gen, roster encryption, AI difficulty tagger & IRT calibrator) (F12, F13, F20-export) | M1, M2 | PLANNED |
| M5 | Final Milestone: 100% E2E Pass (Tiers 1–4) & Adversarial Coverage Hardening (Tier 5) | Phase 1: Pass 100% of E2E test suite (`TEST_READY.md` Tiers 1–4). Phase 2: White-box Challenger -> Worker -> Reviewer adversarial hardening loop (Tier 5) + `scope_minimal_change_reviewer` red-line verification | M1, M2, M3, M4, E2E_Track | PLANNED |

## Interface Contracts

### 1. `core/registry.js` (`window.MathPlatformRegistry`) ↔ All Modules & Apps
- **Global Object**: `window.MathPlatformRegistry` (also CommonJS export)
- **Properties**:
  - `classes`: `['4C', '4D', '5B', '5C']`
  - `extraRoster`: `Array<{ id, name, grade, classID }>` (merged dynamically with `window.ROSTER_DATA` via `getMergedRoster()` without touching `js/roster.js`)
  - `banks`:
    - `{ id: '4cd_1023', title: '高一 1023 函數題庫', globalVar: 'QUESTIONS_4CD1023', script: 'js/questions_4cd1023.js', classes: ['4C','4D'] }`
    - `{ id: '4cd_1102', title: '高一 1102 函數進階題庫', globalVar: 'BANK_4CD_T2', subKey: 'all', script: 'js/bank_4cd_t2.js', adaptiveVar: 'BANK_4CD_1102_ADAPTIVE', adaptiveScript: 'js/bank_4cd_1102_adaptive.js', classes: ['4C','4D'] }`
    - `{ id: '5bc_1102', title: '高二 1102 空間幾何與數列題庫', globalVar: 'BANK_5BC1102', script: 'js/bank_5bc1102.js', classes: ['5B','5C'] }`
  - `exams`:
    - `{ id: 'drill_4cd_1023', title: '4CD 1023 函數自適應刷題', bankId: '4cd_1023', mode: 'drill', classes: ['4C','4D'], timeLimitMin: 15, feedbackMode: 'immediate', adaptive: { ... } }`
    - `{ id: 'drill_4cd_1102', title: '4CD 1102 函數進階聯網刷題', bankId: '4cd_1102', mode: 'drill', classes: ['4C','4D'], timeLimitMin: 15, feedbackMode: 'immediate', adaptive: { ... } }`
    - `{ id: 'exam_4cd_1102', title: '4CD 1102 隨堂小測', bankId: '4cd_1102', subKey: 'exam', mode: 'exam', classes: ['4C','4D'], timeLimitMin: 15, feedbackMode: 'after_submit', adaptive: false, guard: { macau: true, tabSwitchLimit: 3, photoCheck: true } }`
    - `{ id: 'drill_5bc_1102', title: '5BC 1102 聯網自適應刷題', bankId: '5bc_1102', mode: 'drill', classes: ['5B','5C'], timeLimitMin: 15, feedbackMode: 'immediate', adaptive: { wrongStreakAddCount: 2, wrongStreakScope: 'category' } }`
    - `{ id: 'exam_5bc_1102', title: '5BC 1102 隨堂測驗', bankId: '5bc_1102', mode: 'exam', classes: ['5B','5C'], timeLimitMin: 15, feedbackMode: 'after_submit', adaptive: true, guard: { macau: true, tabSwitchLimit: 3, photoCheck: true } }`
  - `scorePacks`:
    - `{ id: 'quiz_1023', title: '1023 隨堂小測', classes: ['4C','4D','5B'], adapter: 'quiz1023_store', script: 'js/quiz1023_encrypted_store.js' }`
    - `{ id: 'quiz_1030', title: '1030 加密考卷詳情', classes: ['4C','4D','5B'], adapter: 'enc_folder', folder: 'quiz_results', indexFile: 'quiz_results/index.json', saltPrefix: 'F4CD_1030_SECRET_' }`
    - `{ id: 'quiz_1106', title: '1106 隨堂小測', classes: ['4C','4D','5B','5C'], adapter: 'sheet_live' }`
  - `bonusRules`:
    - `{ id: 'bonus_1106_4cd', targetScorePackId: 'quiz_1106', sourceExamId: 'drill_4cd_1102', classes: ['4C','4D'], threshold: 80, perPoint: 1, capScore: 60 }`
    - `{ id: 'bonus_1106_5bc', targetScorePackId: 'quiz_1106', sourceExamId: 'drill_5bc_1102', classes: ['5B','5C'], threshold: 80, perPoint: 1, capScore: 60 }`
  - `games`:
    - `{ id: 'trig-ratio', title: '三角比極速挑戰', path: 'games/328.HTML', scoringMode: 'native' }`
    - `{ id: 'bash-nim', title: '高級巴什博弈挑戰', path: 'games/2.HTML', scoringMode: 'win_speed' }`
    - `{ id: 'ring-nim', title: '高級套圈博弈挑戰', path: 'games/4.html', scoringMode: 'win_speed' }`

### 2. `core/storage.js` ↔ `core/sync.js` ↔ `core/api.js` ↔ `core/netwatch.js`
- **Unified Event Schema**:
  `{ token, sid, classID, studentID, examId, qid, action, payload, clientTs, seq, sig, offline }`
- **`MathCoreStorage` API**:
  - `appendEvent(eventObj)` -> assigns monotonic `seq`, saves to IndexedDB & outbox queue.
  - `getPendingEvents(filterFn)` / `markEventsSynced(seqArray)` / `getPendingCount()`.
  - `saveActiveQuizState(state)` / `loadActiveQuizState()` / `clearActiveQuizState()`.
  - `saveWrongQuestion(sid, item)` / `getWrongQuestions(sid, filter)` / `markWrongQuestionRetested(sid, qid, isCorrect)`.
- **`MathCoreNetwatch` API**:
  - `start()`, `stop()`, `probeNow()`, `getState()` -> returns `{ status: 'GREEN' | 'YELLOW' | 'RED', label: '🟢' | '🟡' | '🔴', isMacau: boolean, lastCheckedTs, transitions: [...] }`.
  - `onChange(callback)`.
- **`MathCoreSync` API**:
  - `recordAction(action, payload, context)` -> logs every keyboard/click/hint/answer/adaptive_add event with `clientTs` and `seq`.
  - `flushOnlineBatch(options)` -> runs every 60s in online modes or immediately on submit/`pagehide` (`useBeacon: true`).
  - `flushPracticeIfDue(force)` -> checks `now - lastPracticeSyncTs >= 24h` before syncing practice events.

### 3. `core/content.js` & `core/engine.js` ↔ Question Types & Adaptive Rules
- **`QuestionTypes` API**:
  - `QuestionTypes.register(typeName, { render(question, container, ctx), grade(question, userAnswer) })`
  - Built-in registered types: `'single_choice'`, `'multi_select'`, `'matching'`, `'step_order'`, `'error_find'`, `'graph_plot'`, `'upload_solution'`.
- **`MathCoreEngine` API**:
  - `createSession(config)` -> initializes Practice (`mode: 'practice'`), Drill (`mode: 'drill'`), Exam (`mode: 'exam'`), or Review (`mode: 'review'`).
  - `submitAnswer(userAnswer, durationMs)` -> grades via `QuestionTypes.grade`, evaluates adaptive rules (`hasty`, `wrongStreak`, `malicious`, `prevWrong`), logs telemetry event, updates wrong question store, returns `{ isCorrect, score, feedbackAllowed, adaptiveAdded, quota, completed }`.
  - `requestHint()` -> reveals next hint in `question.hints`, increments hint usage count, logs `hint_use` event, applies optional hint deduction.

### 4. `core/bonus.js` & `core/game-bridge.js` ↔ Apps (A8, A11, A12, A13)
- **`MathCoreBonus` API**:
  - `calculateQuizFinalScore({ rawScore, drillScore, redeemedBonus, rule })` -> returns `{ rawScore, autoBonus, redeemedBonus, capScore, finalScore, appliedBonus }`.
  - `PointsLedger`: `awardPoints(sid, source, amount, meta)`, `redeemPoints(sid, targetType, cost, meta)`, `getBalance(sid)` -> `{ confirmed, pending, history }`, `revokePoints(sid, entryId, teacherId)`.
  - `ArenaManager`: `isOpenNow(dateOrTs, arenaConfig)`, `joinWaitingPool(student)`, `pollMatchStatus(sid)`, `confirmMatch(matchId, sid)`, `submitArenaProgress(matchId, sid, progress)`, `settleMatch(matchId)`.
- **`window.GameBridge` API (`core/game-bridge.js`)**:
  - `GameBridge.init(gameId)` -> checks student login session and remaining daily 30-min quota (`dailyFreeLimitMs` + redeemed extra minutes), starts play timer, warns at 5 min left, locks at 0.
  - `GameBridge.report({ gameId, score, win, durationMs, mode })` -> computes standardized score (`native` for `trig-ratio`, `100 + Math.max(0, 60 - Math.floor(durationMs/1000))` for `bash-nim` & `ring-nim` wins), updates real-name Top 10 leaderboard, awards Top 10 points (+5), and queues event for 1-min sync.

## Code Layout
- **Protected Red-Line Data Files (READ-ONLY — NEVER MODIFY)**:
  - `js/roster.js`, `js/preloaded_faces.js`, `js/quiz1023_encrypted_store.js`, `quiz_results/*`, `js/questions_4cd1023.js`, `js/bank_4cd_t2.js`, `js/bank_4cd_1102_adaptive.js`, `js/bank_5bc1102.js`, `js/questions_g10.js`, `js/questions_g11.js`, `resets/*`, `student_face_reset_mapping.csv`.
- **Core Modules (`core/` — Owned by M1 & M2)**:
  - M1 owns: `core/config.js`, `core/crypto.js`, `core/registry.js`, `core/storage.js`, `core/netwatch.js`, `core/api.js`, `core/sync.js`, `core/auth.js`, `core/ui.js`.
  - M2 owns: `core/content.js`, `core/engine.js`, `core/face.js`, `core/guard.js`, `core/bonus.js`, `core/game-bridge.js`.
- **Student Portal & Game Hooks (Owned by M3)**:
  - `index.html` (and `css/style.css` additions if needed), plus minimal 1-line `GameBridge.report` hook integration in `games/328.HTML`, `games/2.HTML`, `games/4.html`.
- **Teacher Portal & Offline Tools (Owned by M4)**:
  - `teacher.html`, `tools/offline_tools.js`, `data/roster.enc.json`.
- **E2E Test Suite (Owned by E2E Testing Track & M5)**:
  - `TEST_INFRA.md`, `TEST_READY.md`, `tests/run_e2e.js`, `tests/tier1_features.test.js`, `tests/tier2_boundaries.test.js`, `tests/tier3_combinations.test.js`, `tests/tier4_scenarios.test.js`, `tests/tier5_adversarial.test.js`.
