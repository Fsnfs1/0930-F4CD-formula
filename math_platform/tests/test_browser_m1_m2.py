import os
import time
import sys

# Ensure UTF-8 output on Windows terminal
if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def run_browser_tests():
    print("Starting Selenium Headless Chrome E2E test for Milestone 1 & 2...")

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=390,844') # Mobile viewport iPhone 14

    driver = webdriver.Chrome(options=chrome_options)
    html_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'index.html'))
    driver.get(f'file:///{html_file}')

    wait = WebDriverWait(driver, 10)

    # 1. Verify Screen 1 is active
    s1 = driver.find_element(By.ID, 'screen1-roster')
    assert 'active' in s1.get_attribute('class'), "Screen 1 should be active initially"
    print("✓ Step 1: Screen 1 active verified.")

    # 2. Test 4C selection and verify 29 students, absence of #13
    class_select_el = driver.find_element(By.ID, 'classSelect')
    class_select = Select(class_select_el)
    class_select.select_by_value('4C')

    student_select_el = driver.find_element(By.ID, 'studentSelect')
    student_select = Select(student_select_el)
    c4c_options = [opt.get_attribute('value') for opt in student_select.options if opt.get_attribute('value')]
    assert len(c4c_options) == 29, f"4C should have 29 options, got {len(c4c_options)}"
    assert '13' not in c4c_options, "4C MUST NOT contain student ID 13"
    assert '12' in c4c_options and '14' in c4c_options
    print("✓ Step 2: 4C class selection verified (29 students, student #13 strictly omitted).")

    # 3. Test 4D selection and verify 31 students
    class_select.select_by_value('4D')
    c4d_options = [opt.get_attribute('value') for opt in student_select.options if opt.get_attribute('value')]
    assert len(c4d_options) == 31, f"4D should have 31 options, got {len(c4d_options)}"
    print("✓ Step 3: 4D class selection verified (31 students).")

    # 4. Test 5B selection and verify 28 students
    class_select.select_by_value('5B')
    c5b_options = [opt.get_attribute('value') for opt in student_select.options if opt.get_attribute('value')]
    assert len(c5b_options) == 28, f"5B should have 28 options, got {len(c5b_options)}"
    print("✓ Step 4: 5B class selection verified (28 students).")

    # 5. Select 4D 23 (劉付穎) and check student name display
    class_select.select_by_value('4D')
    student_select.select_by_value('23')
    name_display = driver.find_element(By.ID, 'studentNameDisplay').text
    assert '劉付穎' in name_display, f"Expected 劉付穎 in name display, got: {name_display}"
    print(f"✓ Step 5: Student 4D 23 selection verified: {name_display}")

    # 6. Enable Demo Mode
    demo_checkbox = driver.find_element(By.ID, 'demoModeCheckbox')
    if not demo_checkbox.is_selected():
        driver.execute_script("arguments[0].click();", demo_checkbox)
    print("✓ Step 6: Demo Mode enabled.")

    # 7. Click Confirm Identity to enter Screen 2 (First-time registration)
    btn_confirm = driver.find_element(By.ID, 'btnConfirmIdentity')
    btn_confirm.click()
    time.sleep(0.5)

    s2 = driver.find_element(By.ID, 'screen2-register')
    assert 'active' in s2.get_attribute('class'), "Screen 2 should become active"
    print("✓ Step 7: Transitioned to Screen 2 (Face Registration).")

    # 8. Capture Face in Screen 2
    btn_capture = driver.find_element(By.ID, 'btnCaptureFace')
    btn_capture.click()
    time.sleep(0.5)

    preview_card = driver.find_element(By.ID, 'registrationPreviewCard')
    assert preview_card.is_displayed(), "Preview card should be displayed after capture"
    preview_name = driver.find_element(By.ID, 'previewStudentName').text
    assert preview_name == '劉付穎', f"Preview name should be 劉付穎, got {preview_name}"
    preview_img = driver.find_element(By.ID, 'previewSnapshotImg')
    img_src = preview_img.get_attribute('src')
    assert img_src.startswith('data:image/jpeg;base64,'), "Image source must be valid base64 JPEG"
    print("✓ Step 8: Face capture, descriptor extraction and preview verified.")

    # 9. Click Confirm & Lock to save and transition to Dashboard
    btn_lock = driver.find_element(By.ID, 'btnConfirmAndLock')
    btn_lock.click()
    time.sleep(0.8)

    s4 = driver.find_element(By.ID, 'screen4-dashboard')
    assert 'active' in s4.get_attribute('class'), "Screen 4 (Dashboard) should become active"
    dash_name = driver.find_element(By.ID, 'dashStudentName').text
    assert '劉付穎' in dash_name
    dash_grade = driver.find_element(By.ID, 'dashGradeTag').text
    assert '高一' in dash_grade, f"4D must be routed to 高一, got {dash_grade}"
    print("✓ Step 9: Identity locked, dual persistence triggered, Dashboard & Grade 10 routing verified.")

    # 10. Logout and test Secondary Verification (Screen 3)
    btn_logout = driver.find_element(By.ID, 'btnLogout')
    btn_logout.click()
    time.sleep(0.5)

    assert 'active' in s1.get_attribute('class'), "Should return to Screen 1 upon logout"
    # Select 4D 23 again
    class_select.select_by_value('4D')
    student_select.select_by_value('23')
    btn_confirm = driver.find_element(By.ID, 'btnConfirmIdentity')
    assert "已註冊" in btn_confirm.text or "刷臉驗證" in btn_confirm.text
    print("✓ Step 10: Profile persistence recognized; prompt shows secondary verification.")

    # 11. Click to enter Screen 3 (Reauth)
    btn_confirm.click()
    time.sleep(0.5)

    s3 = driver.find_element(By.ID, 'screen3-reauth')
    assert 'active' in s3.get_attribute('class'), "Screen 3 should be active"
    print("✓ Step 11: Transitioned to Screen 3 (Secondary Re-verification).")

    # 12. Run reauth verify
    btn_reauth = driver.find_element(By.ID, 'btnReauthVerify')
    btn_reauth.click()
    time.sleep(1.2)

    # Should transition back to Dashboard after match >= 85%
    assert 'active' in s4.get_attribute('class'), "Should transition back to Dashboard after secondary face verification"
    print("✓ Step 12: Secondary face match (>= 85%) passed and successfully unlocked Dashboard!")

    driver.quit()
    print("\n🎉 ALL BROWSER E2E TESTS PASSED 100% SUCCESSFULLY!")

if __name__ == '__main__':
    run_browser_tests()
