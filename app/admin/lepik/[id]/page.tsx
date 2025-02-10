'use client'

import { updatePostById, getPostById } from '@/actions/post.action'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'

const postSchema = z.object({
  title: z.string().min(1, 'Povinné').max(100, 'Max 100 znaků'),
  description: z.string().min(1, 'Povinné').max(500, 'max 500 znaků'),
  imageLink: z.string().optional(),
})

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      imageLink: '',
    },
  })

  useEffect(() => {
    async function fetchPost() {
      try {
        const post = await getPostById(id)

        if (!post) {
          console.error('Post not found')
          router.push('/')
          return
        }

        form.setValue('title', post.title)
        form.setValue('description', post.description)
        form.setValue('imageLink', post.imageLink)
      } catch (error) {
        console.error('Error fetching post:', error)
      }
    }

    fetchPost()
  }, [id, router, form])

  async function onSubmit(values: z.infer<typeof postSchema>) {
    try {
      await updatePostById(id, values)
      console.log('Post created successfully')
      router.push('/')
    } catch (error) {
      console.error('Failed to create post', error)
    }
  }

  return (
    <section className="bg-custom_purple flex grow justify-center items-center flex-col">
      <h2 className="text-custom_yellow font-mynerve text-5xl max-h-fit">
        Uprav si myšlenku zmrde
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-1 mt-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center text-xl text-white">
                  Název myšlenky
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-transparent bg-muted shadow-none"
                    placeholder="Metáček mňam mňam"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white">
                  Max 100 znaků
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center text-xl text-white">
                  Co právě pociťuješ?
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border-transparent bg-muted shadow-none min-h-32 max-h-64"
                    placeholder="Mam rad modry veci yum yum yum"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white">
                  Max 500 znaků
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-center text-xl text-white">
                  Odkaz na fotku (link)
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-transparent bg-muted shadow-none"
                    placeholder="Link na obrazek"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white">
                  Nepovinné
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-500/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Upravuji...' : 'Upravit ve světě'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
