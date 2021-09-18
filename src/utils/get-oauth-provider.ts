import ClientOAuth2 from 'client-oauth2'

import { getRedirectUri } from './get-redirect-uri'

export const getOAuthProvider = () => {
  return new ClientOAuth2({
    authorizationUri: 'https://discord.com/api/oauth2/authorize',
    accessTokenUri: 'https://discord.com/api/oauth2/token',
    redirectUri: getRedirectUri('discord'),
    scopes: ['identify'],
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET
  })
}
