import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Universal Converter Hub — Free Online File Converter',
  },
  {
    path: 'image-to-pdf',
    loadComponent: () =>
      import('./features/image-to-pdf/image-to-pdf.component').then((m) => m.ImageToPdfComponent),
    title: 'Image to PDF — Converter Hub',
  },
  {
    path: 'pdf-to-word',
    loadComponent: () =>
      import('./features/pdf-to-word/pdf-to-word.component').then((m) => m.PdfToWordComponent),
    title: 'PDF to Word — Converter Hub',
  },
  {
    path: 'word-to-pdf',
    loadComponent: () =>
      import('./features/word-to-pdf/word-to-pdf.component').then((m) => m.WordToPdfComponent),
    title: 'Word to PDF — Converter Hub',
  },
  {
    path: 'pdf-editor',
    loadComponent: () =>
      import('./features/pdf-editor/pdf-editor.component').then((m) => m.PdfEditorComponent),
    title: 'PDF Editor — Converter Hub',
  },
  {
    path: 'image-editor',
    loadComponent: () =>
      import('./features/image-editor/image-editor.component').then((m) => m.ImageEditorComponent),
    title: 'Image Editor — Converter Hub',
  },
  {
    path: 'compress',
    loadComponent: () =>
      import('./features/compress/compress.component').then((m) => m.CompressComponent),
    title: 'Compress Files — Converter Hub',
  },
  {
    path: 'text-to-pdf',
    loadComponent: () =>
      import('./features/text-to-pdf/text-to-pdf.component').then((m) => m.TextToPdfComponent),
    title: 'Text to PDF — Converter Hub',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Login — Converter Hub',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Register — Converter Hub',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard — Converter Hub',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found — Converter Hub',
  },
];
