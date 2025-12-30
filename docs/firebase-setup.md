# Firebase設定ガイド

## 概要
このドキュメントでは、Firebaseプロジェクトの設定手順を説明します。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `heartwarming-chat`）
4. Google Analyticsの設定（無料枠のため、必要に応じて無効化可能）
5. プロジェクトを作成

## 2. Webアプリの追加

1. Firebase Consoleでプロジェクトを選択
2. プロジェクトの概要 > ウェブアプリを追加（</>アイコン）をクリック
3. アプリのニックネームを入力（例: `heartwarming-chat-web`）
4. 「このアプリのFirebase Hostingも設定しますか？」は「今はスキップ」を選択
5. 設定値（firebaseConfig）をコピー

## 3. 環境変数の設定

1. プロジェクトルートに `.env.local` ファイルを作成（`.env.local.example`を参考）
2. Firebase Consoleから取得した設定値を `.env.local` に設定：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## 4. Authenticationの設定

### 匿名認証の有効化

1. Firebase Console > Authentication > サインイン方法
2. 「匿名」を有効化

### Google認証の設定

1. Firebase Console > Authentication > サインイン方法
2. 「Google」を有効化
3. プロジェクトのサポートメールを設定
4. 「保存」をクリック

### Twitter認証の設定（オプション）

1. [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) でアプリを作成
2. OAuth 2.0設定でコールバックURLを設定：
   - `https://your-project-id.firebaseapp.com/__/auth/handler`
3. Firebase Console > Authentication > サインイン方法
4. 「Twitter」を有効化
5. Twitter Developer Portalから取得したAPIキーとAPIシークレットを設定

## 5. Firestoreの設定

### データベースの作成

1. Firebase Console > Firestore Database
2. 「データベースを作成」をクリック
3. セキュリティルールの開始モードを選択：
   - **本番環境**: 「本番モードで開始」を選択（セキュリティルールを後で設定）
   - **開発環境**: 「テストモードで開始」を選択（開発中のみ）
4. ロケーションを選択（例: `asia-northeast1` - 東京リージョン）

### セキュリティルールの設定

1. Firebase Console > Firestore Database > ルール
2. `firestore.rules` ファイルの内容をコピー＆ペースト
3. 「公開」をクリック

### インデックスの設定

1. Firebase Console > Firestore Database > インデックス
2. `firestore.indexes.json` ファイルの内容をコピー
3. Firebase CLIを使用してインデックスをデプロイ：

```bash
# Firebase CLIをインストール（未インストールの場合）
npm install -g firebase-tools

# Firebaseにログイン
firebase login

# プロジェクトを初期化
firebase init firestore

# インデックスをデプロイ
firebase deploy --only firestore:indexes
```

または、Firebase Consoleから手動でインデックスを作成することも可能です。

## 6. 無料枠の確認

Firebase Spark Plan（無料枠）の制限：

- **Firestore**: 
  - 読み取り: 50,000回/日
  - 書き込み: 20,000回/日
  - 削除: 20,000回/日
- **Storage**: 
  - 保存: 5GB
  - ダウンロード: 1GB/日
- **Authentication**: 
  - 月間アクティブユーザー数: 無制限

Firebase Console > 使用量と請求で現在の使用状況を確認できます。

## 7. セキュリティチェックリスト

- [ ] セキュリティルールが適切に設定されている
- [ ] 環境変数が `.gitignore` に含まれている
- [ ] `.env.local` がGitにコミットされていない
- [ ] Firebase Consoleで不要なAPIが無効化されている
- [ ] 本番環境ではテストモードが無効化されている

## トラブルシューティング

### 認証エラーが発生する場合

- Firebase Consoleで認証プロバイダーが有効化されているか確認
- 環境変数が正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### Firestoreの読み取り/書き込みエラーが発生する場合

- セキュリティルールが正しく設定されているか確認
- インデックスが作成されているか確認（複合クエリの場合）
- Firebase Consoleの使用量を確認（無料枠の制限に達していないか）

### 環境変数が読み込まれない場合

- `.env.local` ファイルがプロジェクトルートに存在するか確認
- 環境変数名に `NEXT_PUBLIC_` プレフィックスが付いているか確認（クライアント側で使用する場合）
- 開発サーバーを再起動

