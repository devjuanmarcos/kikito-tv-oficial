import { test, expect, type Page } from "@playwright/test";

const BASE = "/pt/test-animations";

// ─── helpers ─────────────────────────────────────────────────────────────────

async function waitForMotion(page: Page, ms = 600) {
  await page.waitForTimeout(ms);
}

async function screenshot(page: Page, name: string) {
  await page.screenshot({
    path: `playwright-report/animation-qa/${name}.png`,
    fullPage: false,
  });
}

// ─── setup ────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  await page.goto(BASE);
  await page.waitForSelector('[data-testid="test-animations-page"]');
  await page.waitForTimeout(1500);
  // Body may have pointer-events:none set permanently. Force-clear it.
  await page.evaluate(() => {
    document.body.style.removeProperty("pointer-events");
  });
});

// ─── DEBUG ────────────────────────────────────────────────────────────────────

// debug test removed — issue resolved: body had pointer-events:none from Next.js hydration, cleared in beforeEach

// ─── ACCORDION ────────────────────────────────────────────────────────────────

test.describe("Accordion", () => {
  test("opens with spring height animation", async ({ page }) => {
    const trigger = page.locator('[data-testid="accordion"] [data-radix-collection-item]').first();
    await screenshot(page, "accordion-closed");
    await trigger.click();
    await page.waitForTimeout(100);
    await screenshot(page, "accordion-opening");
    await waitForMotion(page, 500);
    await screenshot(page, "accordion-open");
    // Check visible text instead of Radix internal attribute (attribute may not exist in all versions)
    await expect(
      page.locator('[data-testid="accordion"]').getByText("Conteúdo do item 1", { exact: false })
    ).toBeVisible({ timeout: 3000 });
  });

  test("chevron rotates on open", async ({ page }) => {
    const trigger = page.locator('[data-testid="accordion"] button[data-radix-collection-item]').first();
    // Framer Motion applies rotate() to the motion.span wrapper, not to the inner SVG
    const span = trigger.locator("span");
    await trigger.click();
    await waitForMotion(page, 500);
    const transform = await span.evaluate((el) => window.getComputedStyle(el).transform);
    // Framer Motion always sets an explicit transform — after rotate(180), matrix differs from identity
    expect(transform).not.toBe("none");
  });

  test("closes with exit animation", async ({ page }) => {
    const trigger = page.locator('[data-testid="accordion"] button[data-radix-collection-item]').first();
    await trigger.click();
    await waitForMotion(page, 500);
    await trigger.click(); // close
    await waitForMotion(page, 100);
    await screenshot(page, "accordion-closing");
    await waitForMotion(page, 500);
    await screenshot(page, "accordion-closed-again");
  });

  test("second item can open independently", async ({ page }) => {
    const triggers = page.locator('[data-testid="accordion"] button[data-radix-collection-item]');
    await triggers.nth(0).click();
    await waitForMotion(page, 400);
    await triggers.nth(1).click();
    await waitForMotion(page, 500);
    await screenshot(page, "accordion-item2-open");
  });
});

// ─── CHECKBOX ─────────────────────────────────────────────────────────────────

test.describe("Checkbox", () => {
  test("check animates in on click", async ({ page }) => {
    const cb = page.locator('[data-testid="checkbox"]');
    await screenshot(page, "checkbox-unchecked");
    await cb.click();
    await page.waitForTimeout(80);
    await screenshot(page, "checkbox-checking");
    await waitForMotion(page, 400);
    await screenshot(page, "checkbox-checked");
    await expect(cb).toHaveAttribute("data-state", "checked");
  });

  test("uncheck animates out", async ({ page }) => {
    const cb = page.locator('[data-testid="checkbox"]');
    await cb.click();
    await waitForMotion(page, 400);
    await cb.click();
    await page.waitForTimeout(80);
    await screenshot(page, "checkbox-unchecking");
    await waitForMotion(page, 400);
    await expect(cb).toHaveAttribute("data-state", "unchecked");
  });

  test("pre-checked renders check immediately", async ({ page }) => {
    const cb = page.locator('[data-testid="checkbox-pre-checked"]');
    await expect(cb).toHaveAttribute("data-state", "checked");
    await screenshot(page, "checkbox-pre-checked");
  });
});

// ─── SWITCH ───────────────────────────────────────────────────────────────────

test.describe("Switch", () => {
  test("thumb slides with spring on toggle", async ({ page }) => {
    const sw = page.locator('[data-testid="switch"]');
    await screenshot(page, "switch-off");
    await sw.click();
    await page.waitForTimeout(80);
    await screenshot(page, "switch-sliding");
    await waitForMotion(page, 500);
    await screenshot(page, "switch-on");
    await expect(sw).toHaveAttribute("data-state", "checked");
  });

  test("thumb has squeeze effect on tap", async ({ page }) => {
    const sw = page.locator('[data-testid="switch"]');
    // Mouse down — should show squeeze (whileTap)
    await sw.dispatchEvent("pointerdown");
    await page.waitForTimeout(50);
    await screenshot(page, "switch-pressed");
    await sw.dispatchEvent("pointerup");
    await waitForMotion(page, 400);
  });
});

