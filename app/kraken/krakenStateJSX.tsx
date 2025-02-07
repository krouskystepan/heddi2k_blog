import { motion } from 'framer-motion'
import { krakenDescriptionAnimationMap } from './animation'
import { TKraken } from '@/types'

export const getKrakenJSX = (status: TKraken['status']) => {
  const commonStyle = 'text-xl md:text-3xl font-bold text-center'

  switch (status) {
    case 'fed':
      return (
        <p className={`${commonStyle} text-white`}>Kraken spí a nemá hlad.</p>
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
          className={`${commonStyle} text-black`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je hladový.
          <br />
          <span className="text-rose-700">Měl bys ho nakrmit!</span>
        </motion.p>
      )

    case 'very_hungry':
      return (
        <motion.p
          className={`${commonStyle} text-black`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je velmi hladový.
          <br />
          <span className="text-rose-800">Nakrm ho HNED!</span>
        </motion.p>
      )

    case 'angry':
      return (
        <motion.p
          className={`${commonStyle} text-black`}
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror' }}
        >
          Kraken je naštvaný.
          <br />
          <span className="text-amber-400">NAKRM HO IHNED!</span>
        </motion.p>
      )

    case 'very_angry':
      return (
        <motion.div
          className="text-xl font-extrabold text-rose-800 bg-black p-4 border-4 border-rose-700 rounded-md text-center"
          animate={krakenDescriptionAnimationMap[status]}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'mirror' }}
        >
          KRAKEN ŠÍLÍ.
          <br />
          <span className="text-amber-300">
            NAKRM HO IHNED NEBO BUDE POZDĚ!
          </span>
        </motion.div>
      )

    default:
      return (
        <p className={`${commonStyle} text-white`}>Stav Krakena není známý.</p>
      )
  }
}
