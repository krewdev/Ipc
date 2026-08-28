import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
page.on("pageerror", e => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

async function check(label) {
  if (label) {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.waitForTimeout(1200);
  }
  const data = await page.evaluate(() => {
    const main = document.querySelector("main");
    const h1 = main?.querySelector("h1")?.textContent;
    const rect = main?.getBoundingClientRect();
    const cards = main?.querySelectorAll("[class*='rounded']")?.length;
    // sample a pixel color from center of main
    return {
      h1,
      cards,
      mainRect: rect ? { w: rect.width, h: rect.height, t: rect.top, l: rect.left } : null,
      mainText: main?.innerText?.slice(0, 120),
    };
  });
  const name = (label || "overview").toLowerCase().replace(/[^a-z0-9]+/g,"-");
  await page.screenshot({ path: `/workspace/screenshots/check-${name}.png` });
  console.log(JSON.stringify({ label: label||"overview", data, errors: errors.length }));
}

await check(null);
await check("Circuits");
await check("NILM Engine");
await check("Architecture");

// Product switch
await page.getByRole("button", { name: "C2", exact: true }).first().click();
await page.waitForTimeout(1000);
await check("Overview");

console.log("errors", errors);
await browser.close();
