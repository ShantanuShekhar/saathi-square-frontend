import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import {
  Visitor,
  CreateVisitorRequest,
  UpdateVisitorRequest,
  VisitorFilterRequest
} from '../models/visitor.model';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private baseUrl = environment.visitorBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new visitor
   */
  createVisitor(request: CreateVisitorRequest): Observable<ApiResponse<Visitor>> {
    return this.http.post<ApiResponse<Visitor>>(`${this.baseUrl}`, request);
  }

  /**
   * Update an existing visitor
   */
  updateVisitor(visitorId: string, request: UpdateVisitorRequest): Observable<ApiResponse<Visitor>> {
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}`, request);
  }

  /**
   * Get visitor by ID
   */
  getVisitorById(visitorId: string): Observable<ApiResponse<Visitor>> {
    return this.http.get<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}`);
  }

  /**
   * Get visitor by visitor code
   */
  getVisitorByCode(visitorCode: string): Observable<ApiResponse<Visitor>> {
    return this.http.get<ApiResponse<Visitor>>(`${this.baseUrl}/code/${visitorCode}`);
  }

  /**
   * Get visitor by gate pass number
   */
  getVisitorByGatePass(gatePassNumber: string): Observable<ApiResponse<Visitor>> {
    return this.http.get<ApiResponse<Visitor>>(`${this.baseUrl}/gate-pass/${gatePassNumber}`);
  }

  /**
   * Get visitors by society ID
   */
  getVisitorsBySocietyId(societyId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Visitor>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Visitor>>>(`${this.baseUrl}/society/${societyId}`, { params });
  }

  /**
   * Get visitors by host ID
   */
  getVisitorsByHostId(hostId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Visitor>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Visitor>>>(`${this.baseUrl}/host/${hostId}`, { params });
  }

  /**
   * Get visitors by flat ID
   */
  getVisitorsByFlatId(flatId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Visitor>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Visitor>>>(`${this.baseUrl}/flat/${flatId}`, { params });
  }

  /**
   * Get filtered visitors
   */
  getFilteredVisitors(filter: VisitorFilterRequest): Observable<ApiResponse<PaginatedResponse<Visitor>>> {
    return this.http.post<ApiResponse<PaginatedResponse<Visitor>>>(`${this.baseUrl}/filter`, filter);
  }

  /**
   * Get checked-in visitors for a society
   */
  getCheckedInVisitors(societyId: string): Observable<ApiResponse<Visitor[]>> {
    return this.http.get<ApiResponse<Visitor[]>>(`${this.baseUrl}/society/${societyId}/checked-in`);
  }

  /**
   * Get today's expected visitors for a society
   */
  getTodayExpectedVisitors(societyId: string): Observable<ApiResponse<Visitor[]>> {
    return this.http.get<ApiResponse<Visitor[]>>(`${this.baseUrl}/society/${societyId}/today-expected`);
  }

  /**
   * Approve a visitor
   */
  approveVisitor(visitorId: string): Observable<ApiResponse<Visitor>> {
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}/approve`, {});
  }

  /**
   * Reject a visitor
   */
  rejectVisitor(visitorId: string, rejectionReason?: string): Observable<ApiResponse<Visitor>> {
    const body = rejectionReason ? { rejectionReason } : {};
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}/reject`, body);
  }

  /**
   * Check in a visitor
   */
  checkInVisitor(visitorId: string): Observable<ApiResponse<Visitor>> {
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}/check-in`, {});
  }

  /**
   * Check out a visitor
   */
  checkOutVisitor(visitorId: string): Observable<ApiResponse<Visitor>> {
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}/check-out`, {});
  }

  /**
   * Cancel a visitor
   */
  cancelVisitor(visitorId: string): Observable<ApiResponse<Visitor>> {
    return this.http.put<ApiResponse<Visitor>>(`${this.baseUrl}/${visitorId}/cancel`, {});
  }

  /**
   * Delete a visitor
   */
  deleteVisitor(visitorId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${visitorId}`);
  }
}

