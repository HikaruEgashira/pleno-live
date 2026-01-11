# ADR 003: ローカルビルド手順

## ステータス
承認済み

## コンテキスト
EAS Cloudを使用せず、ローカル環境でAndroid APKをビルドしてリリースする必要がある。

## 決定

### 前提条件
- Android SDK（Homebrew: `brew install android-commandlinetools`）
- Node.js 20.x
- pnpm

### 環境設定

1. `android/local.properties` を作成:
```properties
sdk.dir=/opt/homebrew/share/android-commandlinetools
```

2. `.env` に本番APIを設定:
```
EXPO_PUBLIC_API_URL=https://live.plenoai.com
```

### ビルド手順

1. バージョン更新:
   - `app.config.ts` の `version`
   - `android/app/build.gradle` の `versionName`

2. APKビルド:
```bash
cd android && ./gradlew assembleRelease
```

3. 出力先: `android/app/build/outputs/apk/release/app-release.apk`

### リリース手順

1. QRコード生成:
```bash
node scripts/generate_qr.mjs "https://github.com/HikaruEgashira/pleno-live/releases/download/vX.X.X/pleno-live-vX.X.X.apk"
```

2. GitHub Release作成:
```bash
gh release create vX.X.X \
  pleno-live-vX.X.X.apk \
  qr-code.png \
  --title "Pleno Live vX.X.X" \
  --notes "リリースノート"
```

3. README更新: ダウンロードリンクを新バージョンに更新

### トラブルシューティング

- **Network request failed**: `.env` の `EXPO_PUBLIC_API_URL` が正しく設定されているか確認
- **CMakeエラー**: `gradlew clean` ではなく、直接 `gradlew assembleRelease` を実行
- **JSバンドルキャッシュ**: 問題がある場合は `android/app/build/generated/assets/createBundleReleaseJsAndAssets` を削除

## 結果
ローカルでAPKをビルドし、GitHub Releasesで配布できる。
