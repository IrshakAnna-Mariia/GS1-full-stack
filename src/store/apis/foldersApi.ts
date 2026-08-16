import { baseApi } from '@/store/baseApi'
import type {
  CreateFolderDto,
  FolderContentsDto,
  FolderDto,
  UpdateFolderDto,
} from '@/types/folders'
import {
  type DataRoomContents,
  fileToItem,
  folderToItem,
} from '@/types/dataRoom'

export const foldersRootTagId = 'ROOT'

export const foldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findRootFolder: builder.query<DataRoomContents, void>({
      query: () => '/folders',
      transformResponse: (response: FolderDto[]): DataRoomContents => ({
        items: response.map(folderToItem),
        path: [],
      }),
      providesTags: [{ type: 'Folder', id: foldersRootTagId }],
    }),
    findOneFolder: builder.query<FolderDto, string>({
      query: (id) => `/folders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Folder', id }],
    }),
    getContentsOfFolder: builder.query<DataRoomContents, string>({
      async queryFn(folderId, _api, _extraOptions, baseQuery) {
        const contentsResult = await baseQuery(`/folders/${folderId}/contents`)

        if (contentsResult.error) {
          return { error: contentsResult.error }
        }

        const contents = contentsResult.data as FolderContentsDto
        const path = []
        let currentId: string | null = folderId

        while (currentId) {
          const folderResult = await baseQuery(`/folders/${currentId}`)

          if (folderResult.error) {
            return { error: folderResult.error }
          }

          const folder = folderResult.data as FolderDto
          path.unshift(folderToItem(folder))
          currentId = folder.parentId
        }

        return {
          data: {
            items: [
              ...contents.folders.map(folderToItem),
              ...contents.files.map(fileToItem),
            ],
            path,
          },
        }
      },
      providesTags: (_result, _error, folderId) => [{ type: 'Folder', id: folderId }],
    }),
    createFolder: builder.mutation<FolderDto, CreateFolderDto>({
      query: ({ name, parentId }) => ({
        url: '/folders',
        method: 'POST',
        body: parentId ? { name, parentId } : { name },
      }),
      invalidatesTags: (result, _error, arg) => [
        { type: 'Folder', id: foldersRootTagId },
        ...(arg.parentId ? [{ type: 'Folder' as const, id: arg.parentId }] : []),
        ...(result ? [{ type: 'Folder' as const, id: result.id }] : []),
      ],
    }),
    updateFolder: builder.mutation<FolderDto, { id: string; dto: UpdateFolderDto }>({
      query: ({ id, dto }) => ({
        url: `/folders/${id}`,
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Folder', id: arg.id },
        { type: 'Folder', id: foldersRootTagId },
        'Folder',
      ],
    }),
    removeFolder: builder.mutation<FolderDto, string>({
      query: (id) => ({
        url: `/folders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Folder', id: foldersRootTagId }, 'Folder'],
    }),
  }),
})

export const {
  useFindRootFolderQuery: useFindRootQuery,
  useFindOneFolderQuery: useFindOneQuery,
  useGetContentsOfFolderQuery: useGetContentsQuery,
  useCreateFolderMutation: useCreateFolderMutation,
  useUpdateFolderMutation: useUpdateFolderMutation,
  useRemoveFolderMutation: useRemoveFolderMutation,
} = foldersApi
