import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import {
  Resident,
  CreateResidentRequest,
  UpdateResidentRequest,
  ResidentFilterRequest
} from '../models/resident.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private baseUrl = environment.residentBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Create a new resident
   */
  createResident(request: CreateResidentRequest): Observable<ApiResponse<Resident>> {
    return this.http.post<ApiResponse<Resident>>(`${this.baseUrl}`, request);
  }

  /**
   * Update an existing resident
   */
  updateResident(residentId: string, request: UpdateResidentRequest): Observable<ApiResponse<Resident>> {
    return this.http.put<ApiResponse<Resident>>(`${this.baseUrl}/${residentId}`, request);
  }

  /**
   * Get resident by ID
   */
  getResidentById(residentId: string): Observable<ApiResponse<Resident>> {
    return this.http.get<ApiResponse<Resident>>(`${this.baseUrl}/${residentId}`);
  }

  /**
   * Get residents by user ID
   */
  getResidentsByUserId(userId: string): Observable<ApiResponse<Resident[]>> {
    return this.http.get<ApiResponse<Resident[]>>(`${this.baseUrl}/user/${userId}`);
  }

  /**
   * Get residents by society ID
   */
  getResidentsBySocietyId(societyId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Resident>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Resident>>>(`${this.baseUrl}/society/${societyId}`, { params });
  }

  /**
   * Get filtered residents
   */
  getFilteredResidents(filter: ResidentFilterRequest): Observable<ApiResponse<PaginatedResponse<Resident>>> {
    return this.http.post<ApiResponse<PaginatedResponse<Resident>>>(`${this.baseUrl}/filter`, filter);
  }

  /**
   * Get residents by flat ID
   */
  getResidentsByFlatId(flatId: string, pageNo: number = 1, pageSize: number = 20): Observable<ApiResponse<PaginatedResponse<Resident>>> {
    const params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Resident>>>(`${this.baseUrl}/flat/${flatId}`, { params });
  }

  /**
   * Delete a resident
   */
  deleteResident(residentId: string): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${residentId}`);
  }

  /**
   * Verify a resident
   */
  verifyResident(residentId: string, verificationNotes?: string): Observable<ApiResponse<Resident>> {
    const body = verificationNotes ? { verificationNotes } : {};
    return this.http.put<ApiResponse<Resident>>(`${this.baseUrl}/${residentId}/verify`, body);
  }

  /**
   * Move out a resident
   */
  moveOutResident(residentId: string): Observable<ApiResponse<string>> {
    return this.http.put<ApiResponse<string>>(`${this.baseUrl}/${residentId}/move-out`, {});
  }
}

