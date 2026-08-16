import { useMemo, useState } from 'react'

import DataRoomBreadcrumb from '@/components/data-room/DataRoomBreadcrumb'
import DataRoomDialogs, {
  type DataRoomDialogState,
} from '@/components/data-room/DataRoomDialogs'
import DataRoomItemRow from '@/components/data-room/DataRoomItemRow'
import DataRoomToolbar from '@/components/data-room/DataRoomToolbar'
import DataRoomUpload from '@/components/data-room/DataRoomUpload'
import ShareDialog from '@/components/data-room/ShareDialog'
import useDataRoom from '@/hooks/useDataRoom'
import { useFindRootQuery, useGetMineQuery } from '@/store/apis'
import type { DataRoomItem } from '@/types/dataRoom'
import { itemToShareResourceType, type ShareTarget } from '@/types/shares'

const DataRoom = () => {
  const {
    currentFolderId,
    currentItems,
    breadcrumbPath,
    isLoading,
    isError,
    readOnly,
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
  const { data: dataRoom } = useGetMineQuery()
  const [dialog, setDialog] = useState<DataRoomDialogState>({ type: 'closed' })
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null)

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

  const handleShareItem = (item: DataRoomItem) => {
    setShareTarget({
      resourceType: itemToShareResourceType(item.type),
      resourceId: item.id,
      name: item.name,
    })
  }

  const handleShareDataRoom = () => {
    if (!dataRoom) return

    setShareTarget({
      resourceType: 'DATA_ROOM',
      resourceId: dataRoom.id,
      name: dataRoom.name,
    })
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      {readOnly && (
        <div className="border-b bg-muted/40 px-6 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Read-only shared view
          </p>
          <p className="text-sm">You have viewer access to this folder.</p>
        </div>
      )}

      <header className="space-y-4 border-b px-6 py-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Data Room</h1>
          <DataRoomBreadcrumb path={breadcrumbPath} onNavigate={navigateToBreadcrumbIndex} />
        </div>

        <DataRoomToolbar
          readOnly={readOnly}
          onNewFolder={() => openDialog({ type: 'new-folder' })}
          onShare={readOnly ? undefined : handleShareDataRoom}
        />

        <DataRoomUpload
          canUpload={canUpload && dialog.type === 'closed'}
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
            {readOnly
              ? 'This folder is empty.'
              : currentFolderId
                ? 'This folder is empty. Create a subfolder or upload PDF files here.'
                : 'No folders yet. Use New folder to create one, then open it to upload files.'}
          </div>
        )}

        {!isLoading &&
          !isError &&
          currentItems.map((item) => (
            <DataRoomItemRow
              key={item.id}
              item={item}
              readOnly={readOnly}
              onOpen={handleOpenItem}
              onPreview={(selected) => openDialog({ type: 'preview', item: selected })}
              onRename={(selected) => openDialog({ type: 'rename', item: selected })}
              onMove={(selected) => openDialog({ type: 'move', item: selected })}
              onShare={handleShareItem}
              onDelete={(selected) => openDialog({ type: 'delete', item: selected })}
            />
          ))}
      </div>

      <DataRoomDialogs
        dialog={dialog}
        folders={folders}
        folderItems={currentItems}
        isAtRoot={!currentFolderId}
        onClose={closeDialog}
        onCreateFolder={createFolder}
        onRename={renameItem}
        onDelete={deleteItem}
        onMove={moveItem}
      />

      <ShareDialog
        target={shareTarget}
        open={Boolean(shareTarget)}
        onClose={() => setShareTarget(null)}
      />
    </section>
  )
}

export default DataRoom
