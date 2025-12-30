import { Timestamp } from 'firebase/firestore';

/**
 * ユーザーエンティティ
 */
export interface User {
  userId: string;
  nickname?: string;
  authProvider: 'google' | 'twitter' | 'anonymous';
  status: 'active' | 'locked' | 'suspended';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

/**
 * ユーザー作成時のデータ
 */
export interface CreateUserData {
  userId: string;
  nickname?: string;
  authProvider: 'google' | 'twitter' | 'anonymous';
  status?: 'active' | 'locked' | 'suspended';
}

/**
 * ユーザー更新時のデータ
 */
export interface UpdateUserData {
  nickname?: string;
  lastLoginAt?: Timestamp;
  status?: 'active' | 'locked' | 'suspended';
}

