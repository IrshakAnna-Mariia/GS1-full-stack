import type { DataRoomItem } from '@/types/dataRoom'

const normalizeName = (name: string) => name.trim().toLowerCase()

export const hasNameConflict = (
  items: DataRoomItem[],
  name: string,
  excludeItemId: string,
): boolean => {
  const normalized = normalizeName(name)
  if (!normalized) return false

  return items.some(
    (item) => item.id !== excludeItemId && normalizeName(item.name) === normalized,
  )
}

export const suggestUniqueName = (
  items: DataRoomItem[],
  desiredName: string,
  excludeItemId: string,
): string => {
  const trimmed = desiredName.trim()

  if (!hasNameConflict(items, trimmed, excludeItemId)) {
    return trimmed
  }

  const dotIndex = trimmed.lastIndexOf('.')
  const base = dotIndex > 0 ? trimmed.slice(0, dotIndex) : trimmed
  const extension = dotIndex > 0 ? trimmed.slice(dotIndex) : ''

  let counter = 1
  let candidate = `${base} (${counter})${extension}`

  while (hasNameConflict(items, candidate, excludeItemId)) {
    counter += 1
    candidate = `${base} (${counter})${extension}`
  }

  return candidate
}

export const getRenameConflictMessage = (itemType: DataRoomItem['type']) =>
  itemType === 'folder'
    ? 'A folder with this name already exists in this folder.'
    : 'A file with this name already exists in this folder.'
