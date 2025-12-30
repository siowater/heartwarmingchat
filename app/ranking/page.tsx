import { Metadata } from 'next';
import RankingList from '@/components/ranking/ranking-list';
import { ContributionService } from '@/lib/services/contribution.service';

export const metadata: Metadata = {
  title: 'ランキング - 優しさの交換サイト',
  description: '優しさの貢献度ランキング',
};

export default async function RankingPage() {
  const ranking = await ContributionService.getRanking(50);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">優しさの貢献度ランキング</h1>
        <p className="mt-2 text-gray-600">多くの優しさを届けているユーザーを紹介します</p>
      </div>
      <RankingList initialRanking={ranking} />
    </div>
  );
}

