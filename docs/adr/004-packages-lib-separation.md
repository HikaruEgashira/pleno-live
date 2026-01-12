# ADR-004: packages/lib のパッケージ分離

## ステータス

Accepted

## 日付

2026-01-12

## コンテキスト

`packages/lib` ディレクトリが肥大化し、以下の問題が発生していた：

- 5つの異なる責務が混在（状態管理、音声処理、テーマ、API、ユーティリティ）
- 新規開発者がファイルの役割を把握しづらい
- `cn.ts` と `utils.ts` の重複コード

### 変更前の構成

```
packages/lib/
├── _core/
│   ├── theme.ts
│   ├── manus-runtime.ts
│   └── nativewind-pressable.ts
├── recording-session-context.tsx   # 状態管理
├── recordings-context.tsx          # 状態管理
├── theme-provider.tsx              # 状態管理
├── realtime-transcription.ts       # 音声処理
├── web-audio-stream.ts             # 音声処理
├── system-audio-stream.ts          # 音声処理
├── background-recording-task.ts    # 音声処理
├── trpc.ts                         # API
├── cn.ts                           # ユーティリティ
└── utils.ts                        # ユーティリティ（重複）
```

## 決定

`packages/lib` を機能別に分離し、packages直下に新パッケージを作成する。

### 変更後の構成

```
packages/
├── contexts/              # 新規: React Context（状態管理）
│   ├── recording-session-context.tsx
│   ├── recordings-context.tsx
│   └── theme-provider.tsx
├── audio/                 # 新規: 音声処理・文字起こし
│   ├── realtime-transcription.ts
│   ├── web-audio-stream.ts
│   ├── system-audio-stream.ts
│   └── background-recording-task.ts
├── lib/                   # 縮小: コアユーティリティのみ
│   ├── _core/
│   │   ├── theme.ts
│   │   ├── manus-runtime.ts
│   │   └── nativewind-pressable.ts
│   ├── trpc.ts
│   └── cn.ts
├── hooks/                 # 既存
├── components/            # 既存
├── types/                 # 既存
├── constants/             # 既存
└── infra/                 # 既存
```

## 検討した代替案

| 案 | 概要 | 不採用理由 |
|---|------|----------|
| 案A: lib内サブディレクトリ分離 | packages/lib/ 内にサブフォルダを作成 | `lib`という抽象的な名前が残る |
| 案C: ドメイン駆動分割 | recording/, theme/ など機能単位で集約 | 大規模リファクタリングが必要、既存パターンを崩す |

## 理由

1. **既存パターンとの整合性**: hooks, components, types と同レベルに配置
2. **責務の明確化**: 各パッケージの役割が名前から明確
3. **変更コストのバランス**: ディレクトリ作成 + import置換で完了
4. **将来性**: 独立パッケージ化や外部公開が容易

## 影響

### importパスの変更

```typescript
// Before
import { RecordingsProvider } from "@/packages/lib/recordings-context";
import { RealtimeTranscriptionClient } from "@/packages/lib/realtime-transcription";

// After
import { RecordingsProvider } from "@/packages/contexts/recordings-context";
import { RealtimeTranscriptionClient } from "@/packages/audio/realtime-transcription";
```

### 更新が必要だったファイル

- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/record.tsx`
- `app/(tabs)/notes.tsx`
- `app/(tabs)/settings.tsx`
- `app/note/[id].tsx`
- `app/dev/theme-lab.tsx`
- `packages/hooks/use-realtime-transcription.ts`
- `packages/hooks/use-color-scheme.ts`
- `packages/hooks/use-background-recording.ts`
- `packages/components/global-recording-bar.tsx`
- `packages/components/screen-container.tsx`
- `packages/components/themed-view.tsx`

## 結果

- コードベースの見通しが改善
- 新機能追加時の配置先が明確に
- 重複コード（utils.ts）の削除
