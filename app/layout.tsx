import type { Metadata } from 'next'
import { Give_You_Glory, Creepster, Eater, Mynerve } from 'next/font/google'
import './globals.css'
import Providers from '@/providers/Providers'

export const metadata: Metadata = {
  title: 'Barbieho Mňaminky',
  description: '',
}

const giveYouGlory = Give_You_Glory({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-give-you-glory',
})

const creepster = Creepster({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-creepster',
})

const mynerve = Mynerve({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mynerve',
})

const eater = Eater({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-eater',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${giveYouGlory.variable} ${creepster.variable} ${mynerve.variable} ${eater.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
