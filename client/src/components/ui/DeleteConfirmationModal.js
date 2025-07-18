import React from "react";
import Modal from "./Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="lg">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center">
          <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-12 sm:w-12">
            <ExclamationTriangleIcon
              className="h-8 w-8 sm:h-6 sm:w-6 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <h3
              className="text-2xl font-bold text-gray-900 dark:text-white"
              id="modal-title"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-md text-gray-600 dark:text-gray-300">
                {description}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-red-50 dark:bg-red-900/40 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon
                className="h-6 w-6 text-red-500"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                This action is irreversible. Please be certain before
                proceeding.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            className="cursor-pointer px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer px-6 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
