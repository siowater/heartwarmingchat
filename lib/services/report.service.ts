import {
  getCollectionRef,
  getDocument,
  createDocument,
} from '../firebase/firestore';
import {
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Report, CreateReportData } from '@/types/report';
import { PostService } from './post.service';
import { ReplyService } from './reply.service';

/**
 * 通報サービス
 */
export class ReportService {
  private static readonly COLLECTION_NAME = 'reports';
  private static readonly AUTO_HIDE_THRESHOLD = 5;

  /**
   * 通報を作成
   */
  static async createReport(data: CreateReportData): Promise<string> {
    const reportId = `report_${data.targetType}_${data.targetId}_${data.userId}_${Date.now()}`;
    const report: Report = {
      reportId,
      targetType: data.targetType,
      targetId: data.targetId,
      userId: data.userId,
      reason: data.reason,
      details: data.details || '',
      createdAt: Timestamp.now(),
    };

    await createDocument<Report>(this.COLLECTION_NAME, reportId, report);

    // 通報数に応じて自動非表示
    const reportCount = await this.getReportCount(data.targetType, data.targetId);
    if (reportCount >= this.AUTO_HIDE_THRESHOLD) {
      if (data.targetType === 'post') {
        await PostService.updatePost(data.targetId, { isHidden: true });
      } else {
        await ReplyService.updateReply(data.targetId, { isHidden: true });
      }
    } else {
      // 通報数を更新
      if (data.targetType === 'post') {
        await PostService.updatePost(data.targetId, { reportCount });
      } else {
        await ReplyService.updateReply(data.targetId, { reportCount });
      }
    }

    return reportId;
  }

  /**
   * 通報数を取得
   */
  private static async getReportCount(
    targetType: 'post' | 'reply',
    targetId: string
  ): Promise<number> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      )
    );

    return snapshot.size;
  }

  /**
   * 通報一覧を取得
   */
  static async getReports(targetType: 'post' | 'reply', targetId: string): Promise<Report[]> {
    const snapshot = await getDocs(
      query(
        getCollectionRef(this.COLLECTION_NAME),
        where('targetType', '==', targetType),
        where('targetId', '==', targetId)
      )
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Report[];
  }
}
