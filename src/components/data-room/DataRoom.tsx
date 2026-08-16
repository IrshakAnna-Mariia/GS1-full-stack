import { useMemo, useState } from 'react'

import DataRoomBreadcrumb from '@/components/data-room/DataRoomBreadcrumb'
import DataRoomDialogs, {
  type DataRoomDialogState,
} from '@/components/data-room/DataRoomDialogs'
import DataRoomItemRow from '@/components/data-room/DataRoomItemRow'
import DataRoomToolbar from '@/components/data-room/DataRoomToolbar'
import DataRoomUpload from '@/components/data-room/DataRoomUpload'
import useDataRoom from '@/hooks/useDataRoom'
import { useFindRootQuery } from '@/store/apis'
import type { DataRoomItem } from '@/types/dataRoom'

const DataRoom = () => {
  const {
    currentItems,
    breadcrumbPath,
    isLoading,
    isError,
    canUpload,
    uploads,
    navigateToFolder,
    navigateToBreadcrumbIndex,
    createFolder,
    renameItem,
    deleteItem,
    moveItem,
    startUploads,
    retryUpload,
  } = useDataRoom()

  const { data: rootContents } = useFindRootQuery()
  const [dialog, setDialog] = useState<DataRoomDialogState>({ type: 'closed' })

  const folders = useMemo(
    () => rootContents?.items.filter((item) => item.type === 'folder') ?? [],
    [rootContents],
  )

  const openDialog = (nextDialog: DataRoomDialogState) => {
    setDialog(nextDialog)
  }

  const closeDialog = () => {
    setDialog({ type: 'closed' })
  }

  const handleOpenItem = (item: DataRoomItem) => {
    if (item.type === 'folder') {
      navigateToFolder(item.id)
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="space-y-4 border-b px-6 py-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Data Room</h1>
          <DataRoomBreadcrumb path={breadcrumbPath} onNavigate={navigateToBreadcrumbIndex} />
        </div>

        <DataRoomToolbar onNewFolder={() => openDialog({ type: 'new-folder' })} />

        <DataRoomUpload
          canUpload={canUpload}
          uploads={uploads}
          onUpload={startUploads}
          onRetry={retryUpload}
        />
      </header>

      <div className="px-3 py-2">
        {isLoading && (
          <div className="px-3 py-12 text-center text-sm text-muted-foreground">Loading...</div>
        )}

        {isError && (
          <div className="px-3 py-12 text-center text-sm text-destructive">
            Failed to load folder contents.
          </div>
        )}

        {!isLoading && !isError && currentItems.length === 0 && (
          <div className="px-3 py-12 text-center text-sm text-muted-foreground">
            This folder is empty. Create a folder or upload files to get started.
          </div>
        )}

        {!isLoading &&
          !isError &&
          currentItems.map((item) => (
            <DataRoomItemRow
              key={item.id}
              item={item}
              onOpen={handleOpenItem}
              onPreview={(selected) => openDialog({ type: 'preview', item: selected })}
              onRename={(selected) => openDialog({ type: 'rename', item: selected })}
              onMove={(selected) => openDialog({ type: 'move', item: selected })}
              onShare={(selected) => openDialog({ type: 'share', item: selected })}
              onDelete={(selected) => openDialog({ type: 'delete', item: selected })}
            />
          ))}
      </div>

      <DataRoomDialogs
        dialog={dialog}
        folders={folders}
        onClose={closeDialog}
        onCreateFolder={createFolder}
        onRename={renameItem}
        onDelete={deleteItem}
        onMove={moveItem}
      />
    </section>
  )
}

export default DataRoom
