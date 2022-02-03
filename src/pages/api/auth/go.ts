import { NextApiHandler } from 'next'

import { getOAuthProvider } from '../../../utils/get-oauth-provider'
import { getOpenIDProvider } from '../../../utils/get-openid-provider'

export const handler: NextApiHandler = async (req, res) => {
  if (typeof req.query.to !== 'string') {
    res.status(400).end()
    return
  }

  switch (req.query.to) {
    case 'steam':
      const authLink = await new Promise((res, rej) => {
        getOpenIDProvider().authenticate(
          'https://steamcommunity.com/openid',
          false,
          (err, url) => {
            if (err) {
              rej(err)
              return
            }

            res(url)
            return
          }
        )
      })

      res.redirect(authLink as any)
      break

    case 'discord':
      res.redirect(getOAuthProvider().code.getUri())
      break
  }

  res.status(400).end()
  return
}

export default handler
