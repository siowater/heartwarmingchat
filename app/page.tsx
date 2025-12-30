import { Metadata } from 'next';
import Navbar from '@/components/layout/navbar';
import PostListWithSort from '@/components/posts/post-list-with-sort';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '優しさの交換サイト',
  description: '心のモヤモヤを吐き出し、優しさを循環させるプラットフォーム',
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pastel-pink-50 via-pastel-purple-50 to-pastel-blue-50">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-warm-800">投稿一覧</h1>
            <p className="mt-2 text-warm-600">優しさを循環させましょう 🌿</p>
          </div>
          <Link
            href="/posts/new"
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-pastel-pink-400 to-pastel-purple-500 px-6 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            ✨ 投稿する
          </Link>
        </div>
        <PostListWithSort />
      </main>
    </div>
  );
}
