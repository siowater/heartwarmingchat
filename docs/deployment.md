# デプロイ手順書

## 概要
本ドキュメントでは、優しさの交換サイトをVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（無料で作成可能）
- Firebaseプロジェクトの設定完了
- 環境変数の準備

## デプロイ手順

### 1. GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成
2. ローカルリポジトリをGitHubにプッシュ：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/heartwarming-chat.git
git push -u origin main
```

### 2. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com/) にログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択
4. プロジェクト設定：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
   - **Install Command**: `npm install`（デフォルト）

### 3. 環境変数の設定

Vercelのプロジェクト設定 > Environment Variables で以下の環境変数を設定：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

**重要**: 
- 環境変数は本番環境（Production）、プレビュー環境（Preview）、開発環境（Development）すべてに設定してください
- 環境変数を設定した後、再デプロイが必要です

### 4. Firebase Authenticationの設定

1. Firebase Console > Authentication > 設定 > 承認済みドメイン
2. VercelのデプロイURLを追加（例: `your-project.vercel.app`）
3. カスタムドメインを使用する場合、そのドメインも追加

### 5. Firestoreセキュリティルールのデプロイ

Firebase CLIを使用してセキュリティルールをデプロイ：

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init firestore

# セキュリティルールをデプロイ
firebase deploy --only firestore:rules

# インデックスをデプロイ
firebase deploy --only firestore:indexes
```

### 6. デプロイの実行

1. Vercelで「Deploy」をクリック
2. ビルドが完了するまで待機（通常2-3分）
3. デプロイが完了したら、URLが表示されます

### 7. カスタムドメインの設定（オプション）

1. Vercelプロジェクト設定 > Domains
2. カスタムドメインを追加
3. DNS設定を更新（Vercelの指示に従う）

## デプロイ後の確認事項

### 動作確認チェックリスト

- [ ] ホームページが正常に表示される
- [ ] ログイン機能が動作する（Google、Twitter、匿名）
- [ ] 投稿作成が動作する
- [ ] 投稿一覧が表示される
- [ ] 返信機能が動作する
- [ ] リアクション機能が動作する
- [ ] 通知機能が動作する
- [ ] ランキングページが表示される
- [ ] マイページが表示される
- [ ] 利用規約・プライバシーポリシーが表示される
- [ ] お問い合わせフォームが動作する

### パフォーマンス確認

- [ ] Lighthouseスコアを確認（目標: Performance 80以上）
- [ ] モバイル表示を確認
- [ ] ページ読み込み速度を確認

### セキュリティ確認

- [ ] HTTPSが有効になっている
- [ ] 環境変数が正しく設定されている
- [ ] Firestoreセキュリティルールが適用されている
- [ ] 認証が正常に動作している

## トラブルシューティング

### ビルドエラー

- **エラー**: `Module not found`
  - **解決策**: `package.json`の依存関係を確認し、`npm install`を実行

- **エラー**: `Environment variable not found`
  - **解決策**: Vercelの環境変数設定を確認

### ランタイムエラー

- **エラー**: Firebase接続エラー
  - **解決策**: 環境変数が正しく設定されているか確認
  - **解決策**: Firebaseプロジェクトの設定を確認

- **エラー**: 認証エラー
  - **解決策**: Firebase Authenticationの承認済みドメインを確認

### パフォーマンス問題

- **問題**: ページ読み込みが遅い
  - **解決策**: 画像の最適化を確認
  - **解決策**: 不要な依存関係を削除
  - **解決策**: コード分割を確認

## 継続的デプロイ（CI/CD）

Vercelは自動的にGitHubリポジトリと連携し、以下の場合に自動デプロイされます：

- `main`ブランチへのプッシュ → 本番環境にデプロイ
- その他のブランチへのプッシュ → プレビュー環境にデプロイ
- プルリクエストの作成 → プレビュー環境にデプロイ

## モニタリング

### Vercel Analytics

1. Vercelプロジェクト設定 > Analytics
2. Vercel Analyticsを有効化（無料枠あり）
3. パフォーマンスメトリクスを確認

### Firebase Console

1. Firebase Consoleで以下を確認：
   - Firestoreの使用量
   - Authenticationの使用状況
   - エラーログ

## ロールバック

デプロイに問題がある場合：

1. VercelのDeploymentsページに移動
2. 以前の正常なデプロイを選択
3. 「Promote to Production」をクリック

## 注意事項

- 無料枠の制限を常に意識する
- Firestoreの読み取り/書き込み回数を監視
- Vercelの帯域幅使用量を監視
- 定期的にバックアップを取る（将来実装）