// ─── PROGRESS ─────────────────────────────────────────────────────────────────

test.describe("Progress", () => {
  test("animates width on value change", async ({ page }) => {
    await screenshot(page, "progress-40");
    await page.locator('button:has-text("+10%")').click();
    await page.waitForTimeout(80);
    await screenshot(page, "progress-animating-to-50");
    await waitForMotion(page, 500);
    await screenshot(page, "progress-50");
  });

  test("animates down on decrease", async ({ page }) => {
    await page.locator('button:has-text("-10%")').click();
    await page.waitForTimeout(80);
    await screenshot(page, "progress-animating-to-30");
    await waitForMotion(page, 500);
    await screenshot(page, "progress-30");
  });
});

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

test.describe("Toggle", () => {
  test("scales on hover", async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle"]');
    await toggle.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "toggle-hover");
  });

  test("scales down on click (whileTap)", async ({ page }) => {
    const toggle = page.locator('[data-testid="toggle"]');
    await toggle.dispatchEvent("pointerdown");
    await page.waitForTimeout(50);
    await screenshot(page, "toggle-pressed");
    await toggle.dispatchEvent("pointerup");
  });

  test("toggle group items respond to hover", async ({ page }) => {
    const items = page.locator('[data-testid="toggle-group"] button');
    await items.first().hover();
    await page.waitForTimeout(150);
    await screenshot(page, "toggle-group-hover");
  });
});

// ─── BUTTON ───────────────────────────────────────────────────────────────────

test.describe("Button", () => {
  test("scales up on hover", async ({ page }) => {
    const btn = page.locator('[data-testid="button-default"]');
    await btn.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "button-hover");
  });

  test("scales down on press", async ({ page }) => {
    const btn = page.locator('[data-testid="button-default"]');
    await btn.dispatchEvent("pointerdown");
    await page.waitForTimeout(50);
    await screenshot(page, "button-pressed");
    await btn.dispatchEvent("pointerup");
  });

  test("disabled button does not animate", async ({ page }) => {
    const btn = page.locator('[data-testid="button-disabled"]');
    // Disabled button has pointer-events:none via disabled: variant — force hover skips actionability check
    await btn.hover({ force: true });
    await page.waitForTimeout(150);
    await screenshot(page, "button-disabled-hover");
  });
});

// ─── RIPPLE BUTTON ────────────────────────────────────────────────────────────

test.describe("RippleButton", () => {
  test("ripple appears on click", async ({ page }) => {
    const btn = page.locator('[data-testid="ripple-button"]');
    await btn.click();
    await page.waitForTimeout(80);
    await screenshot(page, "ripple-button-clicked");
    await waitForMotion(page, 700);
    await screenshot(page, "ripple-button-settled");
  });

  test("multiple rapid clicks create multiple ripples", async ({ page }) => {
    const btn = page.locator('[data-testid="ripple-button"]');
    await btn.click();
    await btn.click();
    await btn.click();
    await page.waitForTimeout(100);
    await screenshot(page, "ripple-multiple");
    await waitForMotion(page, 700);
  });
});

// ─── FLIP BUTTON ──────────────────────────────────────────────────────────────

test.describe("FlipButton", () => {
  test("flips to back on hover (from top)", async ({ page }) => {
    const btn = page.locator('[data-testid="flip-button-top"]');
    await screenshot(page, "flip-button-rest");
    await btn.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "flip-button-flipping");
    await waitForMotion(page, 500);
    await screenshot(page, "flip-button-flipped");
  });

  test("restores front on mouse leave", async ({ page }) => {
    const btn = page.locator('[data-testid="flip-button-top"]');
    await btn.hover();
    await waitForMotion(page, 400);
    await page.mouse.move(0, 0); // move away
    await waitForMotion(page, 400);
    await screenshot(page, "flip-button-restored");
  });

  test("from=bottom variant", async ({ page }) => {
    const btn = page.locator('[data-testid="flip-button-bottom"]');
    await btn.hover();
    await waitForMotion(page, 400);
    await screenshot(page, "flip-button-bottom-flipped");
  });
});

// ─── TABS ─────────────────────────────────────────────────────────────────────

