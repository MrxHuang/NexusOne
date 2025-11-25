import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { LucideAngularModule, Bell, Search, Settings, X, Info, AlertTriangle, CheckCircle } from 'lucide-angular';
import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      
      <!-- Search Bar -->
      <div class="flex items-center w-96 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-400 mr-2"></lucide-icon>
        <input type="text" placeholder="Search projects, researchers..." class="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400">
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        
        <!-- Settings Button -->
        <button 
          routerLink="/settings"
          class="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <lucide-icon [img]="SettingsIcon" class="w-5 h-5"></lucide-icon>
        </button>

        <!-- Notifications -->
        <div class="relative">
          <button 
            (click)="toggleNotifications()"
            class="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
            <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
            <span *ngIf="notificationService.unreadCount() > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <!-- Notification Dropdown -->
          <div *ngIf="showNotifications()" 
               class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
            <div class="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 class="font-semibold text-slate-900 text-sm">Notifications</h3>
              <button (click)="markAllRead()" class="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
            </div>
            
            <div class="max-h-[400px] overflow-y-auto">
              <div *ngIf="notificationService.notifications().length === 0" class="p-8 text-center text-slate-500 text-sm">
                No notifications
              </div>

              <div *ngFor="let note of notificationService.notifications()" 
                   [class.bg-indigo-50/30]="!note.read"
                   class="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3">
                <div [ngSwitch]="note.type" class="mt-1">
                  <div *ngSwitchCase="'success'" class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <lucide-icon [img]="CheckCircleIcon" class="w-4 h-4"></lucide-icon>
                  </div>
                  <div *ngSwitchCase="'warning'" class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <lucide-icon [img]="AlertTriangleIcon" class="w-4 h-4"></lucide-icon>
                  </div>
                  <div *ngSwitchCase="'error'" class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
                  </div>
                  <div *ngSwitchDefault class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <lucide-icon [img]="InfoIcon" class="w-4 h-4"></lucide-icon>
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-slate-900">{{ note.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ note.message }}</p>
                  <p class="text-[10px] text-slate-400 mt-1.5">{{ formatTime(note.time) }}</p>
                </div>
                <div *ngIf="!note.read" class="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
              </div>
            </div>
          </div>
          
          <!-- Backdrop to close -->
          <div *ngIf="showNotifications()" (click)="showNotifications.set(false)" class="fixed inset-0 z-40 bg-transparent cursor-default"></div>
        </div>

      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  notificationService = inject(NotificationService);
  
  showNotifications = signal(false);

  // Icons
  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly SettingsIcon = Settings;
  readonly CheckCircleIcon = CheckCircle;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;
  readonly InfoIcon = Info;

  ngOnInit() {
    // Load notifications when component initializes
    this.notificationService.loadNotifications();
  }

  toggleNotifications() {
    this.showNotifications.update(v => !v);
  }

  markAllRead() {
    this.notificationService.markAllAsRead();
  }

  formatTime(date: Date): string {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}
