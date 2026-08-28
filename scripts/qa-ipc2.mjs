import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const errors = [];

async function shot(page, name) {
  await page.waitForTimeout(800);
  await page.screenshot({ path: `/workspace/screenshots/${name}`, fullPage: false });
  const text = await page.evaluate(() => document.body.innerText.slice(0, 200));
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(name, { bg, text: text.replace(/\n/g, " | ").slice(0, 160), errs: errors.length });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2000);
await shot(page, "ipc-overview.png");

// Navigate via sidebar
for (const label of ["Circuits", "NILM Engine", "Load Mgmt", "VPP / OpenADR", "Architecture"]) {
  await page.getByRole("button", { name: label, exact: true }).first().click();
  await page.waitForTimeout(1000);
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await shot(page, `ipc-${slug}.png`);
}

// Mobile
errors.length = 0;
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => { if (m.type() === "error") errors.push("m:" + m.text()); });
mobile.on("pageerror", (e) => errors.push("m:" + String(e)));
await mobile.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await mobile.waitForTimeout(2000);
await shot(mobile, "ipc-mobile.png");
// open menu
const menu = mobile.getByRole("button", { name: "Open menu" });
if (await menu.count()) {
  await menu.click();
  await mobile.waitForTimeout(500);
  await shot(mobile, "ipc-mobile-menu.png");
  await mobile.getByRole("button", { name: "Circuits", exact: true }).click();
  await mobile.waitForTimeout(800);
  await shot(mobile, "ipc-mobile-circuits.png");
}

console.log("ALL_ERRORS", errors);
await browser.close();
