'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { ReactionService } from '@/lib/services/reaction.service';
import { ReactionType } from '@/types/reaction';
import { showToast } from '@/components/ui/toast';

interface ReactionButtonsProps {
  targetType: 'post' | 'reply';
  targetId: string;
  initialCounts: Record<string, number>;
  onReactionChange?: () => void;
  ownerUserId?: string; // 投稿/返信の所有者ID（自分の投稿/返信の場合は無効化）
}

const REACTION_TYPES: ReactionType[] = ['ありがとう', '心が温まった', '応援してる'];

export default function ReactionButtons({
  targetType,
  targetId,
  initialCounts,
  onReactionChange,
  ownerUserId,
}: ReactionButtonsProps) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [loading, setLoading] = useState(false);
  
  // 自分の投稿/返信かどうかをチェック
  const isOwnContent = user && ownerUserId && user.uid === ownerUserId;

  useEffect(() => {
    setCounts(initialCounts);
  }, [initialCounts]);

  const loadUserReaction = useCallback(async () => {
    if (!user) return;

    try {
      const reaction = await ReactionService.getUserReaction(targetType, targetId, user.uid);
      setUserReaction(reaction?.reactionType || null);
    } catch (err) {
      console.error('リアクションの取得に失敗:', err);
    }
  }, [user, targetType, targetId]);

  useEffect(() => {
    if (user) {
      void loadUserReaction();
    } else {
      setUserReaction(null);
    }
  }, [user, loadUserReaction]);

  const handleReaction = async (reactionType: ReactionType) => {
    if (!user) {
      return;
    }

    // 自分の投稿/返信にはリアクションできない
    if (isOwnContent) {
      showToast('自分の投稿・返信にはリアクションできません。', 'error');
      return;
    }

    try {
      setLoading(true);

      // 既に同じリアクションをしている場合は削除
      if (userReaction === reactionType) {
        const reaction = await ReactionService.getUserReaction(targetType, targetId, user.uid);
        if (reaction) {
          await ReactionService.deleteReaction(reaction.reactionId);
          setUserReaction(null);
          setCounts((prev) => ({
            ...prev,
            [reactionType]: Math.max(0, prev[reactionType] - 1),
          }));
        }
      } else {
        // 既存のリアクションを削除
        if (userReaction) {
          const reaction = await ReactionService.getUserReaction(targetType, targetId, user.uid);
          if (reaction) {
            await ReactionService.deleteReaction(reaction.reactionId);
            setCounts((prev) => ({
              ...prev,
              [userReaction]: Math.max(0, prev[userReaction] - 1),
            }));
          }
        }

        // 新しいリアクションを作成
        await ReactionService.createReaction({
          targetType,
          targetId,
          userId: user.uid,
          reactionType,
        });

        setUserReaction(reactionType);
        setCounts((prev) => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1,
        }));
        
        showToast('リアクションを送りました。', 'success');
      }

      if (onReactionChange) {
        onReactionChange();
      }
    } catch (err: unknown) {
      console.error('リアクションの処理に失敗:', err);
      const errorMessage = err instanceof Error ? err.message : 'リアクションの送信に失敗しました。';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_TYPES.map((reactionType) => {
        const isActive = userReaction === reactionType;
        const count = counts[reactionType] || 0;

        return (
          <button
            key={reactionType}
            onClick={() => handleReaction(reactionType)}
            disabled={loading || !user || isOwnContent}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {reactionType}
            {count > 0 && (
              <span className="ml-2 text-xs opacity-75">({count})</span>
            )}
          </button>
        );
      })}
      {!user && (
        <span className="text-xs text-gray-500 self-center">
          ログインしてリアクションを送りましょう
        </span>
      )}
      {isOwnContent && user && (
        <span className="text-xs text-gray-500 self-center">
          自分の投稿・返信にはリアクションできません
        </span>
      )}
    </div>
  );
}

