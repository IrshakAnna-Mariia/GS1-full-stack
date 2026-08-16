import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AuthPage from '@/pages/AuthPage'
import DataRoomPage from '@/pages/DataRoomPage'
import NotFoundPage from '@/pages/NotFoundPage'
import SharedViewPage from '@/pages/SharedViewPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/data-room" replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route
        path="/data-room"
        element={
          <ProtectedRoute>
            <DataRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/data-room/folders/:folderId"
        element={
          <ProtectedRoute>
            <DataRoomPage />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:token" element={<SharedViewPage />} />
      <Route path="/share/:token/folders/:folderId" element={<SharedViewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
