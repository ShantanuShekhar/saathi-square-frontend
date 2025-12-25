// src/app/core/services/society.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export interface SocietyCountData {
  floorCount: number;
  flatCount: number;
  towerCount: number;
  societyCount: number;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocietyService {
  private baseUrl = environment.societyBaseUrl;

  constructor(private http: HttpClient) {
    console.log('SocietyService initialized with baseUrl:', this.baseUrl);
  }

  getSocietyCount(userId: string): Observable<ApiResponse<SocietyCountData>> {
    const url = `${this.baseUrl}/${userId}/getCount`;
    console.log('Fetching society count from:', url);
    return this.http.get<ApiResponse<SocietyCountData>>(url);
  }

  getFlatsPaginated(payload: any): Observable<ApiResponse<any>> {
    const url = `${this.baseUrl}/paginated`;
    console.log('Fetching flats paginated from:', url, 'Payload:', payload);
    return this.http.post<ApiResponse<any>>(url, payload);
  }
}
