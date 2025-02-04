import React from 'react'
import Post from './Post'
import { getPosts } from '@/actions/post.action'
import { getServerSession } from 'next-auth'

export default async function Posts() {
  const posts = await getPosts()
  const session = await getServerSession()

  return (
    <section className="bg-custom_blue mb-8">
      <h3 className="max-w-2xl mx-auto uppercase font-glory text-4xl text-center py-5 font-extrabold tracking-wider text-custom_green">
        Zdravíčko zmrdi tady je moje lednička slávy, mrdky!!!!
      </h3>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-12 max-w-[80%] mx-auto px-4 pb-8 mt-6 items-center">
        {posts?.map((post) => (
          <div key={post.id}>
            <Post
              id={post.id}
              title={post.title}
              description={post.description}
              imageLink={post.imageLink}
              createdAt={post.createdAt}
              isLoggedIn={!!session?.user?.name}
            />
          </div>
        ))}
      </section>
      {posts?.length === 0 && (
        <p className="text-center text-5xl text-custom_yellow font-bold font-mynerve">
          Nic tu zatim neni, ale brzy bude!
        </p>
      )}
    </section>
  )
}
