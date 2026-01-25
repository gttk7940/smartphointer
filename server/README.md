# server

WebRTC のシグナリング用 WebSocket サーバです。

## セットアップ
- `npm install`

## 開発
- `npm run dev`

## 本番
- `npm run build`
- `npm start`
- `npm run deploy`

## 接続
WebSocket の接続 URL に `room` を付けて利用します。

例: `ws://localhost:8080/?room=demo`

Cloud Run の場合は `wss://<Cloud Run の URL>/?room=demo` を使います。
