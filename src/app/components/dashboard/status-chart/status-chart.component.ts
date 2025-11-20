import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { ProjectStatus } from '../../../models/project.model';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="h-full w-full">
      <apx-chart
        [series]="chartOptions.series!"
        [chart]="chartOptions.chart!"
        [labels]="chartOptions.labels!"
        [colors]="chartOptions.colors!"
        [legend]="chartOptions.legend!"
        [dataLabels]="chartOptions.dataLabels!"
        [plotOptions]="chartOptions.plotOptions!"
        [tooltip]="chartOptions.tooltip!"
        [stroke]="chartOptions.stroke!"
      ></apx-chart>
    </div>
  `
})
export class StatusChartComponent implements OnChanges {
  @Input() data: { [key in ProjectStatus]?: number } | undefined;
  @ViewChild('chart') chart!: ChartComponent;

  chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: 'donut',
      height: 220,
      fontFamily: 'Inter, sans-serif'
    },
    labels: ['Active', 'Completed', 'In Review', 'Draft'],
    colors: ['#06b6d4', '#22c55e', '#8b5cf6', '#94a3b8'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        strokeWidth: 0,
        radius: 12
      } as any,
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748b'
            },
            value: {
              fontSize: '20px',
              fontWeight: 700,
              color: '#0f172a'
            }
          }
        }
      }
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: function(val) {
          return val + " Projects"
        }
      }
    },
    stroke: {
      show: false
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      this.updateChart();
    }
  }

  updateChart() {
    if (!this.data) return;

    const active = this.data[ProjectStatus.ACTIVE] || 0;
    const completed = this.data[ProjectStatus.COMPLETED] || 0;
    const review = this.data[ProjectStatus.IN_REVIEW] || 0;
    const draft = this.data[ProjectStatus.DRAFT] || 0;

    this.chartOptions = {
      ...this.chartOptions,
      series: [active, completed, review, draft]
    };
  }
}
