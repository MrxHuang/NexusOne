export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface EvaluationScore {
  criteriaId: string;
  score: number;
  comment?: string;
}

export interface Evaluation {
  id: string;
  projectId: string;
  evaluatorId: string;
  evaluator: { id: string; name: string; email: string }; // Simplified User object or full User
  scores: EvaluationScore[];
  overallComment: string;
  recommendation: 'APPROVE' | 'REJECT' | 'REVISE';
  submittedAt: Date;
  status: 'PENDING' | 'COMPLETED';
}

export interface EvaluationResult {
  projectId: string;
  averageScore: number;
  criteriaAverages: { [key: string]: number };
  evaluatorCount: number;
  recommendations: {
    approve: number;
    reject: number;
    revise: number;
  };
}

export const DEFAULT_CRITERIA: EvaluationCriteria[] = [
  { id: 'innovation', name: 'Innovation', description: 'Originality and novelty of the research proposal', maxScore: 10 },
  { id: 'methodology', name: 'Methodology', description: 'Soundness and appropriateness of the research methods', maxScore: 10 },
  { id: 'feasibility', name: 'Feasibility', description: 'Realistic timeline and resource allocation', maxScore: 10 },
  { id: 'impact', name: 'Impact', description: 'Potential contribution to the field and society', maxScore: 10 },
  { id: 'team', name: 'Team Capability', description: 'Expertise and track record of the research team', maxScore: 10 }
];
