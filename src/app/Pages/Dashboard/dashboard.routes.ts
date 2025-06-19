import { DashboardLayoutComponent } from '@Layouts/dashboard-layout/dashboard-layout.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ReposComponent } from '@Pages/repos/repos.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'repos', component: ReposComponent },
    ],
  },
];
