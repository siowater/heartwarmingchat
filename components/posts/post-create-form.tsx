'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { PostService } from '@/lib/services/post.service';
import { showToast } from '@/components/ui/toast';

const MAX_LENGTH = 1000;

export default function PostCreateForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className="w-full rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-4 font-medium text-white shadow-soft transition-all hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              投稿中...
            </span>
          ) : (
            '投稿する'
          )}
        </button>
      </form>
    </div>
  );
}

