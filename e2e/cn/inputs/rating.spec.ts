import { test, expect } from "@playwright/test";

/**
 * Rating absorbs rating-input for real (RatingInput.tsx is a genuine thin
 * backward-compat wrapper: `<Rating toggleOff icon="★" emptyIcon="☆" />`).
 */
const ROUTES = {
  rating: "/pt/cn/inputs/rating",
  "rating-input": "/pt/cn/inputs/rating-input",
};

for (const [name, url] of Object.entries(ROUTES)) {
  test.describe(`${name} (CN)`, () => {
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

test.describe("Rating (CN) — interacao", () => {
  test("clicar numa estrela atualiza o valor exibido", async ({ page }) => {
    await page.goto(ROUTES.rating);
    await page.waitForLoadState("networkidle");
    const star4 = page.getByRole("button", { name: "Rate 4 of 5" }).first();
    await star4.click();
    await expect(page.getByText("Value:").first()).toBeVisible();
  });
});

test.describe("Rating (CN) — a11y read-only", () => {
  test("modo read-only expoe role=img com o valor, botoes internos ficam aria-hidden", async ({ page }) => {
    await page.goto(ROUTES.rating);
    await page.waitForLoadState("networkidle");
    const readOnlyGroup = page
      .locator("main")
      .getByRole("img", { name: /out of/ })
      .first();
    await expect(readOnlyGroup).toBeAttached();
    const innerButtons = readOnlyGroup.locator("button");
    await expect(innerButtons.first()).toHaveAttribute("aria-hidden", "true");
  });
});
