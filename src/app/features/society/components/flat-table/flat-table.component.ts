import { Component, OnInit } from '@angular/core';
import { SocietyService } from 'app/features/society/services/society.service';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from 'app/features/society/components/filters/filters.component';

@Component({
  selector: 'app-flat-table',
  standalone: true,
   imports: [CommonModule, FiltersComponent], 
  templateUrl: './flat-table.component.html',
  styleUrls: ['./flat-table.component.scss']
})
export class FlatTableComponent implements OnInit {

  flats: any[] = [];
  totalPages = 0;
  totalElements = 0;
  currentPage = 1;
  pageSize = 2;
  filterData: any = {}; // 🔹 filter ka data store karega

  constructor(private societyService: SocietyService) {}

  ngOnInit(): void {
    this.loadFlats();
  }

  loadFlats(page: number = 1): void {
    const payload = {
      createdBy: '',
      societyId: '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83',
      towerId: this.filterData.towerId || '',
      flatNo: this.filterData.flatNo || '',
      floorNo: this.filterData.floorNo || '',
      status: this.filterData.status || '',
      pageNo: page,
      pageSize: this.pageSize
    };

    this.societyService.getFlatsPaginated(payload).subscribe({
      next: (res) => {
        if (res.status === 'SUCX001') {
          this.flats = res.data.content;
          this.totalPages = res.data.totalPages;
          this.totalElements = res.data.totalElements;
          this.currentPage = res.data.currentPage;
        } else {
          this.flats = [];
        }
      },
      error: (err) => {
        console.error('Error fetching flats:', err);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadFlats(page);
    }
  }

  // 🔹 Filter ka event listener
  onFilterChange(filters: any): void {
    this.filterData = filters;
    this.loadFlats(1); // filter lagate hi page 1 pe chala jaaye
  }
}
