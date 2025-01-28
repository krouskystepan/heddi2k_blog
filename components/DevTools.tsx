'use client'

import { createAdmin } from '@/actions/admin.action'
import { transferDataToFirebase } from '@/actions/post.action'

export default function DevTools() {
  return (
    <>
      <CreateAdmin />
      <TransferData />
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

function TransferData() {
  return <button onClick={transferDataToFirebase}>Transfer Data</button>
}
