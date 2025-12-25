import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AnnouncementService } from '../../services/announcement.service';
import { CreateAnnouncementDialogComponent } from '../create-announcement-dialog/create-announcement-dialog.component';
import { AnnouncementDetailDialogComponent } from '../announcement-detail-dialog/announcement-detail-dialog.component';
import { EditAnnouncementDialogComponent } from '../edit-announcement-dialog/edit-announcement-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';
import { 
  Announcement, 
  AnnouncementStatus, 
  AnnouncementPriority,
  AnnouncementFilterRequest 
} from '../../models/announcement.model';

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.scss']
})
export class AnnouncementsListComponent implements OnInit {
  announcements: Announcement[] = [];
  pinnedAnnouncements: Announcement[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 10;

  // Filters
  selectedStatus: AnnouncementStatus | '' = '';
  selectedPriority: AnnouncementPriority | '' = '';
  searchTerm: string = '';
  societyId: string = ''; // Should be set from user's society context
  isAdminView = false; // Toggle between admin and resident view

  statuses = [
    { value: '', label: 'All Status' },
    { value: AnnouncementStatus.DRAFT, label: 'Draft' },
    { value: AnnouncementStatus.SCHEDULED, label: 'Scheduled' },
    { value: AnnouncementStatus.ACTIVE, label: 'Active' },
    { value: AnnouncementStatus.EXPIRED, label: 'Expired' },
    { value: AnnouncementStatus.ARCHIVED, label: 'Archived' }
  ];

  priorities = [
    { value: '', label: 'All Priorities' },
    { value: AnnouncementPriority.LOW, label: 'Low' },
    { value: AnnouncementPriority.NORMAL, label: 'Normal' },
    { value: AnnouncementPriority.HIGH, label: 'High' },
    { value: AnnouncementPriority.URGENT, label: 'Urgent' }
  ];

  loading = false;

  constructor(
    private announcementService: AnnouncementService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {
    // TODO: Get societyId from user context or route params
    this.societyId = '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83'; // Temporary hardcoded
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(page: number = 1): void {
    if (!this.societyId) {
      this.snackBar.open('Society ID is required', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    if (this.isAdminView) {
      // Admin view with filters
      const filter: AnnouncementFilterRequest = {
        societyId: this.societyId,
        status: this.selectedStatus || undefined,
        priority: this.selectedPriority || undefined,
        searchTerm: this.searchTerm || undefined,
        includePinnedOnly: false,
        pageNo: page,
        pageSize: this.pageSize
      };

      this.announcementService.getFilteredAnnouncements(filter).subscribe({
        next: (response: any) => {
          console.log('Admin view - Filtered announcements response:', response);
          // Handle different response statuses (SUCX001, SUCCESS, etc.)
          if (response && (response.status === 'SUCX001' || response.status === 'SUCCESS' || response.status === '200') && response.data) {
            const allAnnouncements = response.data.content || [];
            this.totalElements = response.data.totalElements || allAnnouncements.length;
            this.totalPages = response.data.totalPages || 1;
            this.currentPage = response.data.currentPage || page;
            
            // Separate pinned announcements
            this.pinnedAnnouncements = allAnnouncements.filter((a: Announcement) => a.isPinned);
            
            // Regular announcements (exclude pinned ones from main list to avoid duplicates)
            this.announcements = allAnnouncements.filter((a: Announcement) => !a.isPinned);
            
            console.log('Admin view - Total:', allAnnouncements.length, 'Pinned:', this.pinnedAnnouncements.length, 'Regular:', this.announcements.length);
          } else {
            console.log('Admin view - No data in response, response structure:', response);
            this.announcements = [];
            this.pinnedAnnouncements = [];
            this.totalElements = 0;
            this.totalPages = 0;
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading announcements:', error);
          this.snackBar.open('Failed to load announcements', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      // Resident view - only active announcements
      this.announcementService.getActiveAnnouncements(this.societyId, page, this.pageSize).subscribe({
        next: (response: any) => {
          console.log('Resident view - Active announcements response:', response);
          // Handle different response statuses (SUCX001, SUCCESS, etc.)
          if (response && (response.status === 'SUCX001' || response.status === 'SUCCESS' || response.status === '200') && response.data) {
            const allAnnouncements = response.data.content || [];
            this.totalElements = response.data.totalElements || allAnnouncements.length;
            this.totalPages = response.data.totalPages || 1;
            this.currentPage = response.data.currentPage || page;
            
            // Separate pinned announcements
            this.pinnedAnnouncements = allAnnouncements.filter((a: Announcement) => a.isPinned);
            
            // Regular announcements (exclude pinned ones from main list to avoid duplicates)
            this.announcements = allAnnouncements.filter((a: Announcement) => !a.isPinned);
            
            console.log('Resident view - Total:', allAnnouncements.length, 'Pinned:', this.pinnedAnnouncements.length, 'Regular:', this.announcements.length);
          } else {
            console.log('Resident view - No data in response, response structure:', response);
            this.announcements = [];
            this.pinnedAnnouncements = [];
            this.totalElements = 0;
            this.totalPages = 0;
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error loading announcements (resident view):', error);
          console.error('Error details:', error.error);
          this.snackBar.open('Failed to load announcements', 'Close', { duration: 3000 });
          this.announcements = [];
          this.pinnedAnnouncements = [];
          this.loading = false;
        }
      });
    }
  }

  onFilterChange(): void {
    this.loadAnnouncements(1);
  }

  onSearch(): void {
    this.loadAnnouncements(1);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadAnnouncements(event.pageIndex + 1);
  }

  viewAnnouncement(announcementId: string): void {
    // Find the announcement in the list
    const announcement = [...this.pinnedAnnouncements, ...this.announcements]
      .find(a => a.announcementId === announcementId);
    
    if (announcement) {
      // Open dialog with announcement details
      this.dialog.open(AnnouncementDetailDialogComponent, {
        width: '700px',
        maxWidth: '90vw',
        data: announcement,
        disableClose: false
      });
    } else {
      // If not found in current list, fetch it from API
      this.announcementService.getAnnouncementById(announcementId).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.dialog.open(AnnouncementDetailDialogComponent, {
              width: '700px',
              maxWidth: '90vw',
              data: response.data,
              disableClose: false
            });
          } else {
            this.toastService.error('Announcement not found');
          }
        },
        error: (error) => {
          console.error('Error fetching announcement:', error);
          this.toastService.error('Failed to load announcement details');
        }
      });
    }
  }

  createAnnouncement(): void {
    const dialogRef = this.dialog.open(CreateAnnouncementDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload announcements after successful creation
        this.loadAnnouncements(this.currentPage);
        this.toastService.success('Announcement created successfully!');
      }
    });
  }

  editAnnouncement(event: Event, announcement: Announcement): void {
    event.stopPropagation(); // Prevent card click from firing
    
    const dialogRef = this.dialog.open(EditAnnouncementDialogComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { announcement },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload announcements after successful update
        this.loadAnnouncements(this.currentPage);
      }
    });
  }

  toggleAdminView(): void {
    this.isAdminView = !this.isAdminView;
    this.loadAnnouncements(1);
  }

  getPriorityClass(priority: AnnouncementPriority): string {
    const classMap: Record<AnnouncementPriority, string> = {
      [AnnouncementPriority.LOW]: 'priority-low',
      [AnnouncementPriority.NORMAL]: 'priority-normal',
      [AnnouncementPriority.HIGH]: 'priority-high',
      [AnnouncementPriority.URGENT]: 'priority-urgent'
    };
    return classMap[priority] || '';
  }

  getPriorityLabel(priority: AnnouncementPriority): string {
    const labelMap: Record<AnnouncementPriority, string> = {
      [AnnouncementPriority.LOW]: 'Low',
      [AnnouncementPriority.NORMAL]: 'Normal',
      [AnnouncementPriority.HIGH]: 'High',
      [AnnouncementPriority.URGENT]: 'Urgent'
    };
    return labelMap[priority] || priority;
  }

  getStatusLabel(status: AnnouncementStatus): string {
    const statusMap: Record<AnnouncementStatus, string> = {
      [AnnouncementStatus.DRAFT]: 'Draft',
      [AnnouncementStatus.SCHEDULED]: 'Scheduled',
      [AnnouncementStatus.ACTIVE]: 'Active',
      [AnnouncementStatus.EXPIRED]: 'Expired',
      [AnnouncementStatus.ARCHIVED]: 'Archived'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isExpired(announcement: Announcement): boolean {
    if (!announcement.expiresAt) return false;
    return new Date(announcement.expiresAt) < new Date();
  }

  isScheduled(announcement: Announcement): boolean {
    if (!announcement.scheduledAt) return false;
    return new Date(announcement.scheduledAt) > new Date();
  }

  isEdited(announcement: Announcement): boolean {
    // Check if announcement was edited (updatedAt exists and differs from createdAt)
    if (!announcement.updatedAt || !announcement.createdAt) return false;
    return new Date(announcement.updatedAt).getTime() > new Date(announcement.createdAt).getTime();
  }

  formatUpdatedDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

