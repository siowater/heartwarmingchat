'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { UserService } from '@/lib/services/user.service';
import { User } from '@/types/user';
import { signOutUser } from '@/lib/firebase/auth';

export default function SettingsForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const data = await UserService.getUser(user.uid);
      if (data) {
        setUserData(data);
        setNickname(data.nickname || '');
      }
    } catch (err) {
      console.error('ユーザー情報の取得に失敗:', err);
      setError('ユーザー情報の取得に失敗しました。');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, authLoading, router, loadUserData]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // バリデーション
    if (nickname.length > 50) {
      setError('ニックネームは50文字以内で入力してください。');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await UserService.updateNickname(user.uid, nickname);
      setSuccess('ニックネームを更新しました。');
      
      // ユーザーデータを再読み込み
      await loadUserData();
    } catch (err) {
      console.error('ニックネームの更新に失敗:', err);
      setError('ニックネームの更新に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/login');
    } catch (err) {
      console.error('ログアウトに失敗:', err);
      setError('ログアウトに失敗しました。');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">ユーザー情報</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              ニックネーム
            </label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="表示名を入力してください（最大50文字）"
              maxLength={50}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              {nickname.length} / 50 文字
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">認証プロバイダー:</span>{' '}
              {userData.authProvider === 'google' && 'Google'}
              {userData.authProvider === 'twitter' && 'Twitter'}
              {userData.authProvider === 'anonymous' && '匿名'}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium">ユーザーID:</span> {userData.userId}
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">アカウント</h2>
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-red-300 bg-white px-6 py-3 font-medium text-red-600 transition-all hover:bg-red-50"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}

