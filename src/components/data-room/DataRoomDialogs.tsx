import { useEffect, useState } from 'react'

import DataRoomMoveDialog from '@/components/data-room/DataRoomMoveDialog'
import DataRoomPreviewDialog from '@/components/data-room/DataRoomPreviewDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { DataRoomItem } from '@/types/dataRoom'
import {
  getRenameConflictMessage,
  hasNameConflict,
  suggestUniqueName,
} from '@/utils/nameConflict'

export type DataRoomDialogState =
  | { type: 'closed' }
  | { type: 'new-folder' }
  | { type: 'rename'; item: DataRoomItem }
  | { type: 'delete'; item: DataRoomItem }
  | { type: 'preview'; item: DataRoomItem }
  | { type: 'move'; item: DataRoomItem }

type DataRoomDialogsProps = {
  dialog: DataRoomDialogState
  folders: DataRoomItem[]
  folderItems: DataRoomItem[]
  isAtRoot?: boolean
  onClose: () => void
  onCreateFolder: (name: string) => Promise<void>
  onRename: (item: DataRoomItem, name: string) => Promise<void>
  onDelete: (item: DataRoomItem) => void
  onMove: (item: DataRoomItem, targetFolderId: string) => Promise<void>
}

const DataRoomDialogs = ({
  dialog,
  folders,
  folderItems,
  isAtRoot = false,
  onClose,
  onCreateFolder,
  onRename,
  onDelete,
  onMove,
}: DataRoomDialogsProps) => {
  const [value, setValue] = useState('')
  const [renameError, setRenameError] = useState<string | null>(null)
  const [suggestedName, setSuggestedName] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (dialog.type === 'rename') {
      setValue(dialog.item.name)
      setRenameError(null)
      setSuggestedName(null)
      return
    }

    if (dialog.type === 'new-folder') {
      setValue('')
      setRenameError(null)
      setSuggestedName(null)
    }
  }, [dialog])

  const isOpen = dialog.type !== 'closed'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (dialog.type === 'new-folder') {
      const trimmed = value.trim()
      if (!trimmed) return

      setIsSubmitting(true)
      try {
        await onCreateFolder(trimmed)
        onClose()
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    if (dialog.type === 'rename') {
      const trimmed = value.trim()
      if (!trimmed) return

      if (trimmed === dialog.item.name) {
        onClose()
        return
      }

      if (hasNameConflict(folderItems, trimmed, dialog.item.id)) {
        setRenameError(getRenameConflictMessage(dialog.item.type))
        setSuggestedName(suggestUniqueName(folderItems, trimmed, dialog.item.id))
        return
      }

      await onRename(dialog.item, trimmed)
      onClose()
    }
  }

  return (
    <>
      <Dialog open={dialog.type === 'new-folder' || dialog.type === 'rename'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {dialog.type === 'rename' ? 'Rename item' : 'New folder'}
              </DialogTitle>
              <DialogDescription>
                {dialog.type === 'rename'
                  ? 'Enter a new name for this item.'
                  : isAtRoot
                    ? 'Creates a top-level folder in your Data Room. Open it to upload files.'
                    : 'Creates a subfolder in the current folder.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <Input
                autoFocus
                value={value}
                placeholder={dialog.type === 'rename' ? 'Item name' : 'Folder name'}
                aria-invalid={Boolean(renameError)}
                onChange={(event) => {
                  setValue(event.target.value)
                  setRenameError(null)
                  setSuggestedName(null)
                }}
              />

              {dialog.type === 'rename' && renameError && (
                <div className="space-y-2">
                  <p className="text-sm text-destructive">{renameError}</p>
                  {suggestedName && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setValue(suggestedName)
                        setRenameError(null)
                        setSuggestedName(null)
                      }}
                    >
                      Use {suggestedName}
                    </Button>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!value.trim() || isSubmitting}>
                {dialog.type === 'rename' ? 'Save' : isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog.type === 'delete'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          {dialog.type === 'delete' && (
            <>
              <DialogHeader>
                <DialogTitle>Delete {dialog.item.type}?</DialogTitle>
                <DialogDescription>
                  {dialog.item.type === 'folder'
                    ? `"${dialog.item.name}" and everything inside it will be permanently removed.`
                    : `"${dialog.item.name}" will be permanently removed.`}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(dialog.item)
                    onClose()
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DataRoomPreviewDialog
        item={dialog.type === 'preview' ? dialog.item : null}
        open={dialog.type === 'preview'}
        onClose={onClose}
      />

      <DataRoomMoveDialog
        item={dialog.type === 'move' ? dialog.item : null}
        folders={folders}
        open={dialog.type === 'move'}
        onClose={onClose}
        onMove={onMove}
      />

      {!isOpen && null}
    </>
  )
}

export default DataRoomDialogs
