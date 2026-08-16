import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Check, Upload } from 'lucide-react'

import type { UploadEntry } from '@/store/slices/uploadsSlice'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/utils'

type DataRoomUploadProps = {
  canUpload: boolean
  uploads: UploadEntry[]
  onUpload: (files: File[]) => void
  onRetry: (uploadId: string) => void
}

const DataRoomUpload = ({ canUpload, uploads, onUpload, onRetry }: DataRoomUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles)
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    disabled: !canUpload,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg border border-dashed px-6 py-8 text-center transition-colors',
          canUpload
            ? isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/20'
            : 'cursor-not-allowed border-border bg-muted/10 opacity-70',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-3 size-5 text-muted-foreground" />
        <p className="text-sm font-medium">Drag &amp; drop PDF files here</p>
        <p className="my-2 text-sm text-muted-foreground">or</p>
        <Button type="button" variant="outline" disabled={!canUpload} onClick={open}>
          Browse files
        </Button>
        {!canUpload && (
          <p className="mt-3 text-xs text-muted-foreground">
            Uploads require a folder. Create one with New folder, then open it.
          </p>
        )}
      </div>

      {uploads.length > 0 && (
        <ul className="space-y-2">
          {uploads.map((upload) => (
            <li key={upload.id} className="space-y-2 rounded-lg border px-3 py-2.5">
              {upload.status === 'error' ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-destructive">
                    Failed to upload {upload.fileName}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onRetry(upload.id)}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{upload.fileName}</span>
                    <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                      {upload.progress}%
                      {upload.status === 'success' && (
                        <Check className="size-4 text-green-600" aria-label="Uploaded" />
                      )}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'h-full rounded-full transition-[width]',
                        upload.status === 'success' ? 'bg-green-600' : 'bg-primary',
                      )}
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DataRoomUpload
