import React from 'react'
import Post from './Post'
import POSTS from '@/data/posts.json'

export default function Posts() {
  return (
    <section className="bg-blue pb-8">
      <h3 className="max-w-2xl mx-auto uppercase font-glory text-4xl text-center py-5 font-extrabold tracking-wider text-green">
        Zdravíčko zmrdi tady jsou moje výblejsky z mojí zkurvený hlavy!!!!!
      </h3>
      <section className="relative grid justify-center">
        {POSTS.map((post) => {
          const randomStyles = {
            marginLeft: `${Math.random() * 20 - 10}vw`,
            marginTop: `${Math.random() * 70}px`,
            transform: `rotate(${Math.random() * 20 - 10}deg) scale(${
              Math.random() * 0.3 + 0.85
            })`,
            backgroundColor: `hsl(${Math.random() * 360}, 80%, 70%)`,
          }

          return (
            <div
              key={post.id}
              className="relative w-72 p-4 rounded-lg shadow-lg"
              style={randomStyles}
            >
              <Post title={post.title} description={post.body} />
            </div>
          )
        })}
      </section>
    </section>
  )
}
