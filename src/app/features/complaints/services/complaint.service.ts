import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import {
  Complaint,
  CreateComplaintRequest,
  UpdateComplaintRequest,
  ComplaintFilterRequest,
  ComplaintComment,
  CreateCommentRequest,
  AssignComplaintRequest,
  ResolveComplaintRequest
} from '../models/complaint.model';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private baseUrl = environment.complaintBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new complaint
   */
  createComplaint(request: CreateComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.post<ApiResponse<Complaint>>(`${this.baseUrl}`, request);
  }

  /**
   * Update an existing complaint
   */
  updateComplaint(complaintId: string, request: UpdateComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.baseUrl}/${complaintId}`, request);
  }

  /**
   * Get complaint by ID
   */
  getComplaintById(complaintId: string): Observable<ApiResponse<Complaint>> {
    return this.http.get<ApiResponse<Complaint>>(`${this.baseUrl}/${complaintId}`);
  }

  /**
   * Get complaint by ticket number
   */
  getComplaintByTicketNumber(ticketNumber: string): Observable<ApiResponse<Complaint>> {
    return this.http.get<ApiResponse<Complaint>>(`${this.baseUrl}/ticket/${ticketNumber}`);
  }

  /**
   * Get complaints by society ID
   */
  getComplaintsBySocietyId(societyId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Complaint>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Complaint>>>(`${this.baseUrl}/society/${societyId}`, { params });
  }

  /**
   * Get complaints raised by user
   */
  getComplaintsByRaisedBy(raisedBy: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Complaint>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Complaint>>>(`${this.baseUrl}/raised-by/${raisedBy}`, { params });
  }

  /**
   * Get complaints assigned to user
   */
  getComplaintsByAssignedTo(assignedTo: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Complaint>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Complaint>>>(`${this.baseUrl}/assigned-to/${assignedTo}`, { params });
  }

  /**
   * Get filtered complaints
   */
  getFilteredComplaints(filter: ComplaintFilterRequest): Observable<ApiResponse<PaginatedResponse<Complaint>>> {
    return this.http.post<ApiResponse<PaginatedResponse<Complaint>>>(`${this.baseUrl}/filter`, filter);
  }

  /**
   * Assign complaint to a user
   */
  assignComplaint(request: AssignComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.baseUrl}/${request.complaintId}/assign`, { assignedTo: request.assignedTo });
  }

  /**
   * Update complaint status
   */
  updateComplaintStatus(complaintId: string, status: string): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.baseUrl}/${complaintId}/status`, { status });
  }

  /**
   * Resolve a complaint
   */
  resolveComplaint(request: ResolveComplaintRequest): Observable<ApiResponse<Complaint>> {
    return this.http.put<ApiResponse<Complaint>>(`${this.baseUrl}/${request.complaintId}/resolve`, { resolutionNotes: request.resolutionNotes });
  }

  /**
   * Add a comment to a complaint
   */
  addComment(request: CreateCommentRequest): Observable<ApiResponse<ComplaintComment>> {
    return this.http.post<ApiResponse<ComplaintComment>>(`${this.baseUrl}/${request.complaintId}/comments`, request);
  }

  /**
   * Delete a complaint
   */
  deleteComplaint(complaintId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${complaintId}`);
  }
}

