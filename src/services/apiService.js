import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_API_URL}/api`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    // headers.set("Content-Type", "application/json");
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

    updateGroupVps: builder.mutation({
      query: (body) => ({
        url: `/vps/${body._id}/group`,
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
    assignGroup: builder.mutation({
      query: (body) => ({
        url: `/groups/${body._id}/assign_group`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),
    removeAssignGroup: builder.mutation({
      query: (body) => ({
        url: `/groups/${body._id}/remove_assign_group`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Group"],
    }),

    //ADS endpoints
    getAllAdss: builder.query({
      query: () => ({ url: `/advertise` }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Ads", id })), "Ads"]
          : ["Ads"],
    }),
    addAds: builder.mutation({
      query: (formData) => ({
        url: `/advertise/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Ads"],
    }),
    getAds: builder.query({
      query: (slug) => ({ url: `/advertise/${slug}` }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Ads", id: arg.id }] : [],
    }),
    deleteAds: builder.mutation({
      query: (id) => ({
        url: `/advertise/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ads"],
    }),
    updateAds: builder.mutation({
      query: ({ formData, _id }) => ({
        url: `/advertise/${_id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Ads"],
    }),
    postAds: builder.mutation({
      query: (body) => ({
        url: `/advertise/${body._id}/post`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Ads"],
    }),
    repostAds: builder.mutation({
      query: (body) => ({
        url: `/advertise/${body._id}/repost`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Ads"],
    }),

    //Comment endpoints
    getAllComments: builder.query({
      query: () => ({ url: `/comments` }),
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Comment", id })), "Comment"]
          : ["Comment"],
    }),
    addComment: builder.mutation({
      query: (body) => ({
        url: `/comments/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
    getComment: builder.query({
      query: (slug) => ({ url: `/comments/${slug}` }),
      providesTags: (result, error, arg) =>
        result ? [{ type: "Comment", id: arg.id }] : [],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
    updateComment: builder.mutation({
      query: (body) => ({
        url: `/comments/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useAddPostMutation,
  useGetPostQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
  useUpdateGroupVpsMutation,

  useGetAllVpssQuery,
  useAddVpsMutation,
  useGetVpsQuery,
  useDeleteVpsMutation,
  useUpdateVpsMutation,

  useGetAllGroupsQuery,
  useAddGroupMutation,
  useGetGroupQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useAssignGroupMutation,
  useRemoveAssignGroupMutation,

  useGetAllAdssQuery,
  useAddAdsMutation,
  useGetAdsQuery,
  useDeleteAdsMutation,
  useUpdateAdsMutation,
  usePostAdsMutation,
  useRepostAdsMutation,

  useGetAllCommentsQuery,
  useAddCommentMutation,
  useGetCommentQuery,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
} = apiService;
