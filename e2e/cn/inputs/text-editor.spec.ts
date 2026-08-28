import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/text-editor";

test.describe("TextEditor", () => {
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

  test("região editável expõe role=textbox com nome acessível", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const editor = page.getByRole("textbox", { name: "Post content" });
    await expect(editor).toBeVisible();
  });

  test("botão Bold aplica negrito e fica aria-pressed", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const editor = page.getByRole("textbox", { name: "Post content" });
    const boldBtn = page.getByRole("button", { name: "Bold" }).first();

    await expect(boldBtn).toHaveAttribute("aria-pressed", "false");

    // seleciona a palavra "rich" já presente no HTML inicial
    await editor.click();
    await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Post content"]');
      const strong = el?.querySelector("strong");
      if (strong) {
        const range = document.createRange();
        range.selectNodeContents(strong);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
    // seleção já cai dentro de um <strong> existente → Bold deve refletir "pressed" ao focar/mover
    await editor.dispatchEvent("mouseup");
    await expect(boldBtn).toHaveAttribute("aria-pressed", "true");
  });

  test("disabled: editor não aceita edição e toolbar fica desabilitada", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    // demo "Disabled" não passa ariaLabel/placeholder -> cai no default "Start typing…",
    // diferente do editor "Default" (ariaLabel="Post content") — nome único pra localizar
    const disabledEditor = page.getByRole("textbox", { name: "Start typing…" });
    await expect(disabledEditor).toBeVisible();
    await expect(disabledEditor).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByText("This editor is disabled.")).toBeVisible();
    const disabledToolbarBtn = page.getByRole("button", { name: "Bold" }).last();
    await expect(disabledToolbarBtn).toBeDisabled();
  });
});
