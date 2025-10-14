import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Flat } from '../models/flat.model';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class SocietyService {
  constructor(private http: HttpClient) {}
    private baseUrl = environment.societyBaseUrl;
   getFlatsPaginated(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/details`, payload);
  }
}
