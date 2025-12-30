import { Timestamp } from 'firebase/firestore';

/**
 * リアクションタイプ
 */
export type ReactionType = 'ありがとう' | '心が温まった' | '応援してる';

/**
 * リアクションエンティティ
 */
export interface Reaction {
  reactionId: string;
  targetType: 'post' | 'reply';
  targetId: string;
  userId: string;
  reactionType: ReactionType;
  createdAt: Timestamp;
}

/**
 * リアクション作成時のデータ
 */
export interface CreateReactionData {
  targetType: 'post' | 'reply';
  targetId: string;
  userId: string;
  reactionType: ReactionType;
}

