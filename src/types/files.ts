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

export type CreateFileDto = {
  name: string
  folderId: string
  storageKey: string
}

export type UpdateFileDto = {
  name?: string
  folderId?: string
}

export type RequestUploadUrlDto = {
  fileName: string
  folderId: string
  contentType: string
}

export type FileSignedUrlResponse = {
  signedUrl: string | null
}
