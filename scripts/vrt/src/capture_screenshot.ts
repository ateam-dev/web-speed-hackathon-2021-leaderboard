import fetch from "node-fetch";
import * as chromeLauncher from "chrome-launcher";
import puppeteer from "puppeteer-core";

type Params = {
  url: string;
  width: number;
  height: number;
};

export async function captureScreenshot({
  url,
  width,
  height,
}: Params): Promise<Buffer | null> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--hide-scrollbars"],
  });

  try {
    const res = await fetch(`http://localhost:${chrome.port}/json/version`);
    const json = await res.json();
    const browser = await puppeteer.connect({
      browserWSEndpoint: json.webSocketDebuggerUrl,
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.setViewport({ width, height });
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
    console.log(`Go to: ${url}`);
    try {
      await page.goto(url, {
        timeout: 60 * 1000,
        waitUntil: "networkidle0",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
    console.log(`Loaded: ${url}`);
    await page.waitForTimeout(10 * 1000);
    console.log(`Waited: 10s`);

    const screenshot = (await page.screenshot({
      captureBeyondViewport: false,
    })) as Buffer;

    return screenshot;
  } finally {
    await chrome.kill();
  }
}
