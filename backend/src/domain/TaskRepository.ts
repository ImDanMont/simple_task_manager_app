import { Task } from './Task';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  save(task: Task): Promise<Task>;
  update(id: string, task: Partial<Omit<Task, 'id'>>): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  toggleComplete(id: string): Promise<Task | null>;
}
