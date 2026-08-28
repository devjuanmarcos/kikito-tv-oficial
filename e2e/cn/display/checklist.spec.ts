import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/checklist";

test.describe("Checklist", () => {
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

  test("clicar num item alterna aria-checked e atualiza o progresso", async ({ page }) => {
    const frame = page.locator('text="Default — progress + strikethrough"').locator("..");
    const item = frame.getByRole("checkbox", { name: /Dark mode configured/ });
    await expect(item).toHaveAttribute("aria-checked", "false");
    await expect(frame.getByText("2 de 5 concluídos")).toBeVisible();
    await item.click();
    await expect(item).toHaveAttribute("aria-checked", "true");
    await expect(frame.getByText("3 de 5 concluídos")).toBeVisible();
  });

  test("progressbar tem aria-valuenow correto", async ({ page }) => {
    const frame = page.locator('text="Default — progress + strikethrough"').locator("..");
    await expect(frame.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
  });

  test("teclado: Enter no item marcado via foco alterna o estado", async ({ page }) => {
    const frame = page.locator('text="Success intent"').locator("..");
    const item = frame.getByRole("checkbox").first();
    await item.focus();
    await item.press("Enter");
    // já vinha marcado (checked:true) — Enter desmarca
    await expect(item).toHaveAttribute("aria-checked", "false");
  });
});
