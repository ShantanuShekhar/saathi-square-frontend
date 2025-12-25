import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  menuOpen = false;
  email = 'info@sathisquare.com';
  scrolled = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

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
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.menuOpen = false; // Close mobile menu after click
  }
}