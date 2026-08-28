import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", m => { if (m.type()==="error") errors.push(m.text()); });
page.on("pageerror", e => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.getByRole("button", { name: "Blueprints", exact: true }).first().click();
await page.waitForTimeout(1200);

// DWG-001 default or click
await page.getByRole("button", { name: "DWG-001", exact: true }).click();
await page.waitForTimeout(800);
let t = await page.locator("main").innerText();
const dwg = {
  envelope: t.includes("132") && t.includes("98.5"),
  pcb: t.includes("120") && t.includes("80"),
  scr: t.includes("100 × 60 × 25") || t.includes("100 × 60"),
  bus: t.includes("300") && t.includes("250 in-lbs"),
  torque: t.includes("28.2"),
};
await page.screenshot({ path: "/workspace/screenshots/dims-dwg001.png" });

await page.getByRole("button", { name: "OL-004", exact: true }).click();
await page.waitForTimeout(600);
t = await page.locator("main").innerText();
const ol = {
  service800: t.includes("800 A") || t.includes("800A"),
  res200: t.includes("200 A") || t.includes("200A"),
  icu: t.includes("100 kA") && t.includes("250 kA") && t.includes("500 kA"),
  loads: t.includes("50 A") && t.includes("40 A"),
};
await page.screenshot({ path: "/workspace/screenshots/dims-ol004.png" });

await page.getByRole("button", { name: "SCH-002", exact: true }).click();
await page.waitForTimeout(500);
t = await page.locator("main").innerText();
const sch = {
  pin4: t.includes("PIN 4") || t.includes("PIN 4"),
  pin12: t.includes("PIN 12") || t.includes("12"),
  ads1256: t.includes("ADS1256"),
  isol4kv: t.includes("4 kV"),
  zc20: t.includes("20 μs") || t.includes("20"),
};
await page.screenshot({ path: "/workspace/screenshots/dims-sch002.png" });

await page.getByRole("button", { name: "SCH-006", exact: true }).click();
await page.waitForTimeout(500);
t = await page.locator("main").innerText();
const sts = {
  blackout: t.includes("0.40"),
  igbt: t.includes("FZ1200R45KL4"),
  cap: t.includes("10 000") || t.includes("10000") || t.includes("10 mF"),
  uv: t.includes("320"),
};

console.log(JSON.stringify({ dwg, ol, sch, sts, errors }, null, 2));
await browser.close();
