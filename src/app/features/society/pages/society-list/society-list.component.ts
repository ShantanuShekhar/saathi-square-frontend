import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatTableComponent } from '../../components/flat-table/flat-table.component';
import { FlatDetailsComponent } from '../../components/flat-details/flat-details.component';
import { SocietyService } from '../../../core/services/society.service';
import { Flat } from '../../models/flat.model';

@Component({
  selector: 'app-society-list',
  standalone: true,           // ✅ Make it standalone
  imports: [
    CommonModule,
    FormsModule,
    FlatTableComponent,        // ✅ Import the standalone component
    FlatDetailsComponent
  ],
  templateUrl: './society-list.component.html',
  styleUrls: ['./society-list.component.scss']
})
export class SocietyListPageComponent implements OnInit {
  flats: Flat[] = [];
  isLoading: boolean = false;
  selectedFlat?: Flat;

  constructor(private societyService: SocietyService) {}

  ngOnInit() {
    this.loadFlats();
  }

  loadFlats() {
    this.isLoading = true;
    // TODO: Use getFlatsPaginated instead - this component may not be used
    // If needed, implement using getFlatsPaginated with proper payload
    const payload = {
      createdBy: '',
      societyId: '', // TODO: Get from user context
      towerId: '',
      flatNo: '',
      floorNo: '',
      status: '',
      pageNo: 1,
      pageSize: 100
    };
    
    this.societyService.getFlatsPaginated(payload).subscribe({
      next: (response) => {
        if (response && response.status === 'SUCX001' && response.data) {
          this.flats = response.data.content || [];
        } else {
          this.flats = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading flats:', err);
        this.flats = [];
        this.isLoading = false;
      }
    });
  }

  onViewDetails(flat: Flat) {
    this.selectedFlat = flat;
  }
}
