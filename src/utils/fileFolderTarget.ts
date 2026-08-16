const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type FileFolderTarget =
  | { folderId: string; folderName?: never }
  | { folderName: string; folderId?: never }

export function buildFileFolderTarget(options: {
  folderId?: string | null
  folderName?: string | null
}): FileFolderTarget | null {
  const folderId = options.folderId?.trim()
  if (folderId && UUID_REGEX.test(folderId)) {
    return { folderId }
  }

  const folderName = options.folderName?.trim()
  if (folderName) {
    return { folderName }
  }

  return null
}
