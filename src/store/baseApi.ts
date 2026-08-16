import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token =
        import.meta.env.VITE_ACCESS_TOKEN ?? localStorage.getItem('access_token') ?? undefined

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['Auth', 'DataRoom', 'Folder', 'File', 'Share'],
  endpoints: () => ({}),
})
