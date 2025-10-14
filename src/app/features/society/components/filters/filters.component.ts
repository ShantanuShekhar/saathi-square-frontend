import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
  @Output() filterChanged = new EventEmitter<any>();

  towerId = '';
  flatNo = '';
  floorNo = '';
  status = '';

  applyFilter() {
    this.filterChanged.emit({
      towerId: this.towerId,
      flatNo: this.flatNo,
      floorNo: this.floorNo,
      status: this.status
    });
  }

  resetFilter() {
    this.towerId = '';
    this.flatNo = '';
    this.floorNo = '';
    this.status = '';
    this.applyFilter();
  }
}
