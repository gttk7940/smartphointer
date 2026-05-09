# CLAUDE.md

このファイルは Claude Code 用の作業ガイドであり、プロダクト仕様と実装情報を一本化したものです。使い方は `README.md` を参照。

## アプリの概要

本アプリはWeb アプリであり、スマホと PC を使いレーザーポインター機能を提供する。
スマホをレーザーポインターとして使うことが技術的に可能かの PoC である。
「何かの画面の上にポインターを重ねる」のではなく、「白いキャンバスにポインターを表示する」だけに絞る。
PoC のため技術スタック・実装ともに最小限でシンプルさを重視する。

## 技術スタック

- 全体
    - TypeScript
- アプリ（モニターアプリ・コントローラアプリ）
    - React 19
    - Vite
    - SPA
    - GitHub Pages（ホスティング）
    - WebRTC
        - スマホ -> PC にジャイロセンサなどの値を送信する
    - qrcode.react
        - QR コード表示用
- シグナリングサーバー
    - Google Cloud Run
    - WebSocket
        - WebRCT の接続確立のためのシグナリングに使う
        - Node.js

## ユーザのフロー

1. モニターアプリを PC で開く
2. スマホでカメラを開き、モニターアプリに表示された QR コードを読み取るとコントローラアプリが起動し、モニターアプリと P2P 通信を開始する
3. スマホのジャイロセンサの使用を許可されていない場合、コントローラアプリの「センサの使用を許可」を押すことでユーザに許可を求める
4. コントローラアプリの「位置を調整」ボタンを押し、モニターアプリの左上端と右下端を選択すると、ジャイロセンサが較正される
5. P2P 通信が切断されたら、モニターアプリは再び QR コードが表示される

## 仕様

### シグナリングサーバー

モニターアプリとコントローラアプリの P2P 通信を確立する。

### モニターアプリ

- P2P 通信が開始していない場合、P2P 通信を開始するための QR コードが表示される
- P2P 通信が開始すると PR コードは消える

### コントローラアプリ

- 画面に表示されるのは以下
    - 「センサの使用を許可」ボタン
    - 「位置を調整」ボタン（押すと「左上端を指しています」ボタンと「右下端を指しています」ボタンが順に表示される）
- ジャイロセンサには DeviceOrientationEvent を使う
    - https://developer.mozilla.org/ja/docs/Web/API/DeviceOrientationEvent

## リポジトリ構成

モノレポ風の 2 ワークスペース構成（npm workspaces は未使用、各ディレクトリが独立した npm プロジェクト）。

```
smartphointer/
├── CLAUDE.md                  本ファイル（仕様 + 実装ガイド）
├── README.md                  使い方
├── .github/workflows/deploy.yml  main への push で apps を GitHub Pages へ自動デプロイ
├── apps/                      モニター・コントローラを兼ねる SPA（Vite + React 19）
│   ├── src/
│   │   ├── main.tsx           エントリ
│   │   ├── components/
│   │   │   ├── App.tsx        react-device-detect の isMobile で Monitor/Controller を切替
│   │   │   ├── Monitor.tsx    PC 側。QR 表示・WebRTC initiator・受信 position を Canvas に反映
│   │   │   ├── Controller.tsx スマホ側。センサ許可ボタン・キャリブ UI・position 送信
│   │   │   └── PointerCanvas.tsx 白背景に赤い円を描画
│   │   ├── domain/
│   │   │   ├── pointer.ts     PointerPosition, PointerCalibration, mapToRange, toPointerPosition
│   │   │   ├── deviceOrientation.ts ジャイロ用の型のみ
│   │   │   └── signaling.ts   getSignalingUrl()（localhost なら ws://localhost:8080、それ以外は VITE_SIGNALING_URL）
│   │   └── hooks/
│   │       ├── useRoomId.ts   URL の ?room=... を取得（Monitor は無ければ UUID 生成）
│   │       ├── useDeviceOrientation.ts deviceorientation event の購読＋ iOS の requestPermission 対応
│   │       ├── usePointer.ts  idle → topLeft → bottomRight の 3 ステップでキャリブ
│   │       └── useWebRtcDataChannel.ts WebSocket シグナリング＋ RTCPeerConnection を 1 つの effect で管理
│   ├── .env.local             VITE_SIGNALING_URL（git ignore 済み）
│   └── vite.config.ts         base: '/smartphointer/'（GitHub Pages 用）
├── server/                    シグナリングサーバ（Cloud Run 上の WebSocketServer）
│   └── src/index.ts           1 ルーム最大 2 接続。受信メッセージはルーム内の他方へ broadcast。
└── src/components/            空ディレクトリ。リポジトリのトップに残置（git 追跡外）
```

