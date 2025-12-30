import { Timestamp } from 'firebase/firestore';

/**
 * 通知タイプ
 */
export type NotificationType = 'reaction' | 'reply';

/**
 * 通知エンティティ
 */
export interface Notification {
  notificationId: string;
  userId: string;
  notificationType: NotificationType;
  targetType: 'post' | 'reply';
  targetId: string;
  message: string;
  isRead: boolean;
  createdAt: Timestamp;
}

/**
 * 通知作成時のデータ
 */
export interface CreateNotificationData {
  userId: string;
  notificationType: NotificationType;
  targetType: 'post' | 'reply';
  targetId: string;
  message: string;
}

