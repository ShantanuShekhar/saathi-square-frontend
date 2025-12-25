// Marketplace models
export enum PostType {
  SELL = 'SELL',
  REQUEST = 'REQUEST',
  GROUP_BUY = 'GROUP_BUY'
}

export enum PostStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  CLOSED = 'CLOSED',
  DELETED = 'DELETED'
}

export interface MarketplacePost {
  postId: string;
  title: string;
  description?: string;
  postType: PostType;
  status: PostStatus;
  price?: number;
  quantity?: number;
  location?: string;
  contactInfo?: string;
  societyId: string;
  societyName?: string;
  createdBy: string;
  createdByName?: string;
  images: MarketplaceImage[];
  comments?: MarketplaceComment[];
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  soldAt?: string;
  soldTo?: string;
}

export interface MarketplaceImage {
  imageId: string;
  imageUrl: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  displayOrder: number;
}

export interface MarketplaceComment {
  commentId: string;
  content: string;
  createdBy: string;
  createdByName?: string;
  postId: string;
  createdAt: string;
}

export interface CreateMarketplacePostRequest {
  title: string;
  description?: string;
  postType: PostType;
  societyId: string;
  price?: number;
  quantity?: number;
  location?: string;
  contactInfo?: string;
  imageUrls?: string[];
}

export interface UpdateMarketplacePostRequest {
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
  location?: string;
  contactInfo?: string;
  status?: PostStatus;
  imageUrls?: string[];
}

export interface MarketplacePostFilterRequest {
  societyId: string;
  postType?: PostType;
  status?: PostStatus;
  searchTerm?: string;
  pageNo: number;
  pageSize: number;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

