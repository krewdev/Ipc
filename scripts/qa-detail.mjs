import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text().slice(0,200)); });
page.on("pageerror", e => errors.push(String(e).slice(0,200)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.getByRole("button", { name: "Blueprints", exact: true }).first().click();
await page.waitForTimeout(1000);

const checks = {};
for (const id of ["DWG-001", "SCH-002", "OL-004", "DSP-005", "SCH-006"]) {
  await page.getByRole("button", { name: id, exact: true }).click();
  await page.waitForTimeout(700);
  const t = await page.locator("main").innerText();
  checks[id] = {
    len: t.length,
    hasRefdes: /U1[0-2]|Q1|F1|C1|RSHUNT|SFH615A|ADS1256|FZ1200/.test(t),
    hasDims: /132|120|100|300|28\.2|250 in-lbs/.test(t),
    hasSheet: t.includes("SHEET") || t.includes("Sheet") || t.includes("CONTROLLED"),
  };
  await page.screenshot({ path: `/workspace/screenshots/detail-${id.toLowerCase()}.png` });
}

console.log(JSON.stringify({ checks, errors }, null, 2));
await browser.close();
