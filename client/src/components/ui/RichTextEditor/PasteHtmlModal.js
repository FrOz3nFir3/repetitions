import React, { useState } from "react";
import Modal from "../Modal";

const PasteHtmlModal = ({ editor, isOpen, onClose }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  const handleLoadContent = () => {
    if (!html.trim()) {
      setError("HTML content cannot be empty.");
      return;
    }
    try {
      editor.chain().focus().setContent(html, true).run();
      onClose(); // Close modal on success
    } catch (e) {
      setError("Failed to load content. Please ensure it's valid HTML.");
      console.error(e);
    }
  };

  const handleClose = () => {
    setHtml("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Load HTML
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste HTML copied from the <strong>Activity Logs</strong> to view
            the content from a previous version.
          </p>
          <p className="text-xs mt-1 text-amber-600 dark:text-amber-400">
            Note: Custom HTML from other sources may not work as intended.
          </p>
        </div>

        <div className="mt-4">
          <textarea
            rows="10"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<p>Paste your copied HTML here...</p>"
          />
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-5 sm:mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="cursor-pointer rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleLoadContent}
          >
            Load in Editor
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PasteHtmlModal;
