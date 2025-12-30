'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { signOutUser } from '@/lib/firebase/auth';
import NotificationBadge from '@/components/notifications/notification-badge';

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (err) {
      console.error('ログアウトに失敗:', err);
    }
  };

  if (loading) {
    return (
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">優しさの交換サイト</h1>
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl md:text-2xl font-bold text-warm-800 hover:text-pastel-purple-600 transition-colors">
          優しさの交換サイト
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            href="/ranking"
            className="rounded-lg px-3 py-2 text-warm-700 transition-colors hover:bg-warm-100 text-sm md:text-base"
          >
            ランキング
          </Link>
          {user ? (
            <>
              <NotificationBadge />
              <Link
                href="/profile"
                className="rounded-lg px-3 py-2 text-warm-700 transition-colors hover:bg-warm-100 text-sm md:text-base"
              >
                マイページ
              </Link>
              <Link
                href="/settings"
                className="rounded-lg px-3 py-2 text-warm-700 transition-colors hover:bg-warm-100 text-sm md:text-base"
              >
                設定
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-warm-700 transition-colors hover:bg-warm-100 text-sm md:text-base"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-warm-700 transition-colors hover:bg-warm-100 text-sm md:text-base"
            >
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

