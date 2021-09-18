export const getRedirectUri = (provider: 'steam' | 'discord'): string => {
  return new URL(`/api/auth/${provider}`, process.env.APP_URL).href
}
