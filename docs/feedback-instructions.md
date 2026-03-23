# SchoolOS フィードバック対応 実装指示書

> クライアント（YOSHIKI氏）からのフィードバックに基づく改修タスク一覧。
> 優先度順に対応すること。

---

## 前提

- 本プロジェクトは Next.js (App Router) + shadcn/ui + Tailwind CSS + Recharts + Zustand + TanStack Query
- データはすべてモック（`lib/mock/` 配下）で管理、DB接続なし
- デモ用アプリのため、機能追加もモックデータ+フロントエンドで完結させる

---

## 🔴 P0: スマホレスポンシブ対応（最重要・必須）

**背景:** 会員も講師もスマホ利用が9割。現状スマホだとスタイル崩れが起きている。「スマホから綺麗に見れないと会員には見てもらえない」「少なくともスマホ対応は必須」とのこと。

### 対応内容

#### 1. レイアウト全体 (`features/layout/ui/AppLayout.container.tsx`, `AppSidebar.view.tsx`)
- 現状の `aside` は `w-60` 固定で `md:block` のブレークポイント未設定
- モバイル時（768px以下）にサイドバーをハンバーガーメニュー化する
  - shadcn の `Sheet` コンポーネント（既に `components/ui/sheet.tsx` が存在する）を使ってモバイルドロワーに変換
  - ヘッダー左端にハンバーガーアイコン（Menu）を追加し、クリックで Sheet を開閉
- `AppLayout.container.tsx` の `flex h-screen` レイアウトをモバイル時は縦積みに
- `main` の `p-6` をモバイル時は `p-4` に縮小

#### 2. 管理者ダッシュボード (`features/dashboard/ui/Dashboard.view.tsx`)
- KPIカードの `grid-cols-4` → モバイル時 `grid-cols-2`、極小画面で `grid-cols-1`
- グラフ群の `grid-cols-2` → モバイル時 `grid-cols-1`
- `col-span-2` のセミナー参加+成績詳細カードもモバイル時は縦積み

#### 3. 生徒一覧テーブル (`features/students/ui/StudentList.view.tsx`)
- モバイル時はテーブルを横スクロール可能にする（`overflow-x-auto` は `Table` コンポーネントにあるが、親の制約を確認）
- もしくはモバイル時はカード形式に切替

#### 4. 生徒詳細 (`features/students/ui/StudentDetail.view.tsx`)
- `grid-cols-3` → モバイル時 `grid-cols-1`
- プロフィールカードの `col-span-2` → モバイル時フル幅

#### 5. レビュー詳細 (`features/reviews/ui/ReviewDetail.view.tsx`)
- `grid-cols-2` → モバイル時 `grid-cols-1`

#### 6. 動画レッスン (`features/video-lessons/ui/VideoLesson.view.tsx`)
- `grid-cols-3` → モバイル時 `grid-cols-1`（動画が上、チャプターがその下）
- 動画プレイヤーの `aspect-video` はそのまま維持でOK

#### 7. コース一覧 (`features/courses/ui/CourseList.view.tsx`)
- `grid-cols-2` → モバイル時 `grid-cols-1`（既に `sm:grid-cols-2` 対応あり。小さい画面でも確認）

#### 8. カリキュラム (`features/curriculum/ui/Curriculum.view.tsx`)
- 基本的にアコーディオンなので大きな変更不要だが、padding調整

#### 9. ロール選択画面 (`features/role-selection/ui/RoleSelection.view.tsx`)
- `sm:grid-cols-3` は既に設定済み。カード幅 `w-56` 固定をモバイル時はフル幅に

#### 10. ヘッダー (`features/layout/ui/AppHeader.view.tsx`)
- モバイル時にユーザー名を省略（ロール名のみ）
- ロール切替ボタンのサイズ調整

**テスト方法:** ブラウザDevToolsでiPhone SE (375px)、iPhone 14 (390px)、iPad (768px) の各サイズで全画面を確認。

