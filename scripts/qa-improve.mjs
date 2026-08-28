import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
page.on("pageerror", e => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

const overviewText = await page.locator("main").innerText();
await page.screenshot({ path: "/workspace/screenshots/improve-overview.png" });

// Command palette
await page.keyboard.press("Control+k");
await page.waitForTimeout(400);
const palette = await page.locator("[cmdk-root], [cmdk-input], input[placeholder*='Jump']").count();
await page.screenshot({ path: "/workspace/screenshots/improve-cmdk.png" });
await page.keyboard.press("Escape");
await page.waitForTimeout(200);

// Blueprints SYS-003
await page.getByRole("button", { name: "Blueprints", exact: true }).first().click();
await page.waitForTimeout(800);
await page.getByRole("button", { name: "SYS-003", exact: true }).click();
await page.waitForTimeout(800);
const sysText = await page.locator("main").innerText();
await page.screenshot({ path: "/workspace/screenshots/improve-sys003.png" });

// SCH-006 BOM
await page.getByRole("button", { name: "SCH-006", exact: true }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: "/workspace/screenshots/improve-sts.png" });

// Fire DR and check activity
await page.getByRole("button", { name: "Overview", exact: true }).first().click();
await page.waitForTimeout(600);
await page.getByRole("button", { name: "Fire DR Event" }).click();
await page.waitForTimeout(500);
const hasEvent = (await page.locator("main").innerText()).includes("Event Log") || (await page.locator("main").innerText()).includes("VPP");

console.log(JSON.stringify({
  hasFaceplate: overviewText.includes("HMI Faceplate") || overviewText.includes("Energy Overview"),
  hasEventLog: overviewText.includes("Event Log"),
  solarKw: (overviewText.match(/Solar Production[\s\S]{0,40}?([\d.]+)/i)||[])[1],
  palette,
  sysHasLayers: sysText.includes("Colossus") || sysText.includes("LAYER") || sysText.includes("Starlink"),
  hasEvent,
  errors,
}, null, 2));
await browser.close();
