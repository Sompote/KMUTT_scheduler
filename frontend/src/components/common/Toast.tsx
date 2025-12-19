import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible && type === 'success') {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 px-6 py-4 rounded-lg shadow-xl text-white transform transition-transform duration-300 z-[100] flex items-center gap-3 border-l-4 border-white max-w-md cursor-pointer ${
        type === 'error' ? 'bg-red-600' : 'bg-green-600'
      } ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      onClick={onClose}
    >
      <span className="text-2xl">
        {type === 'error' ? (
          <i className="fas fa-exclamation-circle"></i>
        ) : (
          <i className="fas fa-check-circle"></i>
        )}
      </span>
      <div>
        <h4 className="font-bold text-sm uppercase">{type === 'error' ? 'Error' : 'Success'}</h4>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
