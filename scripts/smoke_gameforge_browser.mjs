import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"]
});
const failures = [];
try {
  for (const profile of [
    { name: "desktop", viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false, expectedRatio: 1.7 },
    { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, expectedRatio: 1.15 }
  ]) {
    const page = await browser.newPage({
      viewport: profile.viewport,
      deviceScaleFactor: profile.deviceScaleFactor,
      isMobile: profile.isMobile,
      hasTouch: profile.hasTouch
    });
    const pageErrors = [];
    page.on("pageerror", error => pageErrors.push(error.message));
    await page.route("**/*", async route => {
      const requestUrl = new URL(route.request().url());
      if (requestUrl.origin !== "http://127.0.0.1:4173") {
        failures.push(profile.name + ": unexpected external request " + requestUrl.href);
        await route.abort();
        return;
      }
      await route.continue();
    });
    await page.goto("http://127.0.0.1:4173", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForFunction(() => {
      const canvas = document.querySelector("#viewport canvas");
      return canvas && canvas.dataset.performanceProfile && Number(canvas.dataset.pixelRatio) > 0;
    }, null, { timeout: 30000 });
    const result = await page.locator("#viewport canvas").evaluate(canvas => ({
      profile: canvas.dataset.performanceProfile,
      pixelRatio: Number(canvas.dataset.pixelRatio),
      shadows: canvas.dataset.shadowMapEnabled === "true",
      antialias: canvas.dataset.antialiasEnabled === "true",
      width: canvas.getBoundingClientRect().width,
      height: canvas.getBoundingClientRect().height,
      webgl: Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
    }));
    if (result.profile !== profile.name) failures.push(profile.name + ": wrong profile " + result.profile);
    if (result.pixelRatio > profile.expectedRatio + 0.001) failures.push(profile.name + ": pixel ratio " + result.pixelRatio + " exceeds " + profile.expectedRatio);
    if (result.shadows !== !profile.isMobile) failures.push(profile.name + ": unexpected shadow-map setting " + result.shadows);
    if (result.antialias !== !profile.isMobile) failures.push(profile.name + ": unexpected antialias setting " + result.antialias);
    if (!result.webgl || result.width < 300 || result.height < 300) failures.push(profile.name + ": WebGL canvas is not usable");
    if (pageErrors.length) failures.push(profile.name + ": browser errors " + pageErrors.join("; "));
    await page.locator("#kind").selectOption("heavy");
    await page.waitForTimeout(150);
    await page.screenshot({ path: "gameforge-" + profile.name + ".png", fullPage: true });
    console.log(profile.name.toUpperCase() + "_RENDER_PROFILE " + JSON.stringify(result));
    await page.close();
  }
} finally {
  await browser.close();
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("PASS: desktop and mobile WebGL renderer budgets and runtime smoke tests");
}
