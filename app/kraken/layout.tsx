import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Krakeeeeeen',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="bg-purple !select-none ">{children}</main>
}
