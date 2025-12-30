import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-warm-200 bg-white/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-warm-600">
            <p>© 2024 優しさの交換サイト</p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link
              href="/terms"
              className="text-sm text-warm-600 hover:text-pastel-purple-600 transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-warm-600 hover:text-pastel-purple-600 transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/contact"
              className="text-sm text-warm-600 hover:text-pastel-purple-600 transition-colors"
            >
              お問い合わせ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

