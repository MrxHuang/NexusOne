import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BentoSize = 'small' | 'medium' | 'large' | 'wide' | 'tall';
export type BentoVariant = 'default' | 'gradient' | 'glass';

@Component({
  selector: 'app-bento-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="[
      'bento-card h-full flex flex-col relative overflow-hidden',
      getSizeClass(),
      getVariantClass()
    ]">
      <ng-content></ng-content>
    </div>
  `
})
export class BentoCardComponent {
  @Input() size: BentoSize = 'medium';
  @Input() variant: BentoVariant = 'default';
  @Input() className: string = '';

  getSizeClass(): string {
    switch (this.size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'medium': return 'col-span-1 row-span-1 md:col-span-1 md:row-span-1';
      case 'large': return 'col-span-1 row-span-1 md:col-span-2 md:row-span-2';
      case 'wide': return 'col-span-1 row-span-1 md:col-span-2 md:row-span-1';
      case 'tall': return 'col-span-1 row-span-2 md:col-span-1 md:row-span-2';
      default: return '';
    }
  }

  getVariantClass(): string {
    switch (this.variant) {
      case 'gradient': return 'bg-gradient-to-br from-white to-indigo-50 border-indigo-100';
      case 'glass': return 'bg-white/80 backdrop-blur-sm border-white/50';
      default: return 'bg-white';
    }
  }
}
