import { baseApi } from '../../api/baseApi';

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    assignPermission: builder.mutation({
      query: (data) => ({
        url: '/permissions/assign',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    removePermission: builder.mutation({
      query: (data) => ({
        url: '/permissions/remove',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getAuditLogs: builder.query({
      query: () => '/audit-logs',
      providesTags: ['AuditLog'],
    }),
  }),
});

export const { 
  useAssignPermissionMutation, 
  useRemovePermissionMutation,
  useGetAuditLogsQuery
} = permissionApi;
