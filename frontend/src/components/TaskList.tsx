import React from 'react';
import { ClipboardList, SearchX, Loader2 } from 'lucide-react';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTasksCount: number;
  isLoading: boolean;
  searchQuery: string;
  onToggle: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  updatingTaskId: string | null;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTasksCount,
  isLoading,
  searchQuery,
  onToggle,
  onEdit,
  onDelete,
  updatingTaskId,
}) => {
  if (isLoading && totalTasksCount === 0) {
    return (
      <div className="state-container loading-state">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p>Cargando tareas desde la base de datos...</p>
      </div>
    );
  }

  if (totalTasksCount === 0) {
    return (
      <div className="state-container empty-state">
        <div className="empty-state-icon-wrapper">
          <ClipboardList size={44} />
        </div>
        <h3 className="empty-state-title">No hay tareas aún</h3>
        <p className="empty-state-desc">
          ¡Comienza agregando tu primera tarea en el formulario de arriba!
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-container empty-state">
        <div className="empty-state-icon-wrapper">
          <SearchX size={44} />
        </div>
        <h3 className="empty-state-title">No se encontraron tareas</h3>
        <p className="empty-state-desc">
          {searchQuery
            ? `No hay tareas que coincidan con "${searchQuery}" en este filtro.`
            : 'No hay tareas en esta categoría.'}
        </p>
      </div>
    );
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isUpdating={updatingTaskId === task.id}
        />
      ))}
    </div>
  );
};
