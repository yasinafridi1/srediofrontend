import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@Pages/Dashboard/dashboard.routes').then((c) => c.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('@Pages/Auth/auth.routes').then((c) => c.routes),
  },
];
