import clsx from 'clsx'
import React from 'react'

import { IUser } from '@/types/user'

import Card from './card'
import classes from './user-card.module.scss'

export interface IProps {
  className?: string
  user: IUser
}

export function UserCardComponent({ className, user }: IProps) {
  return (
    <Card className={clsx(classes.card, className)}>
      <img
        className={classes.card__avatar}
        src={user.avatarUrl}
        alt={user.name}
      />
      <div className={classes.card__name}>
        <span>Логин:</span> {user.name}
      </div>
      <div className={classes.card__id}>
        <span>ID:</span> {user.id}
      </div>
    </Card>
  )
}

export default React.memo(UserCardComponent)
