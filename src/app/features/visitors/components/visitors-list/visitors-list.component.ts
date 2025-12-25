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
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VisitorService } from '../../services/visitor.service';
import { Visitor, VisitorStatus, VisitorType, VisitorFilterRequest } from '../../models/visitor.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visitors-list',
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
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
    DatePipe
  ],
  templateUrl: './visitors-list.component.html',
  styleUrls: ['./visitors-list.component.scss']
})
export class VisitorsListComponent implements OnInit {
  visitors: Visitor[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 12;

  // Filters
  selectedVisitorType: VisitorType | '' = '';
  selectedStatus: VisitorStatus | '' = '';
  searchTerm: string = '';
  societyId: string = '';

  visitorTypes = [
    { value: '', label: 'All Types' },
    { value: VisitorType.GUEST, label: 'Guest' },
    { value: VisitorType.DELIVERY, label: 'Delivery' },
    { value: VisitorType.SERVICE, label: 'Service' },
    { value: VisitorType.CONTRACTOR, label: 'Contractor' },
    { value: VisitorType.FAMILY, label: 'Family' },
    { value: VisitorType.FRIEND, label: 'Friend' },
    { value: VisitorType.OTHER, label: 'Other' }
  ];

  statuses = [
    { value: '', label: 'All Status' },
    { value: VisitorStatus.PENDING, label: 'Pending' },
    { value: VisitorStatus.APPROVED, label: 'Approved' },
    { value: VisitorStatus.REJECTED, label: 'Rejected' },
    { value: VisitorStatus.CHECKED_IN, label: 'Checked In' },
    { value: VisitorStatus.CHECKED_OUT, label: 'Checked Out' },
    { value: VisitorStatus.CANCELLED, label: 'Cancelled' },
    { value: VisitorStatus.EXPIRED, label: 'Expired' }
  ];

  loading = false;

  constructor(
    private visitorService: VisitorService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.societyId = localStorage.getItem('societyId') || '';
  }

  ngOnInit(): void {
    if (this.societyId) {
      this.loadVisitors();
    } else {
      this.snackBar.open('Society ID is required', 'Close', { duration: 3000 });
    }
  }

  loadVisitors(page: number = 1): void {
    if (!this.societyId) {
      return;
    }

    this.loading = true;
    const filter: VisitorFilterRequest = {
      societyId: this.societyId,
      visitorType: this.selectedVisitorType || undefined,
      status: this.selectedStatus || undefined,
      searchTerm: this.searchTerm || undefined,
      pageNo: page,
      pageSize: this.pageSize
    };

    this.visitorService.getFilteredVisitors(filter).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001' && response.data) {
          this.visitors = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.visitors = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading visitors:', error);
        this.snackBar.open('Failed to load visitors', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadVisitors(1);
  }

  onSearch(): void {
    this.loadVisitors(1);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadVisitors(event.pageIndex + 1);
  }

  getStatusColor(status: VisitorStatus): string {
    const statusColors: Record<VisitorStatus, string> = {
      [VisitorStatus.PENDING]: 'warn',
      [VisitorStatus.APPROVED]: 'primary',
      [VisitorStatus.REJECTED]: 'warn',
      [VisitorStatus.CHECKED_IN]: 'primary',
      [VisitorStatus.CHECKED_OUT]: '',
      [VisitorStatus.CANCELLED]: '',
      [VisitorStatus.EXPIRED]: ''
    };
    return statusColors[status] || '';
  }

  getStatusLabel(status: VisitorStatus): string {
    const statusMap: Record<VisitorStatus, string> = {
      [VisitorStatus.PENDING]: 'Pending',
      [VisitorStatus.APPROVED]: 'Approved',
      [VisitorStatus.REJECTED]: 'Rejected',
      [VisitorStatus.CHECKED_IN]: 'Checked In',
      [VisitorStatus.CHECKED_OUT]: 'Checked Out',
      [VisitorStatus.CANCELLED]: 'Cancelled',
      [VisitorStatus.EXPIRED]: 'Expired'
    };
    return statusMap[status] || status;
  }

  getVisitorTypeLabel(type: VisitorType): string {
    const typeMap: Record<VisitorType, string> = {
      [VisitorType.GUEST]: 'Guest',
      [VisitorType.DELIVERY]: 'Delivery',
      [VisitorType.SERVICE]: 'Service',
      [VisitorType.CONTRACTOR]: 'Contractor',
      [VisitorType.FAMILY]: 'Family',
      [VisitorType.FRIEND]: 'Friend',
      [VisitorType.OTHER]: 'Other'
    };
    return typeMap[type] || type;
  }

  viewVisitor(visitorId: string): void {
    this.router.navigate(['/visitors', visitorId]);
  }

  approveVisitor(visitorId: string): void {
    this.visitorService.approveVisitor(visitorId).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001') {
          this.snackBar.open('Visitor approved successfully', 'Close', { duration: 3000 });
          this.loadVisitors(this.currentPage);
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to approve visitor', 'Close', { duration: 3000 });
      }
    });
  }

  checkInVisitor(visitorId: string): void {
    this.visitorService.checkInVisitor(visitorId).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001') {
          this.snackBar.open('Visitor checked in successfully', 'Close', { duration: 3000 });
          this.loadVisitors(this.currentPage);
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to check in visitor', 'Close', { duration: 3000 });
      }
    });
  }

  checkOutVisitor(visitorId: string): void {
    this.visitorService.checkOutVisitor(visitorId).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001') {
          this.snackBar.open('Visitor checked out successfully', 'Close', { duration: 3000 });
          this.loadVisitors(this.currentPage);
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to check out visitor', 'Close', { duration: 3000 });
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = ['#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#f44336', '#00bcd4'];
    const index = name.length % colors.length;
    return colors[index];
  }
}