## 通信フロー（実装目線）

1. Monitor が `?room=<UUID>` 付きの自身の URL を QR 化して表示
2. スマホで QR を読み取ると同じ URL の Controller が起動
3. 双方が同じ `roomId` で WebSocket（シグナリング）に接続
4. 接続後すぐ `{type:'ready'}` を送信。両者が `ready` を受け取ると Initiator（Monitor）が offer を作成
5. offer/answer/candidate を WebSocket 経由で交換し RTCDataChannel `signaling` を確立
6. `onopen` で WebSocket は閉じる。以降 Controller → Monitor へ `{type:'pointer', payload:{x,y}}` を流す
7. ジャイロ値 (alpha, beta) は `usePointer` でキャリブ範囲（topLeft/bottomRight）を ±100 にマッピング → Monitor の Canvas へ

## 開発コマンド

apps（Vite SPA）:
```
cd apps
npm install
npm run dev       # ローカル開発
npm run build     # tsc -b && vite build
npm run lint
npm run preview
```

server（シグナリング、ローカル動作確認用）:
```
cd server
npm install
npm run dev       # tsx watch、:8080 で待ち受け
npm run build     # tsc → dist/
npm start         # node dist/index.js
```

ローカルで通しで動かすには両方を別ターミナルで起動。`apps/.env.local` の `VITE_SIGNALING_URL` は localhost で開いた場合は無視され、強制的に `ws://localhost:8080` が使われる（`apps/src/domain/signaling.ts`）。

## デプロイ

- **apps（GitHub Pages）**: main への push で `.github/workflows/deploy.yml` が走る。GitHub Actions Variables の `VITE_SIGNALING_URL` を埋め込んでビルドし、`apps/dist` を Pages へアップロードする。
  - `apps/package.json` の `npm run deploy`（`git add . && git commit -m 'deploy' && git push origin main`）は手動 push のショートカットに過ぎず、現在は dist を git に含めるわけではない（`.gitignore` で `**/dist` 除外、CI ビルド成果物のみ Pages へ上がる）。README の説明は実態と乖離している。
- **server（Cloud Run）**: `server/package.json` の `npm run deploy` で `gcloud run deploy smartphointer-signaling`（asia-northeast1, min 0 / max 1, 256Mi, 1 CPU）。

## 環境変数

| 名前 | 場所 | 用途 |
| --- | --- | --- |
| `VITE_SIGNALING_URL` | `apps/.env.local`, GitHub Actions Variables | シグナリング WebSocket の本番 URL（localhost 時は無視され `ws://localhost:8080` 固定） |
| `PORT` | server 実行環境 | WebSocketServer の listen port（既定 8080）|

## 既知の特性・注意点

- **iOS の DeviceOrientationEvent**: ユーザ操作起点の `requestPermission()` が必要。`useDeviceOrientation` で対応済み。許可拒否時は `window.alert`。
- **キャリブレーション前の座標**: `toPointerPosition` の calibration null 分岐は `(value/180)*100` を ±100 にクランプするだけで、意味のあるマッピングではない。実用は必ずキャリブ後。
- **再接続**: `useWebRtcDataChannel` は `roomId` 変化を依存にしているため、同一 roomId のまま切断された場合に再シグナリングは始まらない（Monitor の `isConnected=false` には戻るが QR を再描画して相手が貼り直すのを待つ形）。仕様「切断後に再び QR」とは挙動が一致しない疑いがあるので、修正フェーズでは要検証。
- **ルーム上限**: server 側は同一ルーム最大 2 接続、3 番目は `1008 'room is full'` で拒否。
- **`apps/src/components` と `src/components`**: 後者（リポジトリ直下の `src/components`）は空で git 未追跡。残骸の可能性。
- **`react-device-detect`** で Monitor/Controller を切替えているため、PC で開きたいのに iPad 等の判定で Controller になることがある。デバッグ時は端末判定を意識する。

## 私（Claude）が編集を始める前に

- 仕様・運用ともに本ファイル、使い方は README.md。情報源を二重化しない。
- ドキュメントの記述（README の deploy 説明、本ファイル「仕様」内の表記揺れなど）と実装が乖離しているケースがあるので、ドキュメントだけを根拠にせず必ずコードと CI 設定を読む。
- バグ修正・リファクタを始める前にユーザの承認を取る方針（過去のやり取り）。
