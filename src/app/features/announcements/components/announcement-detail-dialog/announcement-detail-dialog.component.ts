import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Announcement } from '../../models/announcement.model';

@Component({
  selector: 'app-announcement-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './announcement-detail-dialog.component.html',
  styleUrls: ['./announcement-detail-dialog.component.scss']
})
export class AnnouncementDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public announcement: Announcement,
    private dialogRef: MatDialogRef<AnnouncementDetailDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getPriorityClass(priority: string): string {
    const priorityMap: Record<string, string> = {
      'LOW': 'priority-low',
      'NORMAL': 'priority-normal',
      'HIGH': 'priority-high',
      'URGENT': 'priority-urgent'
    };
    return priorityMap[priority] || 'priority-normal';
  }

  getPriorityLabel(priority: string): string {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  }
}

