import { Platform, STEAM_IDENTIFIER } from '@/constants'
import { getOAuth } from '@/utils/oauth'
import { getOpenID } from '@/utils/openid'
import { redirect } from 'next/navigation'

export async function GET(
  request: Request,
  {
    params
  }: {
    params: { platform: Platform }
  }
) {
  switch (params.platform) {
    case Platform.Discord:
      redirect(getOAuth().code.getUri())

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

      redirect(url)

    default:
      return new Response(null, {
        status: 500
      })
  }
}
