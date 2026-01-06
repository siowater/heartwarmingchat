import {
  getCollectionRef,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../firebase/firestore';
import {
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Reply, CreateReplyData, UpdateReplyData } from '@/types/reply';
import { filterNGWords } from '../utils/ng-word-filter';
import { PostService } from './post.service';
import { NotificationService } from './notification.service';

/**
 * 返信サービス
 */
export class ReplyService {
  private static readonly COLLECTION_NAME = 'replies';
  private static readonly MAX_REPLIES_PER_POST = 1;
  private static readonly MAX_REPLIES_PER_USER = 5;

  /**
   * 返信を取得
   */
  static async getReply(replyId: string): Promise<Reply | null> {
    return await getDocument<Reply>(this.COLLECTION_NAME, replyId);
  }

  /**
   * 投稿に対する返信一覧を取得
   */
  static async getRepliesByPostId(postId: string): Promise<Reply[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('postId', '==', postId),
        where('isHidden', '==', false),
        orderBy('createdAt', 'asc')
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as Reply[];
  }

  /**
   * ユーザーの返信一覧を取得
   */
  static async getUserReplies(userId: string): Promise<Reply[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('userId', '==', userId),
        where('isHidden', '==', false),
        orderBy('createdAt', 'desc')
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as unknown as Reply[];
  }

  /**
   * 返信を作成
   */
  static async createReply(data: CreateReplyData): Promise<string> {
    // 投稿を取得
    const post = await PostService.getPost(data.postId);
    if (!post) {
      throw new Error('投稿が見つかりません。');
    }

    // 自分の投稿には返信できない
    if (post.userId === data.userId) {
      throw new Error('自分の投稿には返信できません。');
    }

    // NGワードチェック
    const filterResult = filterNGWords(data.content);
    if (!filterResult.passed) {
      throw new Error('返信内容に不適切な表現が含まれています。');
    }

    // 1投稿1ユーザー1件の制限チェック
    const existingRepliesSnapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('postId', '==', data.postId),
        where('userId', '==', data.userId)
      )
    );

    if (existingRepliesSnapshot.size >= this.MAX_REPLIES_PER_POST) {
      throw new Error('この投稿には既に返信済みです。');
    }

    // 1ユーザー1日5件の制限チェック
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = Timestamp.fromDate(today);

    const userRepliesSnapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('userId', '==', data.userId),
        where('createdAt', '>=', todayStart),
        orderBy('createdAt', 'desc')
      )
    );

    if (userRepliesSnapshot.size >= this.MAX_REPLIES_PER_USER) {
      throw new Error(`1日の返信数は${this.MAX_REPLIES_PER_USER}件までです。`);
    }

    const replyId = `reply_${data.postId}_${data.userId}_${Date.now()}`;
    const reply: Reply = {
      replyId,
      postId: data.postId,
      userId: data.userId,
      content: data.content,
      isHidden: false,
      reportCount: 0,
      createdAt: Timestamp.now(),
    };

    await createDocument<Reply>(this.COLLECTION_NAME, replyId, reply);

    // 貢献度を更新（非同期で実行）
    const { ContributionService } = await import('./contribution.service');
    ContributionService.updateContribution(data.userId).catch((err) => {
      console.error('貢献度の更新に失敗:', err);
    });

    // 通知を作成（非同期で実行）
    NotificationService.createReplyNotification(data.postId, replyId).catch((err) => {
      console.error('通知の作成に失敗:', err);
    });

    return replyId;
  }

  /**
   * 返信を更新
   */
  static async updateReply(replyId: string, data: UpdateReplyData): Promise<void> {
    await updateDocument(this.COLLECTION_NAME, replyId, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * 返信を削除
   */
  static async deleteReply(replyId: string): Promise<void> {
    await deleteDocument(this.COLLECTION_NAME, replyId, true);
  }
}
