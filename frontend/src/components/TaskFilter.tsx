import React from 'react';
import { Search, CheckCircle, Clock, ListFilter } from 'lucide-react';
import { FilterStatus } from '../types/task';

interface TaskFilterProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}) => {
  return (
    <div className="filter-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar tareas por título o detalle..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            title="Limpiar búsqueda"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          <ListFilter size={16} />
          <span>Todas</span>
          <span className="count-badge">{counts.all}</span>
        </button>

        <button
          type="button"
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          <Clock size={16} />
          <span>Pendientes</span>
          <span className="count-badge count-pending">{counts.pending}</span>
        </button>

        <button
          type="button"
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          <CheckCircle size={16} />
          <span>Completadas</span>
          <span className="count-badge count-completed">{counts.completed}</span>
        </button>
      </div>
    </div>
  );
};
