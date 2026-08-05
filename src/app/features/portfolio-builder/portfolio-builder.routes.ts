import { Routes } from '@angular/router';
import { proGuard } from '../../core/guards/pro.guard';

export const portfolioBuilderRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/editor/portfolio-editor.component').then(m => m.PortfolioEditorComponent),
    canActivate: [proGuard],
    title: 'Portfolio Builder | ApnaConverter',
    data: {
      hideShell: true,
      description: 'Build a stunning, shareable portfolio website with drag-and-drop sections, premium templates, and live customization, no code required.',
    },
  },
];
