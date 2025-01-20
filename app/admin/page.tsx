'use client'

import { createPost } from '@/actions/post.action'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1, 'Povinné').max(100, 'Max 100 znaků'),
  description: z.string().min(1, 'Povinné').max(500, 'max 500 znaků'),
})

export default function AdminPage() {
  const session = useSession()
  const rounter = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{
    title?: string
    description?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = postSchema.safeParse({ title, description })

    if (!result.success) {
      const newErrors: { title?: string; description?: string } = {}
      result.error.errors.forEach((err) => {
        newErrors[err.path[0] as keyof typeof newErrors] = err.message
      })
      setErrors(newErrors)
    } else {
      setErrors({})
      console.log('Form data is valid:', result.data)

      try {
        setIsSubmitting(true)
        await createPost({ title, description })
        console.log('Post created successfully')
        rounter.push('/')
      } catch (error) {
        console.error('Error creating post:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <section className="bg-purple min-h-screen flex justify-center items-center">
      <div className="text-center">
        {session.data?.user?.name === 'Admin' && (
          <h1 className="texy-yellow text-6xl">BUH</h1>
        )}
        <h2 className="text-yellow font-schoolbell text-5xl max-h-fit">
          Přidej si myšlenku zmrde
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4 w-full max-w-md mx-auto"
        >
          <div>
            <label
              className="block text-white font-semibold text-lg"
              htmlFor="title"
            >
              Název myšlenky
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2 mt-1 rounded-lg ${
                errors.title ? 'border-rose-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-rose-500 text-sm m-2">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              className="block text-white font-semibold text-lg"
              htmlFor="description"
            >
              Co právě pociťuješ?
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2 mt-1 rounded-lg min-h-24 max-h-80 ${
                errors.description ? 'border-rose-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-rose-500 text-sm m-2">{errors.description}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`bg-yellow text-white px-4 py-2 rounded-lg mt-3 ${
              isSubmitting ? 'opacity-50' : ''
            }`}
          >
            {isSubmitting ? 'Odesílám...' : 'Odeslat do světa'}
          </button>
        </form>
      </div>
    </section>
  )
}
