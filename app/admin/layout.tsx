'use client'

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex flex-col sm:flex-row justify-center my-0 sm:my-3 gap-1 sm:gap-4">
        <Button
          className="px-4 py-2 rounded-lg m-2"
          variant={'sucess'}
          onClick={() => router.push('/')}
        >
          Zpatky na lednicku
        </Button>
        <Button
          className="px-4 py-2 rounded-lg m-2"
          variant={'destructive'}
          onClick={() =>
            signOut({ callbackUrl: 'https://barbieho-mnamky.vercel.app' })
          }
        >
          Odhlásit se
        </Button>
      </div>
      {children}
    </main>
  )
}
