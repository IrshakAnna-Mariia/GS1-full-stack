import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { DataRoomItem } from '@/types/dataRoom'
import {
  Eye,
  FolderInput,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react'

type DataRoomItemActionsProps = {
  item: DataRoomItem
  readOnly?: boolean
  onPreview: (item: DataRoomItem) => void
  onRename: (item: DataRoomItem) => void
  onMove: (item: DataRoomItem) => void
  onShare: (item: DataRoomItem) => void
  onDelete: (item: DataRoomItem) => void
}

const DataRoomItemActions = ({
  item,
  readOnly = false,
  onPreview,
  onRename,
  onMove,
  onShare,
  onDelete,
}: DataRoomItemActionsProps) => {
  const isFolder = item.type === 'folder'

  if (readOnly) {
    if (isFolder) {
      return null
    }

    return (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Preview ${item.name}`}
        onClick={() => onPreview(item)}
      >
        <Eye />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${item.name}`} />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40">
        {!isFolder && (
          <>
            <DropdownMenuItem onClick={() => onPreview(item)}>
              <Eye />
              Preview
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={() => onRename(item)}>
          <Pencil />
          Rename
        </DropdownMenuItem>

        {!isFolder && (
          <DropdownMenuItem onClick={() => onMove(item)}>
            <FolderInput />
            Move
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => onShare(item)}>
          <Share2 />
          Share
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={() => onDelete(item)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataRoomItemActions
