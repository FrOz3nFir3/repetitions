// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "cards",
  // in development mode api url (nodejs server is on 3000 port) so http://localhost:3000/api
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Card"],
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
        // invalidatesTags: (result, error, arg) => (!error ? ["Card"] : null),
      }),

    getIndividualCard: builder.query({
      query: (id) => `/card/${id}`,
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
      invalidatesTags: (result, error, arg) => (!error ? ["Card"] : null),
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
    }),

    getUserProgress: builder.query({
      query: (id) => `/user/${id}`,
    }),

    patchUpdateUser: builder.mutation({
      query: (user) => ({
        url: "/user",
        method: "PATCH",
        body: user,
      }),
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
  usePatchUpdateUserMutation,
  usePostLogoutUserMutation,
  usePostGoogleLoginMutation,
  usePostCardsByIdsMutation
} = apiSlice;
