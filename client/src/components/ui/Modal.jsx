import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  className,
  isOpen,
  onClose,
  children,
  maxWidth = "lg",
  avoidBackDropClose = true,
}) => {
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
  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    "3xl": "sm:max-w-3xl",
    "4xl": "sm:max-w-4xl",
    "5xl": "sm:max-w-5xl",
    "6xl": "sm:max-w-6xl",
    "7xl": "sm:max-w-7xl",
  };
  const extraProps = {};

  if (avoidBackDropClose) {
    extraProps.onClick = (e) => e.stopPropagation();
  } else {
    extraProps.onClick = onClose;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      {...extraProps}
    >
      <div
        className={`relative transform overflow-y-auto max-h-[90vh] rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full ${
          maxWidthClasses[maxWidth]
        } ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
