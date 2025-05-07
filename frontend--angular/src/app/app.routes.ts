import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { AuthLoginComponent } from './page/login/auth-login/auth-login.component';
import { CreateProjectComponent } from './page/projects/create-project/create-project.component';
import { ProjectsComponent } from './page/projects/process/projects.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      {
        path: 'projects',
        children: [
          { path: 'process', component: ProjectsComponent, title: 'New Project' },
          { path: 'project-path', component: CreateProjectComponent, title: 'Project Path' },
        ],
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: AuthLoginComponent, title: 'Login do Usuario' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
