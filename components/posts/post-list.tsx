'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import { PostService } from '@/lib/services/post.service';
import { timestampToDate } from '@/lib/firebase/firestore';
import { useAuth } from '@/components/auth/auth-provider';
import { DocumentSnapshot } from 'firebase/firestore';

interface PostListProps {
  initialPosts?: Post[];
  sortType?: 'new' | 'random' | 'reactions';
}

export default function PostList({ initialPosts = [], sortType = 'new' }: PostListProps) {
  const { user } = useAuth();
  // initialPostsから重複を除去
  const uniqueInitialPosts = Array.from(
    new Map(initialPosts.map(p => [p.postId, p])).values()
  );
  const [posts, setPosts] = useState<Post[]>(uniqueInitialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      
      if (sortType === 'random') {
        const randomPosts = await PostService.getRandomPosts(10);
        // 重複を除去
        const uniquePosts = Array.from(
          new Map(randomPosts.map(p => [p.postId, p])).values()
        );
        setPosts(uniquePosts);
        setHasMore(false);
      } else if (sortType === 'reactions') {
        const reactionPosts = await PostService.getPostsByReactions(10);
        // 重複を除去
        const uniquePosts = Array.from(
          new Map(reactionPosts.map(p => [p.postId, p])).values()
        );
        setPosts(uniquePosts);
        setHasMore(false);
      } else {
        const result = await PostService.getPosts(10, lastDoc);
        setPosts((prev) => {
          // 重複を除去（postIdでユニークにする）
          const existingIds = new Set(prev.map(p => p.postId));
          const newPosts = result.posts.filter(p => !existingIds.has(p.postId));
          return [...prev, ...newPosts];
        });
        setLastDoc(result.lastDoc);
        setHasMore(result.posts.length === 10);
      }
    } catch (err) {
      console.error('投稿の取得に失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, sortType, lastDoc]);

  useEffect(() => {
    if (initialPosts.length === 0) {
      loadPosts();
    }
  }, [initialPosts.length, loadPosts]);


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
    
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="rounded-3xl bg-white p-8 md:p-12 text-center shadow-soft">
        <div className="mb-4 text-4xl">🌱</div>
        <p className="text-warm-600 mb-4">まだ投稿がありません。最初の投稿をしてみませんか？</p>
        {user && (
          <Link
            href="/posts/new"
            className="inline-block rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-3 font-medium text-white shadow-soft transition-all hover:shadow-soft-lg hover:scale-105 active:scale-95"
          >
            投稿する
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <Link
          key={post.postId}
          href={`/posts/${post.postId}`}
          className="block rounded-3xl bg-white p-5 md:p-6 shadow-soft transition-all hover:shadow-soft-lg hover:-translate-y-1 animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="mb-4">
            <p className="text-warm-800 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-warm-500">
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1">
              返信を見る
              <span className="text-pastel-purple-500">→</span>
            </span>
          </div>
        </Link>
      ))}

      {hasMore && sortType === 'new' && (
        <div className="text-center pt-4">
          <button
            onClick={loadPosts}
            disabled={loading}
            className="rounded-2xl border-2 border-pastel-purple-200 bg-white px-6 py-3 text-warm-700 font-medium transition-all hover:bg-pastel-purple-50 hover:border-pastel-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '読み込み中...' : 'もっと見る'}
          </button>
        </div>
      )}
    </div>
  );
}

