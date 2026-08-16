import { baseApi } from '@/store/baseApi'
import type {
  CreateFileDto,
  FileDto,
  FileSignedUrlResponse,
  RequestUploadUrlDto,
  UploadUrlResponse,
} from '@/types/files'

export const filesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findByFolder: builder.query<FileDto[], string>({
      query: (folderId) => `/files?folderId=${folderId}`,
      providesTags: (_result, _error, folderId) => [{ type: 'File', id: folderId }],
    }),
    getSignedUrl: builder.query<FileSignedUrlResponse, string>({
      query: (id) => `/files/${id}/download`,
    }),
    requestUploadUrl: builder.mutation<UploadUrlResponse, RequestUploadUrlDto>({
      query: (body) => ({
        url: '/files/upload-url',
        method: 'POST',
        body,
      }),
    }),
    create: builder.mutation<FileDto, CreateFileDto>({
      query: (body) => ({
        url: '/files',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'File', id: arg.folderId },
        { type: 'Folder', id: arg.folderId },
        'Folder',
      ],
    }),
    update: builder.mutation<
      FileDto,
      { id: string; name?: string; folderId?: string; previousFolderId?: string }
    >({
      query: ({ id, name, folderId }) => ({
        url: `/files/${id}`,
        method: 'PATCH',
        body: {
          ...(name !== undefined ? { name } : {}),
          ...(folderId !== undefined ? { folderId } : {}),
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        ...(arg.folderId ? [{ type: 'Folder' as const, id: arg.folderId }] : []),
        ...(arg.previousFolderId ? [{ type: 'Folder' as const, id: arg.previousFolderId }] : []),
        'Folder',
      ],
    }),
    remove: builder.mutation<void, { id: string; folderId: string }>({
      query: ({ id }) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'File', id: arg.folderId },
        { type: 'Folder', id: arg.folderId },
        'Folder',
      ],
    }),
  }),
})

export const {
  useFindByFolderQuery,
  useGetSignedUrlQuery,
  useLazyGetSignedUrlQuery,
  useRequestUploadUrlMutation,
  useCreateMutation: useCreateFileMutation,
  useUpdateMutation: useUpdateFileMutation,
  useRemoveMutation: useRemoveFileMutation,
} = filesApi
