import { baseApi } from '@/store/baseApi'
import type { AuthUserDto } from '@/types/auth'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthUserDto, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
})

export const { useGetMeQuery, useLazyGetMeQuery } = authApi
