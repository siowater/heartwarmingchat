import { Timestamp } from 'firebase/firestore';

/**
 * 通報理由
 */
export type ReportReason = '不適切な内容' | 'スパム・宣伝' | '誹謗中傷' | 'その他';

/**
 * 通報エンティティ
 */
export interface Report {
  reportId: string;
  reporterUserId: string;
  targetType: 'post' | 'reply';
  targetId: string;
  reason: ReportReason;
  details?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: Timestamp;
}

/**
 * 通報作成時のデータ
 */
export interface CreateReportData {
  reporterUserId: string;
  targetType: 'post' | 'reply';
  targetId: string;
  reason: ReportReason;
  details?: string;
}

