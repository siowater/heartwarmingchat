import { getDocument, createDocument, updateDocument } from '../firebase/firestore';
import { User, CreateUserData, UpdateUserData } from '@/types/user';
import { Timestamp } from 'firebase/firestore';

/**
 * ユーザーサービス
 */
export class UserService {
  private static readonly COLLECTION_NAME = 'users';

  /**
   * ユーザーを取得
   */
  static async getUser(userId: string): Promise<User | null> {
    return await getDocument<User>(this.COLLECTION_NAME, userId);
  }

  /**
   * ユーザーを作成
   */
  static async createUser(data: CreateUserData): Promise<void> {
    await createDocument<User>(
      this.COLLECTION_NAME,
      data.userId,
      {
        userId: data.userId,
        nickname: data.nickname,
        authProvider: data.authProvider,
        status: data.status || 'active',
        createdAt: Timestamp.now(),
        lastLoginAt: Timestamp.now(),
      }
    );
  }

  /**
   * ユーザーを更新
   */
  static async updateUser(userId: string, data: UpdateUserData): Promise<void> {
    await updateDocument(this.COLLECTION_NAME, userId, {
      ...data,
      ...(data.lastLoginAt ? {} : { updatedAt: Timestamp.now() }),
    });
  }

  /**
   * 最終ログイン日時を更新
   */
  static async updateLastLogin(userId: string): Promise<void> {
    await this.updateUser(userId, {
      lastLoginAt: Timestamp.now(),
    });
  }

  /**
   * ニックネームを更新
   */
  static async updateNickname(userId: string, nickname: string): Promise<void> {
    await this.updateUser(userId, {
      nickname,
    });
  }
}
