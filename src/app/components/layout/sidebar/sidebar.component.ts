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
           class="h-screen bg-[#0f172a] border-r border-slate-800 flex flex-col transition-all duration-300 fixed left-0 top-0 z-20 overflow-hidden">
      
      <!-- Background Gradients -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-slate-800 relative z-10">
        <div class="flex items-center gap-2" [class.justify-center]="isCollapsed()">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">N</div>
          <span *ngIf="!isCollapsed()" class="font-bold text-xl text-white animate-fade-in tracking-tight">Nexus<span class="text-indigo-400">One</span></span>
        </div>
        
        <button (click)="toggleCollapse()" 
                class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0f172a] border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all shadow-sm z-30">
          <lucide-icon [img]="isCollapsed() ? ChevronRightIcon : ChevronLeftIcon" class="w-3 h-3"></lucide-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto relative z-10">
        <a *ngFor="let item of menuItems()" 
           [routerLink]="item.path"
           routerLinkActive="bg-indigo-500/10 text-indigo-400 border-indigo-500/50"
           [routerLinkActiveOptions]="{exact: false}"
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent transition-all group relative">
          
          <lucide-icon [img]="item.icon" class="w-5 h-5 shrink-0 transition-colors"></lucide-icon>
          
          <span *ngIf="!isCollapsed()" class="font-medium text-sm animate-fade-in whitespace-nowrap">{{ item.label }}</span>
          
          <!-- Tooltip for collapsed state -->
          <div *ngIf="isCollapsed()" 
               class="absolute left-full ml-2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            {{ item.label }}
          </div>
        </a>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-slate-800 relative z-10">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img [src]="currentUser()?.avatar" alt="User" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700">
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
          </div>
          <div *ngIf="!isCollapsed()" class="flex-1 min-w-0 animate-fade-in">
            <p class="text-sm font-medium text-white truncate">{{ currentUser()?.name }}</p>
            <p class="text-xs text-slate-500 truncate">{{ currentUser()?.role }}</p>
          </div>
          <button (click)="logout()" *ngIf="!isCollapsed()" class="text-slate-500 hover:text-red-400 transition-colors p-1 hover:bg-slate-800 rounded-md">
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
