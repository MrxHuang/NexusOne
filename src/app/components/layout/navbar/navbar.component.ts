import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule, Bell, Search, User } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      
      <!-- Search Bar (Placeholder) -->
      <div class="flex items-center w-96 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-400 mr-2"></lucide-icon>
        <input type="text" placeholder="Search projects, researchers..." class="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400">
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-4">
        
        <!-- Notifications -->
        <button class="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
          <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <!-- User Profile -->
        <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-slate-900">{{ currentUser()?.name }}</p>
            <p class="text-xs text-slate-500">{{ currentUser()?.role }}</p>
          </div>
          <img [src]="currentUser()?.avatar" alt="Profile" class="w-9 h-9 rounded-full bg-slate-200 border border-slate-200">
        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  // Icons
  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly UserIcon = User;
}
