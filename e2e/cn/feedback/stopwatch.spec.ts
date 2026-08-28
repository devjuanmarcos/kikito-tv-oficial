import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/stopwatch";

test.describe("Stopwatch", () => {
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

  test("Start troca pra Pause e Lap aparece; Reset zera de volta", async ({ page, isMobile }) => {
    // pendência 0b já documentada: sidebar do showcase intercepta clique em mobile-chrome
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Stopwatch — start, pause, lap").locator("..");
    await frame.getByRole("button", { name: "Start" }).click();
    await expect(frame.getByRole("button", { name: "Pause" })).toBeVisible();
    await expect(frame.getByRole("button", { name: "Lap" })).toBeVisible();
    await frame.getByRole("button", { name: "Lap" }).click();
    await expect(frame.getByText("Lap 1")).toBeVisible();
    await frame.getByRole("button", { name: "Pause" }).click();
    await frame.getByRole("button", { name: "Reset" }).click();
    await expect(frame.getByText("Lap 1")).toHaveCount(0);
  });

  test("Reset volta pro initialTime configurado, não pra 0 absoluto", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=initialTime={30000}").locator("..");
    const display = frame.locator(".font-mono").first();
    // 30000ms = 00:30 no display formatado (mm:ss)
    await expect(display).toContainText("00:30");
    await frame.getByRole("button", { name: "Start" }).click();
    await page.waitForTimeout(300);
    await frame.getByRole("button", { name: "Pause" }).click();
    await frame.getByRole("button", { name: "Reset" }).click();
    // depois do reset, volta pra 00:30 (não 00:00 de um reset absoluto pra zero)
    await expect(display).toContainText("00:30");
  });
});
