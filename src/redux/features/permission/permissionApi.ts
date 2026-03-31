import { baseApi } from '../../api/baseApi';

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignPermissions: builder.mutation({
      query: (data) => ({
        url: '/permissions/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    removePermissions: builder.mutation({
      query: (data) => ({
        url: '/permissions/remove',
        method: 'POST', // Changed from DELETE because it has a body in my service impl
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getAllPermissions: builder.query({
      query: () => '/permissions',
      providesTags: ['Permission'],
    }),
    getUserPermissions: builder.query({
      query: (userId) => `/permissions/user/${userId}`,
      providesTags: ['Permission'],
    }),
    getAuditLogs: builder.query({
      query: () => '/audit-logs',
      providesTags: ['AuditLog'],
    }),
  }),
});

export const { 
  useAssignPermissionsMutation, 
  useRemovePermissionsMutation,
  useGetAllPermissionsQuery,
  useGetUserPermissionsQuery,
  useGetAuditLogsQuery
} = permissionApi;
