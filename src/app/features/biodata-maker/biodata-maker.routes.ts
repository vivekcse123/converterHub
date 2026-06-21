import { Routes } from '@angular/router';

export const biodataMakerRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/builder/biodata-maker.component').then(m => m.BiodataMakerComponent),
    title: 'Free Biodata Maker & Biodata Templates | ApnaConverter',
    data: {
      description:
        'Create marriage or professional biodata online for free. Multiple templates, photo upload, family details, and instant PDF download. No sign-up required.',
    },
  },
];
