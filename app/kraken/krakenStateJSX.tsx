import { motion } from 'framer-motion'
import { KrakenState } from './types'
import { krakenDescriptionAnimationMap } from './animation'

export const getKrakenJSX = (status: KrakenState['status']) => {
  const commonStyle = 'text-xl md:text-3xl font-bold'

  switch (status) {
    case 'fed':
      return (
        <p className={`${commonStyle} text-white`}>
          Kraken je klidný a není hladový.
        </p>
      )

    case 'full':
      return (
        <p className={`${commonStyle} text-white`}>
          Kraken je probuzený, ale ještě není hladový.
        </p>
      )

    case 'starting_to_get_hungry':
      return (
        <motion.p
          className={`${commonStyle} text-white`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken začíná být hladový. Měl bys ho nakrmit.
        </motion.p>
      )

    case 'hungry':
      return (
        <motion.p
          className={`${commonStyle} text-orange-500`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je hladový.{' '}
          <span className="text-rose-700">Měl bys ho nakrmit!</span>
        </motion.p>
      )

    case 'very_hungry':
      return (
        <motion.p
          className={`${commonStyle} text-red-500`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je velmi hladový.{' '}
          <span className="text-rose-800">Nakrm ho HNED!</span>
        </motion.p>
      )

    case 'angry':
      return (
        <motion.p
          className={`${commonStyle} text-red-700`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je naštvaný.{' '}
          <span className="text-amber-400">NAKRM HO IHNED!</span>
        </motion.p>
      )

    case 'very_angry':
      return (
        <motion.div
          className="text-xl font-extrabold text-rose-800 bg-black p-4 border-4 border-rose-700 rounded-md"
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror' }}
        >
          KRAKEN ŠÍLÍ.{' '}
          <span className="text-yellow-500">
            NAKRM HO IHNED NEBO BUDE POZDĚ!
          </span>
        </motion.div>
      )

    default:
      return <p className="text-gray-500">Stav Krakena není známý.</p>
  }
}
