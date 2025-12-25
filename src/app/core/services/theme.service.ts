import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';
  private readonly themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.getInitialTheme());
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  isDarkMode(): boolean {
    return this.getCurrentTheme() === 'dark';
  }

  toggleTheme(): void {
    const newTheme = this.getCurrentTheme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark-theme');
      bodyElement.classList.add('dark-theme');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark-theme');
      bodyElement.classList.remove('dark-theme');
      htmlElement.setAttribute('data-theme', 'light');
    }
  }
}

