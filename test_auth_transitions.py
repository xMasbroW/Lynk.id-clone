import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        print("Navigating to login...")
        await page.goto("http://localhost:5173/login")
        await page.wait_for_load_state("networkidle")

        print("Clicking Register link...")
        await page.click('text=Sign up')
        await asyncio.sleep(0.5) # Wait for transition
        await page.screenshot(path="transition_register.png")
        print("Register screenshot saved.")

        print("Clicking Login link...")
        await page.click('text=Sign in')
        await asyncio.sleep(0.5) # Wait for transition
        await page.screenshot(path="transition_login.png")
        print("Login screenshot saved.")

        print("Clicking Forgot Password link...")
        await page.click('text=Forgot password?')
        await asyncio.sleep(0.5) # Wait for transition
        await page.screenshot(path="transition_forgot.png")
        print("Forgot password screenshot saved.")

        await browser.close()

asyncio.run(main())
