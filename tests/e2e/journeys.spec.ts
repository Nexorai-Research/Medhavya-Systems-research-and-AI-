import { expect, test } from "@playwright/test";

test.describe("core visitor journeys", () => {
  test("home presents the proposition, categories and both CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Software that moves businesses");
    await expect(page.getByRole("link", { name: "Explore Products" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Discuss an Enterprise Project" }).first()).toBeVisible();
    await expect(page.locator("#categories-heading")).toBeVisible();
    for (const name of ["Agriculture Software", "Healthcare Software", "Education Software", "Enterprise Software"]) {
      await expect(page.getByRole("link", { name: new RegExp(name) }).first()).toBeVisible();
    }
  });

  test("product discovery: filter catalogue and open a product", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("group", { name: "Filter by category" }).getByRole("button", { name: /Healthcare/ }).click();
    const cards = page.getByRole("main").getByRole("listitem").filter({ has: page.getByRole("heading", { level: 3 }) });
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("MediAI");

    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByRole("searchbox", { name: "Search products" }).fill("attendance");
    await expect(page.getByRole("link", { name: "Medhavya EduSphere" })).toBeVisible();

    await page.getByRole("link", { name: "Medhavya EduSphere" }).click();
    await expect(page).toHaveURL(/\/products\/medhavya-edusphere$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Medhavya EduSphere");
    await expect(page.getByText("Lifecycle status:", { exact: false }).first()).toBeAttached();
    await expect(page.getByText("Demo listing.").first()).toBeVisible();
    await expect(page.getByText("Illustrative concept UI · sample data").first()).toBeVisible();
  });

  test("category page lists its products", async ({ page }) => {
    await page.goto("/product-categories/agriculture");
    await expect(page.getByRole("heading", { name: "Medhavya Agro" })).toBeVisible();
  });

  test("unpublished draft products return 404", async ({ page }) => {
    const res = await page.goto("/products/medhavya-hrms");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page isn’t here." })).toBeVisible();
  });
});

test.describe("runtime health", () => {
  // Guards against render loops and client errors (e.g. a form effect re-running every render).
  for (const path of ["/", "/products", "/products/mediai", "/product-categories/agriculture", "/enterprise-solutions", "/technology", "/security", "/about", "/contact", "/request-demo", "/search?q=ai", "/careers", "/partners"]) {
    test(`no console errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(path, { waitUntil: "networkidle" });
      await page.waitForTimeout(1500);
      expect(errors).toEqual([]);
    });
  }
});

test.describe("lead workflows", () => {
  test("demo request shows validation errors then succeeds", async ({ page }) => {
    await page.goto("/request-demo?product=mediai");
    await expect(page.getByLabel("Product of interest")).toHaveValue("mediai");

    await page.getByRole("button", { name: "Request demo" }).click();
    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(page.getByText("Please confirm you have read the privacy notice")).toBeVisible();

    await page.getByLabel("Full name").fill("E2E Tester");
    await page.getByLabel("Work email").fill(`e2e+${Date.now()}@example.com`);
    await page.getByLabel("How can we help?").fill("Automated end-to-end demo request.");
    await page.getByRole("checkbox", { name: /privacy notice/ }).check();
    await page.getByRole("button", { name: "Request demo" }).click();
    await expect(page.getByRole("status")).toContainText(/Your reference is MS-[0-9A-F]{10}/);
  });

  test("enterprise consultation can be submitted", async ({ page }) => {
    await page.goto("/enterprise-solutions#consult");
    const form = page.locator("#consult");
    await form.getByLabel("Full name").fill("E2E Enterprise");
    await form.getByLabel("Work email").fill(`ent+${Date.now()}@example.com`);
    await form.getByLabel("How can we help?").fill("Integration of three legacy systems with a new ERP.");
    await form.getByRole("checkbox", { name: /privacy notice/ }).check();
    await form.getByRole("button", { name: "Request consultation" }).click();
    await expect(form.getByRole("status")).toContainText("we have your enquiry");
  });
});

test.describe("search and company journeys", () => {
  test("search finds a product, shows an empty state, and hides drafts", async ({ page }) => {
    await page.goto("/search");
    await page.getByRole("searchbox", { name: "Search Medhavya Systems" }).fill("mediai");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/q=mediai/);
    await expect(page.getByRole("link", { name: /MediAI/ }).first()).toBeVisible();

    await page.getByRole("searchbox", { name: "Search Medhavya Systems" }).fill("zzzzqqqq");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText(/No results for/)).toBeVisible();

    await page.getByRole("searchbox", { name: "Search Medhavya Systems" }).fill("hrms");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText(/No results for/)).toBeVisible();
  });

  test("new service pages exist and unknown ones return 404", async ({ request }) => {
    expect((await request.get("/enterprise-solutions/cloud-devops")).status()).toBe(200);
    expect((await request.get("/enterprise-solutions/not-a-service")).status()).toBe(404);
  });

  test("careers form submits as a Career enquiry", async ({ page }) => {
    await page.goto("/careers");
    await page.getByLabel("Full name").fill("E2E Candidate");
    await page.getByLabel("Work email").fill(`career+${Date.now()}@example.com`);
    await page.getByLabel("How can we help?").fill("Interested in engineering roles when they open.");
    await page.getByRole("checkbox", { name: /privacy notice/ }).check();
    await page.getByRole("button", { name: "Send introduction" }).click();
    await expect(page.getByRole("status")).toContainText("we have your enquiry");
  });
});

test.describe("solution finder and comparison", () => {
  test("solution finder recommends products and services, and never drafts", async ({ page }) => {
    await page.goto("/solutions#finder");
    const finder = page.locator("#finder");
    await expect(finder.getByText(/suggestions will appear here/)).toBeVisible();
    await finder.getByLabel("Run operations, inventory and finance").check();
    await finder.getByLabel(/Which industry/).selectOption("logistics");
    await finder.getByLabel(/How large/).selectOption("large");
    await expect(finder.getByRole("link", { name: "Medhavya ERP" })).toBeVisible();
    await expect(finder.getByRole("link", { name: "Consulting & Digital Transformation" })).toBeVisible();
    await expect(finder.getByText("Medhavya HRMS")).toHaveCount(0);
    await finder.getByRole("button", { name: "Start over" }).click();
    await expect(finder.getByText(/suggestions will appear here/)).toBeVisible();
  });

  test("compare two products from the catalogue", async ({ page }) => {
    await page.goto("/products");
    await page.getByRole("checkbox", { name: /Compare Medhavya CRM/ }).check();
    await expect(page.getByText(/choose at least 2 to compare/)).toBeVisible();
    await page.getByRole("checkbox", { name: /Compare MediAI/ }).check();
    await page.getByRole("link", { name: "Compare 2 products" }).click();
    await expect(page).toHaveURL(/compare-products\?p=medhavya-crm,mediai/);
    const table = page.getByRole("table");
    await expect(table.getByRole("columnheader", { name: "Medhavya CRM" })).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "MediAI" })).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Lifecycle stage" })).toBeVisible();
  });

  test("compare limits to three products and ignores unknown slugs", async ({ page }) => {
    await page.goto("/compare-products?p=medhavya-crm,mediai,medhavya-erp,medhavya-agro,not-real");
    await expect(page.getByRole("table").getByRole("columnheader")).toHaveCount(3);
    await expect(page.getByRole("checkbox", { name: "Medhavya Agro" })).toBeDisabled();
  });
});

test.describe("privacy controls and social previews", () => {
  test("cookie preferences dialog opens, saves a choice and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Cookie preferences" }).click();
    const dialog = page.getByRole("dialog", { name: "Cookie preferences" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("checkbox", { name: /Strictly necessary/ })).toBeDisabled();
    const analytics = dialog.getByRole("checkbox", { name: /Anonymous usage analytics/ });
    await expect(analytics).not.toBeChecked();
    await analytics.check();
    await dialog.getByRole("button", { name: "Save choice" }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Cookie preferences" }).click();
    await expect(page.getByRole("checkbox", { name: /Anonymous usage analytics/ })).toBeChecked();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("social preview images are generated for the site and for products", async ({ request, page }) => {
    const site = await request.get("/opengraph-image");
    expect(site.status(), "/opengraph-image").toBe(200);
    expect(site.headers()["content-type"]).toContain("image/png");

    // Next appends a content hash to dynamic-segment image routes, so follow the page's own og:image URL.
    await page.goto("/products/mediai");
    const og = page.locator('meta[property="og:image"]');
    await expect(og).toHaveAttribute("content", /\/products\/mediai\/opengraph-image/);
    const url = new URL((await og.getAttribute("content")) ?? "");
    const product = await request.get(url.pathname);
    expect(product.status(), url.pathname).toBe(200);
    expect(product.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("API boundaries", () => {
  test("lead API rejects privileged fields and invalid payloads", async ({ request }) => {
    const base = { name: "Api Test", email: "api@example.com", enquiryType: "General", message: "Testing the API boundary.", privacyAcknowledged: true };
    const privileged = await request.post("/api/leads", { data: { ...base, status: "Qualified", assignedTo: "me" } });
    expect(privileged.status()).toBe(400);

    const invalid = await request.post("/api/leads", { data: { ...base, email: "nope" } });
    expect(invalid.status()).toBe(400);
    expect((await invalid.json()).errors.email).toBeTruthy();

    const huge = await request.post("/api/leads", { data: { ...base, message: "x".repeat(20_000) } });
    expect(huge.status()).toBe(413);

    const crossSite = await request.post("/api/leads", { data: base, headers: { Origin: "https://evil.example" } });
    expect(crossSite.status()).toBe(403);
  });

  test("lead API success response is generic", async ({ request }) => {
    const res = await request.post("/api/leads", {
      data: { name: "Api Ok", email: `ok+${Date.now()}@example.com`, enquiryType: "Partnership", message: "Partnership enquiry from tests.", privacyAcknowledged: true },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(Object.keys(body).sort()).toEqual(["ok", "reference"]);
    expect(res.headers()["cache-control"]).toContain("no-store");
  });

  test("catalogue API only returns published products without governance fields", async ({ request }) => {
    const res = await request.get("/api/products?pageSize=50");
    const body = await res.json();
    const slugs = body.items.map((p: { slug: string }) => p.slug);
    expect(slugs).not.toContain("medhavya-hrms");
    expect(body.items[0].governance).toBeUndefined();
    expect((await request.get("/api/products/medhavya-hrms")).status()).toBe(404);
    expect((await request.get("/api/products?lifecycle=Bogus")).status()).toBe(400);
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-powered-by"]).toBeUndefined();
  });
});
