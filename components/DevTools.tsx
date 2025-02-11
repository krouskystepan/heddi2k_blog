'use client'

import React from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { changePassword } from '@/actions/admin.action'
import { useSession } from 'next-auth/react'

const devSchema = z.object({
  oldPassowrd: z.string(),
  newPassowrd: z.string(),
})

export default function DevTools() {
  const session = useSession()

  const form = useForm<z.infer<typeof devSchema>>({
    resolver: zodResolver(devSchema),
    defaultValues: {
      oldPassowrd: '',
      newPassowrd: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof devSchema>) {
    const preparedValues = {
      oldPassword: values.oldPassowrd,
      newPassword: values.newPassowrd,
      username: session.data?.user?.name || '',
    }

    await changePassword(preparedValues)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 bg-black text-white max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="oldPassowrd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>oldPassowrd</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>oldPassowrd</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassowrd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>newPassowrd</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>newPassowrd</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Change</Button>
      </form>
    </Form>
  )
}
