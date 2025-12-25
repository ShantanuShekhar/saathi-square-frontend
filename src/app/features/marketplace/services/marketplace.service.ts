import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PaginatedResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';
import {
  MarketplacePost,
  CreateMarketplacePostRequest,
  UpdateMarketplacePostRequest,
  MarketplacePostFilterRequest,
  MarketplaceComment,
  CreateCommentRequest
} from '../models/marketplace.model';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceService {
  private baseUrl = `${environment.societyBaseUrl.replace('/api/societies', '')}/api/marketplace`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new marketplace post
   */
  createPost(request: CreateMarketplacePostRequest): Observable<ApiResponse<MarketplacePost>> {
    return this.http.post<ApiResponse<MarketplacePost>>(`${this.baseUrl}/posts`, request);
  }

  /**
   * Update an existing marketplace post
   */
  updatePost(postId: string, request: UpdateMarketplacePostRequest): Observable<ApiResponse<MarketplacePost>> {
    return this.http.put<ApiResponse<MarketplacePost>>(`${this.baseUrl}/posts/${postId}`, request);
  }

  /**
   * Get marketplace post by ID
   */
  getPostById(postId: string): Observable<ApiResponse<MarketplacePost>> {
    return this.http.get<ApiResponse<MarketplacePost>>(`${this.baseUrl}/posts/${postId}`);
  }

  /**
   * Get filtered marketplace posts
   */
  getFilteredPosts(filter: MarketplacePostFilterRequest): Observable<ApiResponse<PaginatedResponse<MarketplacePost>>> {
    return this.http.post<ApiResponse<PaginatedResponse<MarketplacePost>>>(`${this.baseUrl}/posts/filter`, filter);
  }

  /**
   * Mark post as sold
   */
  markAsSold(postId: string, soldTo?: string): Observable<ApiResponse<MarketplacePost>> {
    const params = soldTo ? new HttpParams().set('soldTo', soldTo) : new HttpParams();
    return this.http.put<ApiResponse<MarketplacePost>>(`${this.baseUrl}/posts/${postId}/mark-sold`, {}, { params });
  }

  /**
   * Delete a marketplace post
   */
  deletePost(postId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/posts/${postId}`);
  }

  /**
   * Add a comment to a post
   */
  addComment(request: CreateCommentRequest): Observable<ApiResponse<MarketplaceComment>> {
    return this.http.post<ApiResponse<MarketplaceComment>>(`${this.baseUrl}/comments`, request);
  }

  /**
   * Delete a comment
   */
  deleteComment(commentId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/comments/${commentId}`);
  }

  /**
   * Get comments for a post
   */
  getPostComments(postId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<MarketplaceComment>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<MarketplaceComment>>>(`${this.baseUrl}/posts/${postId}/comments`, { params });
  }
}

