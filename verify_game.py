from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PageError: {err}"))

        try:
            page.goto("http://localhost:8000")

            # Wait for canvas (Phaser)
            page.wait_for_selector("canvas", timeout=10000)
            print("Canvas found!")

            # Wait a bit for assets to generate and menu to show
            page.wait_for_timeout(3000)

            # Take screenshot of Main Menu
            page.screenshot(path="verification_menu.png")
            print("Menu screenshot taken.")

            # Click NEW GAME if possible
            # We don't have distinct DOM buttons for Phaser, it's all canvas.
            # We can try to click coordinates or just screenshot the menu.
            # For now, Menu screenshot proves it runs.

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run()
