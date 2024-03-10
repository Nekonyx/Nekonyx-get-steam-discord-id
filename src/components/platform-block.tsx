import clsx from 'clsx'
import Image, { StaticImageData } from 'next/image'
import React from 'react'

import { Platform } from '@/constants'
import { IUser } from '@/types/user'

import Card from './card'
import classes from './platform-block.module.scss'
import UserCard from './user-card'

export interface IProps {
  className?: string
  platform: Platform
  name: string
  image: StaticImageData
  user?: IUser
}

export function PlatformBlockComponent({ className, platform, name, image, user }: IProps) {
  return (
    <div className={clsx(classes.platform, className)}>
      <Card className={classes.platform__brand}>
        {name}
        <Image src={image} alt="Logo" />
      </Card>

      {user && <UserCard user={user} />}

      <Card>
        <a className={classes.platform__link} href={`/api/auth/${platform}`}>
          <span>{user ? 'Обновить данные' : `Войти через ${name}`}</span>
          <span>сайт не имеет отношения к {name}</span>
        </a>
      </Card>
    </div>
  )
}

export default React.memo(PlatformBlockComponent)
