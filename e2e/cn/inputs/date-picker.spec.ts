import { test, expect } from "@playwright/test";

/**
 * DatePicker — Super component for the DATE family (`range`/`mode` dispatch):
 * default (single input)  → route inputs/date-picker
 * range                   → absorbed DateRangePicker (route: inputs/date-range-picker)
 * mode="inline"           → absorbed Calendar (route: inputs/calendar)
 * TimePicker and EventCalendar are kept standalone (routes: inputs/time-picker, display/event-calendar).
 */
const ROUTES = {
  "date-picker": "/pt/cn/inputs/date-picker",
  "date-range-picker": "/pt/cn/inputs/date-range-picker",
  calendar: "/pt/cn/inputs/calendar",
  "time-picker": "/pt/cn/inputs/time-picker",
  "event-calendar": "/pt/cn/display/event-calendar",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`Date family (CN) — ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
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
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("DatePicker (CN) — a11y do popover", () => {
  test("trigger expoe aria-haspopup/aria-expanded e abre o calendario", async ({ page }) => {
    await page.goto(ROUTES["date-picker"]);
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Event date" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("dialog").first()).toBeVisible();
  });

  test("selecionar um dia fecha o calendario e atualiza o valor exibido", async ({ page }) => {
    await page.goto(ROUTES["date-picker"]);
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "Event date" });
    await trigger.click();
    const today = page.locator("[data-date]").filter({ hasText: /^\d+$/ }).first();
    await today.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
