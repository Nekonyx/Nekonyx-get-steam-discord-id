import { RelyingParty } from 'openid'

import { getRedirectUri } from './get-redirect-uri'

export const getOpenIDProvider = () => {
  return new RelyingParty(
    getRedirectUri('steam'),
    process.env.APP_URL,
    true,
    false,
    []
  )
}
