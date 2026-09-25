import React from 'react';
import { Check, Edit3, Trash2, Calendar } from 'lucide-react';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  isUpdating: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formattedDate = formatDate(task.createdAt);

  return (
    <div className={`task-item-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-main-content">
        <button
          type="button"
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          disabled={isUpdating}
          title={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="task-text-group">
          <h3 className={`task-title ${task.completed ? 'title-completed' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta-row">
            <span className={`task-badge ${task.completed ? 'badge-completed' : 'badge-pending'}`}>
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>
            {formattedDate && (
              <span className="task-date">
                <Calendar size={13} />
                <span>{formattedDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions-group">
        <button
          type="button"
          className="btn-icon btn-edit"
          onClick={() => onEdit(task)}
          disabled={isUpdating}
          title="Editar tarea"
        >
          <Edit3 size={17} />
        </button>

        <button
          type="button"
          className="btn-icon btn-delete"
          onClick={() => {
            if (window.confirm(`¿Estás seguro de eliminar la tarea "${task.title}"?`)) {
              onDelete(task.id);
            }
          }}
          disabled={isUpdating}
          title="Eliminar tarea"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};
