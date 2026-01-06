import {
  getCollectionRef,
  createDocument,
  deleteDocument,
} from '../firebase/firestore';
import {
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Reaction, CreateReactionData } from '@/types/reaction';
import { PostService } from './post.service';
import { ReplyService } from './reply.service';
import { NotificationService } from './notification.service';

/**
 * リアクションサービス
 */
export class ReactionService {
  private static readonly COLLECTION_NAME = 'reactions';

  /**
   * ユーザーのリアクションを取得
   */
  static async getUserReaction(
    targetType: 'post' | 'reply',
    targetId: string,
    userId: string
  ): Promise<Reaction | null> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId),
        where('userId', '==', userId)
      )
    );

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as unknown as Reaction;
  }

  /**
   * リアクション数を取得
   */
  static async getReactionCounts(
    targetType: 'post' | 'reply',
    targetId: string
  ): Promise<Record<string, number>> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      )
    );

    const counts: Record<string, number> = {
      'ありがとう': 0,
      '心が温まった': 0,
      '応援してる': 0,
    };

    snapshot.docs.forEach((doc) => {
      const reaction = doc.data() as unknown as Reaction;
      counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1;
    });

    return counts;
  }

  /**
   * リアクションを作成
   */
  static async createReaction(data: CreateReactionData): Promise<string> {
    // 自分の投稿・返信にはリアクションできない
    if (data.targetType === 'post') {
      const post = await PostService.getPost(data.targetId);
      if (post && post.userId === data.userId) {
        throw new Error('自分の投稿にはリアクションできません。');
      }
    } else {
      const reply = await ReplyService.getReply(data.targetId);
      if (reply && reply.userId === data.userId) {
        throw new Error('自分の返信にはリアクションできません。');
      }
    }

    // 既存のリアクションを削除
    const existingReaction = await this.getUserReaction(
      data.targetType,
      data.targetId,
      data.userId
    );
    if (existingReaction) {
      await this.deleteReaction(existingReaction.reactionId);
    }

    const reactionId = `reaction_${data.targetType}_${data.targetId}_${data.userId}_${Date.now()}`;
    const reaction: Reaction = {
      reactionId,
      targetType: data.targetType,
      targetId: data.targetId,
      userId: data.userId,
      reactionType: data.reactionType,
      createdAt: Timestamp.now(),
    };

    await createDocument<Reaction>(this.COLLECTION_NAME, reactionId, reaction);

    // リアクション数を更新
    const counts = await this.getReactionCounts(data.targetType, data.targetId);
    if (data.targetType === 'post') {
      await PostService.updatePost(data.targetId, {
        reactionCount: Object.values(counts).reduce((sum, count) => sum + count, 0),
      });
    }

    // 通知を作成（非同期で実行）
    if (data.targetType === 'post') {
      const post = await PostService.getPost(data.targetId);
      if (post && post.userId !== data.userId) {
        NotificationService.createReactionNotification(
          post.userId,
          'post',
          data.targetId,
          data.reactionType
        ).catch((err) => {
          console.error('通知の作成に失敗:', err);
        });
      }
    } else {
      const reply = await ReplyService.getReply(data.targetId);
      if (reply && reply.userId !== data.userId) {
        NotificationService.createReactionNotification(
          reply.userId,
          'reply',
          data.targetId,
          data.reactionType
        ).catch((err) => {
          console.error('通知の作成に失敗:', err);
        });
      }
    }

    return reactionId;
  }

  /**
   * リアクションを削除
   */
  static async deleteReaction(reactionId: string): Promise<void> {
    await deleteDocument(this.COLLECTION_NAME, reactionId, true);
  }
}
