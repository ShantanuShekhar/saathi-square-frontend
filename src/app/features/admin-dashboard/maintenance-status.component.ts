import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-maintenance-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './maintenance-status.component.html',
  styleUrls: ['./maintenance-status.component.scss'],
})
export class MaintenanceStatusComponent {
  maintenanceTasks = [
    { name: 'Elevator A', status: 'Completed', icon: 'check_circle', color: 'green' },
    { name: 'Block B Water Tank', status: 'Pending', icon: 'hourglass_empty', color: 'orange' },
    { name: 'CCTV Inspection', status: 'Scheduled', icon: 'schedule', color: 'blue' },
  ];
}
