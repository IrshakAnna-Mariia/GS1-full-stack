export type FileDto = {
  id: string
  name: string
  storageKey: string
  mimeType: string
  size: number
  folderId: string
  createdAt: string
  updatedAt: string
}

export type UploadUrlResponse = {
  uploadUrl: string
  storageKey: string
}

export type FileFolderTarget =
  | { folderId: string; folderName?: never }
  | { folderName: string; folderId?: never }

export type CreateFileDto = {
  name: string
  storageKey: string
} & FileFolderTarget

export type UpdateFileDto = {
  name?: string
  folderId?: string
}

export type RequestUploadUrlDto = {
  fileName: string
  contentType: string
} & FileFolderTarget

export type FileSignedUrlResponse = {
  signedUrl: string | null
}
