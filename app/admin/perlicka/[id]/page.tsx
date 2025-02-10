'use client'

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
import {
  getStatementById,
  updateStatementById,
} from '@/actions/statement.action'

const statementSchema = z.object({
  title: z.string().min(1, 'Povinné').max(100, 'Max 100 znaků'),
  description: z.string().min(1, 'Povinné').max(5000, 'max 5000 znaků'),
})

export default function EditStatement({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const router = useRouter()

  const form = useForm<z.infer<typeof statementSchema>>({
    resolver: zodResolver(statementSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(() => {
    async function fetchStatement() {
      try {
        const statement = await getStatementById(id)

        if (!statement) {
          console.error('Statement not found')
          router.push('/')
          return
        }

        form.setValue('title', statement.title)
        form.setValue('description', statement.description)
      } catch (error) {
        console.error('Error fetching statement:', error)
      }
    }

    fetchStatement()
  }, [id, router, form])

  async function onSubmit(values: z.infer<typeof statementSchema>) {
    try {
      await updateStatementById(id, values)
      console.log('Statement created successfully')
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
                  Název perličky
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-transparent bg-muted shadow-none"
                    placeholder="Myslivec na procházce"
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
                  Ten DŽOJK
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border-transparent bg-muted shadow-none min-h-32 max-h-64"
                    placeholder="Nejaky dlouhy fetacky reci"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-white">
                  Max 5000 znaků
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
            {form.formState.isSubmitting ? 'Posílám...' : 'Zesměšnit fízla'}
          </Button>
        </form>
      </Form>
    </section>
  )
}
