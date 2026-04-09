export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Roadmap {
  goal: string;
  tasks: Task[];
  progress: number;
}

export interface UserProfile {
  name: string;
  email?: string;
  goal: 'frontend' | 'backend' | 'data' | '';
  learningTime: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  role?: 'user' | 'admin';
  updatedAt?: string;
}
