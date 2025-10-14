import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatTableComponent } from '../../components/flat-table/flat-table.component';
import { FlatDetailsComponent } from '../../components/flat-details/flat-details.component';
import { SocietyService } from '../../services/society.service';
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
    this.societyService.getFlatsBySociety(1).subscribe({
      next: (data) => { this.flats = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  onViewDetails(flat: Flat) {
    this.selectedFlat = flat;
  }
}
