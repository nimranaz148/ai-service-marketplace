import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const N = Number(process.env.FRAMES || 120);
const only = process.env.ONLY ? process.env.ONLY.split(",").map(Number) : null;
const out = path.resolve("png");
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new",
  args: ["--allow-file-access-from-files", "--disable-web-security"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.resolve("scene.html")).href);
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 600));
for (let i = 0; i < N; i++) {
  if (only && !only.includes(i)) continue;
  await page.evaluate((t) => window.render(t), i / (N - 1));
  await page.screenshot({ path: path.join(out, `f${String(i + 1).padStart(3, "0")}.png`) });
}
await browser.close();
console.log("rendered", only ? only.length : N);
