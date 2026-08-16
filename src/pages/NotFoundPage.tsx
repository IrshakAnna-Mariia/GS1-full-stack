import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for does not exist.
        </p>
      </div>
      <Button render={<Link to="/data-room" />}>Back to Data Room</Button>
    </div>
  )
}

export default NotFoundPage
