import os
import re

MATH_PLATFORM_DIR = r"d:\2627\web+\math_platform"

with open(os.path.join(MATH_PLATFORM_DIR, "js", "preloaded_faces.js"), "r", encoding="utf-8") as f:
    preloaded_faces_code = f.read()

with open(os.path.join(MATH_PLATFORM_DIR, "js", "persistence.js"), "r", encoding="utf-8") as f:
    persistence_code = f.read()

with open(os.path.join(MATH_PLATFORM_DIR, "4cd1023.html.bak"), "r", encoding="utf-8") as f:
    orig_html = f.read()

# 1. Update Inlined Persistence and add Preloaded Faces
pos1 = orig_html.find("/* Inlined from persistence.js */")
pos2 = orig_html.find("/* Inlined from questions_4cd1023.js */")

if pos1 == -1 or pos2 == -1:
    raise ValueError("Could not find persistence inlining boundary!")

inlined_replacement = (
    "/* Inlined from preloaded_faces.js */\n"
    + preloaded_faces_code
    + "\n\n/* Inlined from persistence.js */\n"
    + persistence_code
    + "\n\n"
)

html_step1 = orig_html[:pos1] + inlined_replacement + orig_html[pos2:]
print("Step 1 (Inlining): Persistence and Preloaded Faces updated.")

# 2. Add <script src="js/preloaded_faces.js"></script> tag near face-api
face_api_tag = '<script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js"></script>'
if face_api_tag in html_step1:
    html_step2 = html_step1.replace(
        face_api_tag,
        face_api_tag + '\n  <script src="js/preloaded_faces.js"></script>\n  <script src="js/persistence.js"></script>'
    )
else:
    html_step2 = html_step1
print("Step 2 (Script tags): preloaded_faces.js and persistence.js script tags added.")

# 3. Clean up Login UI in 4cd1023.html (R2)
target_demo_div = """        <!-- Camera-less Demo Mode Checkbox -->
        <div style="margin-top: 12px; padding: 10px; background: rgba(51, 65, 85, 0.4); border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
          <label style="font-size: 13px; color: #cbd5e1; display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="demoModeCheckbox" style="accent-color: var(--primary-light); width: 16px; height: 16px;">
            <span>無相機 / 模擬測試模式 (Demo Mock Mode)</span>
          </label>
          <button id="btnQuickDemoLogin" class="btn btn-secondary" style="font-size: 11px; padding: 4px 8px;">
            模擬古永晴登入
          </button>
        </div>"""

if target_demo_div in html_step2:
    html_step3 = html_step2.replace(target_demo_div, "")
    print("Step 3.1: Removed demoModeCheckbox and btnQuickDemoLogin container.")
else:
    html_step3 = re.sub(
        r'<!-- Camera-less Demo Mode Checkbox -->[\s\S]*?模擬古永晴登入\s*</button>\s*</div>',
        '',
        html_step2
    )

old_link = """        <div style="text-align: center; margin-top: 14px;">
          <a href="javascript:void(0)" id="linkGoToManualPage" style="font-size: 13px; color: var(--primary-light); text-decoration: underline;">
            首次登入或無法刷臉？前往身分選擇 ➜
          </a>
        </div>"""

new_link = """        <div style="text-align: center; margin-top: 16px;">
          <a href="javascript:void(0)" id="linkGoToManualPage" title="不方便刷脸，用密码登录" data-text-cn="不方便刷脸，用密码登录" style="font-size: 13px; color: var(--primary-light); text-decoration: underline; font-weight: 500;">
            不方便刷臉，用密碼登錄
          </a>
        </div>"""

if old_link in html_step3:
    html_step3 = html_step3.replace(old_link, new_link)
    print("Step 3.2: Replaced linkGoToManualPage text.")
else:
    html_step3 = re.sub(
        r'<a href="javascript:void\(0\)" id="linkGoToManualPage"[\s\S]*?首次登入或無法刷臉？前往身分選擇 ➜\s*</a>',
        '<a href="javascript:void(0)" id="linkGoToManualPage" title="不方便刷脸，用密码登录" data-text-cn="不方便刷脸，用密码登录" style="font-size: 13px; color: var(--primary-light); text-decoration: underline; font-weight: 500;">不方便刷臉，用密碼登錄</a>',
        html_step3
    )

