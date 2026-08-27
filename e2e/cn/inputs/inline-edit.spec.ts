import { test, expect } from "@playwright/test";

/**
 * Registrado no cn-registry.tsx mas nunca importado/referenciado em _showcase.tsx —
 * mesma classe de bug já fechada em ~36 outras páginas em sessões anteriores. Demo
 * criada e wired nesta validação.
 */
const URL = "/pt/cn/inputs/inline-edit";

test.describe("InlineEdit (CN)", () => {
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

  test("clique entra em modo de edicao, Enter confirma o novo valor", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Project Alpha" });
    await trigger.click();
    const input = page.locator("main").getByRole("textbox").first();
    await expect(input).toBeFocused();
    await input.fill("Project Beta");
    await input.press("Enter");
    await expect(page.getByRole("button", { name: "Project Beta" })).toBeVisible();
  });

  test("Escape cancela sem salvar", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Project Alpha" });
    await trigger.click();
    const input = page.locator("main").getByRole("textbox").first();
    await input.fill("Descartado");
    await input.press("Escape");
    await expect(page.getByRole("button", { name: "Project Alpha" })).toBeVisible();
  });

  test("botao Cancel funciona e o wrapper em foco tem box-shadow real (nao mais 'none')", async ({ page }) => {
    const trigger = page.getByRole("button", { name: "Project Alpha" });
    await trigger.click();
    // o input já entra focado (useEffect), então o wrapper já está em :focus-within aqui —
    // sintaxe antiga (var()+"/20" dentro do bracket) fazia o browser descartar a
    // declaração inteira de box-shadow, resultando em "none"
    const wrapper = page.locator("main").getByRole("textbox").first().locator("..");
    const shadow = await wrapper.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).not.toBe("none");

    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("button", { name: "Project Alpha" })).toBeVisible();
  });
});
