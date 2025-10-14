import { Component, Input } from '@angular/core';
import { Flat } from '../../models/flat.model';

@Component({
  selector: 'app-flat-details',
  templateUrl: './flat-details.component.html',
  styleUrls: ['./flat-details.component.scss']
})
export class FlatDetailsComponent {
  @Input() flat!: Flat;
}
