import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <!-- Sidebar -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Wrapper -->
      <div class="flex-1 flex flex-col transition-all duration-300 ml-64"> <!-- Margin matches sidebar width -->
        
        <!-- Navbar -->
        <app-navbar></app-navbar>

        <!-- Page Content -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-7xl mx-auto animate-fade-in">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  // Logic for responsive sidebar margin could be added here if needed
  // For now, we assume desktop-first with fixed width
}
