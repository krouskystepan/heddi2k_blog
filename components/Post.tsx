'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function Post({
  title,
  description,
  createdAt,
}: {
  title: string
  description: string
  createdAt: Date
}) {
  const [randomStyles, setRandomStyles] = useState({
    rotate: 0,
    scale: 1,
    y: 0,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    shadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    delay: 0,
  })

  useEffect(() => {
    setRandomStyles({
      rotate: Math.random() * 20 - 10,
      scale: Math.random() * 0.3 + 0.85,
      y: Math.random() * 50,
      backgroundColor: `hsl(${Math.random() * 360}, 80%, 70%)`,
      borderColor: `hsl(${Math.random() * 360}, 80%, 50%)`,
      shadow: `0px ${Math.random() * 20 + 4}px ${
        Math.random() * 10 + 5
      }px rgba(0, 0, 0, 0.2)`,
      delay: 0,
    })
  }, [])

  const formattedDate = new Date(createdAt).toLocaleDateString('cs-CZ')

  return (
    <motion.div
      className="p-4 rounded-lg shadow-md overflow-hidden"
      style={{
        backgroundColor: randomStyles.backgroundColor,
        borderColor: randomStyles.borderColor,
        boxShadow: randomStyles.shadow,
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: randomStyles.rotate,
        scale: randomStyles.scale,
      }}
      whileHover={{
        scale: 1.2,
        rotate: 0,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
        backgroundColor: `hsl(${Math.random() * 360}, 80%, 80%)`,
        borderColor: `hsl(${Math.random() * 360}, 80%, 50%)`,
      }}
      transition={{
        scale: { duration: 0.3 },
        rotate: { duration: 0.3, ease: 'easeInOut' },
        opacity: { delay: Math.random() * 0.5 },
        y: { delay: randomStyles.delay },
        boxShadow: { duration: 0.3, ease: 'easeInOut' },
        backgroundColor: { duration: 0.3 },
        borderColor: { duration: 0.3 },
      }}
    >
      <h5 className="font-creepster text-3xl text-center text-white break-words">
        {title}
      </h5>
      <Divider />
      <p className="font-schoolbell my-2 text-red text-2xl font-bold hover:text-blue-500 break-words">
        {description}
      </p>
      <p className="text-right">{formattedDate}</p>
    </motion.div>
  )
}

const Divider = () => <hr className="border-px border-black my-px" />
