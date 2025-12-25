import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResidentService } from '../../services/resident.service';
import { CreateResidentRequest, RelationshipType } from '../../models/resident.model';

@Component({
  selector: 'app-resident-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './resident-create.component.html',
  styleUrls: ['./resident-create.component.scss']
})
export class ResidentCreateComponent implements OnInit {
  residentForm!: FormGroup;
  loading = false;
  relationshipTypes = Object.values(RelationshipType);

  constructor(
    private fb: FormBuilder,
    private residentService: ResidentService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get userId from token or localStorage
    const token = localStorage.getItem('token');
    const userId = this.extractUserIdFromToken(token || '');
    const societyId = localStorage.getItem('societyId') || '';

    if (!userId || !societyId) {
      this.snackBar.open('User ID or Society ID is missing. Please login again.', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    this.residentForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.maxLength(20)]],
      alternatePhone: [''],
      dateOfBirth: [''],
      relationshipType: ['', Validators.required],
      emergencyContactName: [''],
      emergencyContactPhone: [''],
      occupation: [''],
      vehicleDetails: [''],
      moveInDate: [''],
      flatId: ['']
    });
  }

  onSubmit(): void {
    if (this.residentForm.invalid) {
      this.markFormGroupTouched(this.residentForm);
      return;
    }

    const token = localStorage.getItem('token');
    const userId = this.extractUserIdFromToken(token || '');
    const societyId = localStorage.getItem('societyId') || '';

    if (!userId || !societyId) {
      this.snackBar.open('User ID or Society ID is missing.', 'Close', { duration: 3000 });
      return;
    }

    const formValue = this.residentForm.value;
    const request: CreateResidentRequest = {
      userId: userId,
      societyId: societyId,
      flatId: formValue.flatId || undefined,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email || undefined,
      phoneNumber: formValue.phoneNumber || undefined,
      alternatePhone: formValue.alternatePhone || undefined,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth).toISOString().split('T')[0] : undefined,
      relationshipType: formValue.relationshipType,
      emergencyContactName: formValue.emergencyContactName || undefined,
      emergencyContactPhone: formValue.emergencyContactPhone || undefined,
      occupation: formValue.occupation || undefined,
      vehicleDetails: formValue.vehicleDetails || undefined,
      moveInDate: formValue.moveInDate ? new Date(formValue.moveInDate).toISOString().split('T')[0] : undefined
    };

    this.loading = true;
    this.residentService.createResident(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.status === 'SUCX001' || response.status === 'SUCCESS') {
          this.snackBar.open('Resident created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/residents']);
        } else {
          this.snackBar.open(response.message || 'Failed to create resident', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating resident:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to create resident';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/residents']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private extractUserIdFromToken(token: string): string | null {
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
      return payload.sub || payload.userId || payload.id || payload.user_id || null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }
}

