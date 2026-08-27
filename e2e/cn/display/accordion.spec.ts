import { test, expect } from "@playwright/test";

/**
 * `accordion` does NOT absorb accordion-group/multi-accordion/collapsible —
 * the four are separate, parallel implementations with different APIs (see
 * JSDoc comment / cn-registry.tsx note). Fixed a stale `absorbs` claim that
 * was hiding all three from the sidebar nav; `collapsible` additionally had
 * no demo at all (page was blank/"não encontrada" before this fix).
 */
const ROUTES = {
  accordion: "/pt/cn/display/accordion",
  "accordion-group": "/pt/cn/display/accordion-group",
  "multi-accordion": "/pt/cn/display/multi-accordion",
  collapsible: "/pt/cn/display/collapsible",
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

test.describe("accordion-group + multi-accordion (CN) — sidebar", () => {
  test("aparecem na navegacao lateral (nao estao mais marcados como absorvidos)", async ({ page }) => {
    await page.goto(ROUTES.accordion);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Accordion Group" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Multi Accordion" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Collapsible" })).toBeVisible();
  });
});

test.describe("Accordion (CN) — a11y", () => {
  test("trigger e painel expostos com aria-expanded/aria-controls/role=region", async ({ page }) => {
    await page.goto(ROUTES.accordion);
    await page.waitForLoadState("networkidle");
    // já aberto por defaultValue na demo — evita scroll/clique em elemento fora da viewport (múltiplos Frames empilhados)
    const openTrigger = page.locator("main").getByRole("button", { expanded: true }).first();
    await expect(openTrigger).toBeAttached();
    const controlsId = await openTrigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    const panel = page.locator(`#${controlsId}`);
    await expect(panel).toHaveAttribute("role", "region");
    await expect(panel).toHaveAttribute("aria-hidden", "false");

    const closedTrigger = page.locator("main").getByRole("button", { expanded: false }).first();
    await expect(closedTrigger).toBeAttached();
    expect(await closedTrigger.getAttribute("aria-controls")).toBeTruthy();
  });
});

test.describe("Collapsible (CN) — a11y", () => {
  test("trigger e painel ligados por aria-controls/id", async ({ page }) => {
    await page.goto(ROUTES.collapsible);
    await page.waitForLoadState("networkidle");
    const trigger = page.locator("main").getByRole("button", { expanded: false }).first();
    const controlsId = await trigger.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    await expect(page.locator(`#${controlsId}`)).toBeAttached();
  });
});
