export const getApiErrorStatus = (error: unknown): number | undefined => {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status
    return typeof status === 'number' ? status : undefined
  }

  return undefined
}

export const isUnauthorizedError = (error: unknown): boolean =>
  getApiErrorStatus(error) === 401

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
