import { Metadata } from 'next';
import PostCreateForm from '@/components/posts/post-create-form';

export const metadata: Metadata = {
  title: '投稿を作成 - 優しさの交換サイト',
  description: '心のモヤモヤをそっと置いてみませんか？',
};

export default function NewPostPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">心のモヤモヤをそっと置く</h1>
        <p className="mt-2 text-gray-600">今、感じていることを自由に書いてください</p>
      </div>
      <PostCreateForm />
    </div>
  );
}

