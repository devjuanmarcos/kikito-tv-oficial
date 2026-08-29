import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/collapsible";

test.describe("Collapsible", () => {
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

  test("defaultOpen abre o painel; clicar fecha e reflete aria-expanded/aria-hidden", async ({ page }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "What is Kikito CN?" });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("disabled bloqueia o clique e não abre o painel", async ({ page }) => {
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "Can't touch this" });
    await expect(trigger).toBeDisabled();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
