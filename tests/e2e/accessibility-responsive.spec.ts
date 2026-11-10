import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/products", "/products/mediai", "/product-categories/education", "/enterprise-solutions", "/request-demo", "/contact", "/about", "/security", "/resources/blog/reviewable-ai-in-operations"];

test.describe("accessibility (axe, WCAG 2.2 AA rules)", () => {
  for (const path of pages) {
    test(`no serious violations on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ reducedMotion: "reduce" });
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("keyboard and responsive behaviour", () => {
  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard journey checked on desktop");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("desktop products menu opens with keyboard and closes with Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation only");
    await page.goto("/");
    const trigger = page.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Products" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /Explore all products/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("mobile menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await mobileNav.getByText("Products", { exact: true }).click();
    await mobileNav.getByRole("link", { name: "All products" }).click();
    await expect(page).toHaveURL(/\/products$/);
  });

  for (const width of [360, 390, 768, 1024, 1280]) {
    test(`no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
      test.skip(isMobile, "viewport set explicitly");
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/products", "/products/medhavya-erp", "/enterprise-solutions"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});
