from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Login first (assuming standard login path, adjust if needed)
    # Since I don't know the exact login flow, I will try to access the page directly.
    # If auth is required, I might need to bypass or mock it.
    # Given the complexity of auth in these systems, I will try to visit the page.
    # However, without auth, I might be redirected to login.

    # Assuming the app is running on localhost:5173
    page.goto("http://localhost:5173")

    # Wait for potential redirect or load
    time.sleep(5)

    # Take a screenshot of the initial state
    page.screenshot(path="verification/initial_load.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
