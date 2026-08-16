import type { RootState } from '@/store'

export const selectUploadEntries = (state: RootState) => state.uploads.entries
