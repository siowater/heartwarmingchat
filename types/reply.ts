import { Timestamp } from 'firebase/firestore';

/**
 * 返信エンティティ
 */
export interface Reply {
  replyId: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
  reportCount: number;
  isHidden: boolean;
  filterResult?: {
    passed: boolean;
    matchedWords?: string[];
  };
}

/**
 * 返信作成時のデータ
 */
export interface CreateReplyData {
  postId: string;
  userId: string;
  content: string;
  filterResult?: {
    passed: boolean;
    matchedWords?: string[];
  };
}

/**
 * 返信更新時のデータ
 */
export interface UpdateReplyData {
  content?: string;
  isHidden?: boolean;
  reportCount?: number;
}

