import React from 'react';

export interface BaseModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

const Modal: React.FC<{
    open: boolean;
    setIsOpen: (open: boolean) => void;
    children: React.ReactNode;
  }> = ({ open, setIsOpen, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
