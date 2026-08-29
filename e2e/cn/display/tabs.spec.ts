import { test, expect } from "@playwright/test";

const URL = "/pt/cn/display/tabs";

test.describe("Tabs (CN)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForLoadState("networkidle");
  });

  test("renderiza sem crash", async ({ page }) => {
    await expect(page).not.toHaveTitle(/Error|500|404/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("dark mode: pagina nao quebra ao alternar", async ({ page }) => {
    const toggle = page.getByRole("button", { name: /Ativar modo/ });
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(400);
      await expect(page.locator("main")).toBeVisible();
    }
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

  test("clique numa tab troca a selecionada", async ({ page }) => {
    const tabs = page.getByRole("tab");
    const settings = tabs.filter({ hasText: "Settings" }).first();
    await settings.click();
    await expect(settings).toHaveAttribute("aria-selected", "true");
  });

  test("tab focada mostra outline patina (nao mais so o fallback verde do dashboard)", async ({ page }) => {
    const first = page.getByRole("tab").first();
    await first.focus();
    const outlineColor = await first.evaluate((el) => getComputedStyle(el).outlineColor);
    // --ks-patina no tema atual, nao rgb(16, 81, 68) (--brand-primary-mid, fallback do dashboard)
    expect(outlineColor).not.toBe("rgb(16, 81, 68)");
  });

  test("navegacao por teclado (ArrowRight/ArrowLeft) troca a tab focada", async ({ page }) => {
    const tabs = page.getByRole("tab");
    const first = tabs.first();
    await first.focus();
    await expect(first).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowRight");
    const second = tabs.nth(1);
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(second).toBeFocused();

    await page.keyboard.press("ArrowLeft");
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(first).toBeFocused();
  });

  // achado real absorvido de docs/component-import/animation-backport/PLAN.md (tabs-01.tsx):
  // indicador de fundo/sublinhado desliza entre abas via motion layoutId em vez de trocar
  // instantâneo. Página tem 8+ instâncias de <Tabs> simultâneas (variantes + alignment) —
  // cada uma precisa de layoutId único (useId) pra não sincronizar animação com as outras.
  test("indicador deslizante: variante pill move o fundo pra aba clicada, sem vazar pra outras instâncias", async ({
    page,
  }) => {
    // Frame renderiza <div class="mb-4"><p>{label}</p><div>{children}</div></div> — subindo 1
    // nível a partir do label "pill" chega no wrapper que também contém a caixa de conteúdo
    const pillFrame = page.getByText("pill", { exact: true }).locator("..");
    const pillTabs = pillFrame.getByRole("tab");
    await pillTabs.filter({ hasText: "Billing" }).click();

    // motion.span com layoutId só existe dentro da aba ATIVA — confirma que o indicador
    // "pertence" à aba clicada, não ficou preso na aba antiga nem vazou pra outra instância
    const activeTab = pillFrame.getByRole("tab", { name: "Billing" });
    await expect(activeTab.locator("span.absolute")).toHaveCount(1);
    const otherTab = pillFrame.getByRole("tab", { name: "Overview" });
    await expect(otherTab.locator("span.absolute")).toHaveCount(0);
  });

  test("indicador deslizante: 4 instâncias simultâneas de variant=line (Alignment), 1 barra cada, sem colisão de layoutId", async ({
    page,
  }) => {
    // ShowcaseSection renderiza <div><h2>{title}</h2><div>{children}</div></div> — subindo 1
    // nível a partir do título "Alignment" chega no wrapper com as 4 instâncias de Tabs
    const alignmentSection = page.getByText("Alignment", { exact: true }).locator("..");
    const tablists = alignmentSection.getByRole("tablist");
    await expect(tablists).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      // cada instância tem sua própria aba ativa com exatamente 1 barra — nunca 0 (indicador
      // sumiu) nem >1 (layoutId colidindo/indicador duplicado entre instâncias)
      const activeTab = tablists.nth(i).locator('[aria-selected="true"]');
      await expect(activeTab.locator("span.absolute")).toHaveCount(1);
    }
  });
});
