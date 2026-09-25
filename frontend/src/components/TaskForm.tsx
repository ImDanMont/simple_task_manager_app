import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { CreateTaskDTO } from '../types/task';

interface TaskFormProps {
  onAddTask: (data: CreateTaskDTO) => Promise<void>;
  isLoading: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, isLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor ingresa un título para la tarea');
      return;
    }

    try {
      setError(null);
      await onAddTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle('');
      setDescription('');
      setIsExpanded(false);
    } catch {
      // Error manejado en App.tsx mediante toast
    }
  };

  return (
    <form className="task-form-card" onSubmit={handleSubmit}>
      <div className="form-main-row">
        <input
          type="text"
          className={`form-input title-input ${error ? 'input-error' : ''}`}
          placeholder="¿Qué tarea tienes pendiente hoy?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          onFocus={() => setIsExpanded(true)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !title.trim()}
          title="Agregar nueva tarea"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              <span>Crear Tarea</span>
            </>
          )}
        </button>
      </div>

      {error && <p className="form-error-msg">{error}</p>}

      {isExpanded && (
        <div className="form-expanded-row">
          <textarea
            className="form-input textarea-input"
            placeholder="Descripción o detalles adicionales (opcional)..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
          <div className="form-actions-row">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setIsExpanded(false);
                setDescription('');
              }}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
