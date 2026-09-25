import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDatabase } from './infrastructure/db';
import { PostgresTaskRepository } from './infrastructure/PostgresTaskRepository';
import { TaskService } from './application/TaskService';
import { ExpressTaskController } from './infrastructure/ExpressTaskController';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inyección de Dependencias (Hexagonal Architecture Composition Root)
const taskRepository = new PostgresTaskRepository(pool);
const taskService = new TaskService(taskRepository);
const taskController = new ExpressTaskController(taskService);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Task Manager API - Arquitectura Hexagonal',
    endpoints: {
      getTasks: 'GET /tasks o GET /api/tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id o PATCH /tasks/:id',
      toggleComplete: 'PATCH /tasks/:id/toggle',
      markComplete: 'PATCH /tasks/:id/complete',
      deleteTask: 'DELETE /tasks/:id',
    },
  });
});

// Rutas de tareas
app.use('/api/tasks', taskController.getRouter());
app.use('/tasks', taskController.getRouter());

// Iniciar servidor y base de datos
async function bootstrap(): Promise<void> {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`Servidor iniciado exitosamente en puerto ${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/tasks`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando conexiones...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nCerrando conexiones...');
  await pool.end();
  process.exit(0);
});

bootstrap();
