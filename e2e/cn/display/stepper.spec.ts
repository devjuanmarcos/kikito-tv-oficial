import { test, expect } from "@playwright/test";

/**
 * Stepper's `absorbs: ["dot-stepper", "progress-steps"]` was false — Stepper only
 * dispatches by `orientation` (horizontal/vertical), no dot/progress mode of its own.
 * DotStepper is standalone (own dot/dash/progress dispatch); progress-steps already
 * covered separately in e2e/cn/feedback/progress.spec.ts.
 */
const ROUTES = ["/pt/cn/display/stepper", "/pt/cn/display/dot-stepper"];

for (const url of ROUTES) {
  test.describe(`rota ${url}`, () => {
    test("renderiza sem crash e sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await expect(page).not.toHaveTitle(/Error|500|404/);
      await expect(page.locator("main")).toBeVisible();
      expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
    });
  });
}

test.describe("Stepper", () => {
  test("dot-stepper e progress-steps aparecem na sidebar (absorbs falso corrigido)", async ({ page }) => {
    await page.goto("/pt/cn/display/stepper");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Dot Stepper", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Progress Steps", exact: true })).toBeVisible();
  });
});

test.describe("Dot Stepper", () => {
  test("clique num dot muda o step ativo (aria-current)", async ({ page }) => {
    await page.goto("/pt/cn/display/dot-stepper");
    await page.waitForLoadState("networkidle");
    const dash = page.getByRole("button", { name: "Go to step 3" }).first();
    await dash.click();
    await expect(dash).toHaveAttribute("aria-current", "step");
  });
});
