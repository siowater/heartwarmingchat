import { Timestamp } from 'firebase/firestore';

/**
 * 貢献度エンティティ
 */
export interface Contribution {
  userId: string;
  replyCount: number;
  reactionCount: number;
  receivedReactionCount: number;
  contributionScore: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

