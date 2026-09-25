import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { taskApi } from './services/api';
import { Task, CreateTaskDTO, UpdateTaskDTO, FilterStatus } from './types/task';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { EditTaskModal } from './components/EditTaskModal';
import { Toast, ToastMessage } from './components/Toast';
import './styles/app.css';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Filters & Search
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Edit Modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error', text: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch tasks
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getAll();
      setTasks(data);
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
      const message = error instanceof Error ? error.message : 'Error al conectar con el backend';
      addToast('error', `No se pudieron cargar las tareas: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadTasks();
    const interval = setInterval(async () => {
      const ok = await taskApi.checkHealth();
      setIsOnline(ok);
    }, 15000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  // Handle Add Task
  const handleAddTask = async (dto: CreateTaskDTO) => {
    try {
      setIsAddingTask(true);
      const newTask = await taskApi.create(dto);
      setTasks((prev) => [newTask, ...prev]);
      setIsOnline(true);
      addToast('success', '¡Tarea creada exitosamente!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la tarea';
      addToast('error', message);
      throw error;
    } finally {
      setIsAddingTask(false);
    }
  };

  // Handle Toggle Complete
  const handleToggleComplete = async (id: string) => {
    const originalTasks = [...tasks];
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    setUpdatingTaskId(id);

    try {
      const updated = await taskApi.toggleComplete(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setIsOnline(true);
      addToast(
        'success',
        updated.completed
          ? 'Tarea marcada como completada ✓'
          : 'Tarea marcada como pendiente'
      );
    } catch (error) {
      // Rollback
      setTasks(originalTasks);
      const message = error instanceof Error ? error.message : 'Error al actualizar estado';
      addToast('error', message);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Handle Edit Task Modal
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: UpdateTaskDTO) => {
    try {
      setIsSavingEdit(true);
      const updated = await taskApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      setIsOnline(true);
      addToast('success', 'Tarea actualizada correctamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al editar tarea';
      addToast('error', message);
      throw error;
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (id: string) => {
    const originalTasks = [...tasks];
    // Optimistic delete
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await taskApi.delete(id);
      setIsOnline(true);
      addToast('success', 'Tarea eliminada exitosamente');
    } catch (error) {
      // Rollback
      setTasks(originalTasks);
      const message = error instanceof Error ? error.message : 'Error al eliminar tarea';
      addToast('error', message);
    }
  };

  // Filtered tasks and counts
  const counts = useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    return {
      all: tasks.length,
      pending: tasks.length - completed,
      completed,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === 'pending' && task.completed) return false;
      if (filter === 'completed' && !task.completed) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) ?? false;
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  return (
    <div className="app-container">
      <Header
        totalCount={counts.all}
        completedCount={counts.completed}
        isOnline={isOnline}
      />

      <main>
        <TaskForm onAddTask={handleAddTask} isLoading={isAddingTask} />

        <TaskFilter
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          counts={counts}
        />

        <TaskList
          tasks={filteredTasks}
          totalTasksCount={tasks.length}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onToggle={handleToggleComplete}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteTask}
          updatingTaskId={updatingTaskId}
        />
      </main>

      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
        isLoading={isSavingEdit}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
