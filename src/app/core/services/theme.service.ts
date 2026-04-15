import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'ch_theme';

  private _theme = signal<Theme>('light');
  readonly theme  = this._theme.asReadonly();
  readonly isDark = () => this._theme() === 'dark';

  initTheme(): void {
    const stored = localStorage.getItem(this.KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    this.applyTheme(resolved);
  }

  toggle(): void {
    this.applyTheme(this._theme() === 'dark' ? 'light' : 'dark');
  }

  private applyTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem(this.KEY, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}
