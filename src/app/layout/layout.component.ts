import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ThemeToggleComponent } from '../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SideNavComponent,
    ThemeToggleComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  title = 'Saathi Square';
  isMenuOpen = true;

  ngOnInit(): void {
    // Smooth sidebar animation on init
    setTimeout(() => {
      document.querySelector('.sidenav')?.classList.add('loaded');
    }, 100);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
