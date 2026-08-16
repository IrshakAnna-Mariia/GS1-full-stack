import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/useToast'
import { useLoginMutation, useSignUpMutation } from '@/store/apis'
import { getApiErrorMessage } from '@/utils/apiError'
import { cn } from '@/utils/utils'

type AuthMode = 'login' | 'signup'

type AuthFormProps = {
  mode: AuthMode
  redirectTo?: string
}

const AuthForm = ({ mode, redirectTo = '/data-room' }: AuthFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationSent, setConfirmationSent] = useState(false)

  const [login, loginState] = useLoginMutation()
  const [signUp, signUpState] = useSignUpMutation()

  const isLoading = loginState.isLoading || signUpState.isLoading
  const isLogin = mode === 'login'

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail || password.length < 8) {
      return
    }

    try {
      if (isLogin) {
        await login({ email: trimmedEmail, password }).unwrap()
        toast({ title: 'Signed in' })
        navigate(redirectTo, { replace: true })
        return
      }

      const session = await signUp({ email: trimmedEmail, password }).unwrap()

      if (!session.accessToken) {
        setConfirmationSent(true)
        toast({
          title: 'Account created',
          description: 'Check your email to confirm your account, then sign in.',
        })
        return
      }

      toast({ title: 'Account created' })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toast({
        title: isLogin ? 'Sign in failed' : 'Sign up failed',
        description: getApiErrorMessage(
          error,
          isLogin ? 'Invalid email or password' : 'Unable to create account',
        ),
        variant: 'destructive',
      })
    }
  }

  if (confirmationSent) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight">Confirm your email</h1>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium">{email}</span>. After
            confirming, sign in to access your Data Room.
          </p>
        </div>
        <Button render={<Link to="/login" />} nativeButton={false}>
          Go to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">
          {isLogin ? 'Sign in to Data Room' : 'Create your account'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isLogin
            ? 'Use your email and password to continue.'
            : 'Sign up to create and manage your Data Room.'}
        </p>
      </div>

      <div className="grid grid-cols-2 rounded-lg border p-1">
        <Link
          to="/login"
          className={cn(
            'rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
            isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className={cn(
            'rounded-md px-3 py-2 text-center text-sm font-medium transition-colors',
            !isLogin ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Sign up
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="At least 8 characters"
            value={password}
            disabled={isLoading}
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !email.trim() || password.length < 8}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              {isLogin ? 'Signing in...' : 'Creating account...'}
            </>
          ) : isLogin ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  )
}

export default AuthForm
