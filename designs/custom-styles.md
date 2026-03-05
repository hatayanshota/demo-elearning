# SchoolOS カスタムスタイル・アニメーション仕様

## カラーパレット（拡張）

### ブランドカラー
- **Primary (Indigo):** #6366F1 / hover: #4F46E5
- **Sidebar Dark:** #1E1B4B (背景) / #312E81 (ボーダー)
- **Accent Blue:** #0EA5E9
- **Accent Green:** #10B981
- **Accent Purple:** #8B5CF6 / #A855F7
- **Accent Pink:** #EC4899
- **Accent Amber:** #F59E0B
- **Accent Teal:** #14B8A6
- **Danger:** #EF4444

### KPIカードカラーマッピング
| カード | 背景色 | ラベル色 | 値色 |
|---|---|---|---|
| 総生徒数 | #6366F1 | #C7D2FE | #FFFFFF |
| 今月入会数 | #0EA5E9 | #BAE6FD | #FFFFFF |
| アクティブ率 | #10B981 | #A7F3D0 | #FFFFFF |
| 平均課題達成 | #F59E0B | #FEF3C7 | #FFFFFF |
| 課題完了率 | #8B5CF6 | #DDD6FE | #FFFFFF |
| セミナー参加率 | #EC4899 | #FBCFE8 | #FFFFFF |
| チャーンリスク高 | #EF4444 | #FECACA | #FFFFFF |
| 3ヶ月以内達成 | #14B8A6 | #99F6E4 | #FFFFFF |

## アニメーション仕様

### グローバル
- **ページ遷移:** `opacity 0→1, transform translateY(8px)→0`, duration: 300ms, easing: ease-out
- **サイドバーホバー:** nav item の背景色 transition 150ms ease

### ロール選択画面
- **カードホバー:** `transform: translateY(-8px)`, `box-shadow: 0 20px 40px rgba(99,102,241,0.15)`, duration: 300ms, easing: cubic-bezier(0.34, 1.56, 0.64, 1)
- **カード入場:** 3枚のカードが左から順にフェードイン + スライドアップ。delay: 0ms / 100ms / 200ms, duration: 500ms
- **背景:** 微かなグラデーションアニメーション（#6366F1 ↔ #7C3AED）、8秒周期で交互

### KPIダッシュボード
- **KPIカード数値:** カウントアップアニメーション（0→目標値）、duration: 1200ms, easing: ease-out
- **KPIカードホバー:** `transform: translateY(-4px) scale(1.02)`, duration: 200ms
- **グラフ描画:** 棒グラフは下から伸びるアニメーション、折れ線は左からストロークアニメーション、duration: 800ms, delay: stagger 50ms

### 生徒ダッシュボード
- **連続ログインバナー:** 炎アイコンが微かに揺れるアニメーション（transform: rotate(-5deg) ↔ rotate(5deg)）、duration: 600ms, iteration: infinite
- **プログレスバー:** 0%→現在値のアニメーション、duration: 1000ms, easing: ease-out
- **アクションカードホバー:** 背景色が少し濃くなる + 右矢印が右に4px移動、duration: 200ms

### 動画レッスン
- **レジュームダイアログ:** モーダルの `opacity 0→1 + scale(0.95→1)`, duration: 200ms
- **チャプターアクティブ:** 現在再生中のチャプターに左ボーダー（3px solid #6366F1）が slide-in

### カリキュラム
- **アコーディオン開閉:** `height: 0→auto` + `opacity 0→1`, duration: 300ms, easing: ease
- **レッスン完了:** チェックマークが `scale(0→1) + rotate(-10deg→0)` でバウンス表示

### セミナー
- **申込ボタン成功:** ボタンが `背景色→green` に変わり、チェックマークアイコンが現れる、duration: 400ms

### 生徒詳細 チャーンスコア
- **スコア表示:** 数値が0→85にカウントアップ、カードの背景色が緑→黄→赤にグラデーション遷移、duration: 1500ms
- **緊急アラート:** カードが微かに pulse（scale 1→1.02→1）、duration: 2000ms, iteration: infinite

### データテーブル（生徒一覧）
- **行ホバー:** 背景色がフェードイン、duration: 150ms
- **危険行:** 左ボーダーに赤の3pxラインが表示、微かなpulse効果

## カスタムフォント
- **見出し:** Inter（Google Fonts）、weight: 600-800
- **本文:** Inter、weight: 400-500
- 読み込み: `next/font/google` の Inter を使用

## カスタム要素
- **ロール選択イラスト:** AI生成、`designs/assets/` に保存予定。各 120x120px
- **サイドバーダークテーマ:** CSS変数 `--sidebar-bg: #1E1B4B`, `--sidebar-border: #312E81`, `--sidebar-text: #CBD5E1`, `--sidebar-active-bg: rgba(99,102,241,0.19)`, `--sidebar-active-text: #A5B4FC`
