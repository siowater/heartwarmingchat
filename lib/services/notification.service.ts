import {
  getCollectionRef,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../firebase/firestore';
import {
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Notification, CreateNotificationData } from '@/types/notification';
import { PostService } from './post.service';

/**
 * 通知サービス
 */
export class NotificationService {
  private static readonly COLLECTION_NAME = 'notifications';
  private static readonly MAX_NOTIFICATIONS = 100;

  /**
   * 通知を作成
   */
  static async createNotification(data: CreateNotificationData): Promise<string> {
    // 通知IDを生成
    const notificationId = this.generateNotificationId(data.userId, data.targetId);

    // 通知を作成
    await createDocument(
      this.COLLECTION_NAME,
      notificationId,
      {
        notificationId,
        userId: data.userId,
        notificationType: data.notificationType,
        targetType: data.targetType,
        targetId: data.targetId,
        message: data.message,
        isRead: false,
        createdAt: Timestamp.now(),
      } as unknown as Omit<Notification, 'id'>
    );

    // 最大件数を超えた場合、古い通知を削除
    await this.cleanupOldNotifications(data.userId);

    return notificationId;
  }

  /**
   * リアクション通知を作成
   */
  static async createReactionNotification(
    targetUserId: string,
    targetType: 'post' | 'reply',
    targetId: string,
    reactionType: string
  ): Promise<void> {
    // 自分の投稿・返信へのリアクションは通知しない
    if (!targetUserId) return;

    let message = '';
    if (targetType === 'post') {
      message = `あなたの投稿に「${reactionType}」のリアクションがありました`;
    } else {
      message = `あなたの返信に「${reactionType}」のリアクションがありました`;
    }

    await this.createNotification({
      userId: targetUserId,
      notificationType: 'reaction',
      targetType,
      targetId,
      message,
    });
  }

  /**
   * 返信通知を作成
   */
  static async createReplyNotification(
    postId: string,
    _replyId: string
  ): Promise<void> {
    // 投稿を取得して投稿者のユーザーIDを取得
    const post = await PostService.getPost(postId);
    if (!post) return;

    // 自分の投稿への返信は通知しない（既にReplyServiceでチェック済み）
    const message = 'あなたの投稿に返信がありました';

    await this.createNotification({
      userId: post.userId,
      notificationType: 'reply',
      targetType: 'post',
      targetId: postId,
      message,
    });
  }

  /**
   * 通知一覧を取得
   */
  static async getNotifications(userId: string, limitCount: number = 50): Promise<Notification[]> {
    const notificationsQuery = query(
      getCollectionRef(this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(notificationsQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as Notification[];
  }

  /**
   * 未読通知数を取得
   */
  static async getUnreadCount(userId: string): Promise<number> {
    const unreadQuery = query(
      getCollectionRef(this.COLLECTION_NAME),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(unreadQuery);
    return snapshot.size;
  }

  /**
   * 通知を既読にする
   */
  static async markAsRead(notificationId: string): Promise<void> {
    await updateDocument(this.COLLECTION_NAME, notificationId, {
      isRead: true,
    });
  }

  /**
   * すべての通知を既読にする
   */
  static async markAllAsRead(userId: string): Promise<void> {
    const notifications = await this.getNotifications(userId, 100);
    const unreadNotifications = notifications.filter((n) => !n.isRead);

    await Promise.all(
      unreadNotifications.map((n) => this.markAsRead(n.notificationId))
    );
  }

  /**
   * 古い通知を削除（最大件数を超えた場合）
   */
  private static async cleanupOldNotifications(userId: string): Promise<void> {
    const notificationsQuery = query(
      getCollectionRef(this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(notificationsQuery);
    
    if (snapshot.size > this.MAX_NOTIFICATIONS) {
      const notificationsToDelete = snapshot.docs.slice(this.MAX_NOTIFICATIONS);
      await Promise.all(
        notificationsToDelete.map((doc) => deleteDocument(this.COLLECTION_NAME, doc.id, false))
      );
    }
  }

  /**
   * 通知IDを生成
   */
  private static generateNotificationId(userId: string, targetId: string): string {
    return `notification_${userId}_${targetId}_${Date.now()}`;
  }
}
