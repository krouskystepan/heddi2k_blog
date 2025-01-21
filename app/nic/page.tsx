'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Nic() {
  return (
    <section className="h-screen grid items-center justify-center bg-purple">
      <Link
        href="/"
        className="text-center text-2xl font-bold text-white font-eater"
      >
        ZPÁTKY
      </Link>
      <div className="h-screen text-center flex items-center justify-around bg-blue flex-col overflow-hidden md:justify-center md:flex-row">
        <motion.h1
          className="text-4xl font-bold text-orange font-eater"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
          }}
        >
          TADY NIC NENI
        </motion.h1>
        <motion.h1
          className="text-6xl font-bold text-green font-mynerve"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
            delay: 0.5,
          }}
        >
          TADY NIC NENI
        </motion.h1>
        <motion.h1
          className="text-7xl font-bold text-yellow font-creepster"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
            delay: 1,
          }}
        >
          TADY NIC NENI
        </motion.h1>
      </div>
    </section>
  )
}
