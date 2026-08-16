import { useState } from 'react'
import { Copy, Link2, Loader2, Trash2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'
import {
  useCreateShareMutation,
  useListForResourceQuery,
  useRevokeShareMutation,
} from '@/store/apis'
import type { ShareDto, ShareTarget } from '@/types/shares'
import { buildPublicShareUrl } from '@/utils/shareUrl'

type ShareDialogProps = {
  target: ShareTarget | null
  open: boolean
  onClose: () => void
}

const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string | string[] } }).data
    if (Array.isArray(data?.message)) {
      return data.message.join(', ')
    }
    if (typeof data?.message === 'string') {
      return data.message
    }
  }

  return 'Something went wrong. Please try again.'
}

const ShareDialog = ({ target, open, onClose }: ShareDialogProps) => {
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [revokeTarget, setRevokeTarget] = useState<ShareDto | null>(null)

  const listQuery = useListForResourceQuery(
    {
      resourceType: target?.resourceType ?? 'DATA_ROOM',
      resourceId: target?.resourceId ?? '',
    },
    { skip: !open || !target },
  )

  const [createShare, createState] = useCreateShareMutation()
  const [revokeShare, revokeState] = useRevokeShareMutation()

  const shares = listQuery.data ?? []
  const publicShare = shares.find((share) => share.type === 'PUBLIC')
  const userShares = shares.filter((share) => share.type === 'USER')
  const publicLink = publicShare?.token ? buildPublicShareUrl(publicShare.token) : null

  const handleCreatePublicLink = async () => {
    if (!target) return

    try {
      await createShare({
        resourceType: target.resourceType,
        resourceId: target.resourceId,
        shareType: 'PUBLIC',
      }).unwrap()
      toast({ title: 'Public link created' })
    } catch (error) {
      toast({
        title: 'Failed to create public link',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const handleInviteUser = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!target) return

    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    try {
      await createShare({
        resourceType: target.resourceType,
        resourceId: target.resourceId,
        shareType: 'USER',
        email: trimmedEmail,
      }).unwrap()
      setEmail('')
      toast({ title: 'Access granted', description: `${trimmedEmail} can now view this item.` })
    } catch (error) {
      toast({
        title: 'Failed to share',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const handleCopyLink = async () => {
    if (!publicLink) return

    try {
      await navigator.clipboard.writeText(publicLink)
      toast({ title: 'Link copied to clipboard' })
    } catch {
      toast({
        title: 'Failed to copy link',
        description: 'Copy the link manually from the field below.',
        variant: 'destructive',
      })
    }
  }

  const handleConfirmRevoke = async () => {
    if (!target || !revokeTarget) return

    try {
      await revokeShare({
        shareId: revokeTarget.id,
        resourceType: target.resourceType,
        resourceId: target.resourceId,
      }).unwrap()
      toast({ title: 'Access revoked' })
      setRevokeTarget(null)
    } catch (error) {
      toast({
        title: 'Failed to revoke access',
        description: getErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  const isBusy = createState.isLoading || revokeState.isLoading

  return (
    <>
      <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
        <DialogContent className="sm:max-w-lg">
          {target && (
            <>
              <DialogHeader>
                <DialogTitle>Share {target.name}</DialogTitle>
                <DialogDescription>
                  Create a public link or invite someone by email. Shared users get Viewer access.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-2">
                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Link2 className="size-4" />
                    Public link
                  </div>

                  {listQuery.isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading shares...
                    </div>
                  )}

                  {listQuery.isError && (
                    <p className="text-sm text-destructive">Failed to load shares.</p>
                  )}

                  {!listQuery.isLoading && !listQuery.isError && (
                    <div className="space-y-2">
                      {publicLink ? (
                        <>
                          <Input readOnly value={publicLink} />
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
                              <Copy />
                              Copy link
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              onClick={() => publicShare && setRevokeTarget(publicShare)}
                            >
                              <Trash2 />
                              Revoke link
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isBusy}
                          onClick={handleCreatePublicLink}
                        >
                          {createState.isLoading ? (
                            <>
                              <Loader2 className="animate-spin" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Link2 />
                              Create public link
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </section>

                <section className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <UserPlus className="size-4" />
                    Share with user
                  </div>

                  <form className="flex gap-2" onSubmit={handleInviteUser}>
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      disabled={isBusy}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button type="submit" disabled={isBusy || !email.trim()}>
                      Share
                    </Button>
                  </form>
                </section>

                <section className="space-y-3">
                  <p className="text-sm font-medium">People with access</p>

                  {listQuery.isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
                    </div>
                  )}

                  {!listQuery.isLoading && !listQuery.isError && shares.length === 0 && (
                    <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                      No one has access yet.
                    </p>
                  )}

                  {!listQuery.isLoading && shares.length > 0 && (
                    <ul className="divide-y rounded-lg border">
                      {publicShare && (
                        <li className="flex items-center justify-between gap-3 px-3 py-2.5">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">Public link</p>
                            <p className="text-xs text-muted-foreground">Anyone with the link</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Viewer</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isBusy}
                              aria-label="Revoke public link"
                              onClick={() => setRevokeTarget(publicShare)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </li>
                      )}

                      {userShares.map((share) => (
                        <li
                          key={share.id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {share.recipientEmail ?? 'Shared user'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Viewer</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={isBusy}
                              aria-label={`Revoke access for ${share.recipientEmail ?? 'user'}`}
                              onClick={() => setRevokeTarget(share)}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <DialogFooter>
                <Button type="button" onClick={onClose}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(revokeTarget)} onOpenChange={(nextOpen) => !nextOpen && setRevokeTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke access?</DialogTitle>
            <DialogDescription>
              {revokeTarget?.type === 'PUBLIC'
                ? 'Anyone with the public link will lose access immediately.'
                : `${revokeTarget?.recipientEmail ?? 'This user'} will lose access immediately.`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRevokeTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={revokeState.isLoading}
              onClick={handleConfirmRevoke}
            >
              {revokeState.isLoading ? 'Revoking...' : 'Revoke access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShareDialog
