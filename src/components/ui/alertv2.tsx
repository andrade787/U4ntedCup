import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader as LoaderCircle } from 'lucide-react';

type AlertProps = {
  type: 'success' | 'error' | 'loading';
  message: string;
  onShowChange?: (show: boolean) => void; // Torne a função opcional
};

const AlertV2: React.FC<AlertProps> = ({ type, message, onShowChange }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (type !== 'loading') {
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  useEffect(() => {
    if (onShowChange) {
      onShowChange(show);
    }
  }, [show, onShowChange]);

  if (!show) return null;

  const typeStyles = {
    success: 'border-green-800 text-green-700 animate-in fade-in',
    error: 'border-red-800 text-red-700 animate-in fade-in',
    loading: 'animate-in zoom-in'
  };

  const iconMap = {
    success: <CheckCircle size={18} className="text-green-700" />,
    error: <AlertCircle size={18} className="text-red-700" />,
    loading: <LoaderCircle size={18} className="animate-spin" />
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 mt-2 border rounded-xl p-3 ${typeStyles[type]}`}
    >
      {iconMap[type]}
      <h3 className={`font-normal ${typeStyles[type]}`}>
        {message}
      </h3>
    </div>
  );
};

export default AlertV2;
