const fs = require('fs');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/test_css.html');
  const bg = await page.evaluate("window.getComputedStyle(document.body).backgroundColor");
  console.log(bg);
  await browser.close();
})();
