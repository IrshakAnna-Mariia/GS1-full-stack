import { FileText, Folder } from 'lucide-react'

import DataRoomItemActions from '@/components/data-room/DataRoomItemActions'
import type { DataRoomItem } from '@/types/dataRoom'
import { cn } from '@/utils/utils'

type DataRoomItemRowProps = {
  item: DataRoomItem
  onOpen: (item: DataRoomItem) => void
  onPreview: (item: DataRoomItem) => void
  onRename: (item: DataRoomItem) => void
  onMove: (item: DataRoomItem) => void
  onShare: (item: DataRoomItem) => void
  onDelete: (item: DataRoomItem) => void
}

const DataRoomItemRow = ({
  item,
  onOpen,
  onPreview,
  onRename,
  onMove,
  onShare,
  onDelete,
}: DataRoomItemRowProps) => {
  const isFolder = item.type === 'folder'

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-muted/60',
        isFolder && 'cursor-pointer',
      )}
    >
      <button
        type="button"
        className={cn(
          'flex min-w-0 flex-1 items-center gap-3 text-left',
          !isFolder && 'cursor-default',
        )}
        onClick={() => {
          if (isFolder) onOpen(item)
        }}
      >
        {isFolder ? (
          <Folder className="size-5 shrink-0 text-amber-500" />
        ) : (
          <FileText className="size-5 shrink-0 text-blue-500" />
        )}
        <span className="truncate text-sm font-medium">{item.name}</span>
      </button>

      <DataRoomItemActions
        item={item}
        onPreview={onPreview}
        onRename={onRename}
        onMove={onMove}
        onShare={onShare}
        onDelete={onDelete}
      />
    </div>
  )
}

export default DataRoomItemRow
