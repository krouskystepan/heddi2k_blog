'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt?: string
}

export default function ImageModal({ src, alt }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onClick={() => setOpen(true)}
        className="rounded-xl shadow-lg max-w-sm mx-auto h-auto w-40 md:w-auto max-h-96 object-contain cursor-pointer hover:opacity-80 transition"
      />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-[95vw] max-height-[95vh] rounded-xl object-contain"
          />
        </div>
      )}
    </>
  )
}
