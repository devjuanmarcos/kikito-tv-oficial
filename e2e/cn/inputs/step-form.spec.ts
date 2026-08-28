import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/step-form";

test.describe("StepForm", () => {
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

  test("validate real bloqueia o avanço e mostra a mensagem de erro", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Step Form — multi-step").locator("..");
    await frame.getByRole("button", { name: "Next →" }).click();
    await expect(frame.getByText("Email address is required.")).toBeVisible();
    await expect(frame.getByText("Profile")).toBeVisible(); // título do passo 2 ainda não deve aparecer como ativo
  });

  test("passo ativo tem aria-current=step e avança depois de preencher", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Step Form — multi-step").locator("..");
    const activeStep = frame.locator('[aria-current="step"]');
    await expect(activeStep).toHaveCount(1);

    await frame.getByPlaceholder("Email address").fill("user@kikito.dev");
    await frame.getByRole("button", { name: "Next →" }).click();
    await expect(frame.getByText("Tell us a bit about yourself.")).toBeVisible();
  });

  test("Complete no último passo dispara a tela de sucesso", async ({ page, isMobile }) => {
    // pendência 0b já documentada: sidebar/grid do showcase espreme o Frame em mobile-chrome
    test.skip(isMobile, "pendência 0b: container da demo colapsa em mobile-chrome");
    const frame = page.locator("text=Step Form — multi-step").locator("..");
    await frame.getByPlaceholder("Email address").fill("user@kikito.dev");
    await frame.getByRole("button", { name: "Next →" }).click();
    // espera o passo 2 render antes do próximo clique — clicar rápido demais em
    // sequência pegava o botão em transição de layout (textarea entra no DOM)
    await expect(frame.getByText("Tell us a bit about yourself.")).toBeVisible();
    await frame.getByRole("button", { name: "Next →" }).click();
    await expect(frame.getByText("Everything looks good!")).toBeVisible();
    await frame.getByRole("button", { name: "Complete" }).click();
    await expect(frame.getByText("All done!", { exact: true })).toBeVisible();
  });
});
