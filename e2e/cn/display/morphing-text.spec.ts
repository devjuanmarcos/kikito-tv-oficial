import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/morphing-text";

test.describe("MorphingText", () => {
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

  test("uma das palavras do ciclo aparece visivel", async ({ page }) => {
    const frame = page.locator('text="Morphing Text — cycling animated words"').locator("..");
    await expect(frame.getByText(/interfaces|experiences|products|systems/)).toBeVisible();
  });

  test("apos esperar o intervalo, a palavra exibida muda", async ({ page }) => {
    const frame = page.locator('text="Morphing Text — cycling animated words"').locator("..");
    const words = ["interfaces", "experiences", "products", "systems"];
    // frame.locator("p").first() pegava o <p> do LABEL do Frame (vem antes no DOM),
    // nao o <p>"We build {word}" do demo -- ancora pelo texto fixo "We build" em vez de
    // depender de ordem de tag.
    const p = frame.getByText("We build", { exact: false });
    await expect(p).toContainText(/interfaces|experiences|products|systems/, { timeout: 3000 });
    const before = (await p.innerText()).trim();
    await page.waitForTimeout(2500);
    const after = (await p.innerText()).trim();
    expect(words.some((w) => after.includes(w))).toBe(true);
    expect(after).not.toBe(before);
  });
});
