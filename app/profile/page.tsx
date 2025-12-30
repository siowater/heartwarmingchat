import { Metadata } from 'next';
import ProfileContent from '@/components/profile/profile-content';

export const metadata: Metadata = {
  title: 'マイページ - 優しさの交換サイト',
  description: 'あなたの投稿履歴と貢献度を確認できます',
};

export default function ProfilePage() {
  // クライアント側で認証チェックを行うため、ここではデータ取得を行わない
  return <ProfileContent userId="" contribution={null} posts={[]} replies={[]} />;
}

