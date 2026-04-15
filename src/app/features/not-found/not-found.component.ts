import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[70vh] flex items-center justify-center px-4">
      <div class="text-center animate-bounce-in">
        <p class="text-8xl font-black text-primary-600 dark:text-primary-400">404</p>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-white mt-4 mb-2">Page not found</h1>
        <p class="text-slate-500 dark:text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <a routerLink="/" class="btn btn-primary btn-lg">← Back to Home</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
