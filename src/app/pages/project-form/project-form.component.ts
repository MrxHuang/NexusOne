import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectStatus } from '../../models/project.model';
import { LucideAngularModule, Save, X, Calendar, DollarSign, FileText, Tag } from 'lucide-angular';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './project-form.component.html',
  styles: []
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Icons
  readonly SaveIcon = Save;
  readonly XIcon = X;
  readonly CalendarIcon = Calendar;
  readonly DollarSignIcon = DollarSign;
  readonly FileTextIcon = FileText;
  readonly TagIcon = Tag;

  isEditing = signal(false);
  isLoading = signal(false);
  projectId = signal<string | null>(null);
  error = signal<string | null>(null);

  projectForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    objectives: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    status: [ProjectStatus.DRAFT, [Validators.required]],
    budget: [0, [Validators.min(0)]],
    tags: ['']
  });

  statuses = Object.values(ProjectStatus);

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing.set(true);
        this.projectId.set(params['id']);
        this.loadProject(params['id']);
      }
    });
  }

  loadProject(id: string) {
    this.isLoading.set(true);
    this.projectService.getProjectById(id).subscribe({
      next: (project) => {
        this.projectForm.patchValue({
          title: project.title,
          description: project.description,
          objectives: project.objectives,
          startDate: new Date(project.startDate).toISOString().split('T')[0],
          endDate: new Date(project.endDate).toISOString().split('T')[0],
          status: project.status,
          budget: project.budget,
          tags: project.tags.join(', ')
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Error loading project details');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      this.error.set('Please fill in all required fields correctly.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.projectForm.value;
    const projectData: any = {
      ...formValue,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : []
    };

    if (this.isEditing()) {
      this.projectService.updateProject(this.projectId()!, projectData).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.error.set('Error updating project');
          this.isLoading.set(false);
        }
      });
    } else {
      this.projectService.createProject(projectData).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.error.set('Error creating project');
          this.isLoading.set(false);
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/projects']);
  }
}
