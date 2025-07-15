// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "cards",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/api`
        : "/api",
  }),
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

    postCardsByIds: builder.mutation({
      query: (card) => ({
        url: "/cards/ids",
        method: "POST",
        body: card,
      }),
      providesTags: ["Report"],
      // invalidatesTags: (result, error, arg) => (!error ? ["Card"] : null),
    }),

    getIndividualCard: builder.query({
      query: (id) => `/card/${id}`,
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

    getAuthDetails: builder.query({
      query: () => `/user/authed`,
      providesTags: ["User"],
    }),

    getUserProgress: builder.query({
      query: () => `/user/progress`,
      providesTags: ["Report"],
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
  useGetAuthDetailsQuery,
  usePatchUpdateUserProfileMutation,
  usePatchUpdateUserProgressMutation,
  usePostLogoutUserMutation,
  usePostGoogleLoginMutation,
  // no longer used now
  // usePostCardsByIdsMutation
  useGetUserProgressQuery,
  useGetDetailedReportQuery,
  useGetCardLogsQuery,
} = apiSlice;
