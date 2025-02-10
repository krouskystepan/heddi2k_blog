'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { deletePost } from '@/actions/post.action'
import { Pen, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TPost } from '@/types'

export default function Post({
  id,
  title,
  description,
  imageLink,
  createdAt,
  isLoggedIn,
}: TPost & { isLoggedIn: boolean }) {
  const router = useRouter()
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
      scale: Math.random() * 0.2 + 0.85,
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

  const handleDelete = async () => {
    if (window.confirm('Opravdu to chceš smazat?')) {
      await deletePost(id)
    }
  }

  return (
    <motion.div
      className={`relative rounded-lg shadow-md overflow-hidden p-4`}
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
        scale: 1,
        rotate: 0,
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
        backgroundColor: `hsl(${Math.random() * 360}, 80%, 80%)`,
        borderColor: `hsl(${Math.random() * 360}, 80%, 50%)`,
        zIndex: 100,
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
      <h5 className="font-eater text-3xl text-center text-white break-words">
        {title}
      </h5>
      <Divider />
      {/* eslint-disable @next/next/no-img-element */}
      {imageLink && (
        <img
          src={imageLink}
          alt={title || 'Image'}
          className="w-full h-auto object-cover rounded-lg shadow-lg"
        />
      )}
      <p className="font-mynerve my-2 text-custom_red text-2xl font-bold break-words">
        {description}
      </p>
      <section className="flex justify-between items-center">
        <div className="flex gap-2">
          {isLoggedIn && (
            <>
              <button
                className="bg-rose-600 text-white rounded-md aspect-square flex justify-center items-center p-1"
                onClick={() => handleDelete()}
              >
                <X size={20} />
              </button>
              <button
                className="bg-amber-600 text-white rounded-md aspect-square flex justify-center items-center p-1"
                onClick={() => router.push(`/admin/lepik/${id}`)}
              >
                <Pen size={20} />
              </button>
            </>
          )}
        </div>
        <p className="text-right">{formattedDate}</p>
      </section>
    </motion.div>
  )
}

const Divider = () => <hr className="border-px border-black my-px" />
