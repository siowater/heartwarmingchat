/**
 * サービス層のエクスポート
 */

import { UserService } from './user.service';
import { PostService } from './post.service';
import { ReplyService } from './reply.service';
import { ReactionService } from './reaction.service';
import { ContributionService } from './contribution.service';
import { NotificationService } from './notification.service';
import { ReportService } from './report.service';

export const Services = {
  UserService,
  PostService,
  ReplyService,
  ReactionService,
  ContributionService,
  NotificationService,
  ReportService,
};
