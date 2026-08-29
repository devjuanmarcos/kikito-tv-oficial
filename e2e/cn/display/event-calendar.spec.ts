import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/event-calendar";

test.describe("EventCalendar", () => {
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

  test("achado real corrigido: evento intent=neutral usa cor neutra, não cai no primary", async ({ page }) => {
    const frame = page.locator("main");
    const neutralEvent = frame.getByText("1:1s", { exact: true });
    await expect(neutralEvent).toBeVisible();
    await expect(neutralEvent).toHaveClass(/bg-neutral-soft/);
    await expect(neutralEvent).not.toHaveClass(/bg-patina-soft/);
  });

  test("navegar de mês atualiza o texto do cabeçalho (aria-live)", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar/header intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const header = frame.locator('[aria-live="polite"]').first();
    const before = await header.textContent();
    await frame.getByRole("button", { name: "Próximo mês" }).click();
    await expect(header).not.toHaveText(before ?? "");
  });

  test("Enter no dia dispara onDayClick (teclado, não só clique de mouse)", async ({ page }) => {
    const frame = page.locator("main");
    const logs: string[] = [];
    page.on("console", (msg) => {
      if (msg.text().includes("day clicked")) logs.push(msg.text());
    });
    const dayCell = frame.getByRole("button", { name: "Dia 3", exact: true }).first();
    await dayCell.focus();
    await dayCell.press("Enter");
    expect(logs.length).toBeGreaterThan(0);
  });
});
