'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import { Reply } from '@/types/reply';
import { ReplyService } from '@/lib/services/reply.service';
import { ReactionService } from '@/lib/services/reaction.service';
import { timestampToDate } from '@/lib/firebase/firestore';
import { useAuth } from '@/components/auth/auth-provider';
import ReplyForm from './reply-form';
import ReplyList from './reply-list';
import ReactionButtons from './reaction-buttons';
import ReportButton from '@/components/reports/report-button';

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    'ありがとう': 0,
    '心が温まった': 0,
    '応援してる': 0,
  });

  const loadReplies = useCallback(async () => {
    try {
      setLoading(true);
      const loadedReplies = await ReplyService.getRepliesByPostId(post.postId);
      setReplies(loadedReplies);
    } catch (err) {
      console.error('返信の取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [post.postId]);

  const loadReactionCounts = useCallback(async () => {
    try {
      const counts = await ReactionService.getReactionCounts('post', post.postId);
      setReactionCounts(counts);
    } catch (err) {
      console.error('リアクション数の取得に失敗:', err);
    }
  }, [post.postId]);

  useEffect(() => {
    loadReplies();
    loadReactionCounts();
  }, [loadReplies, loadReactionCounts]);


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
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-pastel-purple-600 hover:text-pastel-purple-800 transition-colors"
        >
          ← ホームに戻る
        </Link>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm mb-6">
        <div className="mb-4">
          <p className="text-gray-800 whitespace-pre-wrap break-words text-lg">
            {post.content}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{formatDate(post.createdAt)}</span>
          <ReportButton targetType="post" targetId={post.postId} />
        </div>
        <ReactionButtons
          targetType="post"
          targetId={post.postId}
          initialCounts={reactionCounts}
          onReactionChange={loadReactionCounts}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          優しい言葉を届けましょう
        </h2>
        {user ? (
          <ReplyForm postId={post.postId} onReplyCreated={loadReplies} />
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-gray-600 mb-4">返信するにはログインが必要です。</p>
            <a
              href="/login"
              className="inline-block rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg"
            >
              ログインする
            </a>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          返信 ({replies.length})
        </h2>
        {loading ? (
          <div className="text-center py-8 text-gray-600">読み込み中...</div>
        ) : (
          <ReplyList replies={replies} onReactionChange={loadReactionCounts} />
        )}
      </div>
    </div>
  );
}