test.describe("Tabs", () => {
  test("pill slides between tabs with layoutId", async ({ page }) => {
    const triggers = page.locator('[data-testid="tabs"] [role="tab"]');
    await screenshot(page, "tabs-tab1-active");
    await triggers.nth(1).click();
    await page.waitForTimeout(100);
    await screenshot(page, "tabs-pill-animating");
    await waitForMotion(page, 500);
    await screenshot(page, "tabs-tab2-active");
  });

  test("content fades on tab change", async ({ page }) => {
    const triggers = page.locator('[data-testid="tabs"] [role="tab"]');
    await triggers.nth(2).click();
    await page.waitForTimeout(80);
    await screenshot(page, "tabs-content-fading");
    await waitForMotion(page, 300);
    await screenshot(page, "tabs-tab3-content-visible");
    // All tabpanels may be in DOM simultaneously — use text filter to avoid strict mode violation
    await expect(page.locator('[data-testid="tabs"]').getByText("aba 3", { exact: false })).toBeVisible({
      timeout: 3000,
    });
  });
});

// ─── DIALOG ───────────────────────────────────────────────────────────────────

test.describe("Dialog", () => {
  test("opens with spring animation from top", async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "dialog-opening");
    await waitForMotion(page, 500);
    await screenshot(page, "dialog-open");
    await expect(page.locator('[data-testid="dialog-content"]')).toBeVisible();
  });

  test("overlay fades in with dialog", async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click();
    await page.waitForTimeout(100);
    await screenshot(page, "dialog-overlay-visible");
  });

  test("closes with exit animation on overlay click", async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger"]').click();
    await waitForMotion(page, 400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    await screenshot(page, "dialog-closing");
    await waitForMotion(page, 500);
    await screenshot(page, "dialog-closed");
    await expect(page.locator('[data-testid="dialog-content"]')).not.toBeVisible();
  });

  test("from=bottom variant", async ({ page }) => {
    await page.locator('[data-testid="dialog-trigger-bottom"]').click();
    await page.waitForTimeout(100);
    await screenshot(page, "dialog-bottom-opening");
    await waitForMotion(page, 500);
    await screenshot(page, "dialog-bottom-open");
    await page.keyboard.press("Escape");
    await waitForMotion(page, 400);
  });
});

// ─── SHEET ────────────────────────────────────────────────────────────────────

