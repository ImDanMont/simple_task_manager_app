import React from 'react';
import { CheckSquare2, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  completedCount: number;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  completedCount,
  isOnline,
}) => {
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-title-wrapper">
          <div className="logo-badge">
            <CheckSquare2 size={28} className="logo-icon" />
          </div>
          <div>
            <h1 className="header-title">Task Manager</h1>
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-header">
            <span className="progress-label">Progreso general</span>
            <span className="progress-value">
              {completedCount} de {totalCount} completadas ({progressPercent}%)
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
