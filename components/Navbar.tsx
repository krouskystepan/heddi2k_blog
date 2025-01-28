import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

export default async function Navbar() {
  const session = await getServerSession()

  return (
    <nav className="text-center space-y-3 pb-4 bg-purple">
      {session?.user?.name && (
        <section className="bg-blue w-full py-1">
          <Link
            href={'/admin'}
            className="text-xl text-yellow font-eater underline"
          >
            ADMIN PANEL PIČO
          </Link>
        </section>
      )}
      <section className="overflow-hidden">
        <div className="bg-blue w-full py-1 -rotate-1">
          <Link
            href={'/kraken'}
            className="text-4xl md:text-5xl text-pink-500 font-creepster underline tracking-widest"
          >
            KRAKEN
          </Link>
        </div>
      </section>
      <section className="space-y-3">
        <h1 className="font-bold">
          <span className="font-eater text-5xl text-yellow">Barbieho </span>
          <span className="font-glory text-4xl md:text-6xl text-green">
            vyplachovačky na Dobrou Noc
          </span>
        </h1>
        <div className="flex gap-6 justify-center items-center flex-col sm:flex-row">
          <h2 className="text-6xl font-eater text-orange">SRAČKY</h2>
          <Link className="relative" href={'informejsn'}>
            <span className="text-red text-4xl underline">Informejšn</span>
            <span className="absolute top-0 -right-6 rotate-45 text-orange text-3xl">
              klik
            </span>
          </Link>
        </div>
      </section>
    </nav>
  )
}
