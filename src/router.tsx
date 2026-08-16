import { Navigate, Route, Routes } from 'react-router-dom'

import DataRoomPage from '@/pages/DataRoomPage'
import NotFoundPage from '@/pages/NotFoundPage'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/data-room" replace />} />
      <Route path="/data-room" element={<DataRoomPage />} />
      <Route path="/data-room/folders/:folderId" element={<DataRoomPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
