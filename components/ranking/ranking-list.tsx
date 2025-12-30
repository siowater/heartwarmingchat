'use client';

import { useEffect, useState, useCallback } from 'react';
import { Contribution } from '@/types/contribution';
import { ContributionService } from '@/lib/services/contribution.service';
import { useAuth } from '@/components/auth/auth-provider';
import { UserService } from '@/lib/services/user.service';

interface RankingListProps {
  initialRanking: Contribution[];
}

interface RankingItemData extends Contribution {
  nickname: string;
}

export default function RankingList({ initialRanking }: RankingListProps) {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingItemData[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userNickname, setUserNickname] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadRankingData = useCallback(async () => {
    try {
      setLoading(true);
      const rankingWithNicknames = await Promise.all(
        initialRanking.map(async (contribution) => {
          const userData = await UserService.getUser(contribution.userId);
          return {
            ...contribution,
            nickname: userData?.nickname || '匿名ユーザー',
          };
        })
      );
      setRanking(rankingWithNicknames);
    } catch (err) {
      console.error('ランキングデータの読み込みに失敗:', err);
    } finally {
      setLoading(false);
    }
  }, [initialRanking]);

  const loadUserRank = useCallback(async () => {
    if (!user) return;

    try {
      const rank = await ContributionService.getUserRank(user.uid);
      setUserRank(rank);

      const userData = await UserService.getUser(user.uid);
      if (userData) {
        setUserNickname(userData.nickname || '匿名ユーザー');
      }
    } catch (err) {
      console.error('ランキング情報の取得に失敗:', err);
    }
  }, [user]);

  useEffect(() => {
    loadRankingData();
    if (user) {
      loadUserRank();
    }
  }, [user, loadRankingData, loadUserRank]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}位`;
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">読み込み中...</div>
    );
  }

  return (
    <div className="space-y-4">
      {userRank !== null && (
        <div className="rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-6 shadow-sm">
          <p className="text-lg font-semibold text-gray-800">
            あなたの順位: <span className="text-purple-600">{userRank}位</span>
          </p>
          {userNickname && (
            <p className="mt-1 text-sm text-gray-600">ニックネーム: {userNickname}</p>
          )}
        </div>
      )}

      {ranking.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">まだランキングデータがありません。</p>
        </div>
      ) : (
        <div className="space-y-2">
          {ranking.map((item, index) => (
            <div key={item.userId} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {getRankIcon(index + 1)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.nickname}</p>
                    <p className="text-sm text-gray-500">貢献スコア: {Math.round(item.contributionScore)}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>返信: {item.replyCount}件</p>
                  <p>リアクション: {item.reactionCount}件</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

