import React, { useState, useEffect } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { Task, UpdateTaskDTO } from '../types/task';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: UpdateTaskDTO) => Promise<void>;
  isLoading: boolean;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCompleted(task.completed);
      setError(null);
    }
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título de la tarea no puede estar vacío');
      return;
    }

    try {
      await onSave(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        completed,
      });
      onClose();
    } catch {
      // Error manejado en App
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">Editar Tarea</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            title="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">
              Título <span className="required-star">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              className={`form-input ${error ? 'input-error' : ''}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              disabled={isLoading}
              autoFocus
            />
            {error && <span className="form-error-msg">{error}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">
              Descripción
            </label>
            <textarea
              id="edit-desc"
              className="form-input textarea-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkbox-custom" />
              <span>Marcar como completada</span>
            </label>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
