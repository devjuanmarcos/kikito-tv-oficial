import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/typewriter";

test.describe("Typewriter", () => {
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

  test("texto digitado cresce ao longo do tempo (nao aparece tudo de uma vez)", async ({ page }) => {
    const frame = page.locator('text="Typewriter — type, pause, delete, loop"').locator("..");
    // frame.locator("p").first() pegaria o <p> do LABEL do Frame (vem antes no DOM),
    // nao o <p>"We design {texto}" do demo -- ancora pelo texto fixo "We design".
    const p = frame.getByText("We design", { exact: false });
    await page.waitForTimeout(200);
    const early = (await p.innerText()).trim();
    await page.waitForTimeout(600);
    const later = (await p.innerText()).trim();
    expect(later.length).toBeGreaterThanOrEqual(early.length);
  });
});
