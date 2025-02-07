import { getKrakenStatus } from '@/actions/kraken.action'

export const dynamic = 'force-dynamic'

export async function GET() {
  const kraken = await getKrakenStatus()

  const lastFeedDate = new Date(kraken.lastFeed).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'numeric',
  })

  let apiMessage = ''
  switch (kraken.status) {
    case 'fed':
      apiMessage = `Kraken spí a nemá hlad. Kraken byl naposledy nakrmen ${lastFeedDate}!`
      break
    case 'full':
      apiMessage = 'Kraken je probuzený, ale ještě není hladový.'
      break
    case 'starting_to_get_hungry':
      apiMessage = 'Kraken začíná být hladový. Měl bys ho nakrmit.'
      break
    case 'hungry':
      apiMessage = 'Kraken je hladový. Měl bys ho nakrmit!'
      break
    case 'very_hungry':
      apiMessage = 'Kraken je velmi hladový. Nakrm ho HNED!'
      break
    case 'angry':
      apiMessage = 'Kraken je naštvaný. Nakrm ho IHNED!'
      break
    case 'very_angry':
      apiMessage = 'KRAKEN ŠÍLÍ. NAKRM HO IHNED NEBO BUDE POZDĚ!'
      break
    default:
      apiMessage = 'Stav Krakena není známý.'
      break
  }

  return new Response(apiMessage, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
