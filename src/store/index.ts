import { configureStore } from '@reduxjs/toolkit'

import '@/store/apis'
import { baseApi } from '@/store/baseApi'
import uploadsReducer from '@/store/slices/uploadsSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    uploads: uploadsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
