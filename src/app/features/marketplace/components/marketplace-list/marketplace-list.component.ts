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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MarketplaceService } from '../../services/marketplace.service';
import { MarketplacePost, PostType, PostStatus, MarketplacePostFilterRequest } from '../../models/marketplace.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-marketplace-list',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './marketplace-list.component.html',
  styleUrls: ['./marketplace-list.component.scss']
})
export class MarketplaceListComponent implements OnInit {
  posts: MarketplacePost[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 1;
  pageSize = 12;

  // Filters
  selectedPostType: PostType | '' = '';
  selectedStatus: PostStatus | '' = '';
  searchTerm: string = '';
  societyId: string = ''; // Should be set from user's society context

  postTypes = [
    { value: '', label: 'All Types' },
    { value: PostType.SELL, label: 'Sell' },
    { value: PostType.REQUEST, label: 'Request' },
    { value: PostType.GROUP_BUY, label: 'Group Buy' }
  ];

  postStatuses = [
    { value: '', label: 'All Status' },
    { value: PostStatus.ACTIVE, label: 'Active' },
    { value: PostStatus.SOLD, label: 'Sold' },
    { value: PostStatus.CLOSED, label: 'Closed' }
  ];

  loading = false;

  constructor(
    private marketplaceService: MarketplaceService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // TODO: Get societyId from user context or route params
    this.societyId = '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83'; // Temporary hardcoded
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(page: number = 1): void {
    if (!this.societyId) {
      this.snackBar.open('Society ID is required', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const filter: MarketplacePostFilterRequest = {
      societyId: this.societyId,
      postType: this.selectedPostType || undefined,
      status: this.selectedStatus || undefined,
      searchTerm: this.searchTerm || undefined,
      pageNo: page,
      pageSize: this.pageSize
    };

    this.marketplaceService.getFilteredPosts(filter).subscribe({
      next: (response: any) => {
        if (response.status === 'SUCX001' && response.data) {
          this.posts = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.posts = [];
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading posts:', error);
        this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.loadPosts(1);
  }

  onSearch(): void {
    this.loadPosts(1);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.loadPosts(event.pageIndex + 1);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/placeholder-image.png';
    }
  }

  viewPost(postId: string): void {
    this.router.navigate(['/marketplace', postId]);
  }

  createPost(): void {
    this.router.navigate(['/marketplace/create']);
  }

  getPostTypeLabel(type: PostType): string {
    const typeMap: Record<PostType, string> = {
      [PostType.SELL]: 'Sell',
      [PostType.REQUEST]: 'Request',
      [PostType.GROUP_BUY]: 'Group Buy'
    };
    return typeMap[type] || type;
  }

  getStatusLabel(status: PostStatus): string {
    const statusMap: Record<PostStatus, string> = {
      [PostStatus.ACTIVE]: 'Active',
      [PostStatus.SOLD]: 'Sold',
      [PostStatus.CLOSED]: 'Closed',
      [PostStatus.DELETED]: 'Deleted'
    };
    return statusMap[status] || status;
  }

  formatPrice(price?: number): string {
    if (!price) return '';
    return `₹${price.toLocaleString('en-IN')}`;
  }
}

