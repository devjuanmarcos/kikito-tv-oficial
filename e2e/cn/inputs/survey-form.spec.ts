import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/survey-form";

test.describe("SurveyForm", () => {
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

  test("required real bloqueia o submit e mostra erro por pergunta não respondida", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Survey Form — multiple question types").locator("..");
    await frame.getByRole("button", { name: "Submit Survey" }).click();
    await expect(frame.getByText("This question is required.")).toHaveCount(2); // "name" e "role"
  });

  test("preencher os obrigatórios permite o submit sem erro", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Survey Form — multiple question types").locator("..");
    await frame.getByPlaceholder("Enter your name").fill("Kikito");
    // input do Radio é sr-only (o círculo visível é um <span> decorativo por cima) —
    // clicar no label associado em vez do input escondido
    await frame.getByText("Developer", { exact: true }).click();
    await frame.getByRole("button", { name: "Submit Survey" }).click();
    await expect(frame.getByText("This question is required.")).toHaveCount(0);
  });

  test("tipo scale usa role=radiogroup/radio com aria-checked", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Survey Form — multiple question types").locator("..");
    const group = frame.getByRole("radiogroup", { name: "Years of experience" });
    const option = group.getByRole("radio", { name: "5", exact: true });
    await option.click();
    await expect(option).toHaveAttribute("aria-checked", "true");
  });

  test("tipo rating usa o componente Rating real (estrelas com aria-label)", async ({ page, isMobile }) => {
    test.skip(isMobile, "pendência 0b: sidebar do showcase intercepta clique em mobile-chrome");
    const frame = page.locator("text=Survey Form — multiple question types").locator("..");
    const star = frame.getByRole("button", { name: "Rate 3 of 5" });
    await expect(star).toBeVisible();
    await star.click();
  });
});
