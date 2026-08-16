import { baseApi } from '@/store/baseApi'
import type { ShareDto } from '@/types/shares'

export const sharesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    findForUser: builder.query<ShareDto[], void>({
      query: () => '/shares',
      providesTags: ['Share'],
    }),
  }),
})

export const { useFindForUserQuery, useLazyFindForUserQuery } = sharesApi
