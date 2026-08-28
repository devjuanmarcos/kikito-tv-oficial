import { test, expect } from "@playwright/test";

const URL = "/pt/cn/data/virtual-list";

test.describe("VirtualList", () => {
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

  test("viewport tem role=list acessível e só renderiza uma janela de linhas (windowing real)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const list = page.getByRole("list", { name: "Row list", exact: true });
    await expect(list).toBeVisible();
    await expect(list.getByText("Row 1", { exact: true })).toBeVisible();
    // 1000 linhas de 56px numa janela de 280px + overscan não devem gerar 1000 nós no DOM
    const rendered = await list.getByRole("listitem").count();
    expect(rendered).toBeLessThan(30);
  });

  test("scroll no viewport troca as linhas visíveis pra janela seguinte", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const list = page.getByRole("list", { name: "Row list", exact: true });
    // role="list" fica no spacer interno (altura total, não rola) — quem tem overflow-y-auto
    // de verdade é o pai (viewport com tabIndex/onScroll)
    const viewport = list.locator("..");
    await expect(list.getByText("Row 1", { exact: true })).toBeVisible();
    await viewport.evaluate((el) => {
      el.scrollTop = 5000;
      el.dispatchEvent(new Event("scroll", { bubbles: true }));
    });
    await expect(list.getByText("Row 1", { exact: true })).not.toBeVisible();
  });
});
