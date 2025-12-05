/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

function getFiles(dir, exts) {
  const full = path.join(process.cwd(), 'public', dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => exts.some((ext) => f.toLowerCase().endsWith(ext)))
    .map((f) => `/${dir}/${f}`)
}

const data = {
  images: getFiles('gallery/imgs', ['.jpg', '.jpeg', '.png']),
  videos: getFiles('gallery/videos', ['.mp4']),
}

fs.writeFileSync(
  path.join(process.cwd(), 'gallery-manifest.json'),
  JSON.stringify(data, null, 2)
)

console.log('✨ Manifest generated!')
