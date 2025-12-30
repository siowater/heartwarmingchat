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
  limit,
  getDocs,
  Timestamp,
  startAfter,
  DocumentSnapshot,
} from 'firebase/firestore';
import { Post, CreatePostData, UpdatePostData } from '@/types/post';
import { filterNGWords } from '../utils/ng-word-filter';
import { ReactionService } from './reaction.service';

/**
 * 投稿サービス
 */
export class PostService {
  private static readonly COLLECTION_NAME = 'posts';
  private static readonly MAX_POSTS_PER_DAY = 10;

  /**
   * 投稿を取得
   */
  static async getPost(postId: string): Promise<Post | null> {
    return await getDocument<Post>(this.COLLECTION_NAME, postId);
  }

  /**
   * 投稿一覧を取得（新着順）
   */
  static async getPosts(
    limitCount: number = 10,
    lastDoc?: DocumentSnapshot | null
  ): Promise<{ posts: Post[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
    let q = query(
      getCollectionRef(this.COLLECTION_NAME),
      where('isHidden', '==', false),
      orderBy('createdAt', 'desc'),
      limit(limitCount + 1)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;
    const hasMore = docs.length > limitCount;
    const posts = (hasMore ? docs.slice(0, limitCount) : docs).map(
      (doc) => ({ id: doc.id, ...doc.data() } as Post)
    );

    return {
      posts,
      lastDoc: hasMore ? docs[limitCount - 1] : null,
      hasMore,
    };
  }

  /**
   * ランダムな投稿を取得
   */
  static async getRandomPosts(limitCount: number = 10): Promise<Post[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('isHidden', '==', false),
        limit(100)
      )
    );

    const allPosts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];

    // ランダムに選択
    const shuffled = allPosts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limitCount);
  }

  /**
   * リアクション数順の投稿を取得
   */
  static async getPostsByReactions(limitCount: number = 10): Promise<Post[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('isHidden', '==', false),
        orderBy('reactionCount', 'desc'),
        limit(limitCount)
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  }

  /**
   * ユーザーの投稿一覧を取得
   */
  static async getUserPosts(userId: string): Promise<Post[]> {
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
    })) as Post[];
  }

  /**
   * 投稿を作成
   */
  static async createPost(data: CreatePostData): Promise<string> {
    console.log('[PostService.createPost] Starting post creation for user:', data.userId);
    
    // NGワードチェック
    console.log('[PostService.createPost] Checking NG words...');
    const filterResult = filterNGWords(data.content);
    if (!filterResult.passed) {
      console.error('[PostService.createPost] NG words detected:', filterResult.matchedWords);
      throw new Error('投稿内容に不適切な表現が含まれています。');
    }
    console.log('[PostService.createPost] NG words check passed');

    // 1日の投稿数制限チェック
    console.log('[PostService.createPost] Checking daily post limit...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = Timestamp.fromDate(today);

    try {
      const userPostsSnapshot = await getDocs(
        query(
          getCollectionRef(this.COLLECTION_NAME),
          where('userId', '==', data.userId),
          where('createdAt', '>=', todayStart),
          orderBy('createdAt', 'desc')
        )
      );
      console.log('[PostService.createPost] Daily post check completed, count:', userPostsSnapshot.size);

      if (userPostsSnapshot.size >= this.MAX_POSTS_PER_DAY) {
        throw new Error(`1日の投稿数は${this.MAX_POSTS_PER_DAY}件までです。`);
      }
    } catch (error: any) {
      console.error('[PostService.createPost] Error during daily post limit check:', error);
      console.error('[PostService.createPost] Error code:', error?.code);
      console.error('[PostService.createPost] Error message:', error?.message);
      throw error;
    }

    console.log('[PostService.createPost] Creating post object...');
    const postId = `post_${data.userId}_${Date.now()}`;
    const post: Post = {
      postId,
      userId: data.userId,
      content: data.content,
      isHidden: false,
      reportCount: 0,
      createdAt: Timestamp.now(),
    };

    try {
      console.log('[PostService.createPost] Creating post with data:', {
        postId,
        userId: post.userId,
        content: post.content.substring(0, 50) + '...',
        isHidden: post.isHidden,
        reportCount: post.reportCount,
        createdAt: post.createdAt?.toDate?.() || post.createdAt,
      });
      console.log('Current user:', data.userId);
      await createDocument<Post>(this.COLLECTION_NAME, postId, post);
      return postId;
    } catch (error: any) {
      console.error('PostService.createPost error:', error);
      console.error('Error code:', error?.code);
      console.error('Error message:', error?.message);
      console.error('Post data:', JSON.stringify(post, null, 2));
      console.error('PostId:', postId);
      throw error;
    }
  }

  /**
   * 投稿を更新
   */
  static async updatePost(postId: string, data: UpdatePostData): Promise<void> {
    await updateDocument(this.COLLECTION_NAME, postId, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * 投稿を削除
   */
  static async deletePost(postId: string): Promise<void> {
    await deleteDocument(this.COLLECTION_NAME, postId, true);
  }
}
