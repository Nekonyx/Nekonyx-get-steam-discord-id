export const getRedirectUri = (provider: 'steam' | 'discord'): string => {
  return new URL(`/api/auth/${provider}`, process.env.NEXT_PUBLIC_APP_URL).href
}
