'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { NotificationService } from '@/lib/services/notification.service';
import Link from 'next/link';

export default function NotificationBadge() {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const count = await NotificationService.getUnreadCount(user.uid);
      setUnreadCount(count);
    } catch (err) {
      console.error('未読数の取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    loadUnreadCount();

    // 30秒ごとに未読数を更新
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, loadUnreadCount]);

  if (!user || loading) {
    return null;
  }

  return (
    <Link
      href="/notifications"
      className="relative rounded-full p-2 text-warm-700 transition-colors hover:bg-warm-100"
    >
      <span className="text-2xl">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pastel-pink-500 text-xs font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
}

