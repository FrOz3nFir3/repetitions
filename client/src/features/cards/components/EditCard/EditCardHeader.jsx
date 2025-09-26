import React, { useState } from "react";
import { NewFlashcardModal } from "./NewFlashCardModal";
import AddQuizModal from "./AddQuizModal";
import PermissionManagementModal from "./PermissionManagementModal";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const EditCardHeader = ({ flashcardId, view }) => {
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  return (
    <div className="flex gap-2 flex-wrap justify-between items-center mb-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Edit {view}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsPermissionModalOpen(true)}
          className="group shrink-0 cursor-pointer inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-200">
            <UserGroupIcon className="h-5 w-5" />
          </div>
          Manage Reviewers
        </button>

        {view === "flashcards" && (
          <NewFlashcardModal flashcardId={flashcardId} />
        )}

        {view === "quizzes" && <AddQuizModal cardId={flashcardId} />}
      </div>

      <PermissionManagementModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
      />
    </div>
  );
};

export default EditCardHeader;
