import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnnouncementService } from '../../services/announcement.service';
import { CreateAnnouncementRequest, AnnouncementPriority } from '../../models/announcement.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-create-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-announcement-dialog.component.html',
  styleUrls: ['./create-announcement-dialog.component.scss']
})
export class CreateAnnouncementDialogComponent implements OnInit {
  announcementForm!: FormGroup;
  loading = false;
  priorities = Object.values(AnnouncementPriority);
  societyId: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateAnnouncementDialogComponent>,
    private announcementService: AnnouncementService,
    private toastService: ToastService
  ) {
    // Get societyId from localStorage or user context
    this.societyId = localStorage.getItem('societyId') || '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83'; // Temporary default
  }

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required]],
      summary: ['', [Validators.maxLength(500)]],
      priority: [AnnouncementPriority.NORMAL, Validators.required],
      isPinned: [false],
      pinnedUntil: [''],
      scheduledAt: [''],
      expiresAt: [''],
      targetAudience: ['ALL'],
      attachmentUrl: [''],
      externalLink: ['']
    });
  }

  onSubmit(): void {
    if (this.announcementForm.invalid || !this.societyId) {
      this.markFormGroupTouched(this.announcementForm);
      if (!this.societyId) {
        this.toastService.error('Society ID is required');
      }
      return;
    }

    const formValue = this.announcementForm.value;
    const request: CreateAnnouncementRequest = {
      title: formValue.title,
      content: formValue.content,
      summary: formValue.summary || undefined,
      societyId: this.societyId,
      priority: formValue.priority,
      isPinned: formValue.isPinned || false,
      pinnedUntil: formValue.pinnedUntil ? new Date(formValue.pinnedUntil).toISOString() : undefined,
      scheduledAt: formValue.scheduledAt ? new Date(formValue.scheduledAt).toISOString() : undefined,
      expiresAt: formValue.expiresAt ? new Date(formValue.expiresAt).toISOString() : undefined,
      targetAudience: formValue.targetAudience || 'ALL',
      attachmentUrl: formValue.attachmentUrl || undefined,
      externalLink: formValue.externalLink || undefined
    };

    this.loading = true;
    this.announcementService.createAnnouncement(request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && (response.status === 'SUCX001' || response.status === 'SUCCESS')) {
          this.toastService.success('Announcement created successfully!');
          this.dialogRef.close(true); // Return true to indicate success
        } else {
          this.toastService.error(response?.message || 'Failed to create announcement');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating announcement:', error);
        const errorMessage = error.error?.message || error.message || 'Failed to create announcement';
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
}

