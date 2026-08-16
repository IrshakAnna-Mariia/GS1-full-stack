import type { FileDto } from '@/types/files'

export type FolderDto = {
  id: string
  name: string
  dataRoomId: string
  parentId: string | null
  createdAt: string
  updatedAt: string
}

export type FolderContentsDto = {
  folder: FolderDto
  folders: FolderDto[]
  files: FileDto[]
}

export type CreateFolderDto = {
  name: string
  parentId?: string
}

export type UpdateFolderDto = {
  name: string
}
