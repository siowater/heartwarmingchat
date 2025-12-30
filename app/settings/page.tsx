import { Metadata } from 'next';
import SettingsForm from '@/components/settings/settings-form';

export const metadata: Metadata = {
  title: '設定 - 優しさの交換サイト',
  description: 'ユーザー設定を変更できます。',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">設定</h1>
        <p className="mt-2 text-gray-600">ユーザー情報を管理できます</p>
      </div>
      <SettingsForm />
    </div>
  );
}

