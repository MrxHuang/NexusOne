import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X, User } from 'lucide-angular';
import { UserService } from '../../../services/user.service';
import { User as UserModel } from '../../../models/user.model';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">Add Team Member</h3>
          <button (click)="close.emit()" class="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Search -->
        <div class="p-4">
          <div class="relative">
            <lucide-icon [img]="SearchIcon" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></lucide-icon>
            <input 
              type="text" 
              [ngModel]="searchTerm" 
              (ngModelChange)="onSearch($event)"
              placeholder="Search by name or email..." 
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              autoFocus
            >
          </div>
        </div>

        <!-- Results -->
        <div class="max-h-64 overflow-y-auto px-2 pb-2">
          <div *ngIf="loading()" class="flex justify-center py-4">
            <div class="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div *ngIf="!loading() && users().length === 0 && searchTerm" class="text-center py-4 text-slate-500 text-sm">
            No users found.
          </div>

          <div *ngIf="!loading() && users().length > 0" class="space-y-1">
            <button 
              *ngFor="let user of users()" 
              (click)="selectUser(user)"
              class="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left group"
            >
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-slate-900 truncate">{{ user.name }}</div>
                <div class="text-xs text-slate-500 truncate">{{ user.email }}</div>
              </div>
              <div class="text-xs text-slate-400 group-hover:text-indigo-600 font-medium">
                Select
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserSearchModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() select = new EventEmitter<UserModel>();

  private userService = inject(UserService);
  
  searchTerm = '';
  users = signal<UserModel[]>([]);
  loading = signal(false);
  private searchSubject = new Subject<string>();

  // Icons
  readonly XIcon = X;
  readonly SearchIcon = Search;

  constructor() {
    // Setup search with debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading.set(true);
        return this.userService.searchUsers(term);
      })
    ).subscribe((users: UserModel[]) => {
      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        const filtered = users.filter((u: UserModel) => 
          u.name.toLowerCase().includes(term) || 
          u.email.toLowerCase().includes(term)
        );
        this.users.set(filtered);
      } else {
        this.users.set([]);
      }
      this.loading.set(false);
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  selectUser(user: UserModel) {
    this.select.emit(user);
  }
}
