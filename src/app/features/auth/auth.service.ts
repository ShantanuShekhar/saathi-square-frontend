import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
    return this.http.post(`${this.apiUrl}/signup`, payload);
  }

  // ✅ Login API
  login(payload: { username: string; password: string }): Observable<any> {
    console.log('AuthService.login called with:', payload);
    console.log('Login URL:', `${this.apiUrl}/login`);
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

  // ✅ Change Password API
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    // Extract email from token
    const token = localStorage.getItem('token');
    const email = this.extractEmailFromToken(token || '');
    
    if (!email) {
      return new Observable(observer => {
        observer.error({ message: 'Unable to determine user email' });
      });
    }

    // Backend expects: id, username, email, firstName, lastName, newPassword, oldPassword, roleName
    // For password change, we only need email, oldPassword, and newPassword
    // Backend will fetch user by email and update password
    const request = {
      id: null, // Backend will look up by email
      username: email,
      email: email,
      firstName: null,
      lastName: null,
      oldPassword: oldPassword,
      newPassword: newPassword,
      roleName: null
    };

    console.log('Change password request:', { email, hasOldPassword: !!oldPassword, hasNewPassword: !!newPassword });
    return this.http.post(`${this.apiUrl}/update-user-details`, request);
  }

  // ✅ Update Profile API
  updateProfile(profileData: { firstName: string; lastName: string; email: string; username?: string }): Observable<any> {
    // Extract email from token for user identification
    const token = localStorage.getItem('token');
    const currentEmail = this.extractEmailFromToken(token || '');
    
    if (!currentEmail) {
      return new Observable(observer => {
        observer.error({ message: 'Unable to determine user email' });
      });
    }

    // Backend expects: id, username, email, firstName, lastName, newPassword, oldPassword, roleName
    // For profile-only update (no password change), we send empty strings for passwords
    // Backend will skip password validation if newPassword is empty
    const request = {
      id: null, // Backend will look up by email
      username: profileData.username || profileData.email,
      email: profileData.email || currentEmail,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      oldPassword: '', // Empty for profile-only updates
      newPassword: '', // Empty for profile-only updates (backend will skip password validation)
      roleName: null
    };

    console.log('Update profile request:', request);
    return this.http.post(`${this.apiUrl}/update-user-details`, request);
  }

  // Helper to extract email from JWT token
  private extractEmailFromToken(token: string): string | null {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return payload.sub || payload.email || payload.username || null;
    } catch (error) {
      console.error('Error extracting email from token:', error);
      return null;
    }
  }

  // 🔹 Logout and update UI state
  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const logoutUrl = `${this.apiUrl}/logout`;
    
    console.log('Logout called - URL:', logoutUrl);
    console.log('Logout called - Token exists:', !!token);
    
    // Call logout API if token exists
    if (token) {
      return this.http.post(logoutUrl, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).pipe(
        tap(() => {
          console.log('Logout API call successful');
          // On success, clear local storage
          localStorage.removeItem('token');
          this.loggedInSubject.next(false);
        }),
        catchError((err) => {
          // Even if API call fails, clear local storage
          console.error('Logout API error:', err);
          console.error('Logout URL was:', logoutUrl);
          localStorage.removeItem('token');
          this.loggedInSubject.next(false);
          // Return empty observable to continue the flow
          return of(null);
        })
      );
    } else {
      // No token, just clear local state
      console.log('No token found, clearing local state only');
      localStorage.removeItem('token');
      this.loggedInSubject.next(false);
      return of(null);
    }
  }
}
