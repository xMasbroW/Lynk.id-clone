import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser error: {err}"))

        # Test routing to public profile
        print("Navigating to /johndoe ...")
        await page.goto("http://localhost:5175/johndoe")

        await asyncio.sleep(5)
        print("Current URL:", page.url)

        await page.screenshot(path="public_profile.png")
        print("Public profile screenshot saved.")

        await browser.close()

asyncio.run(main())
