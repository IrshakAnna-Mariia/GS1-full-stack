import { Navigate, useLocation } from 'react-router-dom'

import AuthForm from '@/components/auth/AuthForm'
import { hasStoredSession } from '@/utils/authStorage'

type AuthPageProps = {
  mode: 'login' | 'signup'
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const location = useLocation()

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/data-room'

  if (hasStoredSession()) {
    return <Navigate to={redirectTo} replace />
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
