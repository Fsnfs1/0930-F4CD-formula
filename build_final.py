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
html_s1 = orig_html[:pos1] + inlined_replacement + orig_html[pos2:]

# 2. Add script tags near face-api
face_api_tag = '<script src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.min.js"></script>'
html_s2 = html_s1.replace(
    face_api_tag,
    face_api_tag + '\n  <script src="js/preloaded_faces.js"></script>\n  <script src="js/persistence.js"></script>'
)

# 3. Clean up Login UI in 4cd1023.html (R2)
html_s3 = re.sub(
    r'<!-- Camera-less Demo Mode Checkbox -->[\s\S]*?模擬古永晴登入\s*</button>\s*</div>',
    '',
    html_s2
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
html_s3 = html_s3.replace(old_link, new_link)

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

html_s4 = html_s3.replace(old_card_select, new_card_select)

# 5. Warning banner to #screen4-dashboard and #screen5-quiz (R5)
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

html_s5 = html_s4.replace(dash_heading, dash_heading_with_banner)

quiz_heading = """        <!-- Warning Toast for Hasty Guessing or Malicious Pattern -->
        <div id="quizHastyAlert" class="alert-box alert-warning" style="display: none; margin-bottom: 12px;"></div>"""

quiz_heading_with_banner = """        <!-- Warning Toast for Hasty Guessing or Malicious Pattern -->
        <div id="quizHastyAlert" class="alert-box alert-warning" style="display: none; margin-bottom: 12px;"></div>

        <!-- Warning banner for password-only login (R5) -->
        <div id="quizBannerPasswordOnly" class="alert-box alert-warning" style="display: none; margin-bottom: 14px; padding: 12px 16px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 8px; color: #fcd34d; font-size: 14px; line-height: 1.5;">
          ⚠️ 由於您選擇了不方便刷臉，作答完成後，需要拍照上傳全部答題草稿，待草稿上傳完畢後，才能完成提交。
          <div style="font-size: 12px; color: #fbbf24; margin-top: 4px;">(由于您选择了不方便刷脸，作答完成后，需要拍照上传全部答题草稿，待草稿上传完毕后，才能完成提交。)</div>
        </div>"""

html_s5 = html_s5.replace(quiz_heading, quiz_heading_with_banner)

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

html_s6 = html_s5.replace(force_pwd_modal_end, draft_modal_html)

# 7. Write controller script
controller_start = html_s6.rfind("<script>")
html_base_prefix = html_s6[:controller_start]

with open(os.path.join(MATH_PLATFORM_DIR, "controller_code.js"), "r", encoding="utf-8") as f:
    controller_js = f.read()

final_4cd1023 = html_base_prefix + "<script>\n" + controller_js + "\n</script>\n</body>\n</html>\n"

with open(os.path.join(MATH_PLATFORM_DIR, "4cd1023.html"), "w", encoding="utf-8") as f:
    f.write(final_4cd1023)
print("4cd1023.html generated successfully.")

# 8. Create 1023-test.html
# Add #testControlCard into #screen1-roster
test_card_html = """        <!-- Dedicated Test & Password Reset Control Card (R4) -->
        <div id="testControlCard" style="margin-top: 16px; padding: 16px; background: rgba(30, 41, 59, 0.95); border: 2px solid #38bdf8; border-radius: 12px; text-align: left;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 16px; font-weight: 700; color: #38bdf8; margin: 0;">
              🧪 測試控制台與密碼重設 (1023-Test)
            </h3>
            <span style="font-size: 11px; padding: 2px 8px; background: #0369a1; color: #e0f2fe; border-radius: 10px; font-weight: 600;">測試專用</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
            <div>
              <label for="testClassSelect" style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600;">選擇班別</label>
              <select id="testClassSelect" class="form-select" style="width: 100%; padding: 8px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 13px;">
                <option value="4C" selected>4C 班 (高一)</option>
                <option value="4D">4D 班 (高一)</option>
              </select>
            </div>
            <div>
              <label for="testStudentSelect" style="font-size: 12px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600;">選擇學生</label>
              <select id="testStudentSelect" class="form-select" style="width: 100%; padding: 8px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 13px;">
              </select>
            </div>
          </div>

          <!-- One-click Mock Login Button -->
          <div style="margin-bottom: 14px;">
            <button id="btnTestMockLogin" type="button" class="btn btn-primary" style="width: 100%; padding: 11px 14px; font-size: 14px; font-weight: 600; background: linear-gradient(135deg, #0284c7, #2563eb);">
              <span>不刷臉，模擬 古永晴 同學登錄</span>
            </button>
          </div>

          <hr style="border: 0; border-top: 1px solid #334155; margin: 12px 0;">

          <!-- Password Reset Section -->
          <div>
            <label for="inputTestNewPassword" style="font-size: 13px; font-weight: 600; color: #f1f5f9; display: block; margin-bottom: 4px;">
              🔑 科代表重設新密碼 (純數字 >= 4 位，非 1234)
            </label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <input type="text" id="inputTestNewPassword" placeholder="輸入至少4位新密碼 (如 5678)" inputmode="numeric" style="flex: 1; padding: 8px 12px; background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 6px; font-size: 14px;">
              <button id="btnTestResetPassword" type="button" class="btn btn-warning" style="padding: 8px 14px; font-size: 13px; font-weight: 600; white-space: nowrap;">
                確認重設密碼
              </button>
            </div>
            <div id="testResetAlert" style="display: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; margin-top: 6px;"></div>
          </div>
        </div>"""

# Insert test card right above the manual login link in 1023-test.html
test_html_prefix = html_base_prefix.replace(
    new_link,
    test_card_html + "\n\n" + new_link
)

test_controller_js = controller_js + """

  // R4: Test Page (1023-test.html) Controller Extensions
  function initTestControlCard() {
    const clsSelect = document.getElementById('testClassSelect');
    const stuSelect = document.getElementById('testStudentSelect');
    const btnMock = document.getElementById('btnTestMockLogin');
    const inputPwd = document.getElementById('inputTestNewPassword');
    const btnReset = document.getElementById('btnTestResetPassword');
    const alertBox = document.getElementById('testResetAlert');

    if (!clsSelect || !stuSelect) return;

    function populateStudents() {
      const cls = clsSelect.value || '4C';
      stuSelect.innerHTML = '';
      const students = window.getStudentsByClass ? window.getStudentsByClass(cls) : [];
      students.forEach(function(s, idx) {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.id} 號 - ${s.name}`;
        if (idx === 0) opt.selected = true;
        stuSelect.appendChild(opt);
      });
      updateMockButtonText();
    }

    function updateMockButtonText() {
      const cls = clsSelect.value || '4C';
      const sid = parseInt(stuSelect.value, 10);
      const students = window.getStudentsByClass ? window.getStudentsByClass(cls) : [];
      const st = students.find(s => s.id === sid);
      const sName = st ? st.name : '同學';
      if (btnMock) {
        btnMock.innerHTML = `<span>不刷臉，模擬 ${sName} 同學登錄</span>`;
      }
    }

    clsSelect.onchange = function() {
      populateStudents();
    };

    stuSelect.onchange = function() {
      updateMockButtonText();
    };

    if (btnMock) {
      btnMock.onclick = function() {
        const cls = clsSelect.value || '4C';
        const sid = parseInt(stuSelect.value, 10);
        const students = window.getStudentsByClass ? window.getStudentsByClass(cls) : [];
        const st = students.find(s => s.id === sid) || { id: sid, name: '同學' };
        const mockStudent = {
          classID: cls,
          studentID: sid,
          name: st.name,
          vector: (window.getStudentProfile ? window.getStudentProfile(cls, sid) : null)
        };
        // Mock direct entry (simulates 1:N match)
        onAuthenticationSuccess(mockStudent, 98.0, false);
      };
    }

    if (btnReset && inputPwd) {
      btnReset.onclick = function() {
        const cls = clsSelect.value || '4C';
        const sid = parseInt(stuSelect.value, 10);
        const students = window.getStudentsByClass ? window.getStudentsByClass(cls) : [];
        const st = students.find(s => s.id === sid) || { id: sid, name: '同學' };
        const newPwd = inputPwd.value.trim();

        if (!/^\d{4,}$/.test(newPwd)) {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = 'rgba(239, 68, 68, 0.2)';
            alertBox.style.color = '#fca5a5';
            alertBox.style.border = '1px solid rgba(239, 68, 68, 0.4)';
            alertBox.textContent = '⚠️ 新密碼必須為至少 4 位純數字！';
          }
          return;
        }

        if (newPwd === '1234') {
          if (alertBox) {
            alertBox.style.display = 'block';
            alertBox.style.background = 'rgba(239, 68, 68, 0.2)';
            alertBox.style.color = '#fca5a5';
            alertBox.style.border = '1px solid rgba(239, 68, 68, 0.4)';
            alertBox.textContent = '⚠️ 新密碼不得為初始預設密碼 1234！';
          }
          return;
        }

        const res = window.setStudentPasswordDirect ? window.setStudentPasswordDirect(cls, sid, newPwd, true) : null;
        if (alertBox) {
          alertBox.style.display = 'block';
          alertBox.style.background = 'rgba(16, 185, 129, 0.2)';
          alertBox.style.color = '#6ee7b7';
          alertBox.style.border = '1px solid rgba(16, 185, 129, 0.4)';
          alertBox.textContent = `✓ 成功重設 ${cls} 班 ${sid} 號 ${st.name} 的密碼為 ${newPwd}！LocalStorage 與雲端已同步 (passwordChanged: true)。`;
        }
      };
    }

    populateStudents();
  }

  // Hook test controller into DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestControlCard);
  } else {
    initTestControlCard();
  }
"""

final_test_html = test_html_prefix + "<script>\n" + test_controller_js + "\n</script>\n</body>\n</html>\n"

with open(os.path.join(MATH_PLATFORM_DIR, "1023-test.html"), "w", encoding="utf-8") as f:
    f.write(final_test_html)
print("1023-test.html generated successfully.")
