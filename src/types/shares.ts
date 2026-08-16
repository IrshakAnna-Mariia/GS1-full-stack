import type { DataRoomDto } from '@/types/data-room'
import type { FileDto } from '@/types/files'
import type { FolderDto } from '@/types/folders'

export type ShareResourceType = 'DATA_ROOM' | 'FOLDER' | 'FILE'
export type SharePermission = 'VIEWER'
export type ShareType = 'PUBLIC' | 'USER'

export type ShareDto = {
  id: string
  resourceType: ShareResourceType
  resourceId: string
  permission: SharePermission
  type: ShareType
  userId: string | null
  token: string | null
  createdBy: string
  createdAt: string
  recipientEmail?: string | null
  publicUrl?: string | null
}

export type CreateShareDto = {
  resourceType: ShareResourceType
  resourceId: string
  shareType: ShareType
  email?: string
}

export type ListSharesQuery = {
  resourceType: ShareResourceType
  resourceId: string
}

export type PublicFileDto = FileDto & {
  downloadUrl: string | null
}

export type PublicDataRoomShareView = {
  resourceType: 'DATA_ROOM'
  dataRoom: DataRoomDto
  folders: FolderDto[]
  files: []
}

export type PublicFolderShareView = {
  resourceType: 'FOLDER'
  token: string | null
  folder: FolderDto
  folders: FolderDto[]
  files: PublicFileDto[]
}

export type PublicFileShareView = {
  resourceType: 'FILE'
  token: string | null
  file: PublicFileDto
}

export type PublicShareView =
  | PublicDataRoomShareView
  | PublicFolderShareView
  | PublicFileShareView

export type PublicFolderContentsView = {
  folder: FolderDto
  folders: FolderDto[]
  files: PublicFileDto[]
}

export type ShareTarget = {
  resourceType: ShareResourceType
  resourceId: string
  name: string
}

export const itemToShareResourceType = (
  type: 'folder' | 'file',
): ShareResourceType => (type === 'folder' ? 'FOLDER' : 'FILE')
