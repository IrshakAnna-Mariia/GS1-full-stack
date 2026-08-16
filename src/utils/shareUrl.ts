export const buildPublicShareUrl = (token: string): string =>
  `${window.location.origin}/share/${token}`
