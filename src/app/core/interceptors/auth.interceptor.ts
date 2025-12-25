import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Decode JWT token and extract payload
 */
function decodeJwtToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * Extract user ID from JWT token
 * Tries common JWT claim fields: sub, userId, id, user_id
 */
function extractUserIdFromToken(token: string): string | null {
  const payload = decodeJwtToken(token);
  if (!payload) {
    return null;
  }
  
  // Try common JWT claim fields
  return payload.sub || payload.userId || payload.id || payload.user_id || null;
}

/**
 * HTTP Interceptor for:
 * - Adding Authorization token to requests
 * - Adding X-User-Id header (extracted from JWT)
 * - Adding Correlation ID header
 * - Handling authentication errors (401, 403)
 * - Global error handling
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Skip token expiration check for login/signup requests
  const isAuthRequest = req.url.includes('/api/login') || req.url.includes('/api/signup');
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Check if token is expired before sending request (skip for auth requests)
  if (token && !isAuthRequest) {
    try {
      const payload = decodeJwtToken(token);
      if (payload && payload.exp) {
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        
        // If token is expired, remove it and don't send the request
        if (currentTime >= expirationTime) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
          snackBar.open('Session expired. Please login again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          // Return an error observable to prevent the request
          return throwError(() => new Error('Token expired'));
        }
      }
    } catch (error) {
      // Invalid token, remove it but don't prevent navigation
      // The request will fail with 401 and be handled below
      console.error('Invalid token:', error);
      // Don't remove token here - let the 401 handler deal with it
      // Removing it here would cause all subsequent requests to fail
    }
  }
  
  // Extract user ID from token if available (skip for auth requests)
  let userId: string | null = null;
  if (token && !isAuthRequest) {
    userId = extractUserIdFromToken(token);
  }
  
  // Generate correlation ID if not present in headers
  let correlationId = req.headers.get('X-Correlation-ID');
  if (!correlationId) {
    correlationId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Build headers object
  const headers: { [key: string]: string } = {
    'X-Correlation-ID': correlationId
  };

  // Only add Content-Type if it's not already set
  if (!req.headers.has('Content-Type')) {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if token exists (skip for auth requests)
  if (token && !isAuthRequest) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add X-User-Id header if user ID was extracted from token (skip for auth requests)
  if (userId && !isAuthRequest) {
    headers['X-User-Id'] = userId;
  }

  // Clone request and add headers
  const clonedRequest = req.clone({
    setHeaders: headers
  });

  // Add logging for login requests to debug
  if (isAuthRequest) {
    console.log('Auth interceptor - Login request:', req.url);
    console.log('Auth interceptor - Request headers:', Object.fromEntries(clonedRequest.headers.keys().map(k => [k, clonedRequest.headers.get(k)])));
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error details for debugging
      console.error('HTTP Error in interceptor:', {
        url: req.url,
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        message: error.message
      });

      // Don't show snackbar for auth requests (let component handle it)
      if (isAuthRequest) {
        console.log('Auth request error - letting component handle it');
        return throwError(() => error);
      }

      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
        snackBar.open('Session expired. Please login again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }

      // Handle 403 Forbidden
      if (error.status === 403) {
        snackBar.open('Access denied. You do not have permission.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }

      // Handle 500+ server errors
      if (error.status >= 500) {
        snackBar.open('Server error. Please try again later.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }

      return throwError(() => error);
    })
  );
};

