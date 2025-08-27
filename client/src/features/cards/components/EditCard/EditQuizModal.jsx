import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "../../../../components/ui/Modal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  HashtagIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

import {
  AcademicCapIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ListBulletIcon,
} from "@heroicons/react/24/solid";
import HtmlRenderer from "../../../../components/ui/HtmlRenderer";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import SearchableDropdown from "../../components/ui/SearchableDropdown";
import { getTextFromHtml } from "../../../../utils/dom";
import QuizTips from "./QuizTips";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

let tempIdCounter = 0;

const EditQuizModal = ({
  isOpen,
  onClose,
  cardId,
  flashcardId,
  quiz,
  flashcards,
}) => {
  const user = useSelector(selectCurrentUser);
  const [updateCard, { error, isLoading }] = usePatchUpdateCardMutation();
  const errorRef = useRef(null);

  const originalState = useMemo(
    () => ({
      quizQuestion: quiz.quizQuestion,
      quizAnswer: quiz.quizAnswer,
      options: quiz.options || [],
      minimumOptions: quiz.minimumOptions,
      flashcardId: flashcardId,
    }),
    [quiz, flashcardId]
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
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(
    originalState.flashcardId
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const [isChanged, setIsChanged] = useState(false);

  const flashcardOptions = useMemo(
    () =>
      flashcards.map((fc, index) => {
        const plainText = getTextFromHtml(fc.question);
        const truncatedText =
          plainText.length > 40
            ? `${plainText.substring(0, 40)}...`
            : plainText;
        return {
          value: fc._id,
          label: `${index + 1}. ${truncatedText}`,
        };
      }),
    [flashcards]
  );

  useEffect(() => {
    const currentState = {
      quizQuestion,
      quizAnswer,
      options: options.map(({ value }) => ({ value })),
      minimumOptions,
      flashcardId: selectedFlashcardId,
    };
    const originalSimpleState = {
      quizQuestion: originalState.quizQuestion,
      quizAnswer: originalState.quizAnswer,
      options: originalState.options.map(({ value }) => ({ value })),
      minimumOptions: originalState.minimumOptions,
      flashcardId: originalState.flashcardId,
    };
    setIsChanged(
      JSON.stringify(originalSimpleState) !== JSON.stringify(currentState)
    );
  }, [
    quizQuestion,
    quizAnswer,
    options,
    minimumOptions,
    selectedFlashcardId,
    originalState,
  ]);

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
    const newOptions = [
      ...options,
      { value: "", tempId: `temp_${tempIdCounter++}` },
    ];
    setOptions(newOptions);
    setMinimumOptions(() => {
      let newLength = newOptions.length + 1;
      if (newLength > 2) {
        return newLength;
      } else {
        return 2;
      }
    });
  };

  const handleRemoveOption = () => {
    if (!selectedOptionId) return;

    const payload = {
      _id: cardId,
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
      const newOptions = options.filter((opt) => opt.tempId !== id);
      setOptions(newOptions);
      setMinimumOptions(() => {
        let newLength = newOptions.length + 1;
        if (newLength > 2) {
          return newLength;
        } else {
          return 2;
        }
      });
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
      quizId: quiz._id,
      cardId: selectedFlashcardId,
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
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="7xl">
        <div className="relative bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-950 rounded-3xl overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-300 bg-clip-text text-transparent">
                    Edit Quiz
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Update your quiz content, options, and settings
                  </p>
                  {isChanged && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Unsaved changes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div ref={errorRef}>
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-300 font-medium">
                    {error.data?.error || "An error occurred"}
                  </p>
                </div>
              )}
            </div>

            {/* Main Content - Improved Flow Layout */}
            <div className="space-y-8">
              {/* Core Content Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Question Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <label className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Quiz Question
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        What do you want to ask? Make it clear and specific.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-blue-500 dark:border-blue-600 shadow-lg hover:shadow-xl">
                    <RichTextEditor
                      initialContent={quizQuestion}
                      onChange={setQuizQuestion}
                      editable={!isLoading}
                      className="!mt-0"
                    />
                  </div>
                </div>

                {/* Answer Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                      <LightBulbIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <label className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Correct Answer
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Provide the right answer to your question.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-emerald-500 dark:border-emerald-600 shadow-lg hover:shadow-xl">
                    <RichTextEditor
                      initialContent={quizAnswer}
                      onChange={setQuizAnswer}
                      editable={!isLoading}
                      className="!mt-0"
                    />
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Flashcard Association */}
                <div className="lg:col-span-2 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                      <FunnelIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <label className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Link to Flashcard
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect this quiz to a specific flashcard for better
                        organization.
                      </p>
                    </div>
                  </div>
                  <SearchableDropdown
                    options={flashcardOptions}
                    value={selectedFlashcardId}
                    onChange={setSelectedFlashcardId}
                    placeholder="Search for a flashcard..."
                  />
                </div>

                {/* Minimum Options */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                      <HashtagIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <label className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Minimum Options
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Required number of answer choices for this quiz.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-amber-200 dark:border-amber-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <input
                      type="number"
                      id="minimumOptions"
                      value={minimumOptions}
                      onChange={(e) =>
                        setMinimumOptions(Number(e.target.value))
                      }
                      className="w-full px-4 py-3 text-lg border-0 bg-transparent text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
                      min={2}
                      max={10}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Options Section - Full Width */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <ListBulletIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <label className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Answer Options
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage all possible answer choices for this quiz.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Correct Answer Display */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      Correct Answer
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (automatically included)
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700">
                    <div className="text-green-800 dark:text-green-200">
                      <HtmlRenderer htmlContent={quizAnswer} />
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                {options.map((option, index) => (
                  <div key={option.tempId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Option {index + 2}
                      </span>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(option.tempId)}
                        disabled={isLoading}
                        className="group cursor-pointer p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-700 disabled:opacity-50 transition-all duration-200"
                      >
                        <TrashIcon className="h-4 w-4 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
                      </button>
                    </div>
                    <div>
                      <RichTextEditor
                        initialContent={option.value}
                        onChange={(value) =>
                          handleOptionChange(value, option.tempId)
                        }
                        editable={!isLoading}
                      />
                    </div>
                  </div>
                ))}

                {/* Add Option Button */}
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={isLoading || !user}
                  className="cursor-pointer disabled:cursor-not-allowed w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 disabled:opacity-50"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span className="font-medium">Add Another Option</span>
                </button>
              </div>
            </div>

            {/* Quiz Tips */}
            <QuizTips />

            {/* Footer Actions */}
            <div className="flex gap-4 flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {quizQuestion && quizAnswer && user ? (
                  <span className="text-green-600 dark:text-green-400">
                    Ready to update quiz
                  </span>
                ) : !user ? (
                  "Login in to update"
                ) : (
                  "Fill in both question and answer to continue"
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="cursor-pointer px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isChanged || isLoading || !user}
                  className="group cursor-pointer flex items-center gap-3 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <AcademicCapIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Update Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
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
