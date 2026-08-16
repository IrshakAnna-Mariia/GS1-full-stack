export type AuthUserDto = {
  id: string
  email: string
}

export type AuthSessionDto = {
  user: AuthUserDto
  accessToken: string | null
  refreshToken: string | null
  expiresIn: number | null
}

export type AuthCredentialsDto = {
  email: string
  password: string
}

export type RefreshSessionDto = {
  refreshToken: string
}
