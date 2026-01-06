'use client';

import { useEffect, useState, useCallback } from 'react';
import { Notification } from '@/types/notification';
import { NotificationService } from '@/lib/services/notification.service';
import { timestampToDate } from '@/lib/firebase/firestore';
import { useAuth } from '@/components/auth/auth-provider';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

interface NotificationListProps {
  initialNotifications: Notification[];
}

export default function NotificationList({ initialNotifications }: NotificationListProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const loadedNotifications = await NotificationService.getNotifications(user.uid);
      setNotifications(loadedNotifications);
    } catch (err) {
      console.error('通知の取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('既読処理に失敗:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await NotificationService.markAllAsRead(user.uid);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('すべて既読処理に失敗:', err);
    }
  };

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    const date = timestampToDate(timestamp as Timestamp | Date | string | null | undefined);
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    
    return date.toLocaleDateString('ja-JP', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.notificationType === 'reply') {
      return `/posts/${notification.targetId}`;
    } else {
      // リアクション通知の場合、投稿または返信の親投稿に遷移
      return `/posts/${notification.targetId}`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="text-center py-12 text-warm-600">読み込み中...</div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            className="rounded-2xl border-2 border-pastel-purple-200 bg-white px-4 py-2 text-sm font-medium text-warm-700 transition-all hover:bg-pastel-purple-50"
          >
            すべて既読にする
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-soft">
          <div className="mb-4 text-4xl">🔔</div>
          <p className="text-warm-600">通知はありません。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Link
              key={notification.notificationId}
              href={getNotificationLink(notification)}
              onClick={() => handleMarkAsRead(notification.notificationId)}
              className={`block rounded-3xl p-5 md:p-6 shadow-soft transition-all hover:shadow-soft-lg ${
                notification.isRead
                  ? 'bg-white'
                  : 'bg-pastel-blue-50 border-2 border-pastel-blue-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-2xl">
                  {notification.notificationType === 'reaction' ? '💝' : '💬'}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${notification.isRead ? 'text-warm-600' : 'text-warm-800'}`}>
                    {notification.message}
                  </p>
                  <p className="mt-2 text-sm text-warm-500">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="h-3 w-3 rounded-full bg-pastel-purple-500"></div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

