import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/status-badge";

test.describe("StatusBadge", () => {
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

  test("sem showLabel, o dot expõe o status via role=img + aria-label (não só cor)", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByRole("img", { name: "Online" })).toBeVisible();
    await expect(frame.getByRole("img", { name: "Offline" })).toBeVisible();
    await expect(frame.getByRole("img", { name: "Busy" })).toBeVisible();
    await expect(frame.getByRole("img", { name: "Away" })).toBeVisible();
    await expect(frame.getByRole("img", { name: "Idle" })).toBeVisible();
  });

  test("com showLabel, o texto visível aparece e o dot não duplica o anúncio (aria-hidden)", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("Online", { exact: true }).first()).toBeVisible();
    // com showLabel, nenhum dot deveria expor role=img redundante com o texto ao lado
    const labeledSection = frame.locator("text=Online").first().locator("../..");
    await expect(labeledSection.getByRole("img")).toHaveCount(0);
  });
});
