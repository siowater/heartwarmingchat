'use client';

import { Reply } from '@/types/reply';
import { timestampToDate } from '@/lib/firebase/firestore';
import ReactionButtons from './reaction-buttons';
import ReportButton from '@/components/reports/report-button';
import { useState, useEffect, useCallback } from 'react';
import { ReactionService } from '@/lib/services/reaction.service';

interface ReplyListProps {
  replies: Reply[];
  onReactionChange?: () => void;
}

export default function ReplyList({ replies, onReactionChange }: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
        <p className="text-gray-600">まだ返信がありません。最初の返信をしてみませんか？</p>
      </div>
    );
  }

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    const date = timestampToDate(timestamp);
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

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <ReplyItem
          key={reply.replyId}
          reply={reply}
          formatDate={formatDate}
          onReactionChange={onReactionChange}
        />
      ))}
    </div>
  );
}

function ReplyItem({
  reply,
  formatDate,
  onReactionChange,
}: {
  reply: Reply;
  formatDate: (timestamp: unknown) => string;
  onReactionChange?: () => void;
}) {
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    'ありがとう': 0,
    '心が温まった': 0,
    '応援してる': 0,
  });

  const loadReactionCounts = useCallback(async () => {
    try {
      const counts = await ReactionService.getReactionCounts('reply', reply.replyId);
      setReactionCounts(counts);
    } catch (err) {
      console.error('リアクション数の取得に失敗:', err);
    }
  }, [reply.replyId]);

  useEffect(() => {
    // 非同期関数を呼び出す（コールバック内で実行）
    const fetchCounts = async () => {
      await loadReactionCounts();
    };
    void fetchCounts();
  }, [loadReactionCounts]);

  const handleReactionChange = () => {
    loadReactionCounts();
    if (onReactionChange) {
      onReactionChange();
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap break-words">
          {reply.content}
        </p>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{formatDate(reply.createdAt)}</span>
        <ReportButton targetType="reply" targetId={reply.replyId} />
      </div>
      <ReactionButtons
        targetType="reply"
        targetId={reply.replyId}
        initialCounts={reactionCounts}
        onReactionChange={handleReactionChange}
        ownerUserId={reply.userId}
      />
    </div>
  );
}

