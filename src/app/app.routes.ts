import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      { 
        path: 'projects', 
        loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent) 
      },
      { 
        path: 'projects/:id', 
        loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) 
      },
      { 
        path: 'evaluations', 
        loadComponent: () => import('./pages/evaluations/evaluations.component').then(m => m.EvaluationsComponent) 
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
