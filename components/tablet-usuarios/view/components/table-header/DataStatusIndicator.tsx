import React from 'react';

interface DataStatusIndicatorProps {
  type: 'loading' | 'error' | 'fallback';
  message: string;
  onRetry?: () => void;
}

const DataStatusIndicator: React.FC<DataStatusIndicatorProps> = ({ type, message, onRetry }) => {
  const className = `data-status-indicator ${type}`;
  const dotClassName = `status-dot ${type}`;

  return (
    <div className={className}>
      <span className={dotClassName}></span>
      <span className="status-text">{message}</span>
      {type === 'error' && onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
};

export default DataStatusIndicator;
