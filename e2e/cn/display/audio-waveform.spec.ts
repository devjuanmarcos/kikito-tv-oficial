import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/audio-waveform";

test.describe("AudioWaveform", () => {
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

  test("expõe role=img com aria-label Paused/Playing e alterna ao clicar Play", async ({ page }) => {
    const frame = page.locator("main");
    const waveforms = frame.getByRole("img", { name: "Paused" });
    await expect(waveforms.first()).toBeVisible();
    await frame.getByRole("button", { name: /Play/ }).click();
    await expect(frame.getByRole("img", { name: "Playing" }).first()).toBeVisible();
  });

  test("bars com count > 20 renderiza a quantidade real de barras (sem cap escondido)", async ({ page }) => {
    const frame = page.locator("main");
    // 3º waveform da primeira linha usa bars={30} — cada barra é um div .aw-bar
    const thirtyBarWaveform = frame.getByRole("img").nth(2);
    const barCount = await thirtyBarWaveform.locator(".aw-bar").count();
    expect(barCount).toBe(30);
  });

  test("variant=wave renderiza um svg, variant=pulse renderiza os círculos", async ({ page }) => {
    const frame = page.locator("main");
    const waveVariant = frame.getByRole("img").nth(3);
    await expect(waveVariant.locator("svg .aw-wave")).toHaveCount(1);
    const pulseVariant = frame.getByRole("img").nth(4);
    await expect(pulseVariant.locator(".aw-pulse-ring")).toHaveCount(1);
  });
});
