import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'

import discordLogoImage from '../assets/images/logo/discord.svg'
import steamLogoImage from '../assets/images/logo/steam.svg'

type DiscordUser = {
  id: string
  username: string
  avatar: string
  discriminator: string
}

type SteamUser = {
  steamid: string
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
}

export const HomePage: NextPage = () => {
  const [discordUser, setDiscordUser] = useState<DiscordUser>()
  const [steamUser, setSteamUser] = useState<SteamUser>()

  useEffect(() => {
    const discordUserData = localStorage.getItem('discord')
    const steamUserData = localStorage.getItem('steam')

    if (discordUserData) {
      setDiscordUser(JSON.parse(discordUserData))
    }

    if (steamUserData) {
      setSteamUser(JSON.parse(steamUserData))
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace('#', ''))
    const status = params.get('status')

    if (status === 'error') {
      alert('Не удалось пройти авторизацию. Попробуйте ещё раз')
      return
    }

    if (params.has('discord')) {
      const json = atob(params.get('discord'))

      localStorage.setItem('discord', json)
      setDiscordUser(JSON.parse(json))
    }

    if (params.has('steam')) {
      const json = atob(params.get('steam'))

      localStorage.setItem('steam', json)
      setSteamUser(JSON.parse(json))
    }
  }, [])

  return (
    <Fragment>
      <Head>
        <title>Узнать свой Discord/Steam</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/modern-normalize@1.1.0/modern-normalize.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&amp;display=swap"
        />
      </Head>
      <main>
        <div className="group">
          <div className="brand card">
            <div className="brand__name">Discord</div>
            <Image
              className="brand__logo"
              src={discordLogoImage}
              width={48}
              height={48}
            />
          </div>
          {discordUser && (
            <div className="user card">
              <img
                className="user__avatar"
                src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=64`}
                alt={discordUser.username}
              />
              <div className="user__info">
                <div className="name">
                  <span>Логин: </span>
                  {discordUser.username}#{discordUser.discriminator}
                </div>
                <div className="id">
                  <span>ID: </span>
                  {discordUser.id}
                </div>
              </div>
            </div>
          )}
          <div className="body card">
            <a className="link" href="/api/auth/go?to=discord">
              <span className="link__label">
                {discordUser ? 'Обновить данные' : 'Войти через Discord'}
              </span>
              <span className="link__disclaimer">
                мы не имеем отношения к Discord
              </span>
            </a>
          </div>
        </div>
        <div className="group">
          <div className="brand card">
            <div className="brand__name">Steam</div>
            <Image
              className="brand__logo"
              src={steamLogoImage}
              width={48}
              height={48}
            />
          </div>
          {steamUser && (
            <div className="user card">
              <img
                className="user__avatar"
                src={steamUser.avatarmedium}
                alt={steamUser.personaname}
              />
              <div className="user__info">
                <div className="name">
                  <span>Логин: </span>
                  {steamUser.personaname}
                </div>
                <div className="id">
                  <span>ID: </span>
                  {steamUser.steamid}
                </div>
              </div>
            </div>
          )}
          <div className="body card">
            <a className="link" href="/api/auth/go?to=steam">
              <span className="link__label">
                {discordUser ? 'Обновить данные' : 'Войти через Steam'}
              </span>
              <span className="link__disclaimer">
                мы не имеем отношения к Steam
              </span>
            </a>
          </div>
        </div>
      </main>
      <style>{`
        :root {
          --layoutWidth: 960px;
          --layoutPadding: 0;
          --cardWidth: calc(var(--layoutWidth) / 2);
        }

        html, body, #__next {
          height: 100%;
        }

        body {
          font: 17px Montserrat, Roboto, Lato, sans-serif;
          color: #fff;
          background: #202225;
        }

        main {
          width: var(--layoutWidth);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 auto;
          padding: var(--layoutPadding);
        }

        .group {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: var(--cardWidth);
          margin: 0 1em;
        }

        .card {
          width: 100%;
          padding: 1em;
          border-radius: 8px;
          background: #2f3136;
        }

        .brand {
          border-radius: 8px;
          background: #2f3136;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand__name {
          margin-left: 8px;
          font-weight: 600;
        }

        .body {
          margin-top: 1em;
        }

        .user {
          margin-top: 1em;
          display: flex;
          align-items: center;
        }

        .user__avatar {
          width: 55px;
          height: 55px;
          user-select: none;
          border-radius: 50px;
        }

        .user__info {
          display: flex;
          margin-left: 1em;
          flex-direction: column;
          justify-content: center;
          font-weight: 600;
        }

        .user__info > * {
          margin: 2px 0;
        }

        .user__info span {
          font-weight: 400;
          user-select: none;
          opacity: .6;
        }

        .link {
          display: block;
          padding: 8px 18px;
          border-radius: 4px;
          text-decoration: none;
          color: #fff;
          background: #1c1d20;
          text-align: center;
          transition: .2s;
        }

        .link:hover {
          background: #202225;
        }

        .link__label {
          display: block;
          font-weight: 600;
        }

        .link__disclaimer {
          display: block;
          margin-top: 4px;
          font-size: 12px;
        }

        @media (max-width: 960px) {
          :root {
            --layoutWidth: 100%;
            --layoutPadding: 0 1em;
            --cardWidth: 100%;
          }

          main {
            flex-direction: column;
            padding: 1em;
          }
        }
      `}</style>
    </Fragment>
  )
}
export default HomePage
