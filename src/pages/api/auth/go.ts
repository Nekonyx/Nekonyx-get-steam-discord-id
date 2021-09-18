import { NextApiHandler } from 'next'

import { getOAuthProvider } from '../../../utils/get-oauth-provider'
import { getOpenIDProvider } from '../../../utils/get-openid-provider'

export const handler: NextApiHandler = async (req, res) => {
  if (typeof req.query.to !== 'string') {
    return res.status(400).end()
  }

  switch (req.query.to) {
    case 'steam':
      const authLink = await new Promise((res, rej) => {
        getOpenIDProvider().authenticate(
          'https://steamcommunity.com/openid',
          false,
          (err, url) => {
            if (err) {
              return rej(err)
            }

            return res(url)
          }
        )
      })

      res.redirect(authLink as any)
      break

    case 'discord':
      res.redirect(getOAuthProvider().code.getUri())
      break
  }

  return res.status(400).end()
}

export default handler
