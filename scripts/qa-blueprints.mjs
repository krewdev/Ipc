import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
page.on("pageerror", e => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

await page.getByRole("button", { name: "Blueprints", exact: true }).first().click();
await page.waitForTimeout(1500);
const h1 = await page.locator("main h1").textContent();
const registerRows = await page.locator("main table tbody tr").count();
await page.screenshot({ path: "/workspace/screenshots/blueprints-oneline.png" });

// click SCH-002
await page.getByRole("button", { name: "SCH-002", exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/blueprints-gate.png" });

// DWG-001
await page.getByRole("button", { name: "DWG-001", exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/blueprints-bom.png" });

// DSP-005
await page.getByRole("button", { name: "DSP-005", exact: true }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: "/workspace/screenshots/blueprints-nilm.png" });

// Prototypes presentation
await page.getByRole("button", { name: "Prototypes", exact: true }).first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: "/workspace/screenshots/proto-presentation.png" });

const imgs = await page.evaluate(() =>
  [...document.querySelectorAll("main img")].map(i => ({ src: i.src, w: i.naturalWidth }))
);

console.log(JSON.stringify({ h1, registerRows, imgs: imgs.length, ok: imgs.filter(i=>i.w>0).length, errors }, null, 2));
await browser.close();
