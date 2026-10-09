# E2E Test Infra: High School Math Practice Platform

## Test Philosophy
- Opaque-box, requirement-driven.
- Automated execution via Python 3.12 `unittest` and Selenium 4 (Headless Chrome).
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial Testing + Real-World Workload Testing across Tiers 1-5.

## Feature Inventory & Test Coverage Goals
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Workloads) |
|---|---------|--------|:-----------------:|:-----------------:|:-----------------:|:------------------:|
| F1-F5 | R1: 錯題溫習模組 & MathJax | ORIGINAL_REQUEST §R1 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F6-F11 | R2: 88位學生重設頁面 & CSV | ORIGINAL_REQUEST §R2 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F12-F15 | R3: 純淨化、禁用測試模式、全局刷新 | ORIGINAL_REQUEST §R3 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F16-F18 | R4: Google 澳門網絡探針與鎖定 | ORIGINAL_REQUEST §R4 | ≥5 cases | ≥5 cases | ✓ | ✓ |
| F19-F22 | R5: 眨眼活體檢測 (EAR & 68點) | ORIGINAL_REQUEST §R5 | ≥5 cases | ≥5 cases | ✓ | ✓ |

## Test Architecture
- **Test Runner**: `python tests/test_e2e_runner.py`
- **Unit & Feature Suites**:
  - `tests/test_tier1_features.py` (Tier 1: Feature verification across R1-R5)
  - `tests/test_tier2_boundary.py` (Tier 2: Boundary, invalid inputs, edge cases)
  - `tests/test_tier3_interactivity.py` (Tier 3: Pairwise combinations, event handling)
  - `tests/test_tier4_workloads.py` (Tier 4: Realistic end-to-end student exam scenarios)
  - `tests/test_tier5_adversarial.py` (Tier 5: Adversarial, anti-spoofing, integrity stress)

## Test Environment Considerations
- Browser testing uses Selenium Headless Chrome with `--use-fake-ui-for-media-stream` and `--use-fake-device-for-media-stream`.
- Python 3.12 without external node/npm dependencies.
- Fix identified `GAS_DIR` path bug (`d:/2627/WEB+/gas` vs `math_platform/gas`).
