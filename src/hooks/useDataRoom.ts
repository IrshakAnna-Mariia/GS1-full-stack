import { useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  useCreateFileMutation,
  useCreateFolderMutation,
  useFindOneQuery,
  useFindRootQuery,
  useGetContentsQuery,
  useGetMineQuery,
  useRemoveFileMutation,
  useRemoveFolderMutation,
  useRequestUploadUrlMutation,
  useUpdateFileMutation,
  useUpdateFolderMutation,
} from '@/store/apis'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectUploadEntries } from '@/store/selectors'
import {
  addUploadEntries,
  removeUploadEntry,
  updateUploadEntry,
} from '@/store/slices/uploadsSlice'
import type { DataRoomItem } from '@/types/dataRoom'
import { uploadToStorage } from '@/utils/uploadToStorage'

const useDataRoom = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { folderId } = useParams()
  const currentFolderId = folderId ?? null
  const uploadFilesRef = useRef<Map<string, File>>(new Map())

  const rootQuery = useFindRootQuery(undefined, { skip: Boolean(currentFolderId) })
  const contentsQuery = useGetContentsQuery(currentFolderId ?? '', {
    skip: !currentFolderId,
  })
  const { data: dataRoom } = useGetMineQuery()
  const { data: currentFolder } = useFindOneQuery(currentFolderId ?? '', {
    skip: !currentFolderId,
  })

  const readOnly = Boolean(
    currentFolderId && dataRoom && currentFolder && currentFolder.dataRoomId !== dataRoom.id,
  )

  const [createFolder] = useCreateFolderMutation()
  const [updateFolder] = useUpdateFolderMutation()
  const [removeFolder] = useRemoveFolderMutation()
  const [updateFile] = useUpdateFileMutation()
  const [removeFile] = useRemoveFileMutation()
  const [requestUploadUrl] = useRequestUploadUrlMutation()
  const [createFile] = useCreateFileMutation()

  const uploads = useAppSelector(selectUploadEntries)

  const activeQuery = currentFolderId ? contentsQuery : rootQuery
  const contents = activeQuery.data

  const navigateToFolder = useCallback(
    (nextFolderId: string | null) => {
      if (!nextFolderId) {
        navigate('/data-room')
        return
      }

      navigate(`/data-room/folders/${nextFolderId}`)
    },
    [navigate],
  )

  const navigateToBreadcrumbIndex = useCallback(
    (index: number) => {
      if (index < 0) {
        navigate('/data-room')
        return
      }

      const folder = contents?.path[index]
      if (!folder) {
        navigate('/data-room')
        return
      }

      navigate(`/data-room/folders/${folder.id}`)
    },
    [contents?.path, navigate],
  )

  const createFolderHandler = useCallback(
    async (name: string) => {
      await createFolder({
        name,
        ...(currentFolderId ? { parentId: currentFolderId } : {}),
      })
    },
    [createFolder, currentFolderId],
  )

  const renameItem = useCallback(
    async (item: DataRoomItem, name: string) => {
      if (item.type === 'folder') {
        await updateFolder({ id: item.id, dto: { name } })
        return
      }

      await updateFile({ id: item.id, name })
    },
    [updateFile, updateFolder],
  )

  const deleteItem = useCallback(
    async (item: DataRoomItem) => {
      if (item.type === 'folder') {
        await removeFolder(item.id)

        if (item.id === currentFolderId) {
          if (item.parentId) {
            navigate(`/data-room/folders/${item.parentId}`)
          } else {
            navigate('/data-room')
          }
        }

        return
      }

      await removeFile({ id: item.id, folderId: item.parentId ?? '' })
    },
    [currentFolderId, navigate, removeFile, removeFolder],
  )

  const moveItem = useCallback(
    async (item: DataRoomItem, targetFolderId: string) => {
      await updateFile({
        id: item.id,
        folderId: targetFolderId,
        previousFolderId: item.parentId ?? undefined,
      })
    },
    [updateFile],
  )

  const removeUploadLater = useCallback(
    (uploadId: string) => {
      window.setTimeout(() => {
        uploadFilesRef.current.delete(uploadId)
        dispatch(removeUploadEntry(uploadId))
      }, 2000)
    },
    [dispatch],
  )

  const uploadSingleFile = useCallback(
    async (uploadId: string, file: File) => {
      if (!currentFolderId) {
        dispatch(
          updateUploadEntry({
            id: uploadId,
            patch: {
              status: 'error',
              error: 'Open a folder before uploading files.',
            },
          }),
        )
        return
      }

      try {
        const { uploadUrl, storageKey } = await requestUploadUrl({
          fileName: file.name,
          folderId: currentFolderId,
          contentType: file.type || 'application/pdf',
        }).unwrap()

        await uploadToStorage(uploadUrl, file, (progress) => {
          dispatch(
            updateUploadEntry({
              id: uploadId,
              patch: { progress, status: 'uploading' },
            }),
          )
        })

        await createFile({
          name: file.name,
          folderId: currentFolderId,
          storageKey,
        }).unwrap()

        dispatch(
          updateUploadEntry({
            id: uploadId,
            patch: { progress: 100, status: 'success' },
          }),
        )
        removeUploadLater(uploadId)
      } catch (error) {
        dispatch(
          updateUploadEntry({
            id: uploadId,
            patch: {
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed',
            },
          }),
        )
      }
    },
    [createFile, currentFolderId, dispatch, removeUploadLater, requestUploadUrl],
  )

  const startUploads = useCallback(
    (files: File[]) => {
      const pdfFiles = files.filter(
        (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'),
      )

      if (pdfFiles.length === 0) return

      const newUploads = pdfFiles.map((file) => {
        const id = crypto.randomUUID()
        uploadFilesRef.current.set(id, file)

        return {
          id,
          fileName: file.name,
          progress: 0,
          status: 'uploading' as const,
        }
      })

      dispatch(addUploadEntries(newUploads))

      newUploads.forEach((entry) => {
        const file = uploadFilesRef.current.get(entry.id)
        if (file) {
          void uploadSingleFile(entry.id, file)
        }
      })
    },
    [dispatch, uploadSingleFile],
  )

  const retryUpload = useCallback(
    (uploadId: string) => {
      const file = uploadFilesRef.current.get(uploadId)
      if (!file) return

      dispatch(
        updateUploadEntry({
          id: uploadId,
          patch: { progress: 0, status: 'uploading', error: undefined },
        }),
      )
      void uploadSingleFile(uploadId, file)
    },
    [dispatch, uploadSingleFile],
  )

  return {
    currentFolderId,
    currentItems: contents?.items ?? [],
    breadcrumbPath: contents?.path ?? [],
    isLoading: activeQuery.isLoading || activeQuery.isFetching,
    isError: activeQuery.isError,
    readOnly,
    canUpload: currentFolderId !== null && !readOnly,
    uploads,
    navigateToFolder,
    navigateToBreadcrumbIndex,
    createFolder: createFolderHandler,
    renameItem,
    deleteItem,
    moveItem,
    startUploads,
    retryUpload,
  }
}

export default useDataRoom

export type { UploadEntry } from '@/store/slices/uploadsSlice'
