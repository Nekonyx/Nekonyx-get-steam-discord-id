import type ClientOAuth2 from 'client-oauth2'
import { NextApiRequest, NextApiResponse } from 'next'

import { Platform } from '@/constants'
import { IUser } from '@/types/user'
import { getOAuth } from '@/utils/oauth'
import { getOpenID } from '@/utils/openid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const platform = req.query.platform as Platform | unknown

  switch (platform) {
    case Platform.Discord: {
      const token = await getOAuth().code.getToken(req.url!)
      const user = await fetchDiscordUser(token)

      res.redirect(getFinalLink(platform, user))
      return
    }

    case Platform.Steam: {
      const result: {
        authenticated: boolean
        claimedIdentifier?: string | undefined
      } = await new Promise((resolve, reject) =>
        getOpenID().verifyAssertion(req, (error, result) => {
          if (error) {
            reject(error)
            return
          }

          resolve(result!)
        })
      )

      if (!result.authenticated) {
        res.status(401).end()
        return
      }

      if (
        !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
          result.claimedIdentifier!
        )
      ) {
        res.status(401).end()
        return
      }

      const [steamId] = result.claimedIdentifier!.match(/(\d+)$/)!
      const user = await fetchSteamUser(steamId)

      res.redirect(getFinalLink(platform, user))
      return
    }
  }

  res.status(404).end()
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
