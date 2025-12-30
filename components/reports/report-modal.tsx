'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { ReportService } from '@/lib/services/report.service';
import { ReportReason } from '@/types/report';

interface ReportModalProps {
  targetType: 'post' | 'reply';
  targetId: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: ReportReason[] = ['不適切な内容', 'スパム・宣伝', '誹謗中傷', 'その他'];

export default function ReportModal({
  targetType,
  targetId,
  isOpen,
  onClose,
}: ReportModalProps) {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    if (!selectedReason) {
      setError('通報理由を選択してください。');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await ReportService.createReport({
        reporterUserId: user.uid,
        targetType,
        targetId,
        reason: selectedReason as ReportReason,
        details: details.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedReason('');
        setDetails('');
      }, 2000);
    } catch (err: unknown) {
      console.error('通報の送信に失敗:', err);
      setError(err instanceof Error ? err.message : '通報の送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">通報する</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <div className="mb-4 text-4xl">✅</div>
            <p className="text-lg font-medium text-gray-800">
              通報を受け付けました
            </p>
            <p className="mt-2 text-sm text-gray-600">
              ご報告ありがとうございます。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                通報理由を選択してください
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value as ReportReason)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                詳細説明（任意）
              </label>
              <textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="詳細があれば記入してください"
                rows={3}
                maxLength={500}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                {details.length} / 500 文字
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedReason}
                className="flex-1 rounded-xl bg-red-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '送信中...' : '通報する'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

