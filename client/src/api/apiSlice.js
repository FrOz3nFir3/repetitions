import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  initialUser,
  setCsrfToken,
} from "../features/authentication/state/authSlice";
import { setSessionStatus, isSessionPotentiallyActive } from "../utils/session";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/api`
      : (import.meta.env.VITE_API_URL ?? "") + "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = getState().auth.csrfToken;
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle authentication token expiry
  if (result.error && result.error.status === 401) {
    if (
      result.error.data?.error === "Authentication token expired." ||
      result.error.data?.error === "User not Logged In."
    ) {
      const isValidSession = isSessionPotentiallyActive();
      if (!isValidSession) return result;
      const refreshResult = await baseQuery(
        { url: "/user/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.meta.response.ok) {
        // Update CSRF token if provided in refresh response
        if (refreshResult.data?.csrfToken) {
          api.dispatch(setCsrfToken(refreshResult.data.csrfToken));
        }
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Force logout if refresh fails
        api.dispatch(initialUser({ user: null, csrfToken: null }));
        setSessionStatus();
      }
    }
  }

  // Handle CSRF token issues (with retry limit)
  if (result.error && result.error.status === 403) {
    const errorMessage = result.error.data?.error || "";

    // Check if it's a CSRF-related error
    if (errorMessage.includes("CSRF token")) {
      // Try to get a fresh CSRF token from lightweight /csrf-refresh endpoint
      const authResult = await baseQuery(
        { url: "/user/csrf-refresh", method: "POST" },
        api,
        extraOptions
      );

      if (authResult.meta?.response?.ok && authResult.data?.csrfToken) {
        // Update CSRF token and retry original request
        api.dispatch(setCsrfToken(authResult.data.csrfToken));
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Force logout if refresh fails
        api.dispatch(initialUser({ user: null, csrfToken: null }));
        setSessionStatus();
      }
    }
  }

  return result;
};

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "cards",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Card",
    "CardOverview", // For view=overview (metadata + counts)
    "CardFlashcards", // For view=review and view=review_text (flashcard data)
    "CardQuiz", // For view=quiz (quiz data)
    "CardReviewQueue", // For view=review-queue (review queue data)
    "Report",
    "User",
    "CardReviewProgress",
    "FocusReviewData",
    "FocusQuizData", // Separate tag for focus quiz sessions
    "RegularReviewData", // Separate tag for regular review sessions to avoid unnecessary focus review refetches
    "Reviewers", // For reviewer management
  ],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: () => `/cards/all`,
      providesTags: ["Card"],
    }),

    getCategoriesPaginated: builder.query({
      query: ({ page = 1, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/cards/categories?${params.toString()}`;
      },
      providesTags: ["Card"],
      // Keep separate cache entries for each page and search combination
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          page: queryArgs.page || 1,
          search: queryArgs.search || "",
        };
      },
    }),

    getCardsByCategory: builder.query({
      query: (category) => `/cards/${category}`,
      providesTags: ["Card"],
    }),

    getCardsByCategoryPaginated: builder.query({
      query: ({ category, page = 1, search = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/cards/${category}?${params.toString()}`;
      },
      providesTags: ["Card"],
      // Keep separate cache entries for each page and search combination
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          category: queryArgs.category,
          page: queryArgs.page || 1,
          search: queryArgs.search || "",
        };
      },
    }),

    getIndividualCard: builder.query({
      query: ({ id, view = "overview", skipLogs = false }) => {
        const params = new URLSearchParams();
        if (skipLogs) {
          params.append("skipLogs", "true");
        }
        const queryString = params.toString();
        return `/card/${id}?view=${view}${queryString ? `&${queryString}` : ""}`;
      },
      providesTags: (result, error, { id, view }) => {
        // Provide view-specific tags for granular cache control
        if (view === "review") {
          return [{ type: "CardFlashcards", id }];
        } else if (view === "quiz") {
          return [{ type: "CardQuiz", id }];
        } else if (view === "review-queue") {
          return [{ type: "CardReviewQueue", id }];
        } else if (view === "overview") {
          return [{ type: "CardOverview", id }];
        } else if (view === "review_text") {
          return [{ type: "CardFlashcards", id }];
        }
        // Fallback
        return [{ type: "CardOverview", id }];
      },
    }),

    postCreateNewCard: builder.mutation({
      query: (card) => ({
        url: "/cards",
        method: "POST",
        body: card,
      }),
      invalidatesTags: (result, error, arg) => (!error ? ["Card"] : null),
    }),

    patchUpdateCard: builder.mutation({
      query: (card) => ({
        url: "/card",
        method: "PATCH",
        body: card,
      }),
      invalidatesTags: (result, error, arg) => {
        if (error) return [];

        const { _id, updateType } = arg;
        const tags = ["Card"]; // Always invalidate the general Card list

        // Auto-detect update type based on parameters if not explicitly provided
        let detectedUpdateType = updateType;
        if (!detectedUpdateType) {
          // Check for quiz-related parameters
          if (
            arg.quizId ||
            arg.deleteQuiz ||
            arg.quizzes ||
            arg.quizQuestion ||
            arg.quizAnswer ||
            arg.option ||
            arg.deleteOption ||
            arg.minimumOptions ||
            arg.reorderQuizzes
          ) {
            detectedUpdateType = "quiz";
          }
          // Check for flashcard-related parameters
          else if (
            arg.cardId ||
            arg.deleteCard ||
            arg.review ||
            arg.question ||
            arg.answer ||
            arg.reorderFlashcards
          ) {
            detectedUpdateType = "flashcards";
          } else {
            // Main card fields (category, main-topic, sub-topic, description)
            detectedUpdateType = "overview";
          }
        }

        // Invalidate specific view tags based on what was updated
        if (detectedUpdateType === "flashcards") {
          // Only invalidate flashcard data and overview (for counts)
          tags.push({ type: "CardFlashcards", id: _id });
          tags.push({ type: "CardOverview", id: _id });
        } else if (detectedUpdateType === "quiz") {
          // Only invalidate quiz data and overview (for counts)
          tags.push({ type: "CardQuiz", id: _id });
          tags.push({ type: "CardOverview", id: _id });
        } else if (detectedUpdateType === "overview") {
          // Main card fields changed - invalidate overview only
          tags.push({ type: "CardOverview", id: _id });
        }

        // Always invalidate review queue data when card is updated
        // This ensures review queue items are refreshed after any card changes
        tags.push({ type: "CardReviewQueue", id: _id });

        return tags;
      },
    }),

    postRegisterUser: builder.mutation({
      query: (user) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
    }),

    postLoginUser: builder.mutation({
      query: (user) => ({
        url: "/user/login",
        method: "POST",
        body: user,
      }),
    }),

    postAuthDetails: builder.mutation({
      query: () => ({
        url: `/user/authed`,
        method: "POST",
      }),
      providesTags: ["User"],
    }),

    getUserProgressPaginated: builder.query({
      query: ({ page = 1, search = "", category = "All" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        if (category && category !== "All") {
          params.append("category", category);
        }
        return `/user/progress?${params.toString()}`;
      },
      providesTags: (result) => [
        { type: "Report", id: "LIST" },
        ...(result?.cards?.map(({ _id }) => ({ type: "Report", id: _id })) ??
          []),
      ],
      // Keep separate cache entries for each page, search, and category combination
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          page: queryArgs.page || 1,
          search: queryArgs.search || "",
        };
      },
    }),

    getUserStats: builder.query({
      query: () => `/user/stats`,
      providesTags: ["Report"],
    }),

    getQuizProgress: builder.query({
      query: ({ page = 1, search = "", category = "All" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
        });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        if (category && category !== "All") {
          params.append("category", category);
        }
        return `/user/quiz-progress?${params.toString()}`;
      },
      providesTags: (result) => [
        { type: "Report", id: "LIST" },
        ...(result?.cards?.map(({ _id }) => ({ type: "Report", id: _id })) ??
          []),
      ],
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          page: queryArgs.page || 1,
          search: queryArgs.search || "",
        };
      },
    }),

    getCardReviewProgress: builder.query({
      query: (card_id) => `/user/review-progress/${card_id}`,
      providesTags: (result, error, card_id) => [
        { type: "RegularReviewData", id: card_id }, // Use RegularReviewData for regular review sessions
      ],
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs; // Each card_id gets its own cache entry
      },
    }),

    getDetailedReport: builder.query({
      query: (card_id) => `/user/report/${card_id}`,
      providesTags: ["Report"],
    }),

    getCardLogs: builder.query({
      query: ({ cardId, page, search = "" }) => {
        const params = new URLSearchParams({ page: page.toString() });
        if (search.trim()) {
          params.append("search", search.trim());
        }
        return `/card/${cardId}/logs?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { cardId, search = "" } = queryArgs;
        return `${cardId}-${search.trim()}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, { arg }) => {
        // If it's page 1, replace the cache (new search or reset)
        if (arg.page === 1) {
          return {
            logs: newItems.logs,
            hasMore: newItems.hasMore,
          };
        }
        // Otherwise, append for infinite scroll
        return {
          logs: [...currentCache.logs, ...newItems.logs],
          hasMore: newItems.hasMore,
        };
      },
    }),

    getReviewQueueItems: builder.query({
      query: ({ cardId, page }) => {
        const params = new URLSearchParams({ page: page.toString() });
        return `/card/${cardId}/review-queue?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { cardId } = queryArgs;
        return `reviewQueue-${cardId}`;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems, { arg }) => {
        // If it's page 1, replace the cache (new data or reset)
        if (arg.page === 1) {
          return {
            items: newItems.items,
            hasMore: newItems.hasMore,
          };
        }
        // Otherwise, append for infinite scroll
        return {
          items: [...currentCache.items, ...newItems.items],
          hasMore: newItems.hasMore,
        };
      },
      providesTags: (result, error, { cardId }) => [
        { type: "CardReviewQueue", id: cardId },
      ],
    }),

    patchUpdateUserProfile: builder.mutation({
      query: (user) => ({
        url: "/user",
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (result, error, arg) => (!error ? ["User"] : null),
    }),

    patchUpdateUserQuizProgress: builder.mutation({
      query: (user) => ({
        url: "/user/quiz-progress",
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (result, error, arg) => {
        if (!error) {
          const tags = ["Report"];

          // Add struggling quiz tracking
          if (arg.isFirstQuestion) {
            tags.push("User");
          }

          // Only invalidate FocusQuizData if NOT on focus quiz page
          if (!arg.skipFocusQuizInvalidation) {
            tags.push({ type: "FocusQuizData", id: arg.card_id });
          }

          return tags;
        }
        return [];
      },
    }),

    updateUserReviewProgress: builder.mutation({
      query: (progress) => ({
        url: "/user/review-progress",
        method: "PATCH",
        body: progress,
      }),
      invalidatesTags: (
        result,
        error,
        { card_id, skipFocusReviewInvalidation }
      ) => {
        if (!error) {
          const tags = [
            { type: "Report", id: "LIST" },
            { type: "Report", id: card_id },
            { type: "RegularReviewData", id: card_id },
            { type: "RegularReviewData", id: "LIST" },
          ];

          // Only invalidate FocusReviewData if NOT on focus review page
          if (!skipFocusReviewInvalidation) {
            tags.push({ type: "FocusReviewData", id: card_id });
          }

          return tags;
        }
        return [];
      },
    }),

    updateUserWeakCards: builder.mutation({
      query: (weakCardData) => ({
        url: "/user/weak-cards",
        method: "PATCH",
        body: weakCardData,
      }),
      invalidatesTags: (
        result,
        error,
        { cardId, skipFocusReviewInvalidation, skipRegularReviewInvalidation }
      ) => {
        if (!error) {
          const tags = [
            { type: "Report", id: "LIST" },
            { type: "Report", id: cardId },
          ];

          // Only invalidate RegularReviewData if NOT on regular review page
          if (!skipRegularReviewInvalidation) {
            tags.push(
              { type: "RegularReviewData", id: cardId },
              { type: "RegularReviewData", id: "LIST" }
            );
          }

          // Only invalidate FocusReviewData if NOT on focus review page
          if (!skipFocusReviewInvalidation) {
            tags.push({ type: "FocusReviewData", id: cardId });
          }

          return tags;
        }
        return [];
      },
    }),

    postLogoutUser: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
    }),

    postGoogleLogin: builder.mutation({
      query: (user) => ({
        url: "/user/google-login",
        method: "POST",
        body: user,
      }),
    }),

    getPublicUserByUsername: builder.query({
      query: (username) => `/users/${username}`,
      providesTags: (result, error, arg) => [{ type: "User", id: arg }],
    }),

    getCardsByAuthor: builder.query({
      query: ({ username, page, limit }) =>
        `/users/${username}/cards?page=${page}`,
      providesTags: (result) =>
        result?.cards
          ? [
            ...result.cards.map(({ _id }) => ({ type: "Card", id: _id })),
            { type: "Card", id: "LIST" },
          ]
          : [{ type: "Card", id: "LIST" }],
    }),

    getFocusReviewData: builder.query({
      query: (cardId) => `/user/focus-review/${cardId}`,
      providesTags: (result, error, cardId) => [
        { type: "FocusReviewData", id: cardId },
      ],
    }),

    getFocusQuizData: builder.query({
      query: (cardId) => `/user/focus-quiz/${cardId}`,
      providesTags: (result, error, cardId) => [
        { type: "FocusQuizData", id: cardId },
      ],
    }),

    updateUserStrugglingQuiz: builder.mutation({
      query: (strugglingQuizData) => ({
        url: "/user/struggling-quiz",
        method: "PATCH",
        body: strugglingQuizData,
      }),
      invalidatesTags: (
        result,
        error,
        { cardId, skipFocusQuizInvalidation }
      ) => {
        if (!error) {
          const tags = [
            { type: "Report", id: "LIST" },
            { type: "Report", id: cardId },
          ];

          // Only invalidate FocusQuizData if NOT on focus quiz page
          if (!skipFocusQuizInvalidation) {
            tags.push({ type: "FocusQuizData", id: cardId });
          }

          return tags;
        }
        return [];
      },
    }),

    // Review Queue Management Endpoints
    acceptReviewItem: builder.mutation({
      query: ({ cardId, itemId }) => ({
        url: `/card/${cardId}/review-queue/${itemId}/accept`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { cardId }) => {
        if (!error) {
          return [
            { type: "CardReviewQueue", id: cardId },
            { type: "CardOverview", id: cardId },
            { type: "CardFlashcards", id: cardId },
            { type: "CardQuiz", id: cardId },
            "Card",
          ];
        }
        return [];
      },
    }),

    rejectReviewItem: builder.mutation({
      query: ({ cardId, itemId }) => ({
        url: `/card/${cardId}/review-queue/${itemId}/reject`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { cardId }) => {
        if (!error) {
          return [
            { type: "CardReviewQueue", id: cardId },
            { type: "CardOverview", id: cardId },
          ];
        }
        return [];
      },
    }),

    deleteReviewItem: builder.mutation({
      query: ({ cardId, itemId }) => ({
        url: `/card/${cardId}/review-queue/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { cardId }) => {
        if (!error) {
          return [{ type: "CardReviewQueue", id: cardId }];
        }
        return [];
      },
    }),

    // Reviewer Management Endpoints
    getReviewers: builder.query({
      query: (cardId) => `/card/${cardId}/reviewers`,
      providesTags: (result, error, cardId) => [
        { type: "Reviewers", id: cardId },
      ],
    }),

    addReviewers: builder.mutation({
      query: ({ cardId, usernames }) => ({
        url: `/card/${cardId}/reviewers`,
        method: "POST",
        body: { usernames },
      }),
      invalidatesTags: (result, error, { cardId }) => {
        if (!error) {
          return [{ type: "Reviewers", id: cardId }];
        }
        return [];
      },
    }),

    removeReviewer: builder.mutation({
      query: ({ cardId, username }) => ({
        url: `/card/${cardId}/reviewers/${username}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { cardId }) => {
        if (!error) {
          return [{ type: "Reviewers", id: cardId }];
        }
        return [];
      },
    }),

    // User Search Endpoint
    searchUsers: builder.query({
      query: ({ search, id, page }) => {
        const params = new URLSearchParams({
          id: id?.toString(),
          page: page?.toString()
        });
        if (search && search.trim()) {
          params.append("search", search.trim());
        }
        return `/users/search?${params.toString()}`;
      },
      providesTags: ["User"],
      // Serialize query args to cache only by search term and id, not page
      serializeQueryArgs: ({ queryArgs }) => {
        return {
          search: queryArgs.search?.trim() || "",
          id: queryArgs.id,
        };
      },
      // Force refetch when page changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
    }),
  }),
});

export const {
  useGetCategoriesPaginatedQuery,
  useGetCardsByCategoryQuery,
  useGetCardsByCategoryPaginatedQuery,
  usePostCreateNewCardMutation,
  useGetIndividualCardQuery,
  usePatchUpdateCardMutation,
  usePostRegisterUserMutation,
  usePostLoginUserMutation,
  usePostAuthDetailsMutation,
  usePatchUpdateUserProfileMutation,
  usePatchUpdateUserQuizProgressMutation,
  useUpdateUserReviewProgressMutation,
  useUpdateUserWeakCardsMutation,
  usePostLogoutUserMutation,
  usePostGoogleLoginMutation,
  useGetUserProgressPaginatedQuery,
  useGetUserStatsQuery,
  useGetQuizProgressQuery,
  useGetCardReviewProgressQuery,
  useGetDetailedReportQuery,
  useGetCardLogsQuery,
  useGetReviewQueueItemsQuery,
  useGetPublicUserByUsernameQuery,
  useGetCardsByAuthorQuery,
  useGetFocusReviewDataQuery,
  useGetFocusQuizDataQuery,
  useUpdateUserStrugglingQuizMutation,
  // Review Queue Management Hooks
  useAcceptReviewItemMutation,
  useRejectReviewItemMutation,
  useDeleteReviewItemMutation,
  // Reviewer Management Hooks
  useGetReviewersQuery,
  useAddReviewersMutation,
  useRemoveReviewerMutation,
  // User Search Hook
  useSearchUsersQuery,
} = apiSlice;
