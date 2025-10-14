import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-announcement-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './announcement-card.component.html',
  styleUrls: ['./announcement-card.component.scss'],
})
export class AnnouncementCardComponent {
  announcements = [
    '🚿 Water supply will be off today from 2PM - 4PM.',
    '🚗 New parking rules take effect from July 1st.',
    '🧹 Deep cleaning scheduled for Block A on Sunday.',
  ];
}
