import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
      <div className={`bg-white w-full ${sizeClasses[size]} rounded-xl shadow-2xl z-50 flex flex-col max-h-[90vh]`}>
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
