import { baseApi } from '@/store/baseApi'
import type {
  CreateShareDto,
  ListSharesQuery,
  PublicFolderContentsView,
  PublicShareView,
  ShareDto,
} from '@/types/shares'

const shareListTag = ({ resourceType, resourceId }: ListSharesQuery) =>
  ({ type: 'Share' as const, id: `${resourceType}-${resourceId}` })

export const sharesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listForResource: builder.query<ShareDto[], ListSharesQuery>({
      query: ({ resourceType, resourceId }) =>
        `/shares?resourceType=${resourceType}&resourceId=${resourceId}`,
      providesTags: (_result, _error, arg) => [shareListTag(arg)],
    }),
    createShare: builder.mutation<ShareDto, CreateShareDto>({
      query: (body) => ({
        url: '/shares',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        shareListTag({ resourceType: arg.resourceType, resourceId: arg.resourceId }),
      ],
    }),
    revokeShare: builder.mutation<
      ShareDto,
      { shareId: string; resourceType: CreateShareDto['resourceType']; resourceId: string }
    >({
      query: ({ shareId }) => ({
        url: `/shares/${shareId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        shareListTag({ resourceType: arg.resourceType, resourceId: arg.resourceId }),
      ],
    }),
    getPublicShare: builder.query<PublicShareView, string>({
      query: (token) => `/public/shares/${token}`,
    }),
    getPublicFolderContents: builder.query<
      PublicFolderContentsView,
      { token: string; folderId: string }
    >({
      query: ({ token, folderId }) => `/public/shares/${token}/folders/${folderId}/contents`,
    }),
  }),
})

export const {
  useListForResourceQuery,
  useCreateShareMutation,
  useRevokeShareMutation,
  useGetPublicShareQuery,
  useGetPublicFolderContentsQuery,
} = sharesApi