---

## 🟡 P1: Student画面の改修

### S-1: ダッシュボードの「おすすめレッスン」→「お知らせ・セミナー案内」に変更

**対象ファイル:** `features/dashboard/ui/StudentDashboard.view.tsx`

**現状:** 「次のレッスン」カードと「おすすめレッスン（コンテンツSEO戦略 / Trending Now）」カードが横並び。

**変更内容:**
- 「おすすめレッスン」カードを削除
- 代わりに「お知らせ」セクション（タイトル、日付、概要テキストのリスト）を表示
- その下に「今後のセミナー」セクション（直近2件のセミナーカード + セミナー一覧へのリンク）を表示
- モックデータとして `lib/mock/` にお知らせデータ（3件程度）を追加
  - 例: 「3月度セミナーのご案内」「課題提出期限のリマインド」「新コース開講のお知らせ」
- `lib/types/api.ts` に `Announcement` 型を追加

### S-3: コース選択タブ — コンテンツ完了チェックマークの表示確認

**対象ファイル:** `features/curriculum/ui/Curriculum.view.tsx`

**現状:** `CircleCheck`（緑チェック）、`Play`（進行中）、空の丸（未着手）、`Lock`（ロック）のアイコンは実装済み。

**確認・追加内容:**
- 課題付きレッスン（`hasAssignment: true`）の完了判定を確認:
  - 現状は `lessonProgress.isCompleted` のみで判定
  - 課題提出済み（`assignment.status === "PENDING"` or `"REVIEWED"`）の場合のステータス表示を追加
  - 表示パターン:
    - 動画視聴完了 + 課題未提出 → 「課題未提出」バッジ（amber）
    - 課題提出済み + レビュー待ち → 「採点中」バッジ（blue）
    - 課題提出済み + レビュー済み → 緑チェック

**対象ファイル追加:** `features/curriculum/api/curriculum.api.ts`
- `mockAssignments` からユーザーの課題提出状態を取得し、各レッスンに紐付ける

### S-6: アクション履歴からログイン履歴を除外 → セミナー・イベント参加履歴に変更

**対象ファイル:** `features/dashboard/ui/StudentDashboard.view.tsx`, `features/dashboard/hooks/useStudentDashboard.ts`

**現状:** `recentLogs` は `mockActivityLogs` から全タイプ（LOGIN, LESSON_VIEW, ASSIGNMENT_SUBMIT, SEMINAR_REGISTER）を取得し、最新5件を表示。

**変更内容:**
- `useStudentDashboard.ts` の `recentLogs` フィルタから `LOGIN` タイプを除外:
  ```ts
  const recentLogs = mockActivityLogs
    .filter(l => l.userId === user.id && l.type !== "LOGIN")
    ...
  ```
- 表示は `LESSON_VIEW`, `ASSIGNMENT_SUBMIT`, `SEMINAR_REGISTER` のみ
- 可能であれば、セミナー参加・オリエン参加・イベント参加の履歴を区別して表示（`SEMINAR_REGISTER` のメタデータにセミナー名を含める）

### S-7: チャプター下に動画のポイント・要約文章の表示欄を追加

**対象ファイル:** `features/video-lessons/ui/VideoLesson.view.tsx`

**変更内容:**
- チャプターリストの各チャプター項目の下に、ポイント/要約テキストを表示する欄を追加
- `lib/types/api.ts` の `Chapter` 型に `summary?: string` フィールドを追加
- `lib/mock/courses.ts` の `mockChapters` にいくつかサンプルの要約テキストを追加
  - 例: `{ ..., summary: "マーケティングの定義と歴史的変遷。フィリップ・コトラーの理論を中心に解説。" }`
- チャプター表示部分で、`summary` がある場合はチャプター名の下に小さいテキストで表示

