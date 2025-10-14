import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  menuOpen = false;
  email = 'info@sathisquare.com';

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Smooth scroll to section
  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.menuOpen = false; // Close mobile menu after click
  }
}