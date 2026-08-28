import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/ribbon";

test.describe("Ribbon (CN)", () => {
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

  test("todas as 6 intents renderizam com texto legivel", async ({ page }) => {
    // o card de fundo do demo repete o mesmo texto do label (ver _showcase.tsx) — o
    // <span> da faixa em si é o último elemento com esse texto no DOM (children antes, label depois)
    for (const label of ["primary", "secondary", "success", "warning", "danger", "neutral"]) {
      await expect(page.getByText(label, { exact: true }).last()).toBeVisible();
    }
  });

  test("faixa top-left e top-right coexistem", async ({ page }) => {
    await expect(page.getByText("New", { exact: true })).toBeVisible();
    await expect(page.getByText("Hot", { exact: true })).toBeVisible();
  });
});
