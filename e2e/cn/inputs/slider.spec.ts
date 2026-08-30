import { test, expect } from "@playwright/test";

/**
 * RangeSlider absorbed for real (thin wrapper: `<Slider range />`).
 */
const URL = "/pt/cn/inputs/slider";
const RANGE_URL = "/pt/cn/inputs/range-slider";

test.describe("Slider", () => {
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

  test("slider controlado: ArrowRight aumenta o valor exibido", async ({ page }) => {
    const frame = page.locator("text=With label and value").locator("..");
    const slider = frame.getByRole("slider", { name: "Volume" });
    await expect(slider).toHaveValue("50");
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await expect(slider).toHaveValue("51");
  });

  test("marcas exibem os 5 labels de Low a Max", async ({ page }) => {
    const frame = page.locator("text=Step marks").locator("..");
    for (const label of ["Low", "Fair", "Good", "High", "Max"]) {
      await expect(frame.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test("previewOnHover destaca segmento até o cursor, sem mexer no valor real", async ({ page }) => {
    const frame = page.locator("text=Preview on hover").locator("..");
    const track = frame.locator(".bg-graphite-2");
    const slider = frame.getByRole("slider", { name: "Temperature" });
    await expect(slider).toHaveValue("30");
    // achado real: sem isso o boundingBox ficava fora do viewport (seção fica abaixo da
    // dobra) e page.mouse.move não acertava nada — elementFromPoint confirmava null
    await track.scrollIntoViewIfNeeded();
    const box = await track.boundingBox();
    // hover perto do fim da trilha — preview deve aparecer, valor real não muda
    await page.mouse.move(box!.x + box!.width * 0.9, box!.y + box!.height / 2);
    const preview = track.locator(".opacity-30");
    await expect(preview).toBeVisible();
    await expect(slider).toHaveValue("30");
    await page.mouse.move(0, 0);
    await expect(preview).not.toBeVisible();
  });
});

test.describe("Slider (modo range)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(RANGE_URL);
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
    await page.goto(RANGE_URL);
    await page.waitForLoadState("networkidle");
    expect(errors.filter((e) => !e.includes("favicon"))).toHaveLength(0);
  });

  test("size e intent do modo range são aplicados de verdade (não ignorados)", async ({ page }) => {
    const defaultThumb = page
      .locator("text=Price range selector")
      .locator("..")
      .getByRole("slider", { name: "Minimum value" });
    const customThumb = page
      .locator("text=size='lg' + intent='danger'")
      .locator("..")
      .getByRole("slider", { name: "Minimum value" });

    const [defaultBox, customBox] = await Promise.all([defaultThumb.boundingBox(), customThumb.boundingBox()]);
    // size="lg" (w-5 h-5, 20px) tem que ser maior que o default md (w-4 h-4, 16px) —
    // antes do fix os dois davam exatamente o mesmo tamanho (size era ignorado)
    expect(customBox!.width).toBeGreaterThan(defaultBox!.width);

    const [defaultBg, customBg] = await Promise.all([
      defaultThumb.evaluate((el) => getComputedStyle(el).backgroundColor),
      customThumb.evaluate((el) => getComputedStyle(el).backgroundColor),
    ]);
    // intent="danger" tem que resultar numa cor diferente do primary default —
    // antes do fix os dois davam a mesma cor (intent era ignorado)
    expect(customBg).not.toBe(defaultBg);
  });

  test("thumbs do range são focáveis e movem com as setas", async ({ page }) => {
    const frame = page.locator("text=Price range selector").locator("..");
    const minThumb = frame.getByRole("slider", { name: "Minimum value" });
    await expect(minThumb).toHaveAttribute("aria-valuenow", "20");
    await minThumb.focus();
    await page.keyboard.press("ArrowRight");
    await expect(minThumb).toHaveAttribute("aria-valuenow", "21");
  });

  test("thumb focado muda visualmente o box-shadow (focus-visible funcional)", async ({ page }) => {
    const frame = page.locator("text=Price range selector").locator("..");
    const thumb = frame.getByRole("slider", { name: "Minimum value" });
    const before = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    await thumb.focus();
    const after = await thumb.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(after).not.toBe(before);
  });

  test("thumb desabilitado não muda valor via seta do teclado", async ({ page }) => {
    const frame = page.locator("text=Disabled").locator("..");
    const thumb = frame.getByRole("slider", { name: "Minimum value" });
    await expect(thumb).toBeDisabled();
    const before = await thumb.getAttribute("aria-valuenow");
    await thumb.focus().catch(() => {});
    await page.keyboard.press("ArrowRight");
    const after = await thumb.getAttribute("aria-valuenow");
    expect(after).toBe(before);
  });
});
