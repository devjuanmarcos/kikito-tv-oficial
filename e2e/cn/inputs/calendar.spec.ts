import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/calendar";

test.describe("Calendar (CN)", () => {
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

  test("clicar num dia com evento dispara onEventClick (uncontrolled)", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    await expect(page.getByText("Clicked event: none")).toBeVisible();
    // dia 5 tem o evento "Team sync" (ver CalendarDemo) — o dia vira acessivel via
    // aria-label "5 de agosto — Team sync" (dayLabel + eventsLabel do InlineCalendar)
    const day5 = page.getByRole("button", { name: /Team sync/ }).last();
    await day5.click();
    await expect(page.getByText("Clicked event: Team sync")).toBeVisible();
  });

  test('mode="range" — clique 1 marca inicio, clique 2 marca fim', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const section = page.getByText('mode="range" — clique 2x marca início/fim').locator("..");
    await expect(section.getByText("— → —")).toBeVisible();

    const day5 = section.getByRole("button", { name: /^5 de/ });
    await day5.click();
    const day11 = section.getByRole("button", { name: /^11 de/ });
    await day11.click();

    await expect(section.getByText(/\d{2}\/\d{2}\/\d{4} → \d{2}\/\d{2}\/\d{4}/)).toBeVisible();
  });

  test('mode="multiple" — cada data alterna independente', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "sidebar do showcase intercepta clique (pendência 0b)");
    const section = page.getByText('mode="multiple" — cada data alterna independente').locator("..");
    await expect(section.getByText("0 selecionada(s)")).toBeVisible();

    const day5 = section.getByRole("button", { name: /^5 de/ });
    const day6 = section.getByRole("button", { name: /^6 de/ });
    await day5.click();
    await day6.click();
    await expect(section.getByText("2 selecionada(s)")).toBeVisible();

    await day5.click();
    await expect(section.getByText("1 selecionada(s)")).toBeVisible();
  });
});
