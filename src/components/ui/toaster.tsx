import { XIcon } from 'lucide-react'

import { useToast } from '@/hooks/useToast'
import { cn } from '@/utils/utils'

const Toaster = () => {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto rounded-lg border bg-popover p-4 shadow-lg ring-1 ring-foreground/10',
            toast.variant === 'destructive' && 'border-destructive/30 bg-destructive/5',
          )}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && (
                <p className="text-sm text-muted-foreground">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Dismiss notification"
              onClick={() => dismiss(toast.id)}
            >
              <XIcon className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Toaster
