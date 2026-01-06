import { Metadata } from 'next';
import PostDetail from '@/components/posts/post-detail';
import { PostService } from '@/lib/services/post.service';
import { notFound } from 'next/navigation';
import { Post } from '@/types/post';
import { timestampToDate } from '@/lib/firebase/firestore';

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await PostService.getPost(postId);

  if (!post) {
    return {
      title: '投稿が見つかりません - 優しさの交換サイト',
    };
  }

  const preview = post.content ? post.content.substring(0, 100) : '投稿';
  return {
    title: `${preview}... - 優しさの交換サイト`,
    description: preview,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;
  const post = await PostService.getPost(postId);

  if (!post || post.isHidden) {
    notFound();
  }

  // Timestampオブジェクトをシリアライズ可能な形式に変換
  const serializedPost: Omit<Post, 'createdAt' | 'updatedAt' | 'deletedAt' | 'archivedAt'> & {
    createdAt: string | Date;
    updatedAt?: string | Date;
    deletedAt?: string | Date;
    archivedAt?: string | Date;
  } = {
    ...post,
    createdAt: timestampToDate(post.createdAt) || new Date(), // Dateオブジェクトに変換
    updatedAt: post.updatedAt ? timestampToDate(post.updatedAt) || undefined : undefined,
    deletedAt: post.deletedAt ? timestampToDate(post.deletedAt) || undefined : undefined,
    archivedAt: post.archivedAt ? timestampToDate(post.archivedAt) || undefined : undefined,
  };

  return <PostDetail post={serializedPost as unknown as Post} />;
}

