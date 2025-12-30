import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-800">投稿が見つかりません</h1>
        <p className="mb-8 text-gray-600">
          お探しの投稿は存在しないか、削除された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 px-6 py-3 font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

