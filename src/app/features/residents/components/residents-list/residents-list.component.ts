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
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ResidentService } from '../../services/resident.service';
import { Resident, ResidentStatus, RelationshipType, ResidentFilterRequest } from '../../models/resident.model';

@Component({
  selector: 'app-residents-list',
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
    MatTableModule,
    MatSnackBarModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './residents-list.component.html',
  styleUrls: ['./residents-list.component.scss']
})
export class ResidentsListComponent implements OnInit {
  residents: Resident[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 20;

  // Filters
  selectedStatus: ResidentStatus | '' = '';
  selectedRelationshipType: RelationshipType | '' = '';
  searchTerm: string = '';
  societyId: string = '';

  statuses = [
    { value: '', label: 'All Status' },
    { value: ResidentStatus.PENDING_VERIFICATION, label: 'Pending Verification' },
    { value: ResidentStatus.ACTIVE, label: 'Active' },
    { value: ResidentStatus.INACTIVE, label: 'Inactive' },
    { value: ResidentStatus.MOVED_OUT, label: 'Moved Out' }
  ];

  relationshipTypes = [
    { value: '', label: 'All Types' },
    { value: RelationshipType.OWNER, label: 'Owner' },
    { value: RelationshipType.TENANT, label: 'Tenant' },
    { value: RelationshipType.FAMILY_MEMBER, label: 'Family Member' },
    { value: RelationshipType.DEPENDENT, label: 'Dependent' }
  ];

  displayedColumns: string[] = ['name', 'contact', 'relationship', 'status', 'flatId', 'actions'];
  loading = false;

  constructor(
    private residentService: ResidentService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    // TODO: Get societyId from user context or route params
    this.societyId = localStorage.getItem('societyId') || '';
  }

  ngOnInit(): void {
    if (this.societyId) {
      this.loadResidents();
    } else {
      this.snackBar.open('Society ID is required', 'Close', { duration: 3000 });
    }
  }

  loadResidents(page: number = 1): void {
    if (!this.societyId) {
      return;
    }

    this.loading = true;
    const filter: ResidentFilterRequest = {
      societyId: this.societyId,
      status: this.selectedStatus || undefined,
      relationshipType: this.selectedRelationshipType || undefined,
      searchTerm: this.searchTerm || undefined,
      pageNo: page,
      pageSize: this.pageSize
    };

    this.residentService.getFilteredResidents(filter).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001' && response.data) {
          this.residents = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.residents = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading residents:', error);
        this.snackBar.open('Failed to load residents', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadResidents(1);
  }

  onSearch(): void {
    this.loadResidents(1);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadResidents(event.pageIndex + 1);
  }

  getStatusColor(status: ResidentStatus): string {
    const statusColors: Record<ResidentStatus, string> = {
      [ResidentStatus.PENDING_VERIFICATION]: 'warn',
      [ResidentStatus.ACTIVE]: 'primary',
      [ResidentStatus.INACTIVE]: '',
      [ResidentStatus.MOVED_OUT]: ''
    };
    return statusColors[status] || '';
  }

  getStatusLabel(status: ResidentStatus): string {
    const statusMap: Record<ResidentStatus, string> = {
      [ResidentStatus.PENDING_VERIFICATION]: 'Pending',
      [ResidentStatus.ACTIVE]: 'Active',
      [ResidentStatus.INACTIVE]: 'Inactive',
      [ResidentStatus.MOVED_OUT]: 'Moved Out'
    };
    return statusMap[status] || status;
  }

  getRelationshipLabel(type: RelationshipType): string {
    const typeMap: Record<RelationshipType, string> = {
      [RelationshipType.OWNER]: 'Owner',
      [RelationshipType.TENANT]: 'Tenant',
      [RelationshipType.FAMILY_MEMBER]: 'Family',
      [RelationshipType.DEPENDENT]: 'Dependent'
    };
    return typeMap[type] || type;
  }

  viewResident(residentId: string): void {
    this.router.navigate(['/residents', residentId]);
  }

  editResident(residentId: string): void {
    this.router.navigate(['/residents', residentId, 'edit']);
  }

  verifyResident(residentId: string): void {
    this.residentService.verifyResident(residentId).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001') {
          this.snackBar.open('Resident verified successfully', 'Close', { duration: 3000 });
          this.loadResidents(this.currentPage);
        }
      },
      error: (error: any) => {
        this.snackBar.open('Failed to verify resident', 'Close', { duration: 3000 });
      }
    });
  }

  moveOutResident(residentId: string): void {
    if (confirm('Are you sure you want to mark this resident as moved out?')) {
      this.residentService.moveOutResident(residentId).subscribe({
        next: (response: any) => {
          if (response.status === 'SUCX001') {
            this.snackBar.open('Resident marked as moved out', 'Close', { duration: 3000 });
            this.loadResidents(this.currentPage);
          }
        },
        error: (error: any) => {
          this.snackBar.open('Failed to move out resident', 'Close', { duration: 3000 });
        }
      });
    }
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
    const colors = ['#2196f3', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00bcd4'];
    const index = name.length % colors.length;
    return colors[index];
  }
}

