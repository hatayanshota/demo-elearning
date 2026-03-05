バックエンド環境の初期構築を行う際の動作手順：
- `read` を使用して、@rules/tech-stack.md と @rules/backend/ 配下のルールを確認する。
- ローカル開発環境を構築する：
    - `docker-compose.yml` を作成し、PostgreSQL コンテナを定義する（ポート: 5432、DB名: app、ユーザー: postgres、パスワード: postgres）。
    - `.env` に `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app` を設定する。
- Prisma を初期化する：
    - `npm install prisma @prisma/client` を実行する。
    - `npx prisma init` で Prisma の設定ファイルを生成する。
    - Prisma の `datasource` が `DATABASE_URL` を参照していることを確認する。
- @rules/backend/architecture.md に準拠したディレクトリ構造を作成する（`lib/services/`, `lib/repositories/`, `lib/validators/`, `lib/errors/`, `lib/utils/`, `lib/types/`）。
- `shell` で `docker compose up -d` を実行し、DBコンテナが起動することを確認する。
- `shell` で `npx prisma migrate dev --name init` を実行し、初期マイグレーションが通ることを確認する。
- `shell` で `npm run build` を実行し、ビルドが通ることを確認する。
- ユーザーにバックエンド環境の構築完了を報告し、以下の起動手順を案内する：
    1. `docker compose up -d`（DBコンテナ起動）
    2. `npm run dev`（開発サーバー起動）
