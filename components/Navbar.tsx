import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className="text-center space-y-3 py-4 bg-purple">
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
    </nav>
  )
}
