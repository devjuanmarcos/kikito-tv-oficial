import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/comparison-table";

test.describe("ComparisonTable", () => {
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

  test("cabeçalhos de coluna e de linha têm scope correto (col/row)", async ({ page }) => {
    const frame = page.locator("main");
    const colHeader = frame.getByRole("columnheader", { name: "Pro Popular" });
    await expect(colHeader).toHaveAttribute("scope", "col");
    const rowHeader = frame.getByRole("rowheader", { name: "Projects" });
    await expect(rowHeader).toHaveAttribute("scope", "row");
  });

  test("tooltip de uma feature é acessível por teclado (foco), não só hover", async ({ page }) => {
    const frame = page.locator("main");
    const infoBtn = frame.getByRole("button", { name: "More info: Storage" });
    await infoBtn.focus();
    await expect(page.getByRole("tooltip")).toBeVisible();
    await expect(page.getByRole("tooltip")).toContainText("Storage counts uploaded files");
  });

  test("badge da coluna destacada renderiza via Badge CN", async ({ page }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("Popular", { exact: true })).toBeVisible();
  });
});
