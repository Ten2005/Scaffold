# Scaffold

AIと対話しながら学習方針を定義し、体系的な教材を自動生成する学習支援プラットフォーム。

## 技術スタック

- Next.js
- TypeScript
- TailWindCSS
- Shadcn/ui
- Drizzle ORM
- Supabase
- Vercel
- Zod
- pnpm
- biome

## コマンド

| コマンド | 用途 |
|---|---|
| `pnpm build` | プロダクションビルド |
| `pnpm check:unsafe` | Biome lint + format チェック（unsafe含む） |

## アーキテクチャ（FSD: Feature Sliced Design）

### レイヤー構成（上位→下位、依存方向は上から下への一方向のみ）

1. **app** - ルーティング、グローバルProvider、スタイル初期化
2. **widgets** - 複数entity/featureを組み合わせた自己完結UIブロック
3. **features** - ユーザー操作単位のUI＋ビジネスロジック
4. **entities** - ビジネスドメインのデータ構造・表示・取得（操作ロジックは含まない）
5. **shared** - ドメイン非依存の汎用コンポーネント・ユーティリティ・API基盤

※ Next.jsのapp routerとpagesの責務が重複するため、FSDのpagesレイヤーは省略。

### セグメント（各スライス内の構成）

- **ui** - コンポーネント、スタイル
- **api** - 外部通信（APIリクエスト、DBクエリ）
- **model** - 型定義、状態管理、バリデーション、Server Actions
- **lib** - スライス内部のヘルパー関数
- **config** - 設定値、定数

### FSD ルール

- 同一レイヤー内のスライス間の依存は禁止
- 外部からのアクセスはスライスの `index.ts`（パブリックAPI）経由のみ
- sharedはスライスを持たず、セグメント単位でバレルを置く
- バレルインポートは原則Server Only。クライアント用は `index.client.ts` でエクスポート
- entitiesが上位レイヤーのUIを必要とする場合はスロット（children/render prop）で注入
- スライス間で型を共有したい場合はIDのみを持たせ、型の直接参照を避ける

## ドキュメント

詳細な仕様は `docs/` 配下を参照すること。
