'use client'

import { createAdmin } from '@/actions/admin.action'

export default function DevTools() {
  return (
    <>
      <CreateAdmin />
    </>
  )
}

function CreateAdmin() {
  return (
    <button
      onClick={() =>
        createAdmin({
          username: '',
          password: '',
        })
      }
    >
      Create Admin
    </button>
  )
}
