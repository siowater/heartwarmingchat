# 優しさの交換サイト

心のモヤモヤを吐き出し、優しさを循環させるプラットフォームです。

## プロジェクト概要

不特定多数のユーザーが匿名で心のモヤモヤを吐き出し、AIではなく生の人間が優しい言葉や励ましを投げかけることで、優しさを循環させるプラットフォームです。

## 技術スタック

- **フロントエンド**: Next.js 16.1.1 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4
- **バックエンド**: Firebase (Firestore, Authentication) / モックモード対応
- **ホスティング**: Vercel
- **言語**: TypeScript

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd heartwarming-chat
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下のいずれかを設定してください：

#### モックモード（Firebase設定不要）

```env
NEXT_PUBLIC_USE_MOCK=true
```

#### Firebase設定（本番環境用）

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

詳細は [Firebase設定ガイド](docs/firebase-setup.md) を参照してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

## モックモードについて

Firebase設定が完了していない場合でも、モックモードを使用してアプリケーションを動作確認できます。

モックモードでは：
- メモリ上でデータを管理（ページリロードでリセット）
- サンプルデータが自動的に生成されます
- すべての機能が動作します（投稿、返信、リアクション、通知など）

モックモードを有効にするには、`.env.local` に以下を追加：

```env
NEXT_PUBLIC_USE_MOCK=true
```

## プロジェクト構造

```
heartwarming-chat/
├── app/                    # Next.js App Router
│   ├── login/             # ログインページ
│   ├── settings/         # 設定ページ
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # ホームページ
├── components/           # Reactコンポーネント
│   ├── auth/             # 認証関連コンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   └── settings/         # 設定関連コンポーネント
├── lib/                  # ライブラリ・ユーティリティ
│   ├── firebase/         # Firebase設定・ヘルパー
│   ├── mock/             # モック実装
│   └── services/         # ビジネスロジック
├── types/                # TypeScript型定義
├── docs/                 # プロジェクトドキュメント
├── firestore.rules       # Firestoreセキュリティルール
└── firestore.indexes.json # Firestoreインデックス設定
```

## ドキュメント

- [要件定義書](docs/requirements.md)
- [技術スタック](docs/tech-stack.md)
- [進捗管理](docs/progress.md)
- [データベース設計](docs/database.md)
- [機能一覧](docs/features.md)
- [Firebase設定ガイド](docs/firebase-setup.md)
- [デプロイ手順書](docs/deployment.md)
- [テスト手順書](docs/testing.md)

## 開発ルール

実装を始める前に、必ず `docs/` ディレクトリ配下のドキュメントを確認してください。

詳細は [プロジェクトルール](.cursor/rules/project-rule.mdc) を参照してください。

## ライセンス

このプロジェクトは非営利目的で開発されています。
