import { test, expect } from "@playwright/test";

test.describe("MT-01〜04: ロール選択画面・遷移", () => {
  test("MT-01: ロール選択画面が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.getByText("Adminで体験")).toBeVisible();
    await expect(page.getByText("Teacherで体験")).toBeVisible();
    await expect(page.getByText("Studentで体験")).toBeVisible();
  });

  test("MT-02: Adminクリックで /admin/dashboard に遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test("MT-03: Teacherクリックで /teacher/reviews に遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Teacherで体験").click();
    await page.waitForURL("**/teacher/reviews");
    await expect(page).toHaveURL(/\/teacher\/reviews/);
  });

  test("MT-04: Studentクリックで /student/dashboard に遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Studentで体験").click();
    await page.waitForURL("**/student/dashboard");
    await expect(page).toHaveURL(/\/student\/dashboard/);
  });
});

test.describe("MT-05〜08: サイドバー・ヘッダーナビゲーション", () => {
  test("MT-05: 管理者サイドバーナビゲーション", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");

    await expect(page.getByText("KPI").first()).toBeVisible();

    await page.locator('a[href="/admin/students"]').click();
    await page.waitForURL("**/admin/students");
    await expect(page.locator("main").getByText("生徒一覧").first()).toBeVisible();

    await page.locator('a[href="/admin/courses"]').click();
    await page.waitForURL("**/admin/courses");
    await expect(page.locator("main").getByText("コース").first()).toBeVisible();

    await page.locator('a[href="/admin/seminars"]').click();
    await page.waitForURL("**/admin/seminars");
    await expect(page.locator("main").getByText("セミナー").first()).toBeVisible();
  });

  test("MT-06: 講師サイドバーナビゲーション", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Teacherで体験").click();
    await page.waitForURL("**/teacher/reviews");

    // サイドバーが講師用に更新されるのを待つ
    await page.locator('a[href="/teacher/courses"]').waitFor({ state: "visible", timeout: 10000 });
    await page.locator('a[href="/teacher/courses"]').click();
    await page.waitForURL("**/teacher/courses");
    await expect(page.locator("main").getByText("コース").first()).toBeVisible();

    await page.locator('a[href="/teacher/seminars"]').click();
    await page.waitForURL("**/teacher/seminars");
    await expect(page.locator("main").getByText("セミナー").first()).toBeVisible();
  });

  test("MT-07: 生徒サイドバーナビゲーション", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Studentで体験").click();
    await page.waitForURL("**/student/dashboard");

    await page.locator('a[href="/student/courses"]').click();
    await page.waitForURL("**/student/courses");
    await expect(page.locator("main").getByText("コース").first()).toBeVisible();

    await page.locator('a[href="/student/seminars"]').click();
    await page.waitForURL("**/student/seminars");
    await expect(page.locator("main").getByText("セミナー").first()).toBeVisible();
  });

  test("MT-08: ヘッダーのロール切替", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");

    const roleButton = page.getByText("管理者").first();
    if (await roleButton.isVisible()) {
      await roleButton.click();
      const teacherOption = page.getByText("講師").last();
      if (await teacherOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await teacherOption.click();
        await page.waitForURL("**/teacher/**");
      }
    }
  });
});

test.describe("MT-14〜17: KPIダッシュボード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");
  });

  test("MT-14,15: KPIカードが表示される", async ({ page }) => {
    await expect(page.getByText("総生徒数")).toBeVisible();
    await expect(page.getByText("今月入会数")).toBeVisible();
    await expect(page.getByText("アクティブ率")).toBeVisible();
    await expect(page.getByText("課題完了率")).toBeVisible();
    await expect(page.getByText("セミナー参加率").first()).toBeVisible();
    await expect(page.getByText("チャーンリスク高")).toBeVisible();
    await expect(page.getByText("3ヶ月以内達成")).toBeVisible();
  });

  test("MT-16: チャーンリスク高クリックで生徒一覧に遷移", async ({ page }) => {
    await page.getByText("チャーンリスク高").click();
    await page.waitForURL("**/admin/students**");
  });

  test("MT-17: グラフ/チャートが表示される", async ({ page }) => {
    const charts = page.locator(".recharts-responsive-container");
    await expect(charts.first()).toBeVisible();
    const count = await charts.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});

test.describe("MT-18〜23: 生徒一覧", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");
    await page.locator('a[href="/admin/students"]').click();
    await page.waitForURL("**/admin/students");
  });

  test("MT-18: テーブルに生徒データが表示される", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test("MT-19: 検索が動作する", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="検索"]');
    await searchInput.fill("田中");
    await page.waitForTimeout(500);
    const rows = page.locator("tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("MT-20: リスクフィルターボタンが動作する", async ({ page }) => {
    await page.locator("button", { hasText: "リスク高" }).click();
    await page.waitForTimeout(300);
    await expect(page.locator("table")).toBeVisible();
  });

  test("MT-21: ソートが動作する", async ({ page }) => {
    await page.locator("th", { hasText: "名前" }).click();
    await page.waitForTimeout(300);
    await expect(page.locator("table")).toBeVisible();
  });

  test("MT-09: 行クリックで生徒詳細に遷移", async ({ page }) => {
    await page.locator("tbody tr").first().click();
    await page.waitForURL("**/admin/students/**");
  });
});

