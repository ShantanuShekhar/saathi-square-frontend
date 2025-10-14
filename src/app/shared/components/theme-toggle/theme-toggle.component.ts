import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isDarkMode = false;

toggleTheme() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('dark-theme', this.isDarkMode);
  localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
}

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }
}
