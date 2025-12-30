import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  User,
  onAuthStateChanged,
  getIdToken,
} from 'firebase/auth';
import { getFirebaseAuth } from './config';

// 認証プロバイダー
export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

// 認証プロバイダーの設定
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

twitterProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Googleでログイン
 */
export const signInWithGoogle = async (): Promise<User> => {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Twitterでログイン
 */
export const signInWithTwitter = async (): Promise<User> => {
  const auth = getFirebaseAuth();
  const result = await signInWithPopup(auth, twitterProvider);
  return result.user;
};

/**
 * 匿名でログイン
 */
export const signInAnonymouslyUser = async (): Promise<User> => {
  const auth = getFirebaseAuth();
  const result = await signInAnonymously(auth);
  return result.user;
};

/**
 * ログアウト
 */
export const signOutUser = async (): Promise<void> => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};

/**
 * 認証状態の監視
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): User | null => {
  const auth = getFirebaseAuth();
  return auth.currentUser;
};

/**
 * IDトークンを取得（API Routes用）
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return null;
  return await getIdToken(user);
};
