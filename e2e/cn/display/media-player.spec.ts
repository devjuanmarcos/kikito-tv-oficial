import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/media-player";

test.describe("MediaPlayer", () => {
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

  test("type=video com src real monta <video>, não <audio> escondido", async ({ page }) => {
    const frame = page.locator('text="Video player (src real)"').locator("..");
    await expect(frame.locator("video")).toHaveCount(1);
    await expect(frame.locator("audio")).toHaveCount(0);
  });

  test("type=audio com src real monta <audio>, não <video>", async ({ page }) => {
    const frame = page.locator('text="Audio player (src real)"').locator("..");
    await expect(frame.locator("audio")).toHaveCount(1);
    await expect(frame.locator("video")).toHaveCount(0);
  });

  test("Play alterna aria-label pra Pause e barra de progresso é focável por teclado", async ({ page }) => {
    const frame = page.locator("text=Simulated audio player").locator("..");
    const playButton = frame.getByRole("button", { name: "Play" });
    await playButton.click();
    await expect(frame.getByRole("button", { name: "Pause" })).toBeVisible();

    const seek = frame.getByRole("slider", { name: "Seek" });
    await seek.focus();
    await page.keyboard.press("ArrowRight");
    await expect(seek).not.toHaveAttribute("aria-valuenow", "0");
  });
});
