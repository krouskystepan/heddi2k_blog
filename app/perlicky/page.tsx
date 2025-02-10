import Statements from '@/components/Statements'
import Link from 'next/link'

export default function PerlickyPage() {
  return (
    <main className="flex justify-center flex-col">
      <div className="flex gap-12 items-center max-w-2xl mx-auto">
        <Link
          href={'/'}
          className="text-xl md:text-3xl text-custom_yellow py-2 text-center underline underline-offset-4 font-bold"
        >
          ZPATKY PRYC
        </Link>
        <Link
          href={'/admin'}
          className="text-xl md:text-3xl text-custom_orange py-2 text-center underline underline-offset-4 font-bold"
        >
          ADMIN PANEL
        </Link>
      </div>

      <Statements />
    </main>
  )
}
