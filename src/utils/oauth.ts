import ClientOAuth2 from 'client-oauth2'

import { Platform } from '@/constants'

import { getRedirectURL } from './redirect-url'

export function getOAuth() {
  return new ClientOAuth2({
    authorizationUri: 'https://discord.com/api/oauth2/authorize',
    accessTokenUri: 'https://discord.com/api/oauth2/token',
    redirectUri: getRedirectURL(Platform.Discord),
    scopes: ['identify'],
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET
  })
}
