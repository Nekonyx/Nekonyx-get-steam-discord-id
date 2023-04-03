import { Platform } from '../constants'

export function getRedirectURL(platform: Platform): string {
  const url = new URL(`/api/auth/${platform}/callback`, process.env.APP_URL)

  return url.href
}
