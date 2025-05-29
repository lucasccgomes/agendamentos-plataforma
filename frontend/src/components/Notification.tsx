import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info' }) => {
  const color = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  }[type];

  return (
    <div className={`p-4 mb-4 text-sm rounded ${color}`}>
      {message}
    </div>
  );
};

export default Notification;
