import { DashboardLayoutComponent } from '@Layouts/dashboard-layout/dashboard-layout.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'dashboard', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
];
