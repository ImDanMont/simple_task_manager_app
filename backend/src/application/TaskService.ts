import { randomUUID } from 'crypto';
import { Task } from '../domain/Task';
import { TaskRepository } from '../domain/TaskRepository';

export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la tarea es obligatorio');
    }
    return this.taskRepository.getById(id.trim());
  }

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    if (!dto.title || dto.title.trim() === '') {
      throw new Error('El título de la tarea es obligatorio');
    }

    const newTask: Task = {
      id: randomUUID(),
      title: dto.title.trim(),
      description: dto.description?.trim(),
      completed: false,
      createdAt: new Date(),
    };

    return this.taskRepository.save(newTask);
  }

  async updateTask(id: string, dto: UpdateTaskDTO): Promise<Task> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la tarea es obligatorio');
    }

    if (dto.title !== undefined && dto.title.trim() === '') {
      throw new Error('El título no puede estar vacío');
    }

    const updates: Partial<Omit<Task, 'id'>> = {};
    if (dto.title !== undefined) {
      updates.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      updates.description = dto.description.trim();
    }
    if (dto.completed !== undefined) {
      updates.completed = dto.completed;
    }

    const updatedTask = await this.taskRepository.update(id.trim(), updates);
    if (!updatedTask) {
      throw new Error(`Tarea con ID "${id}" no encontrada`);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la tarea es obligatorio');
    }

    const deleted = await this.taskRepository.delete(id.trim());
    if (!deleted) {
      throw new Error(`Tarea con ID "${id}" no encontrada`);
    }

    return true;
  }

  async toggleTaskComplete(id: string): Promise<Task> {
    if (!id || id.trim() === '') {
      throw new Error('El ID de la tarea es obligatorio');
    }

    const task = await this.taskRepository.toggleComplete(id.trim());
    if (!task) {
      throw new Error(`Tarea con ID "${id}" no encontrada`);
    }

    return task;
  }

  async markAsCompleted(id: string, completed: boolean = true): Promise<Task> {
    return this.updateTask(id, { completed });
  }
}
