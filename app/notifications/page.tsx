import { Metadata } from 'next';
import NotificationList from '@/components/notifications/notification-list';
import { NotificationService } from '@/lib/services/notification.service';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/firebase/auth';

export const metadata: Metadata = {
  title: '通知 - 優しさの交換サイト',
  description: 'あなたへの通知を確認できます',
};

export default async function NotificationsPage() {
  const user = getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const notifications = await NotificationService.getNotifications(user.uid);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-800">通知</h1>
        <p className="mt-2 text-warm-600">あなたへの通知を確認できます</p>
      </div>
      <NotificationList initialNotifications={notifications} />
    </div>
  );
}

