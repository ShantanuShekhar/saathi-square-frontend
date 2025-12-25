// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule
  ],
})
export class LoginComponent {
  loginForm!: FormGroup;
  hide = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.toastService.error('Please enter valid credentials.');
      return;
    }

    this.loading = true;
    const payload = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        console.log('✅ Login response received:', res);
        console.log('✅ Response type:', typeof res);
        console.log('✅ Response keys:', res ? Object.keys(res) : 'null');
        console.log('✅ Full response object:', JSON.stringify(res, null, 2));
        
        // Backend returns: { token, username, roleName }
        // Handle different possible response formats
        let token: string | null = null;
        
        if (res) {
          // Try different possible field names
          token = res.token || res.data?.token || res.body?.token || (typeof res === 'string' ? res : null);
          
          console.log('✅ Extracted token:', token ? token.substring(0, 20) + '...' : 'null');
        }
        
        if (!token) {
          console.error('❌ Token not found in response:', res);
          console.error('❌ Response structure:', JSON.stringify(res, null, 2));
          this.toastService.error('Login failed: Invalid response from server.');
          this.loading = false;
          return;
        }

        // 🔹 Save token
        localStorage.setItem('token', token);
        console.log('✅ Token saved to localStorage');

        // 🔹 Trigger BehaviorSubject
        this.authService.setLogin(token);
        console.log('✅ Login state updated');

        this.toastService.success('Login successful');
        this.router.navigate(['/dashboard']);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Login error details:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error error:', err.error);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        
        // More specific error messages - use backend message if available
        let errorMessage = 'Login failed. Please check your credentials.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (err.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (err.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.toastService.error(errorMessage);
        this.loading = false;
      }
    });
  }
}
