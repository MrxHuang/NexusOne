import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
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
        path: 'projects/new', 
        loadComponent: () => import('./pages/project-form/project-form.component').then(m => m.ProjectFormComponent) 
      },
      { 
        path: 'projects/:id', 
        loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent) 
      },
      { 
        path: 'projects/:id/edit', 
        loadComponent: () => import('./pages/project-form/project-form.component').then(m => m.ProjectFormComponent) 
      },
      { 
        path: 'evaluations', 
        loadComponent: () => import('./pages/evaluations/evaluations.component').then(m => m.EvaluationsComponent) 
      },
      { 
        path: 'team', 
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent) 
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) 
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
