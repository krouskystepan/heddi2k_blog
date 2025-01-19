import type { Metadata } from 'next'
import { Give_You_Glory, Creepster, Eater, Schoolbell } from 'next/font/google'
import './globals.css'

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

const schoolbell = Schoolbell({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-schoolbell',
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
    <html lang="en" className="min-h-100dvh bg-green-background">
      <body
        className={`${giveYouGlory.variable} ${creepster.variable} ${schoolbell.variable} ${eater.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
