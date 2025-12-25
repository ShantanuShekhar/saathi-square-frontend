import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnnouncementService } from '../../features/announcements/services/announcement.service';
import { Announcement } from '../../features/announcements/models/announcement.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.scss'],
})
export class AnnouncementCardComponent implements OnInit {
  announcements: Announcement[] = [];
  loading = false;
  societyId: string = '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83'; // Temporary default

  constructor(
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.loading = true;
    this.announcementService.getActiveAnnouncements(this.societyId, 1, 5).subscribe({
      next: (response) => {
        this.loading = false;
        if (response && response.data && response.data.content) {
          this.announcements = response.data.content;
        }
      },
      error: (error) => {
        console.error('Error loading announcements:', error);
        this.loading = false;
      }
    });
  }

  viewAllAnnouncements(): void {
    this.router.navigate(['/announcements']);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
