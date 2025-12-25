import { Component, OnInit } from '@angular/core';
import { SocietyService } from '../../../../core/services/society.service';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from '../filters/filters.component';

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
  pageSize = 10; // Increased from 2 for better UX
  filterData: any = {};
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private societyService: SocietyService) {}

  ngOnInit(): void {
    this.loadFlats();
  }

  loadFlats(page: number = 1): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    // TODO: Get societyId from user's selected society or from auth service
    // For now, using a placeholder - replace with actual society ID
    const payload = {
      createdBy: '',
      societyId: '7d9c53c1-6c6e-4adf-8d48-9f1cfca10a83', // TODO: Get from user context
      towerId: this.filterData.towerId || '',
      flatNo: this.filterData.flatNo || '',
      floorNo: this.filterData.floorNo || '',
      status: this.filterData.status || '',
      pageNo: page,
      pageSize: this.pageSize
    };

    console.log('FlatTable: Loading flats with payload:', payload);

    this.societyService.getFlatsPaginated(payload).subscribe({
      next: (res) => {
        console.log('FlatTable: API response received:', res);
        this.isLoading = false;
        
        if (res && res.status === 'SUCX001' && res.data) {
          this.flats = res.data.content || [];
          this.totalPages = res.data.totalPages || 0;
          this.totalElements = res.data.totalElements || 0;
          this.currentPage = res.data.currentPage || 1;
          console.log('FlatTable: Loaded', this.flats.length, 'flats');
        } else {
          console.warn('FlatTable: Invalid response structure:', res);
          this.flats = [];
          this.errorMessage = res?.message || 'No data available';
        }
      },
      error: (err: any) => {
        console.error('FlatTable: API error:', err);
        console.error('FlatTable: Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        this.isLoading = false;
        this.flats = [];
        this.errorMessage = `Failed to load flats: ${err.message || 'Unknown error'}`;
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
