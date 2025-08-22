import React, { useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import CategorySkeleton from "../../../components/ui/skeletons/CategoryPageSkeleton";
import PreviouslyStudied from "../../progress/components/PreviouslyStudied";
import CreateCategoryCard from "../components/CreateCategoryCard";
import CategoryHeader from "../components/CategoryHeader";
import Modal from "../../../components/ui/Modal";
import CategorySearch from "../components/CategorySearch";
import CategoryGrid from "../components/CategoryGrid";
import CategoryGridSkeleton from "../../../components/ui/skeletons/CategoryGridSkeleton";
import Pagination from "../../../components/ui/Pagination";
import useCategoriesWithSearch from "../../../hooks/useCategoriesWithSearch";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { normalizeCategory } from "../../../utils/textNormalization";

function CategoryPage() {
  const navigate = useNavigate();
  let { name: categoryName } = useParams();
  categoryName = normalizeCategory(categoryName);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    categories: currentCategories,
    total: totalItemsCount,
    totalPages,
    isFetching,
    isLoading,
    isSearching,
  } = useCategoriesWithSearch();

  const filteredItemsCount = currentCategories.length;

  const handleCategoryClick = (category) => {
    if (categoryName) {
      navigate(`../${category}`);
    } else {
      navigate(category);
    }
    setTimeout(() => {
      const cardListElement = document.querySelector("[data-cardlist]");
      if (cardListElement) {
        cardListElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleCreateCategory = (newCategoryName) => {
    if (categoryName) {
      navigate(`../${newCategoryName}`);
    } else {
      navigate(newCategoryName);
    }
    setShowCreateForm(false);
  };

  // Early return *after* hooks
  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <PreviouslyStudied />
        <CategoryHeader />
        <div className="mb-16">
          <CategorySearch
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onShowCreateForm={() => setShowCreateForm(true)}
            filteredCount={filteredItemsCount}
            totalCount={totalItemsCount}
          />
          {filteredItemsCount === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
                <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                {searchQuery ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                {isSearching
                  ? `No categories match "${searchQuery}". Try a different search term.`
                  : "Create your first category to start organizing your study materials."}
              </p>
              {!isSearching && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="h-5 w-5" />
                  Create First Category
                </button>
              )}
            </div>
          ) : (
            <>
              {isFetching && currentCategories.length === 0 ? (
                <CategoryGridSkeleton count={12} />
              ) : (
                <CategoryGrid
                  categories={currentCategories}
                  onCategoryClick={handleCategoryClick}
                  activeCategory={categoryName}
                />
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsCount={totalItemsCount}
                  itemsPerPage={12}
                  activeColorClass="bg-indigo-600"
                />
              )}

              {isFetching && currentCategories.length > 0 && (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </>
          )}
        </div>
        <Modal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          maxWidth="md"
        >
          <CreateCategoryCard
            onCreate={handleCreateCategory}
            onCancel={() => setShowCreateForm(false)}
          />
        </Modal>
        <div className="mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
