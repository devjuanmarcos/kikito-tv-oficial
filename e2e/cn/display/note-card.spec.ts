import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/note-card";

test.describe("NoteCard (CN)", () => {
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

  test("todas as 6 cores renderizam", async ({ page }) => {
    // capitalize e' CSS (text-transform) - o texto real no DOM fica em minusculas
    for (const color of ["yellow", "pink", "blue", "green", "purple", "orange"]) {
      await expect(page.getByText(color, { exact: true })).toBeVisible();
    }
  });

  test("author e date aparecem no rodape", async ({ page }) => {
    await expect(page.getByText("Alex", { exact: true })).toBeVisible();
    await expect(page.getByText("Aug 27", { exact: true })).toBeVisible();
  });

  test("rotacao aplica transform real", async ({ page }) => {
    // "Note A" -> <p> -> div de conteudo -> div raiz da nota (onde o transform e' aplicado)
    const noteA = page.getByText("Note A").locator("../..");
    const transform = await noteA.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).not.toBe("none");
  });
});
