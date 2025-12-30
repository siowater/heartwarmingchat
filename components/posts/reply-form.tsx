'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { ReplyService } from '@/lib/services/reply.service';
import { showToast } from '@/components/ui/toast';

interface ReplyFormProps {
  postId: string;
  onReplyCreated: () => void;
}

const MAX_LENGTH = 500;

export default function ReplyForm({ postId, onReplyCreated }: ReplyFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    // バリデーション
    if (content.trim().length === 0) {
      setError('返信内容を入力してください。');
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`返信内容は${MAX_LENGTH}文字以内で入力してください。（現在: ${content.length}文字）`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await ReplyService.createReply({
        postId,
        userId: user.uid,
        content: content.trim(),
      });

      showToast('返信を送りました。ありがとうございます。', 'success');

      // 成功時はフォームをクリアして再読み込み
      setContent('');
      onReplyCreated();
    } catch (err: unknown) {
      console.error('返信の作成に失敗:', err);
      const errorMessage = err instanceof Error ? err.message : '返信の保存に失敗しました。もう一度お試しください。';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
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
            placeholder="優しい言葉を届けましょう..."
            maxLength={MAX_LENGTH}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>{content.length} / {MAX_LENGTH} 文字</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || content.trim().length === 0}
          className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '返信する'}
        </button>
      </form>
    </div>
  );
}

