import { ProjectStatus } from './project.model';

export interface ProjectMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsByStatus: { [key in ProjectStatus]?: number };
  pendingEvaluations?: number; // For evaluators
  myProjectsCount?: number; // For researchers
}

export interface Activity {
  id: string;
  type: 'PROJECT_CREATED' | 'PROJECT_UPDATED' | 'EVALUATION_ASSIGNED' | 'EVALUATION_SUBMITTED' | 'STATUS_CHANGED';
  description: string;
  timestamp: Date;
  projectId?: string;
  userId: string;
  userName: string;
}

export interface PersonalStats {
  projectsInvolved: number;
  evaluationsCompleted: number;
  averageEvaluationScore?: number;
}
