import { User } from './user.model';

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SUSPENDED = 'SUSPENDED'
}

export enum ProjectRole {
  PRINCIPAL_INVESTIGATOR = 'PRINCIPAL_INVESTIGATOR',
  CO_INVESTIGATOR = 'CO_INVESTIGATOR',
  RESEARCH_ASSISTANT = 'RESEARCH_ASSISTANT'
}

export interface ProjectResearcher {
  userId: string;
  user?: User; // Populated field
  role: ProjectRole;
  assignedAt: Date;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: string;
  changes: string;
  modifiedBy: string; // User ID
  modifiedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  objectives: string;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  budget?: number;
  researchers: ProjectResearcher[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
}
