import { Metadata } from 'next';
import PostDetail from '@/components/posts/post-detail';
import { PostService } from '@/lib/services/post.service';
import { notFound } from 'next/navigation';

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

  const preview = post.content.substring(0, 100);
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

  return <PostDetail post={post} />;
}

