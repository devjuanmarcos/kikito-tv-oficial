import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/multi-accordion";

test.describe("MultiAccordion", () => {
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

  test("type=multiple mantém vários painéis abertos ao mesmo tempo", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const t1 = frame.getByRole("button", { name: "What is Kikito CN?" }).first();
    const t2 = frame.getByRole("button", { name: "How do I install?" }).first();
    await t1.click();
    await t2.click();
    await expect(t1).toHaveAttribute("aria-expanded", "true");
    await expect(t2).toHaveAttribute("aria-expanded", "true");
  });

  test("achado real corrigido: painel continua no DOM quando fechado (aria-hidden, não desmontado)", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "pendência 0b: sidebar intercepta pointer-events no clique em mobile-chrome");
    const frame = page.locator("main");
    const trigger = frame.getByRole("button", { name: "What is Kikito CN?" }).first();
    const panelId = await trigger.getAttribute("aria-controls");
    const panel = page.locator(`#${panelId}`);
    await expect(panel).toHaveAttribute("aria-hidden", "true");
    await expect(panel).toBeAttached();
    await trigger.click();
    await expect(panel).toHaveAttribute("aria-hidden", "false");
  });

  test("achado real corrigido: variant=flush é visualmente diferente de default (sem borda por item)", async ({
    page,
  }) => {
    const frame = page.locator("main");
    // "What is Kikito CN?" se repete em Default(0)/Bordered(1)/Flush(2) — mesmos items
    // reaproveitados nas 3 demos. .nth(2) é a instância flush; item wrapper é o pai direto do trigger.
    // divide-y (flush) só adiciona borda vertical entre itens — nunca esquerda/direita, ao
    // contrário do `border` real (default/bordered, que envolve os 4 lados)
    const flushTrigger = frame.getByRole("button", { name: "What is Kikito CN?" }).nth(2);
    const itemWrapper = flushTrigger.locator("..");
    const borderLeft = await itemWrapper.evaluate((el) => getComputedStyle(el).borderLeftWidth);
    expect(borderLeft).toBe("0px");

    const defaultTrigger = frame.getByRole("button", { name: "What is Kikito CN?" }).first();
    const defaultBorderLeft = await defaultTrigger.locator("..").evaluate((el) => getComputedStyle(el).borderLeftWidth);
    expect(defaultBorderLeft).not.toBe("0px");
  });

  test("achado real corrigido: intents tertiary/quaternary renderizam (antes inacessíveis pelo tipo)", async ({
    page,
  }) => {
    const frame = page.locator("main");
    await expect(frame.getByText("Tertiary intent")).toBeVisible();
    await expect(frame.getByText("Quaternary intent")).toBeVisible();
  });
});
