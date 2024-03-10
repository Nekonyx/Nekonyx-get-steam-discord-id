import '@/styles/globals.scss'
import 'modern-normalize'
import { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Узнать свой Discord и Steam ID',
  description:
    'Узнайте свой Discord ID и Steam ID легко и быстро. Найдите свои идентификаторы для Discord и Steam в пару кликов.'
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
