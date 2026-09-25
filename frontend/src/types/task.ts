export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export type FilterStatus = 'all' | 'pending' | 'completed';
