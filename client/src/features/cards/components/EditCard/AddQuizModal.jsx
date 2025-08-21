import React, { useState, useRef, useMemo } from "react";
import Modal from "../../../../components/ui/Modal";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import RichTextEditor from "../../../../components/ui/RichTextEditor";
import {
  ArrowPathIcon,
  PlusIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

import {
  AcademicCapIcon,
  SparklesIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";
import SearchableDropdown from "../../components/ui/SearchableDropdown";
import { getTextFromHtml } from "../../../../utils/dom";
import QuizTips from "./QuizTips";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../authentication/state/authSlice";

const AddQuizModal = ({ cardId, flashcards }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);
  const user = useSelector(selectCurrentUser);

  const [updateCard, { error, isLoading }] = usePatchUpdateCardMutation();
  const questionEditorRef = useRef(null);
  const answerEditorRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateDetails = {
      _id: cardId,
      cardId: selectedFlashcardId,
      quizQuestion,
      quizAnswer,
    };
    updateCard(updateDetails).then((response) => {
      if (response.data) {
        setIsOpen(false);
        setQuizQuestion("");
        setQuizAnswer("");
        setSelectedFlashcardId(null);
      }
    });
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const isInputEmpty = !quizQuestion || !quizAnswer;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group shrink-0 cursor-pointer inline-flex items-center gap-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
          <PlusIcon className="h-5 w-5" />
        </div>
        Create Quiz
        <AcademicCapIcon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Create New Quiz"
        maxWidth="7xl"
      >
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
                    Create New Quiz
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Design a quiz to test understanding and knowledge retention
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800">
                <p className="text-red-700 dark:text-red-300 font-medium">
                  {error.data?.error || "An error occurred"}
                </p>
              </div>
            )}

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Form Fields */}
              <div className="space-y-6">
                {/* Question Section */}
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                      <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <label
                        onClick={() => questionEditorRef.current?.focus()}
                        className="cursor-pointer text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                      >
                        Quiz Question
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        What do you want to ask? Make it clear and specific.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-blue-500 dark:border-blue-600 shadow-lg hover:shadow-xl">
                    <RichTextEditor
                      ref={questionEditorRef}
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
                      <label
                        onClick={() => answerEditorRef.current?.focus()}
                        className="cursor-pointer text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                      >
                        Correct Answer
                      </label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Provide the right answer to your question.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-md border-2 border-emerald-500 dark:border-emerald-600 shadow-lg hover:shadow-xl">
                    <RichTextEditor
                      ref={answerEditorRef}
                      initialContent={quizAnswer}
                      onChange={setQuizAnswer}
                      editable={!isLoading}
                      className="!mt-0"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Settings and Tips */}
              <div className="lg:sticky lg:top-8 lg:self-start space-y-6">
                {/* Flashcard Association */}
                <div className="group">
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

                {/* Quiz Tips */}
                <QuizTips />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap gap-4 items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {quizQuestion && quizAnswer && user ? (
                  <span className="text-green-600 dark:text-green-400">
                    Ready to create quiz
                  </span>
                ) : !user ? (
                  "Login in to create"
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
                  disabled={isInputEmpty || isLoading || !user}
                  className="group cursor-pointer flex items-center gap-3 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Create Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AddQuizModal;
