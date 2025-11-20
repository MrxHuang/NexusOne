import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, LucideIconData, TrendingUp, TrendingDown, Minus } from 'lucide-angular';

@Component({
  selector: 'app-metrics-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="h-full flex flex-col justify-between">
      <div class="flex items-start justify-between">
        <div [ngClass]="[
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
          getIconBgClass()
        ]">
          <lucide-icon [img]="icon" [ngClass]="getIconColorClass()" class="w-5 h-5"></lucide-icon>
        </div>
        
        <div *ngIf="trend" [ngClass]="[
          'flex items-center text-xs font-medium px-2 py-1 rounded-full',
          getTrendBgClass()
        ]">
          <lucide-icon [img]="getTrendIcon()" class="w-3 h-3 mr-1"></lucide-icon>
          <span>{{ trendValue }}</span>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-slate-500 text-sm font-medium">{{ title }}</h3>
        <p class="text-2xl font-bold text-slate-900 mt-1">{{ displayValue() }}</p>
      </div>
    </div>
  `
})
export class MetricsCardComponent implements OnChanges {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() icon!: LucideIconData;
  @Input() color: 'indigo' | 'violet' | 'cyan' | 'green' | 'orange' | 'red' = 'indigo';
  @Input() trend: 'up' | 'down' | 'neutral' | null = null;
  @Input() trendValue: string = '';

  displayValue = signal(0);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.animateValue(changes['value'].currentValue);
    }
  }

  animateValue(target: number) {
    const start = this.displayValue();
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      const current = Math.floor(start + (target - start) * ease);
      this.displayValue.set(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  getIconBgClass(): string {
    const colors = {
      indigo: 'bg-indigo-50',
      violet: 'bg-violet-50',
      cyan: 'bg-cyan-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50'
    };
    return colors[this.color] || colors.indigo;
  }

  getIconColorClass(): string {
    const colors = {
      indigo: 'text-indigo-600',
      violet: 'text-violet-600',
      cyan: 'text-cyan-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      red: 'text-red-600'
    };
    return colors[this.color] || colors.indigo;
  }

  getTrendBgClass(): string {
    switch (this.trend) {
      case 'up': return 'bg-green-50 text-green-700';
      case 'down': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-600';
    }
  }

  getTrendIcon(): LucideIconData {
    switch (this.trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Minus;
    }
  }
}
