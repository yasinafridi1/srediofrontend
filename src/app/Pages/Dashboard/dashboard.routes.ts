import { DashboardLayoutComponent } from '@Layouts/dashboard-layout/dashboard-layout.component';
import { Routes } from '@angular/router';
import { HomeComponent } from '@Pages/Dashboard/home/home.component';
import { ProfileComponent } from '@Pages/Dashboard/profile/profile.component';
import { ReposComponent } from '@Pages/Dashboard/repos/repos.component';
import { RepoDetailComponent } from '@Pages/Dashboard/repo-detail/repo-detail.component';
import { AirtableComponent } from '@Pages/Dashboard/airtable/airtable.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HomeComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'repos', component: ReposComponent },
      { path: 'airtable', component: AirtableComponent },
      { path: 'repo/detail/:repoId', component: RepoDetailComponent },
    ],
  },
];
