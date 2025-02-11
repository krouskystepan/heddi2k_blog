import Link from 'next/link'

export default function AdminPage() {
  return (
    <section className="flex-1 bg-custom_purple flex justify-center items-center flex-col gap-6">
      <NavButton text={`PŘIDAT\nLEPÍK`} href="/admin/lepik" />
      <NavButton
        text={`PŘIDAT\nPERLIČKU`}
        extraClassNames="bg-custom_orange"
        href="/admin/perlicka"
      />
    </section>
  )
}

function NavButton({
  text,
  href,
  extraClassNames,
}: {
  text: string
  href: string
  extraClassNames?: string
}) {
  return (
    <Link
      href={href}
      className={`bg-custom_yellow w-40 sm:w-52 md:w-64 h-24 flex justify-center items-center rounded-lg text-2xl text-center whitespace-pre-line ${extraClassNames}`}
    >
      {text}
    </Link>
  )
}
