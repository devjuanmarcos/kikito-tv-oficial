import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/video-card";

test.describe("VideoCard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("sem erros de console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("card sem poster cai no glifo de fallback decorativo", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("No poster fallback")).toBeVisible();
  });

  test("hover no card com src troca poster por vídeo mudo em preview", async ({ page }) => {
    const frame = page.locator("main");
    const card = frame.getByText("Hover to preview").locator("../..");
    await expect(card.locator("video")).toHaveCount(0);
    await card.hover();
    const video = card.locator("video");
    await expect(video).toHaveCount(1);
    expect(await video.evaluate((el: HTMLVideoElement) => el.muted)).toBe(true);
  });
});
