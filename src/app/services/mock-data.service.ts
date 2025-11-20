import { Injectable } from '@angular/core';
import { User, UserRole } from '../models/user.model';
import { Project, ProjectStatus, ProjectRole } from '../models/project.model';
import { Evaluation, DEFAULT_CRITERIA } from '../models/evaluation.model';
import { Activity } from '../models/dashboard.model';
import { addDays, subDays } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  // Mock Users
  users: User[] = [
    {
      id: 'u1',
      name: 'Dr. Elena Rodriguez',
      email: 'elena@university.edu',
      role: UserRole.RESEARCHER,
      department: 'Computer Science',
      specialization: 'Artificial Intelligence',
      avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=4f46e5&color=fff'
    },
    {
      id: 'u2',
      name: 'Prof. James Chen',
      email: 'james@university.edu',
      role: UserRole.EVALUATOR,
      department: 'Physics',
      specialization: 'Quantum Computing',
      avatar: 'https://ui-avatars.com/api/?name=James+Chen&background=06b6d4&color=fff'
    },
    {
      id: 'u3',
      name: 'Admin User',
      email: 'admin@university.edu',
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0f172a&color=fff'
    },
    {
      id: 'u4',
      name: 'Sarah Miller',
      email: 'sarah@university.edu',
      role: UserRole.RESEARCHER,
      department: 'Biology',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=8b5cf6&color=fff'
    }
  ];

  // Mock Projects
  projects: Project[] = [
    {
      id: 'p1',
      title: 'AI-Driven Climate Modeling',
      description: 'Developing advanced machine learning algorithms to predict local climate patterns with higher accuracy.',
      objectives: '1. Collect historical data\n2. Train ML models\n3. Validate against recent weather patterns',
      startDate: subDays(new Date(), 30),
      endDate: addDays(new Date(), 180),
      status: ProjectStatus.ACTIVE,
      tags: ['AI', 'Climate', 'Machine Learning'],
      researchers: [
        { userId: 'u1', role: ProjectRole.PRINCIPAL_INVESTIGATOR, assignedAt: subDays(new Date(), 30) },
        { userId: 'u4', role: ProjectRole.CO_INVESTIGATOR, assignedAt: subDays(new Date(), 25) }
      ],
      createdAt: subDays(new Date(), 30),
      updatedAt: subDays(new Date(), 5),
      createdBy: 'u1'
    },
    {
      id: 'p2',
      title: 'Quantum Encryption Protocols',
      description: 'Researching new encryption standards resistant to quantum computing attacks.',
      objectives: 'Analyze current standards, Propose new protocol, Test vulnerability',
      startDate: subDays(new Date(), 10),
      endDate: addDays(new Date(), 365),
      status: ProjectStatus.IN_REVIEW,
      tags: ['Quantum', 'Security', 'Cryptography'],
      researchers: [
        { userId: 'u2', role: ProjectRole.PRINCIPAL_INVESTIGATOR, assignedAt: subDays(new Date(), 10) }
      ],
      createdAt: subDays(new Date(), 10),
      updatedAt: subDays(new Date(), 1),
      createdBy: 'u2'
    },
    {
      id: 'p3',
      title: 'Sustainable Urban Farming',
      description: 'Optimizing vertical farming techniques for high-density urban environments.',
      objectives: 'Design vertical structure, Test hydroponic systems, Measure yield',
      startDate: subDays(new Date(), 60),
      endDate: addDays(new Date(), 120),
      status: ProjectStatus.COMPLETED,
      tags: ['Agriculture', 'Sustainability', 'Urban'],
      researchers: [
        { userId: 'u4', role: ProjectRole.PRINCIPAL_INVESTIGATOR, assignedAt: subDays(new Date(), 60) }
      ],
      createdAt: subDays(new Date(), 60),
      updatedAt: subDays(new Date(), 2),
      createdBy: 'u4'
    }
  ];

  // Mock Evaluations
  evaluations: Evaluation[] = [
    {
      id: 'e1',
      projectId: 'p2',
      evaluatorId: 'u1',
      scores: [
        { criteriaId: 'innovation', score: 9, comment: 'Very innovative approach' },
        { criteriaId: 'methodology', score: 8 },
        { criteriaId: 'feasibility', score: 7, comment: 'Timeline might be tight' },
        { criteriaId: 'impact', score: 9 },
        { criteriaId: 'team', score: 8 }
      ],
      overallComment: 'Strong proposal with high potential impact.',
      recommendation: 'APPROVE',
      submittedAt: subDays(new Date(), 2),
      status: 'COMPLETED'
    }
  ];

  // Mock Activities
  activities: Activity[] = [
    {
      id: 'a1',
      type: 'PROJECT_CREATED',
      description: 'Created project "Quantum Encryption Protocols"',
      timestamp: subDays(new Date(), 10),
      projectId: 'p2',
      userId: 'u2',
      userName: 'Prof. James Chen'
    },
    {
      id: 'a2',
      type: 'EVALUATION_SUBMITTED',
      description: 'Submitted evaluation for "Quantum Encryption Protocols"',
      timestamp: subDays(new Date(), 2),
      projectId: 'p2',
      userId: 'u1',
      userName: 'Dr. Elena Rodriguez'
    },
    {
      id: 'a3',
      type: 'STATUS_CHANGED',
      description: 'Changed status to Active',
      timestamp: subDays(new Date(), 5),
      projectId: 'p1',
      userId: 'u1',
      userName: 'Dr. Elena Rodriguez'
    }
  ];

  constructor() { }

  getUsers() { return this.users; }
  getProjects() { return this.projects; }
  getEvaluations() { return this.evaluations; }
  getActivities() { return this.activities; }
}
