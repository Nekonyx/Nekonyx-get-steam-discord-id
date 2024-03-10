'use client'

import { Fragment, useEffect, useState } from 'react'

import discordImage from '@/assets/images/discord.svg'
import steamImage from '@/assets/images/steam.svg'
import PlatformBlock from '@/components/platform-block'
import { Platform } from '@/constants'
import { IUser } from '@/types/user'

import classes from './page.module.scss'

export default function Page() {
  const [discord, setDiscord] = useState<IUser>()
  const [steam, setSteam] = useState<IUser>()

  // Данные из кэша
  useEffect(() => {
    const steam = localStorage.getItem(Platform.Steam)
    const discord = localStorage.getItem(Platform.Discord)

    if (steam) {
      setSteam(JSON.parse(steam))
    }

    if (discord) {
      setDiscord(JSON.parse(discord))
    }
  }, [])

  // Данные из аутентификации
  useEffect(() => {
    if (!location.hash) {
      return
    }

    const params = new URLSearchParams(location.hash.replace('#', ''))
    const platform = params.get('platform') as Platform | null
    const data = params.get('data')

    if (!platform || !data) {
      return
    }

    const user = atob(data)

    switch (platform) {
      case Platform.Discord:
        localStorage.setItem(Platform.Discord, user)
        setDiscord(JSON.parse(user))
        return

      case Platform.Steam:
        localStorage.setItem(Platform.Steam, user)
        setSteam(JSON.parse(user))
        return
    }
  }, [])

  return (
    <Fragment>
      <main className={classes.container}>
        <PlatformBlock
          platform={Platform.Discord}
          name="Discord"
          image={discordImage}
          user={discord}
        />

        <PlatformBlock platform={Platform.Steam} name="Steam" image={steamImage} user={steam} />
      </main>
      <footer>
        <a href="https://www.flaticon.com/free-icons/search" title="search icons">
          Search icons created by Chanut - Flaticon
        </a>
      </footer>
    </Fragment>
  )
}
