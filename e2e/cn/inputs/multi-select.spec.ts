import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/multi-select";

test.describe("MultiSelect", () => {
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

  test("selecionado inicial aparece como chip removível", async ({ page }, testInfo) => {
    // pendência 0b: em mobile-chrome (~393px) a sidebar do showcase não colapsa e espreme
    // o conteúdo — texto/chips ficam cortados/ocultos pela largura útil quase zero.
    // Achado sistêmico, não é bug do MultiSelect. Ver docs/AUDITORIA-CN-STATUS.md.
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "pendência 0b — sidebar do showcase espreme o conteúdo em mobile-chrome"
    );
    const frame = page.locator('text="Multi Select — select multiple values"').locator("..");
    await expect(frame.locator("span", { hasText: "React" }).first()).toBeVisible();
    await frame.getByRole("button", { name: "Remove React" }).click();
    await expect(frame.getByText("Selected: typescript")).toBeVisible();
  });

  test("maxSelected=2: terceira opção não é aceita", async ({ page }, testInfo) => {
    // pendência 0b (ver acima) — a lista de opções fica instável/fora do viewport na sidebar
    // espremida de mobile-chrome.
    test.skip(
      testInfo.project.name === "mobile-chrome",
      "pendência 0b — sidebar do showcase espreme o conteúdo em mobile-chrome"
    );
    const frame = page.locator('text="maxSelected — limita a 2 escolhas"').locator("..");
    await frame.getByRole("combobox").click();
    await frame.getByRole("option", { name: "TypeScript" }).click();
    await frame.getByRole("option", { name: "Next.js" }).click();
    await expect(frame.getByRole("option", { name: "React" })).toHaveAttribute("aria-selected", "true");
    await expect(frame.getByRole("option", { name: "TypeScript" })).toHaveAttribute("aria-selected", "true");
    await expect(frame.getByRole("option", { name: "Next.js" })).toHaveAttribute("aria-selected", "false");
  });
});
