import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/user.model';
import { LucideAngularModule, LayoutDashboard, FolderKanban, FileText, Users, Settings, ChevronLeft, ChevronRight, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <aside [class.w-64]="!isCollapsed()" [class.w-20]="isCollapsed()" 
           class="h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 fixed left-0 top-0 z-20">
      
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-slate-100 relative">
        <div class="flex items-center gap-2" [class.justify-center]="isCollapsed()">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <span *ngIf="!isCollapsed()" class="font-bold text-xl text-slate-800 animate-fade-in">NexusOne</span>
        </div>
        
        <button (click)="toggleCollapse()" 
                class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-indigo-600 shadow-sm z-30">
          <lucide-icon [img]="isCollapsed() ? ChevronRightIcon : ChevronLeftIcon" class="w-4 h-4"></lucide-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <a *ngFor="let item of menuItems()" 
           [routerLink]="item.path"
           routerLinkActive="bg-indigo-50 text-indigo-600"
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors group relative">
          
          <lucide-icon [img]="item.icon" class="w-5 h-5 shrink-0"></lucide-icon>
          
          <span *ngIf="!isCollapsed()" class="font-medium text-sm animate-fade-in whitespace-nowrap">{{ item.label }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div *ngIf="isCollapsed()" 
               class="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {{ item.label }}
          </div>
        </a>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3">
          <img [src]="currentUser()?.avatar" alt="User" class="w-10 h-10 rounded-full bg-slate-200">
          <div *ngIf="!isCollapsed()" class="flex-1 min-w-0 animate-fade-in">
            <p class="text-sm font-medium text-slate-900 truncate">{{ currentUser()?.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser()?.role }}</p>
          </div>
          <button (click)="logout()" *ngIf="!isCollapsed()" class="text-slate-400 hover:text-red-500 transition-colors">
            <lucide-icon [img]="LogOutIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  private authService = inject(AuthService);
  
  currentUser = this.authService.currentUser;
  isCollapsed = signal(false);

  // Icons
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly LogOutIcon = LogOut;

  menuItems = computed(() => {
    const role = this.currentUser()?.role;
    const items = [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Projects', path: '/projects', icon: FolderKanban },
    ];

    if (role === UserRole.EVALUATOR || role === UserRole.ADMIN) {
      items.push({ label: 'Evaluations', path: '/evaluations', icon: FileText });
    }

    if (role === UserRole.ADMIN) {
      items.push({ label: 'Team', path: '/team', icon: Users });
      items.push({ label: 'Settings', path: '/settings', icon: Settings });
    }

    return items;
  });

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }
}
