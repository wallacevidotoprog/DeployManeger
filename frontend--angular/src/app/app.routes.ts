import { Routes } from '@angular/router';
import { AuthLoginComponent } from './page/login/auth-login/auth-login.component';
import { AppComponent } from './app.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { ProjectsComponent } from './page/projects/projects.component';

export const routes: Routes = [
  { path: 'auth', component: AuthLoginComponent, title: 'Login do Usuario' },
  { path: 'dashboard', component: DashboardComponent, title: 'Dashboard'},
  { path: 'projects', component: ProjectsComponent, title: 'Projects'},
];
