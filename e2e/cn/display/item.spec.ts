import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/item";

test.describe("Item", () => {
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

  test("ItemGroup expõe role=list e Item expõe role=listitem", async ({ page }) => {
    const frame = page.locator('text="default · outline · muted"').locator("..");
    await expect(frame.getByRole("list")).toBeVisible();
    await expect(frame.getByRole("listitem")).toHaveCount(3);
  });

  test("título, descrição e ações renderizam na lista de notificação", async ({ page }) => {
    const frame = page.locator('text="default · outline · muted"').locator("..");
    await expect(frame.getByText("Novo comentário")).toBeVisible();
    await expect(frame.getByText("Dana Costa comentou no seu post.")).toBeVisible();
    await expect(frame.getByRole("button", { name: "Seguir de volta" })).toBeVisible();
  });

  test("size=xs encolhe a descrição pra caption (font-size menor que default)", async ({ page }) => {
    const frame = page.locator('text="default · sm · xs"').locator("..");
    const defaultDesc = frame.getByText("Padding e gap padrão.");
    const xsDesc = frame.getByText("Mais compacto — descrição encolhe pra caption.");
    const defaultSize = await defaultDesc.evaluate((el) => getComputedStyle(el).fontSize);
    const xsSize = await xsDesc.evaluate((el) => getComputedStyle(el).fontSize);
    expect(parseFloat(xsSize)).toBeLessThan(parseFloat(defaultSize));
  });

  test("ItemSeparator aparece entre os itens do grupo com separador", async ({ page }) => {
    const frame = page.locator('text="ItemGroup + ItemSeparator"').locator("..");
    await expect(frame.getByText("Leo Prado")).toBeVisible();
    await expect(frame.getByText("Dana Costa")).toBeVisible();
    await expect(frame.locator("hr, [role='none']")).toHaveCount(1);
  });
});
