import { RelyingParty } from 'openid'

import { Platform } from '@/constants'

import { getRedirectURL } from './redirect-url'

export function getOpenID() {
  return new RelyingParty(
    getRedirectURL(Platform.Steam),
    process.env.APP_URL,
    true,
    false,
    []
  )
}