# 4. Inject manual password input and alert into #cardFirstTimeSelect
old_card_select = """        <div class="form-group" style="margin-bottom: 16px;">
          <label class="form-label">確認學生姓名</label>
          <div id="studentNameBox" class="student-name-box" style="padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px;">
            <span id="studentNameDisplay" class="student-name-text">請選擇班別與學號</span>
          </div>
        </div>

        <button id="btnConfirmIdentity" class="btn btn-primary" style="width: 100%; margin-top: 8px;" disabled>
          <span>🔒 確認身分，開始答題</span>
        </button>

        <button id="btnBackToFaceFirst" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">
          <span>← 返回第一頁刷臉</span>
        </button>"""

new_card_select = """        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">確認學生姓名</label>
          <div id="studentNameBox" class="student-name-box" style="padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px;">
            <span id="studentNameDisplay" class="student-name-text">請選擇班別與學號</span>
          </div>
        </div>

        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label" for="manualPasswordInput">個人登錄密碼 (Password)</label>
          <input type="password" id="manualPasswordInput" class="form-input" placeholder="請輸入更新後的個人密碼 (預設為 1234)" inputmode="numeric" autocomplete="off" style="width: 100%; padding: 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #f8fafc; font-size: 14px; box-sizing: border-box;">
          <div id="manualLoginAlert" style="display: none; margin-top: 8px; padding: 10px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 8px; color: #fca5a5; font-size: 13px; text-align: left;"></div>
        </div>

        <button id="btnConfirmIdentity" class="btn btn-primary" style="width: 100%; margin-top: 8px;" disabled>
          <span>🔒 密碼驗證並登入</span>
        </button>

        <button id="btnBackToFaceFirst" class="btn btn-secondary" style="width: 100%; margin-top: 10px;">
          <span>← 返回第一頁刷臉</span>
        </button>"""

if old_card_select in html_step3:
    html_step4 = html_step3.replace(old_card_select, new_card_select)
    print("Step 4: Injected manualPasswordInput and alert into #cardFirstTimeSelect.")
else:
    raise ValueError("Could not find old_card_select verbatim!")

# 5. Add warning banner to #screen4-dashboard and #screen5-quiz (R5)
dash_heading = """            <h2 id="dashStudentName" style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 6px;">同學，您好！</h2>
            <p id="dashClassAndId" style="font-size: 13px; color: var(--text-muted);">4C 班 1 號</p>
          </div>
          <button id="btnLogout" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">登出</button>
        </div>"""

dash_heading_with_banner = """            <h2 id="dashStudentName" style="font-size: 20px; font-weight: 700; color: #f8fafc; margin-top: 6px;">同學，您好！</h2>
            <p id="dashClassAndId" style="font-size: 13px; color: var(--text-muted);">4C 班 1 號</p>
          </div>
          <button id="btnLogout" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">登出</button>
        </div>

        <!-- Warning banner for password-only login (R5) -->
        <div id="dashBannerPasswordOnly" class="alert-box alert-warning" style="display: none; margin-bottom: 16px; padding: 12px 16px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; color: #fcd34d; font-size: 14px; line-height: 1.5;">
          ⚠️ 由於您選擇了不方便刷臉，作答完成後，需要拍照上傳全部答題草稿，待草稿上傳完畢後，才能完成提交。
          <div style="font-size: 12px; color: #fbbf24; margin-top: 4px;">(由于您选择了不方便刷脸，作答完成后，需要拍照上传全部答题草稿，待草稿上传完毕后，才能完成提交。)</div>
        </div>"""

if dash_heading in html_step4:
    html_step5 = html_step4.replace(dash_heading, dash_heading_with_banner)
    print("Step 5.1: Added dashBannerPasswordOnly to #screen4-dashboard.")
else:
    raise ValueError("Could not find dash_heading verbatim!")

quiz_heading = """        <!-- Warning Toast for Hasty Guessing or Malicious Pattern -->
        <div id="quizHastyAlert" class="alert-box alert-warning" style="display: none; margin-bottom: 12px;"></div>"""

quiz_heading_with_banner = """        <!-- Warning Toast for Hasty Guessing or Malicious Pattern -->
        <div id="quizHastyAlert" class="alert-box alert-warning" style="display: none; margin-bottom: 12px;"></div>

        <!-- Warning banner for password-only login (R5) -->
        <div id="quizBannerPasswordOnly" class="alert-box alert-warning" style="display: none; margin-bottom: 14px; padding: 12px 16px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; color: #fcd34d; font-size: 14px; line-height: 1.5;">
          ⚠️ 由於您選擇了不方便刷臉，作答完成後，需要拍照上傳全部答題草稿，待草稿上傳完畢後，才能完成提交。
          <div style="font-size: 12px; color: #fbbf24; margin-top: 4px;">(由于您选择了不方便刷脸，作答完成后，需要拍照上传全部答题草稿，待草稿上传完毕后，才能完成提交。)</div>
        </div>"""

