import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/chat-bubble";

test.describe("ChatBubble (CN)", () => {
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

  test("avatar com fallback renderiza via <Avatar> CN (iniciais)", async ({ page }) => {
    await expect(page.getByText("AL", { exact: true }).first()).toBeVisible();
  });

  test("indicador de digitacao tem role=status com aria-label", async ({ page }) => {
    await expect(page.getByRole("status", { name: "Typing" })).toBeVisible();
  });

  test("icone de status tem aria-label descritivo", async ({ page }) => {
    await expect(page.getByLabel("Read", { exact: true }).first()).toBeVisible();
    await expect(page.getByLabel("Sent", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Delivered", { exact: true })).toBeVisible();
  });
});
