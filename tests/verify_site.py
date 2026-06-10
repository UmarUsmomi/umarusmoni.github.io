import os
import sys
from playwright.sync_api import sync_playwright

def verify_portfolio():
    print("Starting Playwright verification tests...")
    
    file_path = os.path.abspath("index.html").replace("\\", "/")
    file_url = f"file:///{file_path}"
    
    if not os.path.exists("index.html"):
        print("Error: index.html not found in the current directory.")
        sys.exit(1)
        
    console_errors = []
    
    with sync_playwright() as p:
        # Launch browser in headless mode
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Register console and error listeners
        page.on("pageerror", lambda err: console_errors.append(f"Runtime Exception: {err}"))
        page.on("console", lambda msg: console_errors.append(f"Console Error: {msg.text}") if msg.type == "error" else None)
        
        # Navigate to the local file
        print(f"Loading page: {file_url}")
        page.goto(file_url)
        page.wait_for_load_state("networkidle")
        
        # 1. Assert Page Title
        title = page.title()
        expected_title = "Umar Usmoni — Cybersecurity Student & AI Engineer"
        assert title == expected_title, f"Incorrect page title: {title}"
        print("[OK] Page title verified successfully.")
        
        # 2. Assert Content Security Policy
        csp_meta = page.locator('meta[http-equiv="Content-Security-Policy"]')
        assert csp_meta.count() > 0, "Content-Security-Policy meta tag is missing!"
        csp_content = csp_meta.get_attribute("content")
        assert "default-src 'self'" in csp_content, f"Weak CSP content: {csp_content}"
        print("[OK] Content-Security-Policy meta tag verified successfully.")
        
        # 3. Assert Referrer Policy
        referrer_meta = page.locator('meta[name="referrer"]')
        assert referrer_meta.count() > 0, "Referrer meta tag is missing!"
        assert referrer_meta.get_attribute("content") == "no-referrer-when-downgrade", "Incorrect referrer policy!"
        print("[OK] Referrer-Policy meta tag verified successfully.")
        
        # 4. Assert noopener noreferrer on target="_blank" links
        anchors = page.locator('a[target="_blank"]')
        count = anchors.count()
        print(f"Checking {count} links with target='_blank'...")
        for i in range(count):
            anchor = anchors.nth(i)
            href = anchor.get_attribute("href")
            rel = anchor.get_attribute("rel") or ""
            assert "noopener" in rel and "noreferrer" in rel, f"Insecure target='_blank' link found for href='{href}' (rel='{rel}')"
        print("[OK] All target='_blank' links have noopener noreferrer verified.")
        
        # 5. Assert no console errors occurred during load
        if console_errors:
            print("\nVerification failed. Console/Runtime errors detected:")
            for err in console_errors:
                print(f"  - {err}")
            sys.exit(1)
            
        print("[OK] Zero console/runtime errors detected.")
        browser.close()
        
    print("\nAll verification tests passed!")

if __name__ == "__main__":
    verify_portfolio()