if quiz_heading in html_step5:
    html_step5 = html_step5.replace(quiz_heading, quiz_heading_with_banner)
    print("Step 5.2: Added quizBannerPasswordOnly to #screen5-quiz.")
else:
    raise ValueError("Could not find quiz_heading verbatim!")

# 6. Add modalDraftUpload for R5
force_pwd_modal_end = """        <button id="btnSubmitForcePassword" class="btn btn-primary" style="width: 100%; padding: 12px;">🔒 確認修改</button>
      </div>
    </div>"""

draft_modal_html = """        <button id="btnSubmitForcePassword" class="btn btn-primary" style="width: 100%; padding: 12px;">🔒 確認修改</button>
      </div>
    </div>

    <!-- MODAL: Mandatory Draft Photo Upload for Password-Only Login (R5) -->
    <div id="modalDraftUpload" class="auth-modal-overlay" style="display: none; position: fixed; inset: 0; z-index: 99998; background: rgba(15, 23, 42, 0.88); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 16px;">
      <div class="auth-modal-card" style="max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); text-align: center;">
        <div style="font-size: 44px; margin-bottom: 8px;">📷</div>
        <h3 style="margin-bottom: 6px; font-size: 18px; font-weight: 700; color: #f8fafc;">
          上傳答題草稿以完成提交
        </h3>
        <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px; line-height: 1.5;">
          由於您選擇了不方便刷臉，作答完成後，需要拍照上傳全部答題草稿，待草稿上傳完畢後，才能完成提交。
        </p>
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
          (由于您选择了不方便刷脸，作答完成后，需要拍照上传全部答题草稿，待草稿上传完毕后，才能完成提交。)
        </p>

        <div id="draftPreviewContainer" style="margin-bottom: 14px; min-height: 160px; background: #0f172a; border: 2px dashed #334155; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; overflow: hidden;">
          <img id="draftImagePreview" src="" alt="草稿預覽" style="display: none; max-width: 100%; max-height: 220px; border-radius: 6px; margin-bottom: 8px; object-fit: contain;">
          <video id="draftCameraVideo" autoplay playsinline muted style="display: none; width: 100%; max-height: 220px; border-radius: 6px; object-fit: cover; margin-bottom: 8px;"></video>
          <div id="draftPlaceholderText" style="font-size: 13px; color: #64748b;">
            尚未拍攝或選取草稿圖片
          </div>
        </div>

        <div id="draftUploadAlert" style="display: none; margin-bottom: 12px; padding: 10px; border-radius: 8px; font-size: 13px; text-align: left;"></div>

        <input type="file" id="draftFileInput" accept="image/*" capture="environment" style="display: none;">

        <div style="display: flex; gap: 8px; flex-direction: column;">
          <button id="btnTriggerDraftCamera" type="button" class="btn btn-secondary" style="padding: 10px; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>📷 開啟相機即時拍照</span>
          </button>
          <button id="btnCaptureDraftPhoto" type="button" class="btn btn-warning" style="display: none; padding: 10px; font-size: 13px; font-weight: 600;">
            <span>📸 拍攝目前畫面</span>
          </button>
          <button id="btnTriggerDraftFile" type="button" class="btn btn-secondary" style="padding: 10px; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>📁 從相簿或檔案選取草稿照片</span>
          </button>
          <button id="btnDraftUploadSubmit" type="button" class="btn btn-success" style="padding: 14px; font-size: 15px; font-weight: 700; margin-top: 6px; background: linear-gradient(135deg, #059669, #10b981);">
            <span>📷 拍照上傳答題草稿 / 拍照提交</span>
          </button>
        </div>
      </div>
    </div>"""

if force_pwd_modal_end in html_step5:
    html_step6 = html_step5.replace(force_pwd_modal_end, draft_modal_html)
    print("Step 6: Injected modalDraftUpload.")
else:
    raise ValueError("Could not find force_pwd_modal_end verbatim!")

# 7. Replace the bottom controller script
controller_start = html_step6.rfind("<script>")
if controller_start == -1:
    raise ValueError("Could not find bottom controller script!")

html_before_controller = html_step6[:controller_start]

# Read the controller template from a separate clean generator
print("Step 7: Generating clean controller script...")
