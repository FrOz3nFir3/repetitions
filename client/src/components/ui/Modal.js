import React, { useEffect } from "react";

const Modal = ({ className, isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // When the modal is open, we want to prevent the background from scrolling
      document.body.style.overflow = "hidden";
    }

    // Cleanup function to run when the modal is closed or the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]); // This effect runs whenever the `isOpen` prop changes

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className={`relative transform overflow-y-auto max-h-[90vh] rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${
          className ?? ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
