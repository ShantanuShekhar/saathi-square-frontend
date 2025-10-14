import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

  profileImage = 'assets/shantanu.jpeg'; // Default image path
  userName = 'Shantanu Shekhar'; // Static name, baad me API se fetch kar sakte ho
  userRole = 'Admin'; // Static role, baad me auth service se aa jayega
}
