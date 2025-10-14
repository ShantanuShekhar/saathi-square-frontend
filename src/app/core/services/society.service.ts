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

  constructor(private http: HttpClient) {}

  getSocietyCount(userId: string): Observable<ApiResponse<SocietyCountData>> {
    return this.http.get<ApiResponse<SocietyCountData>>(`${this.baseUrl}/${userId}/getCount`);
  }
}
