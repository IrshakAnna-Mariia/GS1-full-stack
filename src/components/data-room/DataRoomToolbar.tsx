import { FolderPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type DataRoomToolbarProps = {
  onNewFolder: () => void
}

const DataRoomToolbar = ({ onNewFolder }: DataRoomToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={onNewFolder}>
        <FolderPlus />
        New folder
      </Button>
    </div>
  )
}

export default DataRoomToolbar
