import { test, expect } from "@playwright/test";

/**
 * Timeline — Super component (variant dispatches 4 families):
 * 'default'/'compact'/'reverse' → classic vertical timeline
 * 'scroll'   → absorbed ScrollTimeline    (route: display/scroll-timeline)
 * 'progress' → absorbed TimelineProgress  (route: display/timeline-progress)
 * 'activity' → absorbed ActivityFeed      (route: display/activity-feed)
 */
const ROUTES = {
  default: "/pt/cn/display/timeline",
  scroll: "/pt/cn/display/scroll-timeline",
  progress: "/pt/cn/display/timeline-progress",
  activity: "/pt/cn/display/activity-feed",
};

for (const [family, url] of Object.entries(ROUTES)) {
  test.describe(`Timeline (CN) — ${family} family`, () => {
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

test.describe("Timeline (CN) — dark mode", () => {
  test("pagina nao quebra ao alternar", async ({ page }) => {
    await page.goto(ROUTES.default);
    await page.waitForLoadState("networkidle");
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});

test.describe("Timeline (CN) — progress family a11y", () => {
  test("passo atual tem aria-current=step", async ({ page }) => {
    await page.goto(ROUTES.progress);
    await page.waitForLoadState("networkidle");
    await expect(page.locator('[aria-current="step"]').first()).toBeVisible();
  });
});
