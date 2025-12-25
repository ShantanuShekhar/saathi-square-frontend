import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StatsCardComponent } from "./stats-card.component";
import { AnnouncementCardComponent } from "./announcement-card.component";
import { MaintenanceStatusComponent } from './maintenance-status.component';
import { SocietyService } from '../../core/services/society.service';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CreateAnnouncementDialogComponent } from '../../features/announcements/components/create-announcement-dialog/create-announcement-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    StatsCardComponent,
    AnnouncementCardComponent,
    MaintenanceStatusComponent
  ]
})
export class DashboardComponent implements OnInit {
  userName: string = 'Resident'; // Can be replaced by fetched user info

  // Example stats (could come from an API)
 societyCount = 0;
  towerCount = 0;
  floorCount = 0;
  flatCount = 0;

  announcements: string[] = [
    '🚿 Water supply will be off today from 2PM - 4PM.',
    '🚗 New parking rules take effect from July 1st.',
    '🧹 Deep cleaning scheduled for Block A on Sunday.'
  ];

  isLoading = false;

  constructor(
    private societyService: SocietyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    // TODO: Get userId from auth service or JWT token
    // For now, using a placeholder - replace with actual user ID from auth
    const userId = '40b58d3e-3e20-42f7-b3b2-4d6ffe294c89';
    this.loadDashboardData(userId);
  }

  loadDashboardData(userId: string): void {
    this.isLoading = true;
    console.log('Dashboard: Loading data for userId:', userId);
    
    this.societyService.getSocietyCount(userId).subscribe({
      next: (response) => {
        console.log('Dashboard: API response received:', response);
        this.isLoading = false;
        
        if (response && response.status === 'SUCX001' && response.data) {
          const data = response.data;
          // Explicitly convert to number and handle null/undefined
          this.societyCount = Number(data.societyCount) || 0;
          this.towerCount = Number(data.towerCount) || 0;
          this.floorCount = Number(data.floorCount) || 0;
          this.flatCount = Number(data.flatCount) || 0;
          
          console.log('Dashboard: Data loaded successfully', {
            societyCount: this.societyCount,
            towerCount: this.towerCount,
            floorCount: this.floorCount,
            flatCount: this.flatCount,
            rawData: data
          });
          
          // Force change detection to ensure UI updates
          this.cdr.detectChanges();
          console.log('Dashboard: Component properties updated, change detection triggered');
        } else {
          console.warn('Dashboard: Invalid response structure:', response);
          // Set defaults to show something
          this.societyCount = 0;
          this.towerCount = 0;
          this.floorCount = 0;
          this.flatCount = 0;
        }
      },
      error: (error: any) => {
        console.error('Dashboard: API error:', error);
        console.error('Dashboard: Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        this.isLoading = false;
        // Keep defaults at 0
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.success('Logout successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if API fails, clear local state and redirect
        this.toastService.success('Logged out successfully');
        this.router.navigate(['/login']);
      }
    });
  }

  createQuickAnnouncement(): void {
    const dialogRef = this.dialog.open(CreateAnnouncementDialogComponent, {
      width: '700px',
      maxWidth: '90vw',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optionally reload announcements or show success message
        this.toastService.success('Announcement created successfully!');
        // The announcement card will reload on next view or we can trigger a reload event
      }
    });
  }
}
