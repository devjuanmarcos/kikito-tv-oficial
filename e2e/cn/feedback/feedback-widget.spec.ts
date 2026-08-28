import { test, expect } from "@playwright/test";

const URL = "/pt/cn/feedback/feedback-widget";

test.describe("FeedbackWidget", () => {
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

  test("stars: escolher 4 estrelas marca aria-pressed e libera o botão de enviar", async ({ page }) => {
    const frame = page.locator('text="Stars"').locator("..");
    const submit = frame.getByRole("button", { name: "Submit feedback" });
    await expect(submit).toBeDisabled();
    await frame.getByRole("button", { name: "4 stars" }).click();
    await expect(frame.getByRole("button", { name: "4 stars" })).toHaveAttribute("aria-pressed", "true");
    await expect(submit).toBeEnabled();
  });

  test("nps: escolher nota e enviar mostra tela de agradecimento", async ({ page }) => {
    const frame = page.locator('text="NPS"').locator("..");
    await frame.getByRole("button", { name: "Score 9" }).click();
    await frame.getByRole("button", { name: "Submit feedback" }).click();
    await expect(frame.getByRole("status")).toContainText("Thank you!");
  });

  test("emoji: escolher opção marca aria-pressed e aria-label acessível", async ({ page }) => {
    const frame = page.locator('text="Emoji"').locator("..");
    const great = frame.getByRole("button", { name: "Great" });
    await great.click();
    await expect(great).toHaveAttribute("aria-pressed", "true");
  });
});
