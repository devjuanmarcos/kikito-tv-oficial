import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/textarea";

test.describe("Textarea", () => {
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

  test("controlado: digitar atualiza o valor", async ({ page }) => {
    const frame = page.locator('text="Outline (default)"').locator("..");
    const ta = frame.getByLabel("Message");
    await ta.fill("Hello world");
    await expect(ta).toHaveValue("Hello world");
  });

  test("erro: aria-invalid e aria-describedby apontam pra mensagem real", async ({ page }) => {
    const frame = page.locator('text="Error · success"').locator("..");
    const ta = frame.locator("textarea").first();
    await expect(ta).toHaveAttribute("aria-invalid", "true");
    const describedBy = await ta.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toHaveText("Este campo é obrigatório");
  });

  test("floatingLabel: label sobe e encolhe no foco/valor", async ({ page }) => {
    const frame = page.locator('text="Floating label (paridade com Input.floatingLabel)"').locator("..");
    const label = frame.getByText("Message", { exact: true });
    const ta = frame.locator("textarea");
    await expect(label).not.toHaveClass(/text-patina/);
    await ta.focus();
    await expect(label).toHaveClass(/text-patina/);
    await ta.blur();
    await expect(label).not.toHaveClass(/text-patina/);
    await ta.fill("hello");
    await expect(label).toHaveClass(/text-patina/);
  });

  test("showCount exibe contador e cresce com autoResize", async ({ page }) => {
    const frame = page.locator('text="Auto-resize · char count"').locator("..");
    const ta = frame.locator("textarea");
    await expect(frame.getByText("0 / 200")).toBeVisible();
    await ta.fill("abc");
    await expect(frame.getByText("3 / 200")).toBeVisible();
  });
});
