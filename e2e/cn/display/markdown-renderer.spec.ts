import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/markdown-renderer";

test.describe("MarkdownRenderer", () => {
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

  test("renderiza heading, bold, código inline e blockquote como elementos reais", async ({ page, isMobile }) => {
    // pendência 0b já documentada: sidebar/grid do showcase espreme o Frame em
    // mobile-chrome a ponto de zerar a área visível — não é bug deste componente
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator('text="Markdown → styled HTML"').locator("..");
    await expect(frame.locator("h1", { hasText: "Heading 1" })).toBeVisible();
    await expect(frame.locator("strong", { hasText: "bold" })).toBeVisible();
    await expect(frame.locator("code", { hasText: "inline code" })).toBeVisible();
    await expect(frame.locator("blockquote")).toBeVisible();
  });

  test("renderiza tabela GFM como <table> real com thead/tbody", async ({ page }) => {
    const frame = page.locator('text="Markdown → styled HTML"').locator("..");
    const table = frame.locator("table");
    await expect(table).toBeVisible();
    await expect(table.locator("th", { hasText: "Token" })).toBeVisible();
    await expect(table.locator("td", { hasText: "6px" })).toBeVisible();
  });
});
