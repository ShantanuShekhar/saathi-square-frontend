// src/app/features/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/api`;

  // 🔹 BehaviorSubject for login state, initially false
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log("AuthService instance created!");

    // 🔹 Check token on app load / refresh
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedInSubject.next(true);
    }
  }

  // ✅ Register API
  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  // ✅ Login API
  login(payload: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload);
  }

  // 🔹 Check if token exists (helper)
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // 🔹 Set login state after successful login
  setLogin(token: string) {
    localStorage.setItem('token', token);
    this.loggedInSubject.next(true);
  }

  // 🔹 Logout and update UI state
  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }
}
