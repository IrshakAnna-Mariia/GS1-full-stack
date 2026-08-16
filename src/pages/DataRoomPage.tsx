import AppUserMenu from '@/components/auth/AppUserMenu'
import DataRoom from '@/components/data-room/DataRoom'

const DataRoomPage = () => {
  return (
    <div className="min-h-svh bg-background">
      <AppUserMenu />
      <div className="px-4 py-10">
        <main className="mx-auto w-full max-w-3xl">
          <DataRoom />
        </main>
      </div>
    </div>
  )
}

export default DataRoomPage
