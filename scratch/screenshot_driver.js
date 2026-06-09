const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a large viewport to see everything
  await page.setViewportSize({ width: 1280, height: 1200 });

  console.log('Navigating to driver dashboard localisation tab...');
  await page.goto('http://localhost:3000/dashboard/driver#localisation');
  
  console.log("Waiting 5 seconds for UI to load...");
  await page.waitForTimeout(5000);
  
  const screenshotPath = '/Users/macbookair/.gemini/antigravity/brain/f56979b3-b884-41b3-b8e2-df85b68bddb8/driver_missions.png';
  console.log(`Taking screenshot and saving to ${screenshotPath}...`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  
  await browser.close();
  console.log("Done!");
})();
