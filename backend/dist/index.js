"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./infrastructure/db");
const PostgresTaskRepository_1 = require("./infrastructure/PostgresTaskRepository");
const TaskService_1 = require("./application/TaskService");
const ExpressTaskController_1 = require("./infrastructure/ExpressTaskController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Inyección de Dependencias (Hexagonal Architecture Composition Root)
const taskRepository = new PostgresTaskRepository_1.PostgresTaskRepository(db_1.pool);
const taskService = new TaskService_1.TaskService(taskRepository);
const taskController = new ExpressTaskController_1.ExpressTaskController(taskService);
// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
app.get('/', (_req, res) => {
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
async function bootstrap() {
    try {
        await (0, db_1.initDatabase)();
        app.listen(PORT, () => {
            console.log(`===============================================`);
            console.log(`Servidor iniciado exitosamente en puerto ${PORT}`);
            console.log(`API disponible en: http://localhost:${PORT}/tasks`);
            console.log(`===============================================`);
        });
    }
    catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}
// Cierre graceful
process.on('SIGINT', async () => {
    console.log('\nCerrando conexiones...');
    await db_1.pool.end();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\nCerrando conexiones...');
    await db_1.pool.end();
    process.exit(0);
});
bootstrap();
