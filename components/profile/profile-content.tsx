'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Contribution } from '@/types/contribution';
import { Post } from '@/types/post';
import { Reply } from '@/types/reply';
import { UserService } from '@/lib/services/user.service';
import { ContributionService } from '@/lib/services/contribution.service';
import { PostService } from '@/lib/services/post.service';
import { ReplyService } from '@/lib/services/reply.service';
import { useAuth } from '@/components/auth/auth-provider';
import { User } from '@/types/user';
import { timestampToDate } from '@/lib/firebase/firestore';
import Link from 'next/link';

interface ProfileContentProps {
  userId: string;
  contribution: Contribution | null;
  posts: Post[];
  replies: Reply[];
}

export default function ProfileContent({
  userId: _userId,
  contribution: initialContribution,
  posts: initialPosts,
  replies: initialReplies,
}: ProfileContentProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [contribution, setContribution] = useState<Contribution | null>(initialContribution);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // 貢献度を更新
      await ContributionService.updateContribution(user.uid);

      // データを取得
      const [contributionData, postsData, repliesData] = await Promise.all([
        ContributionService.getContribution(user.uid),
        PostService.getUserPosts(user.uid),
        ReplyService.getUserReplies(user.uid),
      ]);

      setContribution(contributionData);
      setPosts(postsData);
      setReplies(repliesData);
    } catch (err) {
      console.error('プロフィールデータの取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await UserService.getUser(user.uid);
      setUserData(data);
    } catch (err) {
      console.error('ユーザー情報の取得に失敗:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadUserData();
      loadProfileData();
    }
  }, [user, authLoading, router, loadUserData, loadProfileData]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return '';
    const date = timestampToDate(timestamp);
    if (!date) return '';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="text-center py-12 text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">マイページ</h1>
        <p className="mt-2 text-gray-600">あなたの投稿履歴と貢献度</p>
      </div>

      {/* ユーザー情報 */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">ユーザー情報</h2>
        <div className="space-y-2">
          <p className="text-gray-700">
            <span className="font-medium">ニックネーム:</span>{' '}
            {userData?.nickname || '未設定'}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">認証プロバイダー:</span>{' '}
            {userData?.authProvider === 'google' && 'Google'}
            {userData?.authProvider === 'twitter' && 'Twitter'}
            {userData?.authProvider === 'anonymous' && '匿名'}
          </p>
        </div>
      </div>

      {/* 貢献度 */}
      {contribution && (
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">貢献度</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">貢献スコア</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(contribution.contributionScore)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">返信数</p>
              <p className="text-2xl font-bold text-gray-800">{contribution.replyCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">送ったリアクション</p>
              <p className="text-2xl font-bold text-gray-800">{contribution.reactionCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">受け取ったリアクション</p>
              <p className="text-2xl font-bold text-gray-800">
                {contribution.receivedReactionCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 投稿履歴 */}
      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          投稿履歴 ({posts.length}件)
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">まだ投稿がありません。</p>
        ) : (
          <div className="space-y-3">
            {posts.slice(0, 10).map((post) => (
              <Link
                key={post.postId}
                href={`/posts/${post.postId}`}
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <p className="text-gray-800 line-clamp-2">{post.content}</p>
                <p className="mt-2 text-sm text-gray-500">{formatDate(post.createdAt)}</p>
              </Link>
            ))}
            {posts.length > 10 && (
              <p className="text-sm text-gray-500">他 {posts.length - 10} 件の投稿があります</p>
            )}
          </div>
        )}
      </div>

      {/* 返信履歴 */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          返信履歴 ({replies.length}件)
        </h2>
        {replies.length === 0 ? (
          <p className="text-gray-600">まだ返信がありません。</p>
        ) : (
          <div className="space-y-3">
            {replies.slice(0, 10).map((reply) => (
              <Link
                key={reply.replyId}
                href={`/posts/${reply.postId}`}
                className="block rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
              >
                <p className="text-gray-800 line-clamp-2">{reply.content}</p>
                <p className="mt-2 text-sm text-gray-500">{formatDate(reply.createdAt)}</p>
              </Link>
            ))}
            {replies.length > 10 && (
              <p className="text-sm text-gray-500">他 {replies.length - 10} 件の返信があります</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

