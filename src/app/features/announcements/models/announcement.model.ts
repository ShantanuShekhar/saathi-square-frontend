// Announcement models
export enum AnnouncementStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  ARCHIVED = 'ARCHIVED'
}

export enum AnnouncementPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface Announcement {
  announcementId: string;
  title: string;
  content: string;
  summary?: string;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  isPinned: boolean;
  pinnedUntil?: string;
  scheduledAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  targetAudience?: string;
  attachmentUrl?: string;
  externalLink?: string;
  societyId: string;
  societyName?: string;
  createdBy: string;
  createdByName?: string;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  summary?: string;
  societyId: string;
  priority: AnnouncementPriority;
  isPinned?: boolean;
  pinnedUntil?: string;
  scheduledAt?: string;
  expiresAt?: string;
  targetAudience?: string;
  attachmentUrl?: string;
  externalLink?: string;
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  summary?: string;
  priority?: AnnouncementPriority;
  isPinned?: boolean;
  pinnedUntil?: string;
  scheduledAt?: string;
  expiresAt?: string;
  status?: AnnouncementStatus;
  targetAudience?: string;
  attachmentUrl?: string;
  externalLink?: string;
}

export interface AnnouncementFilterRequest {
  societyId: string;
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  searchTerm?: string;
  includePinnedOnly?: boolean;
  pageNo: number;
  pageSize: number;
}

