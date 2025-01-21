import Link from 'next/link'
import Image from 'next/image'
import { INFO } from '@/data'

export default function Informejsn() {
  return (
    <div className="min-h-screen h-full bg-[linear-gradient(to_bottom,_var(--blue)_50%,_var(--purple)_50%)] bg-[length:100%_60px] animate-stripe-move">
      <Link
        href={'/'}
        className="absolute top-0 md:top-4 left-4 text-2xl text-yellow underline underline-offset-8 md:pt-20"
      >
        ZPATKY PRYC
      </Link>
      <h3 className="pt-14 text-orange font-eater text-center md:pt-7 text-5xl md:text-7xl">
        NAZDAR!! BOLÍ TĚ Z TOHO PALICE?
      </h3>
      <h4 className="text-yellow font-eater text-center pt-3 text-2xl md:text-5xl">
        TO JE DOBŘE TY SRAČKO
        <br className="block md:hidden" />
        <span className="ml-4 text-xl font-glory font-extrabold">
          ( zavolej )
        </span>
      </h4>
      <Link
        href={'/nic'}
        className="absolute top-0 md:top-4 right-4 text-2xl text-yellow underline underline-offset-8 md:pt-20"
      >
        POJD DAL
      </Link>
      <hr />
      <h5 className="py-4 font-glory text-4xl font-extrabold tracking-widest text-center text-green bg-black/50">
        Tak a teď se usaď pejsku. Něco ti řeknu tak poslouchej.
      </h5>
      <section className="px-4 flex flex-col gap-6 justify-center max-w-3xl mx-auto">
        {INFO.map((info, index) => (
          <div
            key={index}
            className="flex gap-6 flex-col md:flex-row md:even:flex-row-reverse "
          >
            <div className="flex flex-col gap-2 justify-center">
              <h6 className="text-5xl font-schoolbell font-extrabold text-center text-green">
                {info.title}
              </h6>
              <p className="text-center text-yellow font-glory text-3xl font-bold tracking-widest leading-relaxed">
                {info.text}
              </p>
            </div>
            <Image
              src={info.image}
              width={270}
              height={360}
              alt={`photo${index}`}
              className="size-auto"
            />
          </div>
        ))}
      </section>
    </div>
  )
}
