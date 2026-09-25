import { Request, Response, Router } from 'express';
import { TaskService } from '../application/TaskService';

export class ExpressTaskController {
  private readonly router: Router;

  constructor(private readonly taskService: TaskService) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.get('/', this.getAllTasks.bind(this));
    this.router.get('/:id', this.getTaskById.bind(this));
    this.router.post('/', this.createTask.bind(this));
    this.router.put('/:id', this.updateTask.bind(this));
    this.router.patch('/:id', this.updateTask.bind(this));
    this.router.patch('/:id/toggle', this.toggleComplete.bind(this));
    this.router.patch('/:id/complete', this.markComplete.bind(this));
    this.router.delete('/:id', this.deleteTask.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }

  private async getAllTasks(_req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: message });
    }
  }

  private async getTaskById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id as string);
      if (!task) {
        res.status(404).json({ error: `Tarea con ID "${id}" no encontrada` });
        return;
      }
      res.status(200).json(task);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      res.status(500).json({ error: message });
    }
  }

  private async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'El campo "title" es obligatorio y debe ser texto' });
        return;
      }

      const newTask = await this.taskService.createTask({
        title,
        description: typeof description === 'string' ? description : undefined,
      });

      res.status(201).json(newTask);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al crear la tarea';
      res.status(400).json({ error: message });
    }
  }

  private async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
        res.status(400).json({ error: 'El título no puede estar vacío' });
        return;
      }

      if (completed !== undefined && typeof completed !== 'boolean') {
        res.status(400).json({ error: 'El campo "completed" debe ser un booleano' });
        return;
      }

      const updatedTask = await this.taskService.updateTask(id as string, {
        title,
        description,
        completed,
      });

      res.status(200).json(updatedTask);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al actualizar la tarea';
      if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }

  private async toggleComplete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedTask = await this.taskService.toggleTaskComplete(id as string);
      res.status(200).json(updatedTask);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al alternar estado de la tarea';
      if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }

  private async markComplete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      const isCompleted = typeof completed === 'boolean' ? completed : true;

      const updatedTask = await this.taskService.markAsCompleted(id as string, isCompleted);
      res.status(200).json(updatedTask);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al marcar estado de la tarea';
      if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
      } else {
        res.status(400).json({ error: message });
      }
    }
  }

  private async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.taskService.deleteTask(id as string);
      res.status(200).json({ message: `Tarea con ID "${id}" eliminada exitosamente` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error al eliminar la tarea';
      if (message.includes('no encontrada')) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }
}
