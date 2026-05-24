import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Clear local storage / session by using a fresh context
        context = await browser.new_context()
        page = await context.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        print("Navigating to / ...")
        await page.goto("http://localhost:5173/")

        # Wait for redirect to login
        print("Waiting for redirect to login...")
        await page.wait_for_url("**/login", timeout=5000)
        print("Current URL:", page.url)

        print("Typing credentials...")
        await page.fill('input[type="email"]', 'test@example.com')
        await page.fill('input[type="password"]', 'password123')

        print("Clicking sign in...")
        await page.click('button[type="submit"]')

        # Wait for navigation to dashboard
        try:
            await page.wait_for_url("**/dashboard", timeout=5000)
            print("Successfully logged in and redirected to dashboard!")
            print("Current URL:", page.url)
            # wait for dashboard to load its content
            await asyncio.sleep(2)
            await page.screenshot(path="dashboard_after_login.png")
            print("Dashboard screenshot saved.")
        except Exception as e:
            print("Failed to navigate to dashboard or find content:", e)
            await page.screenshot(path="error_login.png")

        await browser.close()

asyncio.run(main())
