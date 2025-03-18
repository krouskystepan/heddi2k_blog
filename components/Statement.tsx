'use client'

import { deleteStatement } from '@/actions/statement.action'
import { TStatement } from '@/types'
import { X, Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Statement({
  id,
  title,
  description,
  createdAt,
  isLoggedIn,
}: TStatement & { isLoggedIn: boolean }) {
  const router = useRouter()

  const formattedDate = new Date(createdAt).toLocaleDateString('cs-CZ')

  const handleDelete = async () => {
    if (window.confirm('Opravdu to chceš smazat?')) {
      await deleteStatement(id)
    }
  }

  return (
    <article className="odd:bg-custom_green even:bg-custom_yellow py-4 px-4">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-custom_red text-2xl md:text-4xl font-extrabold">
          {title}
        </h3>

        <p className="whitespace-pre-line text-custom_purple font-semibold text-lg md:text-xl">
          {description}
        </p>

        <div className="flex justify-between mt-2">
          <div className="flex gap-2">
            {isLoggedIn && (
              <>
                <button
                  className="bg-rose-600 text-white rounded-md aspect-square flex justify-center items-center p-1"
                  onClick={() => handleDelete()}
                >
                  <X size={20} />
                </button>
                <button
                  className="bg-amber-600 text-white rounded-md aspect-square flex justify-center items-center p-1"
                  onClick={() => router.push(`/admin/perlicka/${id}`)}
                >
                  <Pen size={20} />
                </button>
              </>
            )}
          </div>
          <p className="text-base text-right">{formattedDate}</p>
        </div>
      </div>
    </article>
  )
}
