import { Metadata } from 'next';
import LoginForm from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'ログイン - 優しさの交換サイト',
  description: '優しさの交換サイトへようこそ。ログインして優しさを循環させましょう。',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">
              優しさの交換サイトへようこそ
            </h1>
            <p className="text-gray-600">
              心のモヤモヤを吐き出し、優しさを循環させましょう
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

