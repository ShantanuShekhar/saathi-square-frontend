// Complaint models
export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum ComplaintCategory {
  MAINTENANCE = 'MAINTENANCE',
  SECURITY = 'SECURITY',
  CLEANING = 'CLEANING',
  PARKING = 'PARKING',
  NOISE = 'NOISE',
  WATER = 'WATER',
  ELECTRICITY = 'ELECTRICITY',
  LIFT = 'LIFT',
  COMMON_AREA = 'COMMON_AREA',
  OTHER = 'OTHER'
}

export interface Complaint {
  complaintId: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  societyId: string;
  flatId?: string;
  raisedBy: string;
  raisedByName?: string;
  assignedTo?: string;
  assignedToName?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  estimatedResolutionDate?: string;
  location?: string;
  contactPhone?: string;
  attachments?: ComplaintAttachment[];
  comments?: ComplaintComment[];
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ComplaintAttachment {
  attachmentId: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

export interface ComplaintComment {
  commentId: string;
  content: string;
  commentedBy: string;
  commentedByName?: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  societyId: string;
  flatId?: string;
  location?: string;
  contactPhone?: string;
  estimatedResolutionDate?: string;
  attachmentUrls?: string[];
}

export interface UpdateComplaintRequest {
  title?: string;
  description?: string;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
  location?: string;
  contactPhone?: string;
  estimatedResolutionDate?: string;
  resolutionNotes?: string;
}

export interface ComplaintFilterRequest {
  societyId: string;
  flatId?: string;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
  raisedBy?: string;
  assignedTo?: string;
  searchTerm?: string;
  pageNo: number;
  pageSize: number;
}

export interface CreateCommentRequest {
  complaintId: string;
  content: string;
  isInternal?: boolean;
}

export interface AssignComplaintRequest {
  complaintId: string;
  assignedTo: string;
}

export interface ResolveComplaintRequest {
  complaintId: string;
  resolutionNotes: string;
}

