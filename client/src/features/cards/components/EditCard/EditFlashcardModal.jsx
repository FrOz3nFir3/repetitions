import React, { useState, useRef, useEffect, useMemo } from "react";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import { useSelector } from "react-redux";
import {
  ArrowPathIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  QuestionMarkCircleIcon,
  LightBulbIcon,
  EyeIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import Modal from "../../../../components/ui/Modal";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import Flashcard from "../Flashcard/Review/Flashcard";
import FlashcardTips from "./FlashcardTips";
import { selectCurrentUser } from "../../../authentication/state/authSlice";
import toast from "react-hot-toast";

const EditFlashcardModal = ({ isOpen, onClose, flashcard, cardId }) => {
  const user = useSelector(selectCurrentUser);
  const [updateCard, { isLoading, error }] = usePatchUpdateCardMutation();
  const errorRef = useRef(null);

  const originalState = useMemo(
    () => ({
      question: flashcard.question,
      answer: flashcard.answer,
    }),
    []
  );

  const [question, setQuestion] = useState(originalState.question);
  const [answer, setAnswer] = useState(originalState.answer);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

  useEffect(() => {
    const currentState = { question, answer };
    setIsChanged(
      JSON.stringify(originalState) !== JSON.stringify(currentState)
    );
  }, [question, answer, originalState]);

  useEffect(() => {
    setQuestion(flashcard.question);
    setAnswer(flashcard.answer);
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isChanged) return;

    const payload = {
      _id: cardId,
      cardId: flashcard._id,
    };

    // Only send changed fields
    if (originalState.question !== question) {
      payload.question = question;
    }
    if (originalState.answer !== answer) {
      payload.answer = answer;
    }

    updateCard(payload).then((response) => {
      if (response.data) {
        toast.success(response.data.message);
        onClose();
      }
    });
  };

  const handleClose = () => {
    setQuestion(originalState.question);
    setAnswer(originalState.answer);
    setIsFlipped(false);
    onClose();
  };

  const previewData = { question, answer };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="7xl">
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 rounded-3xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <BookOpenIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                  Edit Flashcard
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Update your flashcard content and preview changes
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
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Error Message */}
          <div ref={errorRef}>
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200">
                      Something went wrong
                    </h4>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                      {error.data?.error || "Please try again"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Section */}
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <label
                    onClick={() => questionEditorRef.current?.focus()}
                    className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer"
                  >
                    Front Side (Question)
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    What you want to learn or remember
                  </p>
                </div>
              </div>
              <div className="rounded-md border-2 border-blue-500 dark:border-blue-600 shadow-lg hover:shadow-xl">
                <RichTextEditor
                  ref={questionEditorRef}
                  initialContent={question}
                  onChange={(newContent) => {
                    setQuestion(newContent);
                    setIsFlipped(false);
                  }}
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
                  <label
                    onClick={() => answerEditorRef.current?.focus()}
                    className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent cursor-pointer"
                  >
                    Back Side (Answer)
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The answer or explanation
                  </p>
                </div>
              </div>
              <div className="rounded-md border-2 border-emerald-500 dark:border-emerald-600 shadow-lg hover:shadow-xl">
                <RichTextEditor
                  ref={answerEditorRef}
                  initialContent={answer}
                  onChange={(newContent) => {
                    setAnswer(newContent);
                    setIsFlipped(true);
                  }}
                  editable={!isLoading}
                  className="!mt-0"
                />
              </div>
            </div>
          </div>
          {/* Right Side - Live Preview */}
          <div className="mt-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <EyeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Live Preview
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the card to flip between sides
                </p>
              </div>
            </div>

            <Flashcard
              currentFlashcard={previewData}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />
            <div className="mt-4">
              <FlashcardTips />
            </div>
          </div>
          {/* Footer Actions */}
          <div className="flex gap-4 flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {question && answer && user ? (
                <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="h-4 w-4" />
                  Ready to update
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
                onClick={handleClose}
                disabled={isLoading}
                className="cursor-pointer px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isLoading || !question || !answer || !user || !isChanged
                }
                className="group cursor-pointer flex items-center gap-3 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <BookOpenIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    Update Flashcard
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditFlashcardModal;
