import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';
import {
  Announcement,
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementFilterRequest
} from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private baseUrl = `${environment.societyBaseUrl.replace('/api/societies', '')}/api/announcements`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new announcement
   */
  createAnnouncement(request: CreateAnnouncementRequest): Observable<ApiResponse<Announcement>> {
    return this.http.post<ApiResponse<Announcement>>(`${this.baseUrl}`, request);
  }

  /**
   * Update an existing announcement
   */
  updateAnnouncement(announcementId: string, request: UpdateAnnouncementRequest): Observable<ApiResponse<Announcement>> {
    return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/${announcementId}`, request);
  }

  /**
   * Get announcement by ID
   */
  getAnnouncementById(announcementId: string): Observable<ApiResponse<Announcement>> {
    return this.http.get<ApiResponse<Announcement>>(`${this.baseUrl}/${announcementId}`);
  }

  /**
   * Get active announcements for residents
   */
  getActiveAnnouncements(societyId: string, pageNo: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedResponse<Announcement>>> {
    const params = new HttpParams()
      .set('societyId', societyId)
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Announcement>>>(`${this.baseUrl}/active`, { params });
  }

  /**
   * Get filtered announcements (admin view)
   */
  getFilteredAnnouncements(filter: AnnouncementFilterRequest): Observable<ApiResponse<PaginatedResponse<Announcement>>> {
    return this.http.post<ApiResponse<PaginatedResponse<Announcement>>>(`${this.baseUrl}/filter`, filter);
  }

  /**
   * Publish an announcement
   */
  publishAnnouncement(announcementId: string): Observable<ApiResponse<Announcement>> {
    return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/${announcementId}/publish`, {});
  }

  /**
   * Pin/unpin an announcement
   */
  togglePin(announcementId: string, isPinned: boolean, pinnedUntil?: string): Observable<ApiResponse<Announcement>> {
    let params = new HttpParams().set('isPinned', isPinned.toString());
    if (pinnedUntil) {
      params = params.set('pinnedUntil', pinnedUntil);
    }
    return this.http.put<ApiResponse<Announcement>>(`${this.baseUrl}/${announcementId}/pin`, {}, { params });
  }

  /**
   * Delete an announcement
   */
  deleteAnnouncement(announcementId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${announcementId}`);
  }
}

