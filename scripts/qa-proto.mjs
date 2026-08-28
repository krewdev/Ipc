import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
page.on("pageerror", e => errors.push(String(e)));
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
// hero image present
const hero = await page.locator("img[alt*='Residential'], img[alt*='Commercial'], img[alt*='Power']").first();
await page.waitForTimeout(500);
await page.screenshot({ path: "/workspace/screenshots/proto-overview-hero.png" });
await page.getByRole("button", { name: "Prototypes", exact: true }).first().click();
await page.waitForTimeout(1500);
const imgs = await page.locator("main img").count();
const failed = await page.evaluate(() => {
  return [...document.querySelectorAll("main img")].map(img => ({
    src: img.getAttribute("src"),
    natural: img.naturalWidth,
    complete: img.complete,
  }));
});
await page.screenshot({ path: "/workspace/screenshots/proto-gallery.png", fullPage: false });
// click first gallery card
await page.locator("main button").filter({ hasText: "Residential Power Node" }).first().click();
await page.waitForTimeout(600);
await page.screenshot({ path: "/workspace/screenshots/proto-lightbox.png" });
console.log(JSON.stringify({ imgs, failed, errors }, null, 2));
await browser.close();
