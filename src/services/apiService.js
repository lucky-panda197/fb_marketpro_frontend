import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiService = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Post", "Group", "Vps"],
  endpoints: (builder) => ({
    //Post endpoints
    getAllPosts: builder.query({
      query: () => ({ url: `/posts` }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Post", id })), "Post"]
          : ["Post"],
    }),
    addPost: builder.mutation({
      query: (body) => ({
        url: `/posts/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    getPost: builder.query({
      query: (slug) => ({ url: `/posts/${slug}` }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Post", id: arg.id }] : [],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
    updatePost: builder.mutation({
      query: (body) => ({
        url: `/posts/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Post"],
    }),

    //VPS endpoints
    getAllVpss: builder.query({
      query: () => ({ url: `/vps` }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Vps", id })), "Vps"]
          : ["Vps"],
    }),
    addVps: builder.mutation({
      query: (body) => ({
        url: `/vps/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Vps"],
    }),
    getVps: builder.query({
      query: (slug) => ({ url: `/vps/${slug}` }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Vps", id: arg.id }] : [],
    }),
    deleteVps: builder.mutation({
      query: (id) => ({
        url: `/vps/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vps"],
    }),
    updateVps: builder.mutation({
      query: (body) => ({
        url: `/vps/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Vps"],
    }),

    //Group endpoints
    getAllGroups: builder.query({
      query: () => ({ url: `/groups` }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Group", id })), "Group"]
          : ["Group"],
    }),
    addGroup: builder.mutation({
      query: (body) => ({
        url: `/groups/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroup: builder.query({
      query: (slug) => ({ url: `/groups/${slug}` }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Group", id: arg.id }] : [],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `/groups/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation({
      query: (body) => ({
        url: `/groups/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useCreatePostMutation,
  useAddPostMutation,
  useGetPostQuery,
  useDeletePostMutation,
  useUpdatePostMutation,

  useGetAllVpssQuery,
  useCreateVpsMutation,
  useAddVpsMutation,
  useGetVpsQuery,
  useDeleteVpsMutation,
  useUpdateVpsMutation,

  useGetAllGroupsQuery,
  useCreateGroupMutation,
  useAddGroupMutation,
  useGetGroupQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
} = apiService;
