# ADR-001: Explore Agentトークン消費最適化

## Status
Accepted

## Context

Claude Code の Explore Agent（haiku）呼び出しにおけるトークン消費を最適化する必要がある。

### 観測された課題
- Read呼び出し回数が多い（1タスクで17ファイル読み込みの例）
- CLAUDE.mdが毎回全体ロードされる
- 出力の冗長性（要求4項目に対し7セクション出力等）

## Decision

### 1. プロジェクトCLAUDE.mdの整備

必須セクション:
- **Entry Points**: クライアント・サーバー・DBスキーマの起点ファイル
- **Structure**: ディレクトリ構造と役割の説明
- **Tech Stack**: 使用技術の列挙

```markdown
# project-name

簡潔な説明

## Entry Points
- Client: `app/_layout.tsx`
- Server: `server/index.ts`
- DB Schema: `drizzle/schema.ts`

## Structure
app/           # ページ
server/        # API
lib/           # ユーティリティ

## Tech Stack
- Framework, Database, etc.
```

### 2. Explore Agent呼び出し時の指示

プロンプトに「簡潔に回答してください」を含めることで出力トークンを大幅削減。

### 3. グローバルCLAUDE.mdの分離（オプション）

```
~/.claude/CLAUDE.md           # 常にロード（最小限）
~/.claude/contexts/
  llm.md                      # LLM接続情報（必要時のみ）
  git.md                      # Git操作規約
```

## Consequences

### Positive
- 出力トークン78%削減（実験で確認）
- ツール呼び出し14回→4回に削減
- Explore Agentの探索効率向上

### Negative
- プロジェクトごとにCLAUDE.md整備が必要

## Best Practices

| 項目 | 推奨 | 非推奨 |
|------|------|--------|
| CLAUDE.md | 必要十分な情報を維持 | 過度な圧縮・省略 |
| プロンプト | 「簡潔に」を明示 | 冗長な出力を許容 |
| Entry Points | 明示する | 探索に任せる |

## References

- 実験実施日: 2026-01-10, 2026-01-11
- 対象: pleno-live プロジェクト