### S-8: アクション画面下にセミナー参加回数・イベント参加回数を横並び表示

**対象ファイル:** `features/dashboard/ui/StudentDashboard.view.tsx`, `features/dashboard/hooks/useStudentDashboard.ts`

**変更内容:**
- 「今週のアクション」カードの下に、横並びで2つのカウンターを追加:
  - 「セミナー参加回数」
  - 「イベント参加回数」
- `useStudentDashboard.ts` で `mockSeminarRegistrations` からユーザーのセミナー参加数を集計
- 表示ルール:
  - 0回 → 赤文字（`text-red-500 font-bold`）
  - 1回以上 → 緑文字（`text-green-500 font-bold`）
- UIイメージ: 2つの小さなカードを `grid-cols-2` で横並び配置

---

## 🟡 P1: Teacher画面の改修

### T-3: 課題レビュー画面上部に未レビュー完了パーセンテージを表示

**対象ファイル:** `features/reviews/ui/ReviewList.view.tsx`, `features/reviews/hooks/useReviews.ts`

**現状:** 未レビュー件数はバッジで表示（「N件 未レビュー」）

**変更内容:**
- ヘッダー部分（「課題レビュー」タイトルの横 or 上）にプログレスバー + パーセンテージを追加
- 計算: `レビュー完了率 = レビュー済み件数 / 全課題提出件数 × 100`
- 全件レビュー済み → 100%（緑表示）
- 未レビューあり → 現在のパーセンテージ + 残件数表示
- `useReviews.ts` で pending と reviewed の両方の件数を取得するよう修正（現状はタブごとに片方のみ取得）

---

## 🟡 P1: Admin画面の改修

### A-1: ダッシュボードのグラフ表示順を変更

**対象ファイル:** `features/dashboard/ui/Dashboard.view.tsx`

**現状のグラフ順:**
1. 年齢分布チャート
2. 性別デモグラフィクス
3. コホート分析（職業分布）
4. アクティブ状況
5. セミナー参加 + 成績詳細レポート（横並び）
6. アクティブユーザー分析（地域分布）
7. 課題停滞箇所

**変更後の順番（クライアント指定）:**
1. アクティブ状況（折れ線グラフ — 現状4番目）
2. アクティブユーザー分析（地域分布 — 現状6番目）
3. セミナー参加 + 成績詳細レポート（横並び — 現状5番目）
4. 課題停滞箇所（棒グラフ — 現状7番目）
5. コホート分析（職業分布 — 現状3番目）
6. 年齢分布チャート（棒グラフ — 現状1番目）
7. 性別デモグラフィクス（円グラフ — 現状2番目）

要するに: コホート分析・年齢分布・性別デモグラの3つを後半に回す。アクティブ状況とアクティブユーザー分析を先頭に持ってくる。

**実装:** `Dashboard.view.tsx` 内の `<ChartCard>` コンポーネントの配置順を入れ替えるだけ。

### A-2: 生徒一覧にLINE名・chatwork名・meet名・サロン会員有無を追加

**対象ファイル:**
- `lib/types/api.ts` — `StudentProfile` 型に追加
- `lib/mock/users.ts` — `mockStudentProfiles` にダミーデータ追加
- `features/students/ui/StudentList.view.tsx` — テーブルカラム追加
- `features/students/ui/StudentDetail.view.tsx` — プロフィール表示に追加

**変更内容:**
- `StudentProfile` に以下を追加:
  ```ts
  lineName: string | null;
  chatworkName: string | null;
  meetName: string | null;
  isSalonMember: boolean;
  ```
- 生徒一覧テーブル:
  - 名前カラムの横に chatwork名 を表示（`名前 (CW: xxx)` 形式、もしくはサブテキスト）
  - ※LINE名・meet名はテーブル幅の都合上、生徒詳細のみで表示
  - サロン会員の有無はバッジで表示
