import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'

import classes from './card.module.scss'

export interface IProps {
  className?: string
}

export function CardComponent({
  className,
  children
}: PropsWithChildren<IProps>) {
  // prettier-ignore
  return (
    <div className={clsx(classes.card, className)}>
      {children}
    </div>
  )
}

export default React.memo(CardComponent)
