import { NextApiRequest, NextApiResponse } from 'next'

import { Platform, STEAM_IDENTIFIER } from '@/constants'
import { getOAuth } from '@/utils/oauth'
import { getOpenID } from '@/utils/openid'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const platform = req.query.platform as Platform | unknown

  switch (platform) {
    case Platform.Discord:
      res.redirect(getOAuth().code.getUri())
      return

    case Platform.Steam:
      const url: string = await new Promise((resolve, reject) =>
        getOpenID().authenticate(STEAM_IDENTIFIER, false, (error, url) => {
          if (error) {
            reject(error)
            return
          }

          resolve(url!)
        })
      )

      res.redirect(url)
      return
  }

  res.status(404).end()
}
