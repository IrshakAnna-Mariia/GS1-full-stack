import { baseApi } from '@/store/baseApi'
import type {
  CreateFileDto,
  FileDto,
  RequestUploadUrlDto,
  UpdateFileDto,
  UploadUrlResponse,
} from '@/types/files'

export const filesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findByFolder: builder.query<FileDto[], string>({
      query: (folderId) => `/files?folderId=${folderId}`,
      providesTags: (_result, _error, folderId) => [{ type: 'File', id: folderId }],
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
    update: builder.mutation<FileDto, { id: string } & UpdateFileDto>({
      query: ({ id, ...body }) => ({
        url: `/files/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: 'File', id: result.folderId },
              { type: 'Folder', id: result.folderId },
              'Folder',
            ]
          : ['File', 'Folder'],
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
  useRequestUploadUrlMutation,
  useCreateMutation: useCreateFileMutation,
  useUpdateMutation: useUpdateFileMutation,
  useRemoveMutation: useRemoveFileMutation,
} = filesApi
