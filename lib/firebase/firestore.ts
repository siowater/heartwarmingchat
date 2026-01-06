import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { getFirestoreDb } from './config';

// Firestoreヘルパー関数

/**
 * コレクション参照を取得
 */
export const getCollectionRef = (collectionName: string) => {
  return collection(getFirestoreDb(), collectionName);
};

/**
 * ドキュメント参照を取得
 */
export const getDocRef = (collectionName: string, docId: string) => {
  return doc(getFirestoreDb(), collectionName, docId);
};

/**
 * ドキュメントを取得
 */
export const getDocument = async <T>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  const docRef = getDocRef(collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * ドキュメントを作成
 */
export const createDocument = async <T extends Record<string, unknown>>(
  collectionName: string,
  docId: string,
  data: Omit<T, 'id'>
): Promise<void> => {
  const docRef = getDocRef(collectionName, docId);
  console.log('[createDocument] Starting document creation:', {
    collectionName,
    docId,
    dataKeys: Object.keys(data),
    dataPreview: Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value instanceof Date ? value.toISOString() : 
        typeof value === 'object' && value !== null && 'toDate' in value ? 
          (value as { toDate?: () => Date }).toDate?.()?.toISOString() || value : 
          value
      ])
    ),
  });
  
  try {
    // createdAtが既に設定されている場合はそのまま使用
    // セキュリティルールの評価時には値が必要なため、serverTimestamp()は使わない
    console.log('[createDocument] Calling setDoc...');
    await setDoc(docRef, data);
    console.log('[createDocument] Document created successfully');
  } catch (error: unknown) {
    const firebaseError = error as FirebaseError;
    console.error('[createDocument] Error occurred:', error);
    console.error('[createDocument] Error code:', firebaseError?.code);
    console.error('[createDocument] Error message:', firebaseError?.message);
    console.error('[createDocument] Collection:', collectionName, 'DocId:', docId);
    console.error('[createDocument] Data being written:', JSON.stringify(data, null, 2));
    throw error;
  }
};

/**
 * ドキュメントを更新
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<Record<string, unknown>>
): Promise<void> => {
  const docRef = getDocRef(collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * ドキュメントを削除（論理削除）
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string,
  softDelete: boolean = true
): Promise<void> => {
  const docRef = getDocRef(collectionName, docId);
  
  if (softDelete) {
    // 論理削除
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
    });
  } else {
    // 物理削除
    await deleteDoc(docRef);
  }
};

/**
 * バッチ書き込み
 */
export const batchWrite = async (
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    collectionName: string;
    docId: string;
    data?: Record<string, unknown>;
  }>
): Promise<void> => {
  const batch = writeBatch(getFirestoreDb());
  
  operations.forEach((op) => {
    const docRef = getDocRef(op.collectionName, op.docId);
    
    switch (op.type) {
      case 'create':
        if (op.data) {
          batch.set(docRef, {
            ...op.data,
            createdAt: serverTimestamp(),
          });
        }
        break;
      case 'update':
        if (op.data) {
          batch.update(docRef, {
            ...op.data,
            updatedAt: serverTimestamp(),
          });
        }
        break;
      case 'delete':
        batch.delete(docRef);
        break;
    }
  });
  
  await batch.commit();
};

/**
 * タイムスタンプをDateに変換
 * Timestamp、Date、ISO文字列、unknownのいずれも受け入れる
 */
export const timestampToDate = (timestamp: Timestamp | Date | string | null | undefined | unknown): Date | null => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === 'string') return new Date(timestamp);
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return (timestamp as Timestamp).toDate();
  }
  return null;
};

/**
 * Dateをタイムスタンプに変換
 */
export const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

