import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/scroll-reveal";

test.describe("ScrollReveal", () => {
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

  test("4 variantes de animacao renderizam visiveis e legiveis", async ({ page }) => {
    const frame = page.locator('text="Scroll Reveal — animações de fade/slide ao entrar na viewport"').locator("..");
    for (const label of ["fade", "slide-up", "slide-left", "zoom"]) {
      const card = frame.getByText(label, { exact: true });
      await expect(card).toBeVisible();
      await expect(card).toHaveCSS("opacity", "1");
    }
  });

  test("'Repetir animação' re-dispara o efeito sem quebrar os cards", async ({ page }) => {
    const frame = page.locator('text="Scroll Reveal — animações de fade/slide ao entrar na viewport"').locator("..");
    await frame.getByRole("button", { name: "Repetir animação" }).click();
    // apos re-disparar, os 4 cards continuam presentes e acabam visiveis de novo
    // (opacity volta a 1 apos a animacao de entrada, once=false permite retrigger)
    for (const label of ["fade", "slide-up", "slide-left", "zoom"]) {
      await expect(frame.getByText(label, { exact: true })).toBeVisible({ timeout: 2000 });
    }
  });
});
