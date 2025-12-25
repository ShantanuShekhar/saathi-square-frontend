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
import { MatBadgeModule } from '@angular/material/badge';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint, ComplaintStatus, ComplaintPriority, ComplaintCategory, ComplaintFilterRequest } from '../../models/complaint.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-complaints-list',
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
    MatBadgeModule,
    DatePipe
  ],
  templateUrl: './complaints-list.component.html',
  styleUrls: ['./complaints-list.component.scss']
})
export class ComplaintsListComponent implements OnInit {
  complaints: Complaint[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 12;

  // Filters
  selectedCategory: ComplaintCategory | '' = '';
  selectedPriority: ComplaintPriority | '' = '';
  selectedStatus: ComplaintStatus | '' = '';
  searchTerm: string = '';
  societyId: string = '';

  categories = [
    { value: '', label: 'All Categories' },
    { value: ComplaintCategory.MAINTENANCE, label: 'Maintenance' },
    { value: ComplaintCategory.SECURITY, label: 'Security' },
    { value: ComplaintCategory.CLEANING, label: 'Cleaning' },
    { value: ComplaintCategory.PARKING, label: 'Parking' },
    { value: ComplaintCategory.NOISE, label: 'Noise' },
    { value: ComplaintCategory.WATER, label: 'Water' },
    { value: ComplaintCategory.ELECTRICITY, label: 'Electricity' },
    { value: ComplaintCategory.LIFT, label: 'Lift' },
    { value: ComplaintCategory.COMMON_AREA, label: 'Common Area' },
    { value: ComplaintCategory.OTHER, label: 'Other' }
  ];

  priorities = [
    { value: '', label: 'All Priorities' },
    { value: ComplaintPriority.LOW, label: 'Low' },
    { value: ComplaintPriority.MEDIUM, label: 'Medium' },
    { value: ComplaintPriority.HIGH, label: 'High' },
    { value: ComplaintPriority.URGENT, label: 'Urgent' }
  ];

  statuses = [
    { value: '', label: 'All Status' },
    { value: ComplaintStatus.OPEN, label: 'Open' },
    { value: ComplaintStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ComplaintStatus.RESOLVED, label: 'Resolved' },
    { value: ComplaintStatus.CLOSED, label: 'Closed' },
    { value: ComplaintStatus.REJECTED, label: 'Rejected' }
  ];

  loading = false;

  constructor(
    private complaintService: ComplaintService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.societyId = localStorage.getItem('societyId') || '';
  }

  ngOnInit(): void {
    if (this.societyId) {
      this.loadComplaints();
    } else {
      this.snackBar.open('Society ID is required', 'Close', { duration: 3000 });
    }
  }

  loadComplaints(page: number = 1): void {
    if (!this.societyId) {
      return;
    }

    this.loading = true;
    const filter: ComplaintFilterRequest = {
      societyId: this.societyId,
      category: this.selectedCategory || undefined,
      priority: this.selectedPriority || undefined,
      status: this.selectedStatus || undefined,
      searchTerm: this.searchTerm || undefined,
      pageNo: page,
      pageSize: this.pageSize
    };

    this.complaintService.getFilteredComplaints(filter).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001' && response.data) {
          this.complaints = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.complaints = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading complaints:', error);
        this.snackBar.open('Failed to load complaints', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusCount(status: string): number {
    return this.complaints.filter(c => c.status === status).length;
  }

  onFilterChange(): void {
    this.loadComplaints(1);
  }

  onSearch(): void {
    this.loadComplaints(1);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadComplaints(event.pageIndex + 1);
  }

  getStatusColor(status: ComplaintStatus): string {
    const statusColors: Record<ComplaintStatus, string> = {
      [ComplaintStatus.OPEN]: 'warn',
      [ComplaintStatus.IN_PROGRESS]: 'primary',
      [ComplaintStatus.RESOLVED]: 'primary',
      [ComplaintStatus.CLOSED]: '',
      [ComplaintStatus.REJECTED]: 'warn'
    };
    return statusColors[status] || '';
  }

  getStatusLabel(status: ComplaintStatus): string {
    const statusMap: Record<ComplaintStatus, string> = {
      [ComplaintStatus.OPEN]: 'Open',
      [ComplaintStatus.IN_PROGRESS]: 'In Progress',
      [ComplaintStatus.RESOLVED]: 'Resolved',
      [ComplaintStatus.CLOSED]: 'Closed',
      [ComplaintStatus.REJECTED]: 'Rejected'
    };
    return statusMap[status] || status;
  }

  getPriorityLabel(priority: ComplaintPriority): string {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  }

  getCategoryLabel(category: ComplaintCategory): string {
    const categoryMap: Record<ComplaintCategory, string> = {
      [ComplaintCategory.MAINTENANCE]: 'Maintenance',
      [ComplaintCategory.SECURITY]: 'Security',
      [ComplaintCategory.CLEANING]: 'Cleaning',
      [ComplaintCategory.PARKING]: 'Parking',
      [ComplaintCategory.NOISE]: 'Noise',
      [ComplaintCategory.WATER]: 'Water',
      [ComplaintCategory.ELECTRICITY]: 'Electricity',
      [ComplaintCategory.LIFT]: 'Lift',
      [ComplaintCategory.COMMON_AREA]: 'Common Area',
      [ComplaintCategory.OTHER]: 'Other'
    };
    return categoryMap[category] || category;
  }

  viewComplaint(complaintId: string): void {
    this.router.navigate(['/complaints', complaintId]);
  }
}