- 生徒詳細:
  - プロフィールセクションにLINE名・chatwork名・meet名を表示
  - サロン会員バッジ

**モックデータ:** `mockStudentProfiles` の各生徒に chatwork名（ニックネーム風）を追加。40名分。

### A-3: デモグラフィクスに都道府県（居住地域）データ追加

**対象ファイル:** `features/dashboard/ui/Dashboard.view.tsx`

**現状:** 「アクティブユーザー分析」として地域分布グラフは既に存在する（`regionDistribution`）。ただしグラフタイトルが「アクティブユーザー分析」になっており、内容が地域分布であることがわかりにくい。

**変更内容:**
- グラフタイトルを「地域分布（都道府県）」に変更、もしくは別グラフとして地域分布を追加
- 既存の `regionDistribution` データはそのまま活用可能

### A-4: 管理者側の会員データ表示にはログイン履歴を残す

**対象ファイル:** `features/students/ui/StudentDetail.view.tsx`

**現状:** アクティビティタイムラインに全タイプ（LOGIN含む）を表示中。

**変更:** 管理者画面の生徒詳細ではログイン履歴を**そのまま残す**（変更なし）。S-6の変更は生徒側ダッシュボードのみに適用。

---

## 🟢 P2: 追加機能（中優先）

### T-1: Teacher画面に会員検索機能を追加

**対象ファイル:** 新規で `features/reviews/ui/` または Teacher用の生徒検索UIを追加

**変更内容:**
- Teacher用のサイドバーに「会員検索」メニューを追加、もしくはレビュー一覧画面に検索バーを追加
- 生徒名での検索（`mockUsers` からフィルタ）

### T-2: セミナー一覧から参加者一覧が見られるようにする

**対象ファイル:** `features/seminars/ui/SeminarList.view.tsx`

**変更内容:**
- Teacher ロールの場合、各セミナーカードに「参加者一覧」ボタンを追加
- クリックでダイアログ or アコーディオンで参加者名リストを表示
- `mockSeminarRegistrations` + `mockUsers` から参加者名を取得

### S-4: セミナー一覧にサロン会員向けサロンサイトリンクを追加

**対象ファイル:** `features/seminars/ui/SeminarList.view.tsx`

- サロン会員（`isSalonMember: true`）の場合、セミナー一覧画面にサロンサイトへのリンクボタンを表示
- リンク先はダミーURL（`#` もしくは `https://salon.example.com`）

---

## ⚪ 要件確認事項（実装保留）

以下はクライアントとの仕様確認が必要な項目。今回は実装しない。

- **S-5:** セミナー一覧から申込する際の会員ステータス管理（一般/サロンで価格変動、途中入退会への対応）→ 仕様決めが必要
- **T-（将来）:** teacher と admin のロール分離の必要性 → 外部講師が増える場合に検討

---

## 実装順序（推奨）

1. **P0: スマホレスポンシブ対応** — 全画面
2. **S-6:** ログイン履歴除外（影響範囲小、即対応可）
3. **A-1:** グラフ順入替（コード並べ替えのみ）
4. **S-1:** おすすめ → お知らせ・セミナー案内
5. **T-3:** 未レビューパーセンテージ
6. **S-8:** 参加回数表示（赤/緑）
7. **A-2:** LINE名等の追加
8. **S-3:** 課題ステータス表示改善
9. **S-7:** チャプター要約欄
10. **T-1, T-2:** 会員検索、参加者一覧

---

## 補足: 変更しないこと

- **S-9（ポジティブFB）:** パーセント表示が一番上に来る構成はそのまま維持（「めちゃくちゃ良い」との評価）
- **A-4:** 管理者の生徒詳細のアクティビティタイムラインはログイン履歴を含めたまま
- **Admin ダッシュボード全体:** 「全体的にとても見やすい」「データ分析系は助かりそう」「進捗とリスク表示もわかりやすく素晴らしい」 → 大きな構成変更は不要
