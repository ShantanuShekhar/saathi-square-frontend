import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './features/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 🔹 Subscribe login state
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status && this.router.url !== '/login';
    });

    // 🔹 Track route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // 🔹 Only show toggle if logged in and not login page
      this.isLoggedIn = this.authService.isAuthenticated() && event.url !== '/login';
    });
  }
}