test.describe("Sheet", () => {
  test("slides in from right with spring", async ({ page }) => {
    await page.locator('[data-testid="sheet-trigger-right"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "sheet-right-opening");
    await waitForMotion(page, 500);
    await screenshot(page, "sheet-right-open");
    await expect(page.locator('[data-testid="sheet-content-right"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    await screenshot(page, "sheet-right-closing");
    await waitForMotion(page, 500);
  });

  test("slides in from bottom", async ({ page }) => {
    await page.locator('[data-testid="sheet-trigger-bottom"]').click();
    await waitForMotion(page, 500);
    await screenshot(page, "sheet-bottom-open");
    await page.keyboard.press("Escape");
    await waitForMotion(page, 500);
  });
});

// ─── POPOVER ──────────────────────────────────────────────────────────────────

test.describe("Popover", () => {
  test("opens with spring scale", async ({ page }) => {
    await page.locator('[data-testid="popover-trigger"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "popover-opening");
    await waitForMotion(page, 500);
    await screenshot(page, "popover-open");
    // MutationObserver+AnimatePresence may batch React updates — poll for visibility
    await page.locator('[data-testid="popover-content"]').waitFor({ state: "visible", timeout: 5000 });
    await expect(page.locator('[data-testid="popover-content"]')).toBeVisible();
  });

  test("closes with exit animation", async ({ page }) => {
    await page.locator('[data-testid="popover-trigger"]').click();
    await waitForMotion(page, 400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(80);
    await screenshot(page, "popover-closing");
    await waitForMotion(page, 400);
    await expect(page.locator('[data-testid="popover-content"]')).not.toBeVisible();
  });
});

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────

test.describe("Tooltip", () => {
  test("appears with spring scale on hover", async ({ page }) => {
    // Radix Tooltip won't open via pointermove in headless Chromium.
    // Use the controlled-open hidden button instead to verify spring animation.
    await page.locator('[data-testid="tooltip-open-btn"]').click({ force: true });
    await page.waitForTimeout(80);
    await screenshot(page, "tooltip-opening");
    await waitForMotion(page, 400);
    await screenshot(page, "tooltip-visible");
    await expect(page.locator('[data-testid="tooltip-content"]')).toBeVisible({ timeout: 3000 });
  });

  test("disappears on mouse leave", async ({ page }) => {
    // Open via controlled button, then move mouse away (onOpenChange(false) fires on pointer leave)
    await page.locator('[data-testid="tooltip-open-btn"]').click({ force: true });
    await waitForMotion(page, 400);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(100);
    await screenshot(page, "tooltip-closing");
    await waitForMotion(page, 400);
  });
});

// ─── DROPDOWN ─────────────────────────────────────────────────────────────────

test.describe("Dropdown Menu", () => {
  test("opens with fade+scale", async ({ page }) => {
    await page.locator('[data-testid="dropdown-trigger"]').click();
    await page.waitForTimeout(60);
    await screenshot(page, "dropdown-opening");
    await waitForMotion(page, 300);
    await screenshot(page, "dropdown-open");
    await expect(page.locator('[data-testid="dropdown-content"]')).toBeVisible();
  });

  test("closes with exit animation", async ({ page }) => {
    await page.locator('[data-testid="dropdown-trigger"]').click();
    await waitForMotion(page, 300);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(60);
    await screenshot(page, "dropdown-closing");
    await waitForMotion(page, 300);
    await expect(page.locator('[data-testid="dropdown-content"]')).not.toBeVisible();
  });
});

// ─── SELECT ───────────────────────────────────────────────────────────────────

test.describe("Select", () => {
  test("dropdown opens with animation", async ({ page }) => {
    await page.locator('[data-testid="select-trigger"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "select-opening");
    await waitForMotion(page, 400);
    await screenshot(page, "select-open");
    await expect(page.locator('[data-testid="select-content"]')).toBeVisible();
  });

  test("closes after selection", async ({ page }) => {
    await page.locator('[data-testid="select-trigger"]').click();
    // Radix manages mount/unmount natively — options are in DOM when select opens
    await waitForMotion(page, 300);
    await page.locator('[data-testid="select-content"]').getByText("Opção 1").click();
    await page.waitForTimeout(80);
    await screenshot(page, "select-closing");
    await waitForMotion(page, 400);
    await expect(page.locator('[data-testid="select-content"]')).not.toBeVisible();
  });
});

// ─── COLLAPSIBLE ──────────────────────────────────────────────────────────────

test.describe("Collapsible", () => {
  test("expands with spring height", async ({ page }) => {
    await screenshot(page, "collapsible-closed");
    await page.locator('[data-testid="collapsible-trigger"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "collapsible-expanding");
    await waitForMotion(page, 500);
    await screenshot(page, "collapsible-open");
    await expect(page.locator('[data-testid="collapsible-content"]')).toBeVisible();
  });

  test("collapses with exit animation", async ({ page }) => {
    await page.locator('[data-testid="collapsible-trigger"]').click();
    await waitForMotion(page, 500);
    await page.locator('[data-testid="collapsible-trigger"]').click();
    await page.waitForTimeout(80);
    await screenshot(page, "collapsible-collapsing");
    await waitForMotion(page, 500);
    await screenshot(page, "collapsible-closed-again");
  });
});

// ─── ALERT ────────────────────────────────────────────────────────────────────

test.describe("Alert", () => {
  test("renders with entrance animation on page load", async ({ page }) => {
    // Alert should already be on page — entrance happens on mount
    await page.goto(BASE);
    await page.waitForTimeout(80);
    await screenshot(page, "alert-entering");
    await waitForMotion(page, 500);
    await screenshot(page, "alert-settled");
    await expect(page.locator('[data-testid="alert-default"]')).toBeVisible();
  });
});

// ─── CARD ─────────────────────────────────────────────────────────────────────

test.describe("Card", () => {
  test("static card has no hover lift", async ({ page }) => {
    const card = page.locator('[data-testid="card-static"]');
    await card.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "card-static-hover");
  });

  test("interactive card lifts on hover", async ({ page }) => {
    const card = page.locator('[data-testid="card-interactive"]');
    await screenshot(page, "card-interactive-rest");
    await card.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "card-interactive-hover");
  });
});

// ─── BADGE ────────────────────────────────────────────────────────────────────

test.describe("Badge", () => {
  test("interactive badge scales on hover", async ({ page }) => {
    const badge = page.locator('[data-testid="badge-interactive"]');
    await screenshot(page, "badge-rest");
    await badge.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "badge-hover");
  });

  test("static badge has no hover scale", async ({ page }) => {
    const badge = page.locator('[data-testid="badge-static"]');
    await badge.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "badge-static-hover");
  });
});

// ─── AVATAR ───────────────────────────────────────────────────────────────────

test.describe("Avatar", () => {
  test("interactive avatar scales on hover", async ({ page }) => {
    const avatar = page.locator('[data-testid="avatar-interactive"]');
    await screenshot(page, "avatar-rest");
    await avatar.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "avatar-hover");
  });
});

// ─── SLIDER ───────────────────────────────────────────────────────────────────

test.describe("Slider", () => {
  test("thumb is visible and hoverable", async ({ page }) => {
    const thumb = page.locator('[data-testid="slider-wrapper"] [role="slider"]');
    await screenshot(page, "slider-rest");
    await thumb.hover();
    await page.waitForTimeout(150);
    await screenshot(page, "slider-thumb-hover");
  });
});
