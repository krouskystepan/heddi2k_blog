import React from 'react'
import Post from './Post'
import { getPosts } from '@/actions/post.action'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <section className="bg-blue mb-8">
      <h3 className="max-w-2xl mx-auto uppercase font-glory text-4xl text-center py-5 font-extrabold tracking-wider text-green">
        Zdravíčko zmrdi tady je moje lednička slávy, mrdky!!!!
      </h3>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-full lg:max-w-[80%] mx-auto px-4 pb-8 mt-6 items-center">
        {posts?.map((post) => (
          <div key={post.id}>
            <Post
              title={post.title}
              description={post.description}
              createdAt={post.createdAt}
            />
          </div>
        ))}
      </section>
    </section>
  )
}
