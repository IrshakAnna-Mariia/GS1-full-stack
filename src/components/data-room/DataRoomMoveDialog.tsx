import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { DataRoomItem } from '@/types/dataRoom'
import { cn } from '@/utils/utils'

type DataRoomMoveDialogProps = {
  item: DataRoomItem | null
  folders: DataRoomItem[]
  open: boolean
  onClose: () => void
  onMove: (item: DataRoomItem, targetFolderId: string) => Promise<void>
}

const DataRoomMoveDialog = ({
  item,
  folders,
  open,
  onClose,
  onMove,
}: DataRoomMoveDialogProps) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  const destinations = useMemo(
    () => folders.filter((folder) => folder.id !== item?.parentId),
    [folders, item?.parentId],
  )

  useEffect(() => {
    if (!open || !item) return

    setSelectedFolderId(destinations[0]?.id ?? null)
    setIsMoving(false)
  }, [destinations, item, open])

  const handleMove = async () => {
    if (!item || !selectedFolderId) return

    setIsMoving(true)

    try {
      await onMove(item, selectedFolderId)
      onClose()
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent>
        {item && (
          <>
            <DialogHeader>
              <DialogTitle>Move &quot;{item.name}&quot;</DialogTitle>
              <DialogDescription>Choose folder:</DialogDescription>
            </DialogHeader>

            <fieldset className="space-y-3 py-2">
              <legend className="sr-only">Choose folder</legend>

              <p className="text-sm font-medium">Data Room</p>

              <div className="space-y-2 pl-4">
                {destinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No other folders available.
                  </p>
                ) : (
                  destinations.map((folder) => (
                    <label
                      key={folder.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                        selectedFolderId === folder.id && 'bg-muted',
                      )}
                    >
                      <input
                        type="radio"
                        name={`move-folder-${item.id}`}
                        value={folder.id}
                        checked={selectedFolderId === folder.id}
                        onChange={() => setSelectedFolderId(folder.id)}
                        className="size-4 accent-primary"
                      />
                      {folder.name}
                    </label>
                  ))
                )}
              </div>
            </fieldset>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isMoving}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleMove()}
                disabled={!selectedFolderId || isMoving}
              >
                Move
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DataRoomMoveDialog
