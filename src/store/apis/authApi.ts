import { baseApi } from '@/store/baseApi'
import type {
  AuthCredentialsDto,
  AuthSessionDto,
  AuthUserDto,
  RefreshSessionDto,
} from '@/types/auth'
import { clearSession, saveSession } from '@/utils/authStorage'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<AuthUserDto, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
    login: builder.mutation<AuthSessionDto, AuthCredentialsDto>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled
        saveSession(data)
      },
      invalidatesTags: ['Auth', 'DataRoom', 'Folder', 'File', 'Share'],
    }),
    signUp: builder.mutation<AuthSessionDto, AuthCredentialsDto>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled
        if (data.accessToken) {
          saveSession(data)
        }
      },
      invalidatesTags: ['Auth'],
    }),
    refreshSession: builder.mutation<AuthSessionDto, RefreshSessionDto>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled
        saveSession(data)
      },
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          clearSession()
        }
      },
      invalidatesTags: ['Auth', 'DataRoom', 'Folder', 'File', 'Share'],
    }),
  }),
})

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useLoginMutation,
  useSignUpMutation,
  useRefreshSessionMutation,
  useLogoutMutation,
} = authApi
