import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

        print("Navigating to /johndoe ...")
        await page.goto("http://localhost:5175/johndoe")

        try:
            await page.wait_for_selector('text=Profile Not Found', timeout=10000)
            print("Successfully rendered the 404 Profile Not Found state!")
        except Exception as e:
            print("Failed to render 404 state:", e)

        await page.screenshot(path="public_profile_404.png")
        await browser.close()

asyncio.run(main())
