import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UploadEntryStatus = 'uploading' | 'success' | 'error'

export type UploadEntry = {
  id: string
  fileName: string
  progress: number
  status: UploadEntryStatus
  error?: string
}

type UploadsState = {
  entries: UploadEntry[]
}

const initialState: UploadsState = {
  entries: [],
}

const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    addUploadEntries: (state, action: PayloadAction<UploadEntry[]>) => {
      state.entries.push(...action.payload)
    },
    updateUploadEntry: (
      state,
      action: PayloadAction<{ id: string; patch: Partial<UploadEntry> }>,
    ) => {
      const entry = state.entries.find((item) => item.id === action.payload.id)
      if (!entry) return
      Object.assign(entry, action.payload.patch)
    },
    removeUploadEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload)
    },
  },
})

export const { addUploadEntries, updateUploadEntry, removeUploadEntry } = uploadsSlice.actions
export default uploadsSlice.reducer
