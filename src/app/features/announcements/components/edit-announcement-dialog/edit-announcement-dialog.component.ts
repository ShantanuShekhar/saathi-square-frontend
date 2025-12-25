import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { ToastService } from '../../../../core/services/toast.service';
import { 
  Announcement, 
  AnnouncementStatus, 
  AnnouncementPriority,
  UpdateAnnouncementRequest 
} from '../../models/announcement.model';

@Component({
  selector: 'app-edit-announcement-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-announcement-dialog.component.html',
  styleUrls: ['./edit-announcement-dialog.component.scss']
})
export class EditAnnouncementDialogComponent implements OnInit {
  editForm!: FormGroup;
  loading = false;

  statuses = Object.values(AnnouncementStatus).map(status => ({
    value: status,
    label: this.getStatusLabel(status)
  }));

  priorities = Object.values(AnnouncementPriority).map(priority => ({
    value: priority,
    label: this.getPriorityLabel(priority)
  }));

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAnnouncementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcement: Announcement },
    private announcementService: AnnouncementService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const announcement = this.data.announcement;
    
    // Pre-fill form with all current announcement values
    this.editForm = this.fb.group({
      title: [announcement.title, [Validators.required, Validators.maxLength(200)]],
      content: [announcement.content, Validators.required],
      summary: [announcement.summary || '', Validators.maxLength(500)],
      priority: [announcement.priority, Validators.required],
      status: [announcement.status, Validators.required],
      isPinned: [announcement.isPinned || false],
      pinnedUntil: [announcement.pinnedUntil ? new Date(announcement.pinnedUntil) : null],
      scheduledAt: [announcement.scheduledAt ? new Date(announcement.scheduledAt) : null],
      expiresAt: [announcement.expiresAt ? new Date(announcement.expiresAt) : null],
      targetAudience: [announcement.targetAudience || 'ALL'],
      attachmentUrl: [announcement.attachmentUrl || ''],
      externalLink: [announcement.externalLink || '']
    });
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    const formValue = this.editForm.value;
    const request: UpdateAnnouncementRequest = {
      title: formValue.title,
      content: formValue.content,
      summary: formValue.summary || undefined,
      priority: formValue.priority,
      status: formValue.status,
      isPinned: formValue.isPinned,
      pinnedUntil: formValue.pinnedUntil ? new Date(formValue.pinnedUntil).toISOString() : undefined,
      scheduledAt: formValue.scheduledAt ? new Date(formValue.scheduledAt).toISOString() : undefined,
      expiresAt: formValue.expiresAt ? new Date(formValue.expiresAt).toISOString() : undefined,
      targetAudience: formValue.targetAudience || undefined,
      attachmentUrl: formValue.attachmentUrl || undefined,
      externalLink: formValue.externalLink || undefined
    };

    this.loading = true;
    this.announcementService.updateAnnouncement(this.data.announcement.announcementId, request).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && (response.status === 'SUCX001' || response.status === 'SUCCESS')) {
          this.toastService.success('Announcement updated successfully');
          this.dialogRef.close(true); // Return true to indicate successful update
        } else {
          this.toastService.error(response?.message || 'Failed to update announcement');
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('Error updating announcement:', error);
        this.toastService.error(error?.error?.message || 'Failed to update announcement');
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
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getStatusLabel(status: AnnouncementStatus): string {
    const labels: Record<AnnouncementStatus, string> = {
      [AnnouncementStatus.DRAFT]: 'Draft',
      [AnnouncementStatus.SCHEDULED]: 'Scheduled',
      [AnnouncementStatus.ACTIVE]: 'Active',
      [AnnouncementStatus.EXPIRED]: 'Expired',
      [AnnouncementStatus.ARCHIVED]: 'Archived'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: AnnouncementPriority): string {
    const labels: Record<AnnouncementPriority, string> = {
      [AnnouncementPriority.LOW]: 'Low',
      [AnnouncementPriority.NORMAL]: 'Normal',
      [AnnouncementPriority.HIGH]: 'High',
      [AnnouncementPriority.URGENT]: 'Urgent'
    };
    return labels[priority] || priority;
  }
}
