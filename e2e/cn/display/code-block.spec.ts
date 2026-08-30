import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/code-block";

test.describe("CodeBlock", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
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

  test("botão Copy do header copia o código e mostra Copied! com aria-live", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const btn = frame.getByRole("button", { name: "Copy code" }).first();
    await expect(btn).toHaveAttribute("aria-live", "polite");
    await btn.click();
    await expect(frame.getByRole("button", { name: "Copied!" }).first()).toBeVisible();
  });

  test("sem filename/language: botão de copiar flutuante fica visível ao focar por teclado (não só hover)", async ({
    page,
  }) => {
    const frame = page.locator("main");
    const floatingBtn = frame.getByRole("button", { name: "Copy code" }).last();
    await floatingBtn.focus();
    // toHaveCSS faz polling/retry — evita ler o valor no meio da transição CSS (opacity
    // anima de 0 a 1), diferente de um evaluate() de tiro único
    await expect(floatingBtn).toHaveCSS("opacity", "1");
  });

  test("tabela de código é role=presentation (não anuncia como tabela de dados)", async ({ page }) => {
    const frame = page.locator("main");
    const table = frame.locator("table").first();
    await expect(table).toHaveAttribute("role", "presentation");
  });

  test("multi-arquivo: trocar de aba troca o código exibido", async ({ page }) => {
    const frame = page.locator('text="Multi-arquivo"').locator("..");
    const tab1 = frame.getByRole("tab", { name: "Button.tsx" });
    const tab2 = frame.getByRole("tab", { name: "utils.ts" });
    await expect(tab1).toHaveAttribute("aria-selected", "true");
    await expect(frame.getByText("handleSave").first()).toBeVisible();

    await tab2.click();
    await expect(tab2).toHaveAttribute("aria-selected", "true");
    await expect(tab1).toHaveAttribute("aria-selected", "false");
    await expect(frame.getByText("greet").first()).toBeVisible();
    await expect(frame.getByText("handleSave")).toHaveCount(0);
  });
});
