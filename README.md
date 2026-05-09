# smartphointer

スマートフォンのデバイスモーションを表示する React + TypeScript + Vite プロジェクトです。

## ディレクトリ構成
- `apps` モニターアプリ・コントローラアプリ（SPA）
- `server` シグナリングサーバ（Cloud Run にデプロイ済み）

## セットアップ
### Web
- `cd apps`
- `npm install`

### Signaling
- `cd server`
- `npm install`

## スクリプト
以下は `apps` 配下で実行します。
- `npm run dev` ローカル開発サーバーを起動します。
- `npm run build` 型チェック込みで本番ビルドを作成します（出力先: `dist/`）。
- `npm run preview` ビルド済み成果物をローカルでプレビューします。
- `npm run lint` ESLint を実行します。

## デプロイ
main ブランチへの push を契機に GitHub Actions（`.github/workflows/deploy.yml`）が `apps/dist` を GitHub Pages にデプロイします。
