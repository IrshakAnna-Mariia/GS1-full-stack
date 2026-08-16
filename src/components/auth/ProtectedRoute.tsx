import { Navigate, useLocation } from 'react-router-dom'

import { useGetMeQuery } from '@/store/apis'
import { clearSession, hasStoredSession } from '@/utils/authStorage'

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  const hasDevToken = Boolean(import.meta.env.VITE_ACCESS_TOKEN)
  const hasSession = hasStoredSession()
  const meQuery = useGetMeQuery(undefined, { skip: !hasSession })

  if (hasDevToken) {
    return children
  }

  if (!hasSession) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (meQuery.isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (meQuery.isError) {
    clearSession()
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
