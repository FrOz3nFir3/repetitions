import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import Modal from "../../../../components/ui/Modal";
import DraggableItem from "./DraggableItem";
import { usePatchUpdateCardMutation } from "../../../../api/apiSlice";
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const ReorderModal = ({ isOpen, onClose, cardId, contentType, items }) => {
  const [orderedItems, setOrderedItems] = useState(items || []);
  const [isLoading, setIsLoading] = useState(false);
  const [updateCard] = usePatchUpdateCardMutation();

  // Reset items when modal opens or items change
  React.useEffect(() => {
    if (isOpen && items) {
      setOrderedItems([...items]);
    }
  }, [isOpen, items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const itemIds = useMemo(
    () => orderedItems.map((item) => item._id),
    [orderedItems]
  );

  // Check if order has changed
  const hasOrderChanged = useMemo(() => {
    if (!items || orderedItems.length !== items.length) return false;
    return !orderedItems.every((item, index) => item._id === items[index]._id);
  }, [orderedItems, items]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setOrderedItems((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleMoveToTop = (itemId) => {
    setOrderedItems((items) => {
      const itemIndex = items.findIndex((item) => item._id === itemId);
      if (itemIndex > 0) {
        const item = items[itemIndex];
        const newItems = [...items];
        newItems.splice(itemIndex, 1);
        newItems.unshift(item);
        return newItems;
      }
      return items;
    });
  };

  const handleMoveToBottom = (itemId) => {
    setOrderedItems((items) => {
      const itemIndex = items.findIndex((item) => item._id === itemId);
      if (itemIndex < items.length - 1) {
        const item = items[itemIndex];
        const newItems = [...items];
        newItems.splice(itemIndex, 1);
        newItems.push(item);
        return newItems;
      }
      return items;
    });
  };

  const handleMoveUp = (itemId) => {
    setOrderedItems((items) => {
      const itemIndex = items.findIndex((item) => item._id === itemId);
      if (itemIndex > 0) {
        return arrayMove(items, itemIndex, itemIndex - 1);
      }
      return items;
    });
  };

  const handleMoveDown = (itemId) => {
    setOrderedItems((items) => {
      const itemIndex = items.findIndex((item) => item._id === itemId);
      if (itemIndex < items.length - 1) {
        return arrayMove(items, itemIndex, itemIndex + 1);
      }
      return items;
    });
  };

  const handleMoveToPosition = (itemId, position) => {
    const targetIndex = Math.max(
      0,
      Math.min(position - 1, orderedItems.length - 1)
    );
    setOrderedItems((items) => {
      const currentIndex = items.findIndex((item) => item._id === itemId);
      if (currentIndex !== targetIndex) {
        return arrayMove(items, currentIndex, targetIndex);
      }
      return items;
    });
  };

  const handleSave = async () => {
    if (!cardId || orderedItems.length === 0 || !hasOrderChanged) return;

    setIsLoading(true);
    try {
      const itemIds = orderedItems.map((item) => item._id);
      const updateData = {
        _id: cardId,
        ...(contentType === "flashcards"
          ? { reorderFlashcards: itemIds }
          : { reorderQuizzes: itemIds }),
      };

      await updateCard(updateData).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to reorder items:", error);
      // Error will be handled by RTK Query
    } finally {
      setIsLoading(false);
    }
  };

  const isFlashcards = contentType === "flashcards";
  const title = isFlashcards ? "Reorder Flashcards" : "Reorder Quizzes";
  const description = `Drag and drop or click on three dots to reorder your ${
    isFlashcards ? "flashcards" : "quizzes"
  }. `;

  return (
    <Modal className={"!p-0"} isOpen={isOpen} onClose={onClose} maxWidth="7xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-[85vh] flex flex-col">
        {/* Clean Header - Title Only */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
          <div className="relative px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <AdjustmentsHorizontalIcon className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                <p className="text-indigo-100 dark:text-purple-100 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 flex flex-col">
          {orderedItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <AdjustmentsHorizontalIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No {isFlashcards ? "flashcards" : "quizzes"} to reorder.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 px-6 py-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[
                  restrictToWindowEdges,
                  restrictToVerticalAxis,
                  restrictToParentElement,
                ]}
              >
                <SortableContext
                  items={itemIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="h-full overflow-y-auto overscroll-contain px-2 space-y-2">
                    {orderedItems.map((item, index) => (
                      <DraggableItem
                        key={item._id}
                        id={item._id}
                        index={index}
                        content={item}
                        contentType={contentType}
                        totalItems={orderedItems.length}
                        onMoveToTop={() => handleMoveToTop(item._id)}
                        onMoveToBottom={() => handleMoveToBottom(item._id)}
                        onMoveToPosition={(position) =>
                          handleMoveToPosition(item._id, position)
                        }
                        onMoveUp={() => handleMoveUp(item._id)}
                        onMoveDown={() => handleMoveDown(item._id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {hasOrderChanged ? (
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  Changes detected
                </span>
              ) : (
                <span>No changes made</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={
                  isLoading || orderedItems.length === 0 || !hasOrderChanged
                }
                className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                {isLoading ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReorderModal;
