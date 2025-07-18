import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "../../../../components/ui/Modal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { PencilIcon } from "@heroicons/react/24/solid";

let tempIdCounter = 0;

const EditQuizModal = ({ isOpen, onClose, cardId, flashcardId, quiz }) => {
  const [updateCard, { error, isLoading }] = usePatchUpdateCardMutation();
  const errorRef = useRef(null);

  const originalState = useMemo(
    () => ({
      quizQuestion: quiz.quizQuestion,
      quizAnswer: quiz.quizAnswer,
      options: quiz.options || [],
      minimumOptions: quiz.minimumOptions,
    }),
    [quiz]
  );

  const [quizQuestion, setQuizQuestion] = useState(originalState.quizQuestion);
  const [quizAnswer, setQuizAnswer] = useState(originalState.quizAnswer);
  const [options, setOptions] = useState(() =>
    originalState.options.map((opt) => ({
      ...opt,
      tempId: `temp_${tempIdCounter++}`,
    }))
  );
  const [minimumOptions, setMinimumOptions] = useState(
    originalState.minimumOptions
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const currentState = {
      quizQuestion,
      quizAnswer,
      options: options.map(({ value }) => ({ value })),
      minimumOptions,
    };
    const originalSimpleState = {
      quizQuestion: originalState.quizQuestion,
      quizAnswer: originalState.quizAnswer,
      options: originalState.options.map(({ value }) => ({ value })),
      minimumOptions: originalState.minimumOptions,
    };
    setIsChanged(
      JSON.stringify(originalSimpleState) !== JSON.stringify(currentState)
    );
  }, [quizQuestion, quizAnswer, options, minimumOptions, originalState]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleOptionChange = (value, tempId) => {
    setOptions(
      options.map((opt) => (opt.tempId === tempId ? { ...opt, value } : opt))
    );
  };

  const handleAddOption = () => {
    setOptions([...options, { value: "", tempId: `temp_${tempIdCounter++}` }]);
  };

  const handleRemoveOption = () => {
    if (!selectedOptionId) return;

    const payload = {
      _id: cardId,
      cardId: flashcardId,
      quizId: quiz._id,
      optionId: selectedOptionId,
      deleteOption: true,
    };

    updateCard(payload).then((response) => {
      if (response.data) {
        const optionToRemove = options.find(
          (opt) => opt._id === selectedOptionId
        );
        if (optionToRemove) {
          setOptions(options.filter((opt) => opt._id !== selectedOptionId));
        }
      }
    });
  };

  const openDeleteModal = (id) => {
    const option = options.find((opt) => opt.tempId === id);
    if (option._id) {
      setSelectedOptionId(option._id);
      setIsDeleteModalOpen(true);
    } else {
      // If it's a new option that hasn't been saved, just remove it from state
      setOptions(options.filter((opt) => opt.tempId !== id));
    }
  };

  const closeDeleteModal = () => {
    setSelectedOptionId(null);
    setIsDeleteModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isChanged) return;

    const payload = {
      _id: cardId,
      cardId: flashcardId,
      quizId: quiz._id,
    };

    if (originalState.quizQuestion !== quizQuestion) {
      payload.quizQuestion = quizQuestion;
    }
    if (originalState.quizAnswer !== quizAnswer) {
      payload.quizAnswer = quizAnswer;
    }
    if (originalState.minimumOptions !== minimumOptions) {
      payload.minimumOptions = minimumOptions;
    }

    const originalOptions = originalState.options.map((opt) => opt.value);
    const currentOptions = options.map((opt) => opt.value);
    if (JSON.stringify(originalOptions) !== JSON.stringify(currentOptions)) {
      payload.options = currentOptions;
    }

    updateCard(payload).then((response) => {
      if (response.data) {
        onClose();
      }
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Edit Quiz`}>
        <div className="p-1">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <PencilIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Quiz
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Update the quiz details below. Changes are saved when you click
                "Update Quiz".
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div ref={errorRef}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error.data?.error || "An error occurred"}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Question
            </label>
            <RichTextEditor
              initialContent={quizQuestion}
              onChange={setQuizQuestion}
              editable={!isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Answer
            </label>
            <RichTextEditor
              initialContent={quizAnswer}
              onChange={setQuizAnswer}
              editable={!isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="minimumOptions"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Minimum Options
            </label>
            <input
              type="number"
              id="minimumOptions"
              value={minimumOptions}
              onChange={(e) => setMinimumOptions(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:text-white border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              min={2}
              max={10}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Options
            </label>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                Correct Answer (read-only)
              </label>
              <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/50 p-3 rounded-md border border-green-200 dark:border-green-800 pointer-events-none">
                <div className="flex-grow min-w-0 text-green-800 dark:text-green-300">
                  <HtmlRenderer htmlContent={quizAnswer} />
                </div>
              </div>
            </div>

            {options.map((option, index) => (
              <div key={option.tempId} className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">
                  Option {index + 1}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <RichTextEditor
                      initialContent={option.value}
                      onChange={(value) =>
                        handleOptionChange(value, option.tempId)
                      }
                      editable={!isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(option.tempId)}
                    disabled={isLoading}
                    className="cursor-pointer p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            {options.length < minimumOptions - 1 && (
              <button
                type="button"
                onClick={handleAddOption}
                disabled={isLoading}
                className="cursor-pointer flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Option</span>
              </button>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isChanged || isLoading}
              className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Update Quiz"
              )}
            </button>
          </div>
        </form>
      </Modal>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleRemoveOption}
        title="Delete Quiz Option"
        description="Are you sure you want to delete this quiz option? This action is not reversible."
      />
    </>
  );
};

export default EditQuizModal;
