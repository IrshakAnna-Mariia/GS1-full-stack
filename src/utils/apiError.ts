export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string | string[] } }).data
    if (Array.isArray(data?.message)) {
      return data.message.join(', ')
    }
    if (typeof data?.message === 'string') {
      return data.message
    }
  }

  return fallback
}
