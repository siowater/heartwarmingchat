import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase設定の型定義
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// 環境変数からFirebase設定を取得
const getFirebaseConfig = (): FirebaseConfig => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  // 必須環境変数のチェック
  if (!config.apiKey || !config.authDomain || !config.projectId) {
    throw new Error(
      'Firebase設定に必要な環境変数が設定されていません。.env.localファイルを確認してください。'
    );
  }

  return config as FirebaseConfig;
};

// Firebase Appの初期化（シングルトンパターン）
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(getFirebaseConfig());
    } else {
      app = apps[0];
    }
  }
  return app;
};

// Firebase Authenticationの取得
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
};

// Firestoreの取得
export const getFirestoreDb = (): Firestore => {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
};

