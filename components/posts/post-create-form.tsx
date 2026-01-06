'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { PostService } from '@/lib/services/post.service';
import { filterNGWords } from '@/lib/utils/ng-word-filter';
import { timestampToDate } from '@/lib/firebase/firestore';
import { showToast } from '@/components/ui/toast';

const MAX_LENGTH = 1000;

export default function PostCreateForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyPostCount, setDailyPostCount] = useState<number | null>(null);
  const [checkingLimit, setCheckingLimit] = useState(false);

  // 1日の投稿数制限をチェック
  useEffect(() => {
    const checkDailyLimit = async () => {
      if (!user) {
        setDailyPostCount(null);
        return;
      }

      try {
        setCheckingLimit(true);
        const userPosts = await PostService.getUserPosts(user.uid);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPosts = userPosts.filter(post => {
          const postDate = timestampToDate(post.createdAt);
          if (!postDate) return false;
          return postDate >= today;
        });
        setDailyPostCount(todayPosts.length);
      } catch (err) {
        console.error('投稿数チェックに失敗:', err);
      } finally {
        setCheckingLimit(false);
      }
    };

    if (user) {
      void checkDailyLimit();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    // バリデーション
    if (content.trim().length === 0) {
      setError('投稿内容を入力してください。');
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`投稿内容は${MAX_LENGTH}文字以内で入力してください。（現在: ${content.length}文字）`);
      return;
    }

    // 1日の投稿数制限チェック
    if (dailyPostCount !== null && dailyPostCount >= 10) {
      setError('1日の投稿数は10件までです。明日またお願いします。');
      showToast('1日の投稿数は10件までです。', 'error');
      return;
    }

    // NGワードチェック（事前チェック）
    const ngWordResult = filterNGWords(content.trim());
    if (!ngWordResult.passed) {
      setError('投稿内容に不適切な表現が含まれています。');
      showToast('投稿内容に不適切な表現が含まれています。', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await PostService.createPost({
        userId: user.uid,
        content: content.trim(),
      });

      showToast('投稿が完了しました。優しい言葉をお待ちしています。', 'success');

      // 成功時はホームにリダイレクト
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      console.error('投稿の作成に失敗:', err);
      const errorMessage = err instanceof Error ? err.message : '投稿の保存に失敗しました。もう一度お試しください。';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <p className="mb-4 text-warm-600">投稿するにはログインが必要です。</p>
        <a
          href="/login"
          className="inline-block rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-3 font-medium text-white shadow-soft transition-all hover:shadow-soft-lg hover:scale-105"
        >
          ログインする
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 md:p-8 shadow-soft">
      <div className="mb-6 text-center">
        <div className="mb-2 text-4xl">💭</div>
        <p className="text-warm-600">心のモヤモヤをそっと置いてみませんか？</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-2xl bg-pastel-pink-100 border border-pastel-pink-300 p-4 text-sm text-warm-800">
            {error}
          </div>
        )}

        <div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setError(null);
            }}
            placeholder="今、感じていることを自由に書いてください..."
            maxLength={MAX_LENGTH}
            rows={8}
            className="w-full rounded-2xl border-2 border-warm-200 px-5 py-4 text-warm-800 placeholder-warm-400 focus:border-pastel-purple-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple-200 transition-all resize-none"
          />
          <div className="mt-3 flex justify-between text-sm text-warm-500">
            <span>{content.length} / {MAX_LENGTH} 文字</span>
          </div>
        </div>

        <div className="pt-4">
          {dailyPostCount !== null && dailyPostCount >= 10 && (
            <div className="mb-4 rounded-2xl bg-pastel-yellow-50 border border-pastel-yellow-300 p-4 text-sm text-warm-800">
              <p className="font-medium">1日の投稿数制限に達しています</p>
              <p className="mt-1 text-xs">今日は既に10件の投稿をしています。明日またお願いします。</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || content.trim().length === 0 || (dailyPostCount !== null && dailyPostCount >= 10) || checkingLimit}
            className="w-full rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-4 font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                投稿中...
              </span>
            ) : checkingLimit ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                確認中...
              </span>
            ) : dailyPostCount !== null && dailyPostCount >= 10 ? (
              <span>投稿制限に達しています</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                ✨ 投稿する
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

