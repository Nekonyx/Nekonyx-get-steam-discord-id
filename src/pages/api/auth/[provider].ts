import { NextApiHandler } from 'next'

import { getOAuthProvider } from '../../../utils/get-oauth-provider'
import { getOpenIDProvider } from '../../../utils/get-openid-provider'

const btoa = (str: string): string =>
  Buffer.from(str, 'utf8').toString('base64')

// next.js api is hell

export const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.query.provider) {
      case 'discord': {
        if (typeof req.query.code !== 'string') {
          return res.status(400).end()
        }

        const { accessToken } = await getOAuthProvider().code.getToken(req.url)

        const response = await fetch('https://discord.com/api/oauth2/@me', {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        })

        const { user } = await response.json()

        res.redirect(`/#status=success&discord=${btoa(JSON.stringify(user))}`)

        return
      }

      case 'steam': {
        const party = getOpenIDProvider()
        const result: {
          authenticated: boolean
          claimedIdentifier?: string | undefined
        } = await new Promise((res, rej) =>
          party.verifyAssertion(req, (err, result) =>
            err ? rej(err) : res(result)
          )
        )

        if (!result.authenticated) {
          res.status(401).end()
          return
        }
        if (
          !/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(
            result.claimedIdentifier
          )
        ) {
          res.status(401).end()
        }

        const [steamId] = result.claimedIdentifier.match(/(\d+)$/)

        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_WEBAPI_KEY}&steamids=${steamId}`
        )

        const {
          response: { players: pain }
        } = await response.json()

        res.redirect(`/#status=done&steam=${btoa(JSON.stringify(pain[0]))}`)
        return
      }
    }
  } catch (e) {
    console.error('authentication error:', e)
    res.redirect('/#status=error')
    return
  }

  res.status(400).end()
  return
}

export default handler
