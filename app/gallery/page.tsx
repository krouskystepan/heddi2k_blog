import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import ImageModal from '@/components/ImageModal'

export const dynamic = 'force-static'

// Helper: load filenames from directory inside /public
function getFilesFromPublicDir(dir: string, exts: string[]): string[] {
  const fullPath = path.join(process.cwd(), 'public', dir)

  if (!fs.existsSync(fullPath)) return []

  return fs
    .readdirSync(fullPath)
    .filter((file) => exts.some((ext) => file.toLowerCase().endsWith(ext)))
    .map((file) => `/${dir}/${file}`)
}

export default function GalleryPage() {
  const images = getFilesFromPublicDir('gallery/imgs', [
    '.jpg',
    '.jpeg',
    '.png',
  ])
  const videos = getFilesFromPublicDir('gallery/videos', ['.mp4'])

  return (
    <main className="flex justify-center flex-col">
      <div className="flex gap-12 items-center max-w-2xl mx-auto">
        <Link
          href={'/'}
          className="text-xl md:text-3xl text-custom_yellow py-2 text-center underline underline-offset-4 font-bold"
        >
          ZPATKY PRYC
        </Link>
      </div>
      <section>
        <div className="bg-custom_purple py-4 w-full">
          <h2 className="text-xl md:text-4xl text-pink-400 font-mono font-bold tracking-wide text-center">
            GALLERY
          </h2>
          <main className="flex flex-col items-center">
            <h2 className="mt-4 md:mt-10 mb-2 text-lg md:text-4xl text-emerald-400 font-mono font-bold tracking-wide text-center">
              OBRAZKY
            </h2>
            <section className="mx-auto w-full flex flex-wrap gap-6 px-12">
              {images.map((src) => (
                <ImageModal key={src} src={src} alt="Gallery item" />
              ))}
            </section>

            <h2 className="mt-8 md:mt-20 mb-2 text-lg md:text-4xl text-emerald-400 font-mono font-bold tracking-wide text-center">
              VIDEA
            </h2>
            <section className="mx-auto w-full flex flex-wrap gap-6 px-12">
              {videos.map((src) => (
                <video
                  key={src}
                  src={src}
                  controls
                  className="rounded-xl shadow-lg max-w-sm mx-auto h-auto w-40 md:w-auto max-h-96 object-contain"
                />
              ))}
            </section>
          </main>
        </div>
      </section>
    </main>
  )
}
