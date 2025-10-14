import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { StatsCardComponent } from "./stats-card.component";
import { AnnouncementCardComponent } from "./announcement-card.component";
import { MaintenanceStatusComponent } from './maintenance-status.component';
import { SocietyService } from 'app/core/services/society.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [MatCard, StatsCardComponent, AnnouncementCardComponent,MaintenanceStatusComponent]
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

  constructor(private societyService: SocietyService) {}
  ngOnInit(): void {
  const userId = '40b58d3e-3e20-42f7-b3b2-4d6ffe294c89';

  this.societyService.getSocietyCount(userId).subscribe({
    next: (response) => {
      console.log("getting response: {}",response);
      
      if (response.status === 'SUCX001') {
        const data = response.data;
        this.societyCount = data.societyCount;
        this.towerCount = data.towerCount;
        this.floorCount = data.floorCount;
        this.flatCount = data.flatCount;
      } else {
        console.warn('Failed:', response.message);
      }
    },
    error: (error:any) => {
      console.error('API error:', error);
    }
  });
  }
}
