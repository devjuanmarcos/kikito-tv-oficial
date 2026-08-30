import { test, expect } from "@playwright/test";

const URL = "/pt/cn/layout/side-panel";

test.describe("SidePanel", () => {
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

  test("defaultOpen: painel abre expandido por padrao, nao colapsado", async ({ page }) => {
    const frame = page.locator('text="Side Panel — collapsible split layout"').locator("..");
    await expect(frame.getByText("Overview")).toBeVisible();
    await expect(frame.getByRole("button", { name: "Collapse panel" })).toBeVisible();
  });

  test("achado real corrigido: clicar no toggle colapsa de verdade (uncontrolled)", async ({ page }) => {
    // Antes do fix, SidePanel resolvia `open ?? defaultOpen` num boolean sempre
    // concreto, fazendo o ModalPanel (que decide `controlled = open !== undefined`)
    // achar que era sempre controlado -- clicar disparava onOpenChange mas nada
    // reagia, porque ninguem escutava esse callback. Aqui ninguem controla `open`
    // de fora, entao so o estado interno do proprio ModalPanel pode mudar isso.
    const frame = page.locator('text="Side Panel — collapsible split layout"').locator("..");
    const rail = frame.locator(".transition-\\[width\\]").first();

    await expect(rail).toHaveCSS("width", "180px");
    await frame.getByRole("button", { name: "Collapse panel" }).click();
    await expect(frame.getByRole("button", { name: "Expand panel" })).toBeVisible();
    // collapsedWidth=0, mas box-sizing:border-box + border-r de 1px nao deixa o
    // trilho encolher abaixo da largura da propria borda -- 1px e o minimo real.
    await expect(rail).toHaveCSS("width", "1px");
  });
});
