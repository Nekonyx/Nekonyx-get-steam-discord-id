import type ClientOAuth2 from 'client-oauth2'
import { redirect } from 'next/navigation'

import { Platform } from '@/constants'
import { IUser } from '@/types/user'
import { getOAuth } from '@/utils/oauth'
import { getOpenID } from '@/utils/openid'

export async function GET(
  request: Request,
  {
    params
  }: {
    params: { platform: Platform }
  }
) {
  const url = new URL(request.url)
  const { platform } = params

  switch (platform) {
    case Platform.Discord: {
      const token = await getOAuth().code.getToken(url)
      const user = await fetchDiscordUser(token)

      redirect(getFinalLink(platform, user))
    }

    case Platform.Steam: {
      const result: {
        authenticated: boolean
        claimedIdentifier?: string | undefined
      } = await new Promise((resolve, reject) =>
        getOpenID().verifyAssertion(url.toString(), (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve(result!)
        })
      )

      if (!result.authenticated) {
        return new Response(null, {
          status: 401
        })
      }

      if (!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier!)) {
        return new Response(null, {
          status: 401
        })
      }

      const [steamId] = result.claimedIdentifier!.match(/(\d+)$/)!
      const user = await fetchSteamUser(steamId)

      redirect(getFinalLink(platform, user))
    }
  }
}

/** Генерирует финальную ссылку для завершения аутентификации */
function getFinalLink(platform: Platform, user: IUser): string {
  const data = Buffer.from(JSON.stringify(user), 'utf8').toString('base64')

  return `/#platform=${platform}&data=${data}`
}

/** Получает Discord пользователя */
async function fetchDiscordUser(token: ClientOAuth2.Token): Promise<IUser> {
  const response = await fetch('https://discord.com/api/oauth2/@me', {
    headers: {
      authorization: `Bearer ${token.accessToken}`
    }
  })

  const json: {
    user: {
      id: string
      username: string
      avatar: string
      discriminator: string
    }
  } = await response.json()

  return {
    id: json.user.id,
    name: `${json.user.username}#${json.user.discriminator}`,
    avatarUrl: `https://cdn.discordapp.com/avatars/${json.user.id}/${json.user.avatar}.png?size=64`
  }
}

/** Получает Steam пользователя */
async function fetchSteamUser(steamId: string): Promise<IUser> {
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_WEBAPI_KEY}&steamids=${steamId}`
  )

  const json: {
    response: {
      players: {
        steamid: string
        personaname: string
        profileurl: string
        avatar: string
        avatarmedium: string
        avatarfull: string
      }[]
    }
  } = await response.json()

  const player = json.response.players[0]

  return {
    id: player.steamid,
    name: player.personaname,
    avatarUrl: player.avatarmedium
  }
}
