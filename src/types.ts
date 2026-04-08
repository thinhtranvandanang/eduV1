export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  goal: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  study_time: string;
  created_at: string;
}

export interface RoadmapItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  order: number;
  created_at: string;
}

export interface LearningTask {
  id: string;
  roadmap_item_id: string;
  title: string;
  content: string;
  is_completed: boolean;
  created_at: string;
}

export interface ErrorLog {
  id: string;
  user_id: string;
  error_message: string;
  code_snippet: string;
  ai_suggestion: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  link?: string;
  created_at: string;
}
