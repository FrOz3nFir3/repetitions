import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  initialUser,
  setCsrfToken,
} from "../features/authentication/state/authSlice";

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
      }
    }
  }

  return result;
};

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "cards",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Card", "IndividualCard", "Report", "User"],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getAllCards: builder.query({
      query: () => `/cards/all`,
      providesTags: ["Card"],
    }),

    getCardsByCategory: builder.query({
      query: (category) => `/cards/${category}`,
      providesTags: ["Card"],
    }),

    getIndividualCard: builder.query({
      query: ({ id, view = "overview" }) => `/card/${id}?view=${view}`,
      providesTags: ["IndividualCard"],
      // providesTags: ["Card"],
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
      invalidatesTags: (result, error, arg) =>
        !error ? ["Card", "IndividualCard"] : null,
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

    postAuthDetails: builder.query({
      query: () => ({
        url: `/user/authed`,
        method: "POST",
      }),
      providesTags: ["User"],
    }),

    getUserProgress: builder.query({
      query: () => `/user/progress`,
      providesTags: (result) => [
        { type: "Report", id: "LIST" },
        ...(result?.map(({ _id }) => ({ type: "Report", id: _id })) ?? []),
      ],
    }),

    getCardReviewProgress: builder.query({
      query: (card_id) => `/user/card-progress/${card_id}`,
    }),

    getDetailedReport: builder.query({
      query: (card_id) => `/user/report/${card_id}`,
      providesTags: ["Report"],
    }),

    getCardLogs: builder.query({
      query: ({ cardId, page }) => `/card/${cardId}/logs?page=${page}`,
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        return endpointName;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      merge: (currentCache, newItems) => {
        return {
          logs: [...currentCache.logs, ...newItems.logs],
          hasMore: newItems.hasMore,
        };
      },
    }),

    patchUpdateUserProfile: builder.mutation({
      query: (user) => ({
        url: "/user",
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (result, error, arg) => (!error ? ["User"] : null),
    }),

    patchUpdateUserProgress: builder.mutation({
      query: (user) => ({
        url: "/user/progress",
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: (result, error, arg) => {
        if (!error && arg.isFirstQuestion) {
          // TODO: for every first question it will call user auth can optimize this later
          return ["Report", "User"];
        }
        if (!error) {
          return ["Report"];
        }
      },
    }),

    updateUserReviewProgress: builder.mutation({
      query: (progress) => ({
        url: "/user/review-progress",
        method: "PATCH",
        body: progress,
      }),
      invalidatesTags: (result, error) => {
        if (!error) {
          return [{ type: "Report", id: "LIST" }]; // Only invalidate the progress list
        }
        return [];
      },
      onQueryStarted: async (
        { card_id, lastReviewedCardNo },
        { dispatch, queryFulfilled }
      ) => {
        try {
          await queryFulfilled;

          // Manually update the card progress cache without triggering a refetch
          dispatch(
            apiSlice.util.updateQueryData(
              "getCardReviewProgress",
              card_id,
              (draft) => {
                draft.lastReviewedCardNo = lastReviewedCardNo;
              }
            )
          );
        } catch {
          // Handle error if needed
        }
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
        `/users/${username}/cards?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.cards
          ? [
              ...result.cards.map(({ _id }) => ({ type: "Card", id: _id })),
              { type: "Card", id: "LIST" },
            ]
          : [{ type: "Card", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCardsQuery,
  useGetCardsByCategoryQuery,
  usePostCreateNewCardMutation,
  useGetIndividualCardQuery,
  usePatchUpdateCardMutation,
  usePostRegisterUserMutation,
  usePostLoginUserMutation,
  usePostAuthDetailsQuery,
  usePatchUpdateUserProfileMutation,
  usePatchUpdateUserProgressMutation,
  useUpdateUserReviewProgressMutation,
  usePostLogoutUserMutation,
  usePostGoogleLoginMutation,
  useGetUserProgressQuery,
  useGetCardReviewProgressQuery,
  useGetDetailedReportQuery,
  useGetCardLogsQuery,
  useGetPublicUserByUsernameQuery,
  useGetCardsByAuthorQuery,
} = apiSlice;
