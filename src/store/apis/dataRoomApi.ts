import { baseApi } from '@/store/baseApi'
import type { DataRoomDto } from '@/types/data-room'

export const dataRoomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMine: builder.query<DataRoomDto, void>({
      query: () => '/data-room',
      providesTags: ['DataRoom'],
    }),
  }),
})

export const { useGetMineQuery, useLazyGetMineQuery } = dataRoomApi
