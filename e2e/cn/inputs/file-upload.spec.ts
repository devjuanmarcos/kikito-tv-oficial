import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/file-upload";

test.describe("FileUpload (CN)", () => {
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

  test("dropzone e acionavel por teclado (role=button + Enter aciona o input escondido)", async ({ page }) => {
    const dropzone = page.getByRole("button", { name: /Click to upload/ });
    await expect(dropzone).toHaveAttribute("tabindex", "0");

    const fileInput = page.locator('input[type="file"]').first();
    const clicked = fileInput.evaluate(
      (el: HTMLInputElement) => new Promise((resolve) => el.addEventListener("click", () => resolve(true)))
    );
    await dropzone.focus();
    await dropzone.press("Enter");
    await expect(clicked).resolves.toBe(true);
  });

  test("upload via input dispara a lista de arquivos e permite remover", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from("fake-png-content"),
    });
    await expect(page.getByText("test.png")).toBeVisible();

    await page.getByRole("button", { name: "Remove test.png" }).click();
    await expect(page.getByText("test.png")).not.toBeAttached();
  });

  test("variante button usa o componente Button do CN", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Choose file…" });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveClass(/focus-visible:outline-patina/);
  });
});
