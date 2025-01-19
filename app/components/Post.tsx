import React from 'react'

export default function Post({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h5 className="font-creepster text-3xl text-center">{title}</h5>
      <Divider />
      <p className="font-schoolbell my-2 text-red text-2xl font-bold">
        {description}
      </p>
      <p className="text-right">16.24</p>
    </div>
  )
}

const Divider = () => <hr className="border-px border-black my-px" />
