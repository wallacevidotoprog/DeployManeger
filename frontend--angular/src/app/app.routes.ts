import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { AuthLoginComponent } from './page/login/auth-login/auth-login.component';
import { ProjectsComponent } from './page/projects/projects.component';

export const routes: Routes = [
  { path: 'auth', component: AuthLoginComponent, title: 'Login do Usuario' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard', canActivate: [authGuard] },
  { path: 'projects', component: ProjectsComponent, title: 'Projects', canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' }
];
