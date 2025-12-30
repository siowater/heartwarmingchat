'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { showToast } from '@/components/ui/toast';

type ContactCategory = 'question' | 'bug' | 'suggestion' | 'other';

export default function ContactForm() {
  const { user } = useAuth();
  const [category, setCategory] = useState<ContactCategory>('question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!subject.trim()) {
      showToast('件名を入力してください。', 'error');
      return;
    }

    if (!message.trim()) {
      showToast('お問い合わせ内容を入力してください。', 'error');
      return;
    }

    if (message.length > 2000) {
      showToast('お問い合わせ内容は2000文字以内で入力してください。', 'error');
      return;
    }

    if (!email.trim() && !user) {
      showToast('メールアドレスを入力してください。', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      // 実際の実装では、ここでFirebase FunctionsやAPI Routesに送信
      // 今回は簡易的にコンソールに出力
      const contactData = {
        category,
        subject: subject.trim(),
        message: message.trim(),
        email: email.trim() || (user?.email || ''),
        userId: user?.uid || null,
        createdAt: new Date().toISOString(),
      };

      console.log('お問い合わせ内容:', contactData);

      // 実際の実装例（コメントアウト）:
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactData),
      // });

      showToast('お問い合わせを受け付けました。ありがとうございます。', 'success');

      // フォームをリセット
      setCategory('question');
      setSubject('');
      setMessage('');
      setEmail('');
    } catch (err) {
      console.error('お問い合わせの送信に失敗:', err);
      showToast('お問い合わせの送信に失敗しました。もう一度お試しください。', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels: Record<ContactCategory, string> = {
    question: '質問・お問い合わせ',
    bug: '不具合報告',
    suggestion: 'ご意見・ご要望',
    other: 'その他',
  };

  return (
    <div className="rounded-3xl bg-white p-6 md:p-8 shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-warm-700 mb-2">
            カテゴリ
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ContactCategory)}
            className="w-full rounded-2xl border-2 border-warm-200 px-4 py-3 text-warm-800 focus:border-pastel-purple-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple-200"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-warm-700 mb-2">
            件名 <span className="text-pastel-pink-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="件名を入力してください"
            maxLength={100}
            required
            className="w-full rounded-2xl border-2 border-warm-200 px-4 py-3 text-warm-800 placeholder-warm-400 focus:border-pastel-purple-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple-200"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-warm-700 mb-2">
            お問い合わせ内容 <span className="text-pastel-pink-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="お問い合わせ内容を詳しくご記入ください"
            rows={8}
            maxLength={2000}
            required
            className="w-full rounded-2xl border-2 border-warm-200 px-4 py-3 text-warm-800 placeholder-warm-400 focus:border-pastel-purple-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple-200 resize-none"
          />
          <p className="mt-2 text-sm text-warm-500">
            {message.length} / 2000 文字
          </p>
        </div>

        {!user && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-2">
              メールアドレス <span className="text-pastel-pink-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-2xl border-2 border-warm-200 px-4 py-3 text-warm-800 placeholder-warm-400 focus:border-pastel-purple-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple-200"
            />
            <p className="mt-2 text-sm text-warm-500">
              返信が必要な場合は、メールアドレスをご入力ください。
            </p>
          </div>
        )}

        {user && (
          <div className="rounded-2xl bg-pastel-blue-50 p-4">
            <p className="text-sm text-warm-700">
              ログイン中のため、アカウント情報を使用します。
              {user.email && (
                <span className="block mt-1 font-medium">メールアドレス: {user.email}</span>
              )}
            </p>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-4 font-medium text-white shadow-soft transition-all hover:shadow-soft-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                送信中...
              </span>
            ) : (
              '送信する'
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-warm-200">
          <p className="text-xs text-warm-500">
            ※ お問い合わせへの返信には数日かかる場合があります。ご了承ください。
            <br />
            ※ 緊急の場合は、直接メールでご連絡ください。
          </p>
        </div>
      </form>
    </div>
  );
}

