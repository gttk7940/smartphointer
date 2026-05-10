# smartphointer

スマホをレーザーポインタとして使う Web アプリ。スマホのジャイロセンサ値を WebRTC で PC に送り、PC 側のキャンバスに赤い円としてポインタを描画します。

## ディレクトリ構成
- `apps/` モニター・コントローラ兼用 SPA（Vite + React 19 + Chakra UI v3）
- `server/` シグナリング用 WebSocket サーバ（Cloud Run）
- 仕様と実装メモは `CLAUDE.md`

## セットアップ
```
cd apps && npm install
cd server && npm install     # ローカルでシグナリングサーバを動かす場合のみ
```

## ローカル開発
別ターミナルで両方を起動：
- apps: `cd apps && npm run dev`
- server: `cd server && npm run dev`

localhost で開いた apps は `VITE_SIGNALING_URL` を無視して `ws://localhost:8080` を強制使用します（`apps/src/domain/signaling.ts`）。

## スクリプト
**apps**（`apps/` 配下）
- `npm run dev` ローカル開発サーバ
- `npm run build` 型チェック + 本番ビルド（出力: `dist/`）
- `npm run preview` ビルド成果物をローカルでプレビュー
- `npm run lint` ESLint

**server**（`server/` 配下）
- `npm run dev` ローカル開発サーバを起動（`:8080` で待ち受け、変更を自動反映）
- `npm run build` 本番ビルド（出力: `dist/`）
- `npm start` ビルド成果物を Node.js で起動
- `npm run deploy` Cloud Run へデプロイ（前提：`gcloud` CLI、`gcloud auth login` 済み、`smartphointer` プロジェクトへのアクセス権）

## デプロイ
**apps（GitHub Pages）** — main への push を契機に GitHub Actions（`.github/workflows/deploy.yml`）が自動でビルドと Pages へのアップロードを行います。ビルド時に GitHub Actions のリポジトリ Variables `VITE_SIGNALING_URL`（`wss://...`）が埋め込まれます。

**server（Cloud Run）** — `cd server && npm run deploy` を手動で実行。デプロイ先: `smartphointer-signaling`（asia-northeast1, min 0 / max 1, 256Mi, 1 CPU）。URL が変わったら GitHub Actions Variables の `VITE_SIGNALING_URL` を更新し、apps を再デプロイ。

## シグナリングサーバ仕様
- 接続 URL: `ws://localhost:8080/?room=<id>` または `wss://<Cloud Run URL>/?room=<id>`
- 1 ルーム最大 2 接続まで（3 番目は `1008 'room is full'` で切断）
- 受信メッセージは同ルームの他方の接続へ転送

## 環境変数
- `VITE_SIGNALING_URL`: apps が使うシグナリング WebSocket URL。`apps/.env.local` または GitHub Actions Variables。localhost で開いた apps は無視されます。
- `PORT`: server の listen port（既定 8080。Cloud Run が自動で上書き）。
