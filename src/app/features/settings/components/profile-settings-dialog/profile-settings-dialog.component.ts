import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-profile-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile-settings-dialog.component.html',
  styleUrls: ['./profile-settings-dialog.component.scss']
})
export class ProfileSettingsDialogComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  userData: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfileSettingsDialogComponent>,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['']
    });
  }

  ngOnInit(): void {
    // Load current user data
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    // Extract email from token for now
    // In a real app, you'd call an API to get current user details
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = this.decodeJwtToken(token);
        const email = payload.sub || payload.email || '';
        
        this.profileForm.patchValue({
          email: email,
          username: email
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    const formValue = this.profileForm.value;
    this.loading = true;

    this.authService.updateProfile({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username || formValue.email
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && (response.status === 'SUCX001' || response.status === 'SUCCESS')) {
          this.toastService.success('Profile updated successfully');
          this.dialogRef.close(true);
        } else {
          this.toastService.error(response?.message || 'Failed to update profile');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating profile:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to update profile';
        this.toastService.error(errorMessage);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private decodeJwtToken(token: string): any {
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
}

