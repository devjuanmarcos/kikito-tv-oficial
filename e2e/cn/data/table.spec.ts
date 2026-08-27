import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/table";

test.describe("Table / DataTable (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
  });

  test("sort de coluna funciona via teclado", async ({ page }) => {
    const nameHeader = page.locator("th[aria-sort]").first();
    await nameHeader.focus();
    await page.keyboard.press("Enter");
    await expect(nameHeader).toHaveAttribute("aria-sort", /ascending|descending/);
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
});

/**
 * DataTable — Super component (variant dispatches 4 renderers):
 * 'table' (default) → covered above (data/table)
 * 'grid'  → absorbed DataGrid (route: data/data-grid)
 * 'list'  → absorbed DataList (route: data/data-list)
 * 'tree'  → absorbed TreeTable (route: data/tree-table)
 * TreeView is a separate, standalone hierarchical component (route: data/tree-view).
 */
const OTHER_ROUTES = {
  "data-grid": "/pt/cn/data/data-grid",
  "data-list": "/pt/cn/data/data-list",
  "tree-table": "/pt/cn/data/tree-table",
  "tree-view": "/pt/cn/data/tree-view",
};

for (const [name, url] of Object.entries(OTHER_ROUTES)) {
  test.describe(`DataTable family (CN) — ${name}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(url);
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
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("Table (CN) — a11y dos filtros/view options", () => {
  test("filtro select expoe aria-haspopup/aria-expanded", async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
    const trigger = page.getByRole("button", { name: "View" });
    await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menu")).toBeVisible();
  });
});

test.describe("TreeView (CN) — expand/collapse via teclado", () => {
  test("nó com filhos expõe aria-expanded", async ({ page }) => {
    await page.goto(OTHER_ROUTES["tree-view"]);
    await page.waitForLoadState("networkidle");
    const item = page.locator('[role="treeitem"][aria-expanded]').first();
    await expect(item).toBeAttached();
  });
});
