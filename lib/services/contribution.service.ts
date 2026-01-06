import {
  getCollectionRef,
  getDocument,
  updateDocument,
} from '../firebase/firestore';
import {
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Contribution } from '@/types/contribution';
import { ReplyService } from './reply.service';
import { ReactionService } from './reaction.service';
import { PostService } from './post.service';

/**
 * 貢献度サービス
 */
export class ContributionService {
  private static readonly COLLECTION_NAME = 'contributions';

  /**
   * 貢献度を取得
   */
  static async getContribution(userId: string): Promise<Contribution | null> {
    return await getDocument<Contribution>(this.COLLECTION_NAME, userId);
  }

  /**
   * 貢献度を更新
   */
  static async updateContribution(userId: string): Promise<void> {
    // ユーザーが送った返信数を取得
    const replies = await ReplyService.getUserReplies(userId);
    const replyCount = replies.length;

    // ユーザーが送ったリアクション数を取得
    const reactions = await this.getUserSentReactions(userId);
    const reactionCount = reactions.length;

    // ユーザーが受け取ったリアクション数を取得
    const receivedReactions = await this.getUserReceivedReactions(userId);
    const receivedReactionCount = receivedReactions.length;

    // 貢献スコアを計算
    const contributionScore =
      replyCount * 2 + reactionCount * 1 + receivedReactionCount * 0.5;

    const contribution: Contribution = {
      userId,
      contributionScore,
      replyCount,
      reactionCount,
      receivedReactionCount,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await updateDocument(this.COLLECTION_NAME, userId, contribution as unknown as Partial<Record<string, unknown>>);
  }

  /**
   * ユーザーが送ったリアクション一覧を取得
   */
  private static async getUserSentReactions(userId: string): Promise<Array<{ id: string; [key: string]: unknown }>> {
    const snapshot = await getDocs(
      query(
        getCollectionRef('reactions'),
        where('userId', '==', userId)
      )
    );

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * ユーザーが受け取ったリアクション一覧を取得
   */
  private static async getUserReceivedReactions(userId: string): Promise<Array<{ id: string; [key: string]: unknown }>> {
    const receivedReactions: Array<{ id: string; [key: string]: unknown }> = [];

    // 投稿に対するリアクション
    const userPosts = await PostService.getUserPosts(userId);
    for (const post of userPosts) {
      const reactions = await ReactionService.getReactionCounts('post', post.postId);
      const count = Object.values(reactions).reduce((sum, c) => sum + c, 0);
      if (count > 0) {
        receivedReactions.push({ id: post.postId, count });
      }
    }

    // 返信に対するリアクション
    const userReplies = await ReplyService.getUserReplies(userId);
    for (const reply of userReplies) {
      const reactions = await ReactionService.getReactionCounts('reply', reply.replyId);
      const count = Object.values(reactions).reduce((sum, c) => sum + c, 0);
      if (count > 0) {
        receivedReactions.push({ id: reply.replyId, count });
      }
    }

    return receivedReactions;
  }

  /**
   * ユーザーのランクを取得
   */
  static async getUserRank(userId: string): Promise<number> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        orderBy('contributionScore', 'desc')
      )
    );

    const contributions = snapshot.docs.map((doc) => doc.data() as unknown as Contribution);
    const index = contributions.findIndex((c) => c.userId === userId);
    return index >= 0 ? index + 1 : 0;
  }

  /**
   * トップ貢献者を取得
   */
  static async getTopContributors(limitCount: number = 10): Promise<Contribution[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        orderBy('contributionScore', 'desc'),
        limit(limitCount)
      )
    );

    return snapshot.docs.map((doc) => doc.data() as unknown as Contribution);
  }

  /**
   * ランキングを取得（getTopContributorsのエイリアス）
   */
  static async getRanking(limitCount: number = 10): Promise<Contribution[]> {
    return this.getTopContributors(limitCount);
  }
}
