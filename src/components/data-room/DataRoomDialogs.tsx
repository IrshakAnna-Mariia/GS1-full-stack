import { useEffect, useState } from 'react'

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

export type DataRoomDialogState =
  | { type: 'closed' }
  | { type: 'new-folder' }
  | { type: 'rename'; item: DataRoomItem }
  | { type: 'delete'; item: DataRoomItem }
  | { type: 'share'; item: DataRoomItem }
  | { type: 'preview'; item: DataRoomItem }
  | { type: 'move'; item: DataRoomItem }

type DataRoomDialogsProps = {
  dialog: DataRoomDialogState
  folders: DataRoomItem[]
  onClose: () => void
  onCreateFolder: (name: string) => void
  onRename: (item: DataRoomItem, name: string) => void
  onDelete: (item: DataRoomItem) => void
  onMove: (itemId: string, targetFolderId: string | null) => void
}

const DataRoomDialogs = ({
  dialog,
  folders,
  onClose,
  onCreateFolder,
  onRename,
  onDelete,
  onMove,
}: DataRoomDialogsProps) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (dialog.type === 'rename') {
      setValue(dialog.item.name)
      return
    }

    if (dialog.type === 'new-folder') {
      setValue('')
    }
  }, [dialog])

  const isOpen = dialog.type !== 'closed'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (dialog.type === 'new-folder') {
      onCreateFolder(value)
      onClose()
      return
    }

    if (dialog.type === 'rename') {
      onRename(dialog.item, value)
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
                  : 'Create a folder in the current location.'}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Input
                autoFocus
                value={value}
                placeholder={dialog.type === 'rename' ? 'Item name' : 'Folder name'}
                onChange={(event) => setValue(event.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!value.trim()}>
                {dialog.type === 'rename' ? 'Save' : 'Create'}
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

      <Dialog open={dialog.type === 'share'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          {dialog.type === 'share' && (
            <>
              <DialogHeader>
                <DialogTitle>Share {dialog.item.name}</DialogTitle>
                <DialogDescription>
                  Anyone with this link can view this {dialog.item.type}.
                </DialogDescription>
              </DialogHeader>

              <div className="py-2">
                <Input
                  readOnly
                  value={`https://data-room.example.com/share/${dialog.item.id}`}
                />
              </div>

              <DialogFooter>
                <Button type="button" onClick={onClose}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog.type === 'preview'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-lg">
          {dialog.type === 'preview' && (
            <>
              <DialogHeader>
                <DialogTitle>{dialog.item.name}</DialogTitle>
                <DialogDescription>File preview</DialogDescription>
              </DialogHeader>

              <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                Preview placeholder for {dialog.item.name}
              </div>

              <DialogFooter>
                <Button type="button" onClick={onClose}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialog.type === 'move'} onOpenChange={(open) => !open && onClose()}>
        <DialogContent>
          {dialog.type === 'move' && (
            <>
              <DialogHeader>
                <DialogTitle>Move {dialog.item.name}</DialogTitle>
                <DialogDescription>Select a destination folder.</DialogDescription>
              </DialogHeader>

              <div className="max-h-60 space-y-1 overflow-y-auto py-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onMove(dialog.item.id, null)
                    onClose()
                  }}
                >
                  Data Room (root)
                </Button>

                {folders
                  .filter((folder) => folder.id !== dialog.item.id)
                  .map((folder) => (
                    <Button
                      key={folder.id}
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        onMove(dialog.item.id, folder.id)
                        onClose()
                      }}
                    >
                      {folder.name}
                    </Button>
                  ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {!isOpen && null}
    </>
  )
}

export default DataRoomDialogs
