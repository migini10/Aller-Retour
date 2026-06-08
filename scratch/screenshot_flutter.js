const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a mobile-like viewport size
  await page.setViewportSize({ width: 450, height: 950 });

  console.log("Navigating to Flutter driver missions screen...");
  await page.goto('http://localhost:60006/#/driver/missions');
  
  console.log("Waiting 5 seconds for app to load...");
  await page.waitForTimeout(5000);
  
  const screenshotPath = '/Users/macbookair/.gemini/antigravity/brain/f56979b3-b884-41b3-b8e2-df85b68bddb8/flutter_missions.png';
  console.log(`Taking screenshot and saving to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath });
  
  await browser.close();
  console.log("Done!");
})();