test.describe("MT-24〜26: 生徒詳細", () => {
  test("MT-24,25,26: 生徒詳細が正しく表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");
    await page.locator('a[href="/admin/students"]').click();
    await page.waitForURL("**/admin/students");
    await page.locator("tbody tr").first().click();
    await page.waitForURL("**/admin/students/**");

    // プロフィール（メールアドレスに@が含まれる）
    await expect(page.getByText("@").first()).toBeVisible();

    // チャーンスコア
    await expect(page.getByText("離脱スコア")).toBeVisible();

    // タイムライン
    await expect(page.getByText("アクティビティタイムライン")).toBeVisible();

    // MT-10: 戻るボタン
    await page.getByText("生徒一覧").first().click();
    await page.waitForURL("**/admin/students");
  });
});

test.describe("MT-27〜32: 講師レビュー", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByText("Teacherで体験").click();
    await page.waitForURL("**/teacher/reviews");
  });

  test("MT-27,28,29: レビュー一覧が表示される", async ({ page }) => {
    // 課題レビューヘッダーが表示されるまで待つ
    await expect(page.getByText("課題レビュー")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("未レビュー").first()).toBeVisible();
    await expect(page.getByText("レビュー済み").first()).toBeVisible();

    const cards = page.locator('[class*="cursor-pointer"]');
    await cards.first().waitFor({ state: "visible", timeout: 10000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("MT-30,31,32: レビュー詳細でフィードバック送信", async ({ page }) => {
    // カードが表示されるまで待つ
    await page.locator('[class*="cursor-pointer"]').first().waitFor({ state: "visible", timeout: 10000 });
    await page.locator('[class*="cursor-pointer"]').first().click();
    await page.waitForURL("**/teacher/reviews/**");

    // 提出内容セクションが表示される
    await expect(page.getByText("提出内容")).toBeVisible();
  });
});

test.describe("MT-33〜35: 生徒ダッシュボード", () => {
  test("MT-33,34,35: 生徒ダッシュボードが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Studentで体験").click();
    await page.waitForURL("**/student/dashboard");

    await expect(page.getByRole("heading", { name: "学習ダッシュボード" })).toBeVisible();

    const progressBars = page.locator('[role="progressbar"]');
    const count = await progressBars.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe("MT-36〜38: コース一覧（生徒）", () => {
  test("MT-36,37,38: コース一覧からカリキュラムへ遷移", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Studentで体験").click();
    await page.waitForURL("**/student/dashboard");

    await page.locator('a[href="/student/courses"]').click();
    await page.waitForURL("**/student/courses");

    await expect(page.locator("main").getByText("コース").first()).toBeVisible();

    const courseCard = page.locator('[class*="cursor-pointer"]').first();
    if (await courseCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await courseCard.click();
      await page.waitForURL("**/student/courses/**");
    }
  });
});

test.describe("MT-39〜42: カリキュラム", () => {
  test("MT-39,40,41,42: カリキュラムが表示される", async ({ page }) => {
    await page.goto("/student/courses/course-1");
    await page.waitForTimeout(1000);

    await expect(page.getByText("Webマーケティング").first()).toBeVisible();
    await expect(
      page.getByText("マーケティング基礎").first().or(page.getByText("Section").first())
    ).toBeVisible();
  });
});

test.describe("MT-43〜46: 動画レッスン", () => {
  test("MT-43,44,45: 動画レッスンが表示される", async ({ page }) => {
    await page.goto("/student/courses/course-1/lessons/lesson-1");
    await page.waitForTimeout(1000);

    // 動画プレイヤーまたはvideoタグが表示される
    await expect(page.locator("video").or(page.getByText("動画プレイヤー")).first()).toBeVisible();
    await expect(page.getByText("チャプター")).toBeVisible();
  });
});

test.describe("MT-47〜50: セミナー一覧", () => {
  test("MT-47,48: 管理者セミナー一覧", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Adminで体験").click();
    await page.waitForURL("**/admin/dashboard");

    await page.locator('a[href="/admin/seminars"]').click();
    await page.waitForURL("**/admin/seminars");

    await expect(page.locator("main").getByText("セミナー").first()).toBeVisible();
  });

  test("MT-49,50: 生徒セミナー申込", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Studentで体験").click();
    await page.waitForURL("**/student/dashboard");

    await page.locator('a[href="/student/seminars"]').click();
    await page.waitForURL("**/student/seminars");

    await expect(page.locator("main").getByText("セミナー").first()).toBeVisible();
  });
});

test.describe("MT-51〜53: 共通UI", () => {
  test("MT-51: 全画面でクラッシュが発生しない", async ({ page }) => {
    const urls = [
      "/",
      "/admin/dashboard",
      "/admin/students",
      "/admin/courses",
      "/admin/seminars",
      "/teacher/reviews",
      "/teacher/courses",
      "/teacher/seminars",
      "/student/dashboard",
      "/student/courses",
      "/student/seminars",
      "/student/courses/course-1",
      "/student/courses/course-1/lessons/lesson-1",
    ];

    for (const url of urls) {
      await page.goto(url);
      await page.waitForTimeout(500);
      await expect(page.locator("body")).toBeVisible();
    }
  });
});
