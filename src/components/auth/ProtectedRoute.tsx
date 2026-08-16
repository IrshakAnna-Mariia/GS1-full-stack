import { Navigate, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useGetMeQuery } from '@/store/apis'
import { isUnauthorizedError } from '@/utils/apiError'
import { clearSession, hasStoredSession } from '@/utils/authStorage'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  const hasDevToken = Boolean(
    typeof import.meta.env.VITE_ACCESS_TOKEN === 'string' &&
      import.meta.env.VITE_ACCESS_TOKEN.trim().length > 0,
  )
  const hasSession = hasStoredSession()
  const meQuery = useGetMeQuery(undefined, { skip: !hasSession })

  if (hasDevToken) {
    return children
  }

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (meQuery.isLoading || meQuery.isFetching) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (meQuery.isError) {
    if (isUnauthorizedError(meQuery.error)) {
      clearSession()
      return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-destructive">Could not reach the API. Check your connection.</p>
        <Button type="button" variant="outline" onClick={() => meQuery.refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
