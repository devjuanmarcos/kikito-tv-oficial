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
});
