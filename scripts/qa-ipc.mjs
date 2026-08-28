import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const body = document.body;
  const cs = getComputedStyle(body);
  const root = document.documentElement;
  const rootCs = getComputedStyle(root);
  const text = body.innerText.slice(0, 1000);
  const els = document.querySelectorAll("*").length;
  const main = document.querySelector("main");
  return {
    bg: cs.backgroundColor,
    color: cs.color,
    font: cs.fontFamily,
    els,
    text,
    mainChildren: main ? main.children.length : 0,
    themeBg: rootCs.getPropertyValue("--color-bg"),
    themeFg: rootCs.getPropertyValue("--color-fg"),
    surface: rootCs.getPropertyValue("--color-surface"),
  };
});

console.log(JSON.stringify({ info, errors }, null, 2));
await page.screenshot({ path: "/workspace/screenshots/ipc-overview.png", fullPage: false });

const circuitsBtn = page.getByRole("button", { name: "Circuits" });
if (await circuitsBtn.count()) {
  await circuitsBtn.first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "/workspace/screenshots/ipc-circuits.png" });
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "/workspace/screenshots/ipc-mobile.png" });

await browser.close();
