import { FolderPlus, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DataRoomToolbarProps = {
  onNewFolder: () => void
  onShare?: () => void
  readOnly?: boolean
}

const DataRoomToolbar = ({ onNewFolder, onShare, readOnly = false }: DataRoomToolbarProps) => {
  if (readOnly) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={onNewFolder}>
        <FolderPlus />
        New folder
      </Button>
      {onShare && (
        <Button variant="outline" onClick={onShare}>
          <Share2 />
          Share
        </Button>
      )}
    </div>
  )
}

export default DataRoomToolbar
