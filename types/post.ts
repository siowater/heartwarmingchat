import { Timestamp } from 'firebase/firestore';

/**
 * 投稿エンティティ
 */
export interface Post {
  postId: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
  archivedAt?: Timestamp;
  reportCount: number;
  isHidden: boolean;
  filterResult?: {
    passed: boolean;
    matchedWords?: string[];
  };
}

/**
 * 投稿作成時のデータ
 */
export interface CreatePostData {
  userId: string;
  content: string;
  filterResult?: {
    passed: boolean;
    matchedWords?: string[];
  };
}

/**
 * 投稿更新時のデータ
 */
export interface UpdatePostData {
  content?: string;
  isHidden?: boolean;
  reportCount?: number;
}

