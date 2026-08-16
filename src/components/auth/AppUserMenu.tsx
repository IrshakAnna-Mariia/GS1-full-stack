import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/useToast'
import { useGetMeQuery, useLogoutMutation } from '@/store/apis'
import { getApiErrorMessage } from '@/utils/apiError'

const AppUserMenu = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: user } = useGetMeQuery()
  const [logout, logoutState] = useLogoutMutation()

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      toast({ title: 'Signed out' })
      navigate('/login', { replace: true })
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: getApiErrorMessage(error),
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="flex items-center justify-end gap-3 border-b px-4 py-3">
      <span className="truncate text-sm text-muted-foreground">{user.email}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={logoutState.isLoading}
        onClick={handleLogout}
      >
        <LogOut />
        Sign out
      </Button>
    </div>
  )
}

export default AppUserMenu
