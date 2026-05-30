const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3001/dashboard/traveller#billets');
  await page.waitForTimeout(2000); // Wait for load

  // Click the empty space of the first ticket (specifically NOT a button)
  const ticketId = 'ticket-AR-74892374';
  const boundingBox = await page.locator(`#${ticketId}`).boundingBox();
  
  if (boundingBox) {
    console.log("Clicking ticket at coordinates: ", boundingBox.x + 10, boundingBox.y + 10);
    // Click near the top left of the ticket, away from any buttons
    await page.mouse.click(boundingBox.x + 10, boundingBox.y + 10);
  } else {
    console.log("Ticket not found");
  }

  await page.waitForTimeout(1000);
  
  const url = page.url();
  console.log("URL after clicking ticket: ", url);
  
  await browser.close();
})();
