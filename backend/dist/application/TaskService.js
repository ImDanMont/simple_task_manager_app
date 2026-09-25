"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const crypto_1 = require("crypto");
class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async getAllTasks() {
        return this.taskRepository.getAll();
    }
    async getTaskById(id) {
        if (!id || id.trim() === '') {
            throw new Error('El ID de la tarea es obligatorio');
        }
        return this.taskRepository.getById(id.trim());
    }
    async createTask(dto) {
        if (!dto.title || dto.title.trim() === '') {
            throw new Error('El título de la tarea es obligatorio');
        }
        const newTask = {
            id: (0, crypto_1.randomUUID)(),
            title: dto.title.trim(),
            description: dto.description?.trim(),
            completed: false,
            createdAt: new Date(),
        };
        return this.taskRepository.save(newTask);
    }
    async updateTask(id, dto) {
        if (!id || id.trim() === '') {
            throw new Error('El ID de la tarea es obligatorio');
        }
        if (dto.title !== undefined && dto.title.trim() === '') {
            throw new Error('El título no puede estar vacío');
        }
        const updates = {};
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
    async deleteTask(id) {
        if (!id || id.trim() === '') {
            throw new Error('El ID de la tarea es obligatorio');
        }
        const deleted = await this.taskRepository.delete(id.trim());
        if (!deleted) {
            throw new Error(`Tarea con ID "${id}" no encontrada`);
        }
        return true;
    }
    async toggleTaskComplete(id) {
        if (!id || id.trim() === '') {
            throw new Error('El ID de la tarea es obligatorio');
        }
        const task = await this.taskRepository.toggleComplete(id.trim());
        if (!task) {
            throw new Error(`Tarea con ID "${id}" no encontrada`);
        }
        return task;
    }
    async markAsCompleted(id, completed = true) {
        return this.updateTask(id, { completed });
    }
}
exports.TaskService = TaskService;
