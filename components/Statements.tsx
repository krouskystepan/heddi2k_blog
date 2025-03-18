import { getAllStatements } from '@/actions/statement.action'
import Statement from './Statement'
import { getServerSession } from 'next-auth'

export default async function Statements() {
  const session = await getServerSession()
  const statements = await getAllStatements()

  return (
    <section>
      <div className="bg-custom_purple py-4 w-full">
        <h2 className="text-xl md:text-4xl text-blue-400 font-eater font-bold tracking-widest text-center">
          POLICEJNÍ PERLIČKY PUSINKY
        </h2>
      </div>

      <div className="w-full">
        {statements?.map((item) => (
          <Statement
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            createdAt={item.createdAt}
            isLoggedIn={!!session?.user?.name}
          />
        ))}

        {statements?.length === 0 && (
          <p className="text-center text-5xl text-custom_yellow font-bold font-mynerve mt-6">
            Nic tu zatim neni, ale brzy bude!
          </p>
        )}
      </div>
    </section>
  )
}
