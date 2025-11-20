import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="isOpen()" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
           (click)="close()"></div>

      <!-- Modal Panel -->
      <div class="relative w-full bg-white rounded-xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]"
           [ngClass]="maxWidthClass">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
          <button (click)="close()" class="text-slate-400 hover:text-slate-500 transition-colors">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <ng-content></ng-content>
        </div>

      </div>
    </div>
  `
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Output() closed = new EventEmitter<void>();

  isOpen = signal(false);

  // Icons
  readonly XIcon = X;

  open() {
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen.set(false);
    document.body.style.overflow = '';
    this.closed.emit();
  }

  get maxWidthClass(): string {
    switch (this.maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      default: return 'max-w-md';
    }
  }
}
