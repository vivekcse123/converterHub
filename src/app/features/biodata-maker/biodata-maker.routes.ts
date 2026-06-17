import { Routes } from '@angular/router';

export const biodataMakerRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/builder/biodata-maker.component').then(m => m.BiodataMakerComponent),
    title: 'Free Biodata Maker — Create Marriage & Professional Biodata | ApnaConverter',
    data: {
      description:
        'Create a professional biodata online for free. Choose from marriage biodata or professional biodata templates, upload your photo, fill in details, and download a polished PDF instantly — no sign-up required.',
    },
  },
];
