import { Navigate, useLocation } from 'react-router-dom'

import AuthForm from '@/components/auth/AuthForm'
import { useGetMeQuery } from '@/store/apis'
import { isUnauthorizedError } from '@/utils/apiError'
import { clearSession, hasStoredSession } from '@/utils/authStorage'

type AuthPageProps = {
  mode: 'login' | 'signup'
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const location = useLocation()
  const hasSession = hasStoredSession()
  const meQuery = useGetMeQuery(undefined, { skip: !hasSession })

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/data-room'

  if (hasSession && meQuery.isSuccess) {
    return <Navigate to={redirectTo} replace />
  }

  if (hasSession && (meQuery.isLoading || meQuery.isFetching)) {
    return (
      <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
        Checking session...
      </div>
    )
  }

  if (hasSession && meQuery.isError && isUnauthorizedError(meQuery.error)) {
    clearSession()
  }

  return (
    <div className="min-h-svh bg-background px-4 py-10">
      <main className="mx-auto w-full max-w-md">
        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <AuthForm mode={mode} redirectTo={redirectTo} />
        </section>
      </main>
    </div>
  )
}

export default AuthPage
