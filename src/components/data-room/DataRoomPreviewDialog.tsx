import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGetSignedUrlQuery } from '@/store/apis'
import type { DataRoomItem } from '@/types/dataRoom'

type DataRoomPreviewDialogProps = {
  item: DataRoomItem | null
  open: boolean
  onClose: () => void
}

const DataRoomPreviewDialog = ({ item, open, onClose }: DataRoomPreviewDialogProps) => {
  const { data, isLoading, isError } = useGetSignedUrlQuery(item?.id ?? '', {
    skip: !open || !item,
  })

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl" showCloseButton>
        {item && (
          <>
            <DialogHeader className="border-b px-4 py-3">
              <DialogTitle className="pr-8">{item.name}</DialogTitle>
            </DialogHeader>

            <div className="min-h-[70vh] bg-muted/20">
              {isLoading && (
                <div className="flex min-h-[70vh] items-center justify-center text-sm text-muted-foreground">
                  Loading preview...
                </div>
              )}

              {isError && (
                <div className="flex min-h-[70vh] items-center justify-center px-6 text-center text-sm text-destructive">
                  Failed to load preview.
                </div>
              )}

              {!isLoading && !isError && data?.signedUrl && (
                <iframe
                  src={data.signedUrl}
                  title={item.name}
                  className="h-[70vh] w-full border-0 bg-white"
                />
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DataRoomPreviewDialog
