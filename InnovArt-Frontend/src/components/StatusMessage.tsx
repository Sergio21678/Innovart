import React from 'react';

type StatusMessageProps = {
  loading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
};

const StatusMessage: React.FC<StatusMessageProps> = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 text-blue-700">
        <span className="animate-spin mr-2">⏳</span> Cargando...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-32 text-red-700">
        <span className="mr-2">❌</span> {error}
      </div>
    );
  }
  return <>{children}</>;
};

export default StatusMessage;
