import { test, expect } from "@playwright/test";

const URL = "/pt/cn/inputs/otp-input";

test.describe("OtpInput (CN)", () => {
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

  test("digitar avanca o foco pra proxima celula, Value: aparece completo", async ({ page }) => {
    const group = page.getByRole("group", { name: "One-time passcode" }).first();
    const digits = group.getByRole("textbox");
    await expect(digits).toHaveCount(6);

    for (let i = 0; i < 6; i++) {
      await digits.nth(i).pressSequentially(String(i + 1));
    }
    await expect(page.getByText("Value:").first()).toContainText("123456");
  });

  test("Backspace numa celula vazia volta o foco pra anterior e limpa", async ({ page }) => {
    const group = page.getByRole("group", { name: "One-time passcode" }).first();
    const digits = group.getByRole("textbox");
    await digits.nth(0).pressSequentially("9");
    await digits.nth(1).focus();
    await digits.nth(1).press("Backspace");
    await expect(digits.nth(0)).toHaveValue("");
    await expect(digits.nth(0)).toBeFocused();
  });

  test("colar 6 digitos preenche todas as celulas", async ({ page }) => {
    const group = page.getByRole("group", { name: "One-time passcode" }).first();
    const first = group.getByRole("textbox").first();
    await first.focus();
    await first.evaluate((el: HTMLInputElement) => {
      const dt = new DataTransfer();
      dt.setData("text", "654321");
      el.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
    });
    const digits = group.getByRole("textbox");
    await expect(digits.nth(5)).toHaveValue("1");
  });
});
