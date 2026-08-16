import type { FileDto } from '@/types/files'
import type { FolderDto } from '@/types/folders'

export type DataRoomItemType = 'folder' | 'file'

export type DataRoomItem = {
  id: string
  name: string
  type: DataRoomItemType
  parentId: string | null
}

export type DataRoomContents = {
  items: DataRoomItem[]
  path: DataRoomItem[]
}

export const folderToItem = (folder: FolderDto): DataRoomItem => ({
  id: folder.id,
  name: folder.name,
  type: 'folder',
  parentId: folder.parentId,
})

export const fileToItem = (file: FileDto): DataRoomItem => ({
  id: file.id,
  name: file.name,
  type: 'file',
  parentId: file.folderId,
})
