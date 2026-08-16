import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'

import type { AuthSessionDto } from '@/types/auth'
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from '@/utils/authStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const refreshStoredSession = async (
  api: Parameters<BaseQueryFn>[1],
  extraOptions: Parameters<BaseQueryFn>[2],
): Promise<boolean> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return false
  }

  const refreshResult = await rawBaseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      body: { refreshToken },
    },
    api,
    extraOptions,
  )

  if (refreshResult.data) {
    saveSession(refreshResult.data as AuthSessionDto)
    return true
  }

  clearSession()
  return false
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (!getAccessToken() && getRefreshToken()) {
    await refreshStoredSession(api, extraOptions)
  }

  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) {
    return result
  }

  if (await refreshStoredSession(api, extraOptions)) {
    result = await rawBaseQuery(args, api, extraOptions)
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'DataRoom', 'Folder', 'File', 'Share'],
  endpoints: () => ({}),
})
