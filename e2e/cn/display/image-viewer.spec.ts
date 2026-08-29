import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/image-viewer";

test.describe("ImageViewer", () => {
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

  test("abrir a lightbox move o foco pra dentro e Tab não escapa pro conteúdo de trás", async ({ page }) => {
    const frame = page.locator("main");
    await frame.getByRole("button", { name: "Abstract landscape" }).click();
    const dialog = page.getByRole("dialog", { name: "Image viewer" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeFocused();
    // Shift+Tab a partir do primeiro botão focável deve ciclar pro último dentro do dialog,
    // nunca escapar pro grid de thumbnails atrás do overlay
    await page.keyboard.press("Shift+Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    const dialogButtons = await dialog.locator("button").all();
    const lastLabel = await dialogButtons[dialogButtons.length - 1].getAttribute("aria-label");
    expect(focused).toBe(lastLabel);
  });

  test("fechar a lightbox devolve o foco pro thumbnail que abriu", async ({ page }) => {
    const frame = page.locator("main");
    const thumb = frame.getByRole("button", { name: "Abstract landscape" });
    await thumb.click();
    await page.keyboard.press("Escape");
    await expect(thumb).toBeFocused();
  });

  test("ArrowRight navega pra próxima imagem e o dot ativo reflete aria-current", async ({ page }) => {
    const frame = page.locator("main");
    await frame.getByRole("button", { name: "Abstract landscape" }).click();
    await page.keyboard.press("ArrowRight");
    const dialog = page.getByRole("dialog", { name: "Image viewer" });
    await expect(dialog.getByText("Mountains B")).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Image 2" })).toHaveAttribute("aria-current", "true");
  });
});
