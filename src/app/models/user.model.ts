export enum UserRole {
  RESEARCHER = 'RESEARCHER',
  EVALUATOR = 'EVALUATOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  specialization?: string;
}
