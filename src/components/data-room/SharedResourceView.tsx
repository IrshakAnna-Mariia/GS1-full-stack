import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Download, Eye, FileText, Folder, Link2, Loader2 } from 'lucide-react'

import DataRoomBreadcrumb from '@/components/data-room/DataRoomBreadcrumb'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  useGetPublicFolderContentsQuery,
  useGetPublicShareQuery,
} from '@/store/apis'
import { fileToItem, folderToItem, type DataRoomItem } from '@/types/dataRoom'
import type { PublicFileDto } from '@/types/shares'

const SharedResourceView = () => {
  const { token = '', folderId } = useParams()
  const navigate = useNavigate()
  const [previewFile, setPreviewFile] = useState<PublicFileDto | null>(null)
  const [breadcrumbPath, setBreadcrumbPath] = useState<DataRoomItem[]>([])

  const rootQuery = useGetPublicShareQuery(token, { skip: !token })
  const folderQuery = useGetPublicFolderContentsQuery(
    { token, folderId: folderId ?? '' },
    { skip: !token || !folderId },
  )

  const activeQuery = folderId ? folderQuery : rootQuery
  const isLoading = activeQuery.isLoading || activeQuery.isFetching
  const isError = activeQuery.isError

  const viewItems = useMemo(() => {
    if (folderId && folderQuery.data) {
      return [
        ...folderQuery.data.folders.map(folderToItem),
        ...folderQuery.data.files.map(fileToItem),
      ]
    }

    if (!folderId && rootQuery.data) {
      if (rootQuery.data.resourceType === 'DATA_ROOM') {
        return rootQuery.data.folders.map(folderToItem)
      }

      if (rootQuery.data.resourceType === 'FOLDER') {
        return [
          ...rootQuery.data.folders.map(folderToItem),
          ...rootQuery.data.files.map(fileToItem),
        ]
      }
    }

    return []
  }, [folderId, folderQuery.data, rootQuery.data])

  const sharedTitle = useMemo(() => {
    if (folderId && folderQuery.data) {
      return folderQuery.data.folder.name
    }

    if (!rootQuery.data) {
      return 'Shared item'
    }

    switch (rootQuery.data.resourceType) {
      case 'DATA_ROOM':
        return rootQuery.data.dataRoom.name
      case 'FOLDER':
        return rootQuery.data.folder.name
      case 'FILE':
        return rootQuery.data.file.name
      default:
        return 'Shared item'
    }
  }, [folderId, folderQuery.data, rootQuery.data])

  const handleOpenFolder = (item: DataRoomItem) => {
    setBreadcrumbPath((current) => {
      if (
        current.length === 0 &&
        !folderId &&
        rootQuery.data?.resourceType === 'FOLDER'
      ) {
        return [folderToItem(rootQuery.data.folder), item]
      }

      return [...current, item]
    })
    navigate(`/share/${token}/folders/${item.id}`)
  }

  const handleNavigateBreadcrumb = (index: number) => {
    if (index < 0) {
      setBreadcrumbPath([])
      navigate(`/share/${token}`)
      return
    }

    const folder = breadcrumbPath[index]
    setBreadcrumbPath((current) => current.slice(0, index + 1))
    navigate(`/share/${token}/folders/${folder.id}`)
  }

  const handleDownload = (file: PublicFileDto) => {
    if (!file.downloadUrl) return
    window.open(file.downloadUrl, '_blank', 'noopener,noreferrer')
  }

  if (!token) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center text-sm text-destructive">
        Invalid share link.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border bg-card px-6 py-12 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading shared content...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-3 rounded-xl border bg-card px-6 py-12 text-center">
        <Link2 className="mx-auto size-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium">This share is unavailable</p>
          <p className="text-sm text-muted-foreground">
            The link may be invalid, revoked, or the shared item was deleted.
          </p>
        </div>
      </div>
    )
  }

  if (rootQuery.data?.resourceType === 'FILE' && !folderId) {
    const file = rootQuery.data.file

    return (
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <SharedBanner title={sharedTitle} />

        <div className="space-y-4 px-6 py-8">
          <div className="flex items-center gap-3">
            <FileText className="size-8 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold">{file.name}</h2>
              <p className="text-sm text-muted-foreground">Shared file</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setPreviewFile(file)}>
              <Eye />
              Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!file.downloadUrl}
              onClick={() => handleDownload(file)}
            >
              <Download />
              Download
            </Button>
          </div>
        </div>

        <SharedPreviewDialog file={previewFile} onClose={() => setPreviewFile(null)} />
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <SharedBanner title={sharedTitle} />

      <header className="space-y-4 border-b px-6 py-5">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">{sharedTitle}</h1>
          {breadcrumbPath.length > 0 && (
            <DataRoomBreadcrumb path={breadcrumbPath} onNavigate={handleNavigateBreadcrumb} />
          )}
        </div>
      </header>

      <div className="px-3 py-2">
        {viewItems.length === 0 && (
          <div className="px-3 py-12 text-center text-sm text-muted-foreground">
            This folder is empty.
          </div>
        )}

        {viewItems.map((item) => {
          const isFolder = item.type === 'folder'
          const file =
            !isFolder && folderQuery.data
              ? folderQuery.data.files.find((entry) => entry.id === item.id)
              : !isFolder && rootQuery.data?.resourceType === 'FOLDER'
                ? rootQuery.data.files.find((entry) => entry.id === item.id)
                : undefined

          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:bg-muted/60"
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => {
                  if (isFolder) {
                    handleOpenFolder(item)
                  }
                }}
              >
                {isFolder ? (
                  <Folder className="size-5 shrink-0 text-amber-500" />
                ) : (
                  <FileText className="size-5 shrink-0 text-blue-500" />
                )}
                <span className="truncate text-sm font-medium">{item.name}</span>
              </button>

              {!isFolder && file && (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Preview ${item.name}`}
                    onClick={() => setPreviewFile(file)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Download ${item.name}`}
                    disabled={!file.downloadUrl}
                    onClick={() => handleDownload(file)}
                  >
                    <Download />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <SharedPreviewDialog file={previewFile} onClose={() => setPreviewFile(null)} />
    </section>
  )
}

const SharedBanner = ({ title }: { title: string }) => (
  <div className="border-b bg-muted/40 px-6 py-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Read-only shared view
        </p>
        <p className="text-sm">{title}</p>
      </div>
      <Button render={<Link to="/data-room" />} variant="outline" size="sm" nativeButton={false}>
        Open Data Room
      </Button>
    </div>
  </div>
)

const SharedPreviewDialog = ({
  file,
  onClose,
}: {
  file: PublicFileDto | null
  onClose: () => void
}) => (
  <Dialog open={Boolean(file)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl" showCloseButton>
      {file && (
        <>
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle className="pr-8">{file.name}</DialogTitle>
          </DialogHeader>

          <div className="min-h-[70vh] bg-muted/20">
            {!file.downloadUrl && (
              <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-sm text-destructive">
                Preview is unavailable for this file.
              </div>
            )}

            {file.downloadUrl && (
              <iframe
                src={file.downloadUrl}
                title={file.name}
                className="h-[70vh] w-full border-0 bg-white"
              />
            )}
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
)

export default SharedResourceView
