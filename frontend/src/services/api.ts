import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Error HTTP ${res.status}: ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.error) {
        errorMessage = data.error;
      }
    } catch {
      // Si no es JSON, mantenemos el mensaje por defecto
    }
    throw new ApiError(res.status, errorMessage);
  }
  return res.json() as Promise<T>;
}

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    return handleResponse<Task[]>(res);
  },

  async getById(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
    return handleResponse<Task>(res);
  },

  async create(data: CreateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<Task>(res);
  },

  async toggleComplete(id: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    return handleResponse<Task>(res);
  },

  async delete(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  },
};
