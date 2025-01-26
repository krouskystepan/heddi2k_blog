'use client'

import { useEffect, useRef, useState } from 'react'
import {
  krakenInitialState,
  krakenStateColors,
  generateTimeline,
  LOGGING,
  getCurrentPhase,
  getRemainingTime,
  formatTime,
  krakenStateAudio,
} from './utils'
import {
  feedKraken,
  getKrakenStatus,
  startKraken,
} from '@/actions/kraken.action'
import { KrakenData, KrakenState } from './types'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  krakenTitleStageAnimationMap,
  krakenImageStageAnimationMap,
} from './animation'
import { getKrakenJSX } from './krakenStateJSX'
import Link from 'next/link'

export default function Kraken() {
  const [krakenData, setKrakenData] = useState<KrakenData>(krakenInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isWindowClicked, setIsWindowClicked] = useState(false)
  const previousStatus = useRef<KrakenState['status'] | null>(null)
  const session = useSession()

  const fetchData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) setIsLoading(true)
      const kraken = await getKrakenStatus()

      if (LOGGING) console.log('Kraken Data:', kraken)

      setKrakenData({
        status: kraken.currentPhase,
        remainingTime: kraken.remainingTime,
        timeline: kraken.timeline,
        startTime: kraken.startTime,
      })
      if (isInitialLoad) setIsLoading(false)
    } catch (error) {
      console.error('Error fetching Kraken data:', error)
      if (isInitialLoad) setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(true)
  }, [])

  // Refetch data every 5 minutes (300,000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
      if (LOGGING) console.log('Refetching Kraken Data...')
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (krakenData.status === 'very_angry') return

    if (krakenData.status !== 'fed' && krakenData.timeline.length > 0) {
      const interval = setInterval(() => {
        setKrakenData((prevValues) => ({
          ...prevValues,
          remainingTime: getRemainingTime(krakenData),
          status: getCurrentPhase(krakenData).status,
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [krakenData])

  useEffect(() => {
    if (krakenData.status !== previousStatus.current && isWindowClicked) {
      if (LOGGING) console.log('Playing audio for:', krakenData.status)

      const status = krakenData.status as keyof typeof krakenStateAudio

      if (!krakenStateAudio[status]) return

      const audio = new Audio(krakenStateAudio[status].source)
      audio.volume = krakenStateAudio[status].volume

      audio.play()

      previousStatus.current = krakenData.status
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [krakenData.status])

  const handleStart = async () => {
    try {
      if (krakenData.status !== 'fed') return

      setIsSubmitting(true)
      const timeline = generateTimeline()

      if (LOGGING) console.log('Generated Timeline:', timeline)

      const startTime = Date.now()

      await startKraken(timeline, startTime)

      setKrakenData({
        status: timeline[0].status,
        remainingTime: timeline[0].time,
        timeline,
        startTime: startTime,
      })
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error starting the Kraken:', error)
    }
  }

  const handleFeed = async () => {
    try {
      if (krakenData.status === 'fed') return

      setIsSubmitting(true)
      if (LOGGING) console.log('You fed the Kraken!')

      await feedKraken()

      setKrakenData(krakenInitialState)
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error feeding the Kraken:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-purple h-dvh flex items-center justify-center flex-col gap-5">
        <LoaderCircle size={64} className="text-yellow animate-spin" />
        <p className="font-eater tracking-widest font-bold text-4xl md:text-5xl text-yellow">
          Načítám
        </p>
      </div>
    )
  }

  if (!isWindowClicked) {
    return (
      <div className="bg-purple h-dvh flex items-center justify-center flex-col gap-4 text-center max-w-3xl mx-auto">
        <p className="font-eater tracking-widest font-bold text-xl sm:text-3xl md:text-5xl text-yellow !leading-snug">
          Jsi si jistý, že chceš vstoupit do těchto neprobádaných vod?
        </p>
        <button
          onClick={() => setIsWindowClicked(true)}
          className="bg-emerald-500 px-4 py-2 rounded-lg text-lg transition-all duration-200 hover:scale-105"
        >
          PUST MĚ TAM ZMRDE
        </button>
        <button className="bg-rose-500 px-4 py-2 rounded-lg text-lg transition-all duration-200 hover:scale-105">
          <Link href={'/'} className="text-gray-200">
            JSEM PUSSY JDU PRYC
          </Link>
        </button>
      </div>
    )
  }

  return (
    <motion.div
      className="relative min-h-dvh py-6 flex flex-col items-center justify-center cursor-kraken"
      animate={{ backgroundColor: krakenStateColors[krakenData.status] }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="py-2 px-4 absolute left-1/2 top-0 -translate-x-1/2 text-center">
        <Link
          href="/"
          className="text-white font-eater tracking-widest underline text-xl md:text-3xl"
        >
          Moje myšlenky
        </Link>
      </div>
      <motion.section
        animate={
          krakenData.status === 'fed'
            ? { scale: 1, rotate: 0 }
            : krakenImageStageAnimationMap[krakenData.status]
        }
        transition={
          krakenData.status === 'fed'
            ? { duration: 0 }
            : {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }
        }
      >
        <Image
          src={'/kraken.png'}
          alt="kraken"
          width={682}
          height={366}
          priority
        />
      </motion.section>

      <motion.h1
        className="text-4xl md:text-7xl font-bold text-white font-creepster tracking-widest"
        animate={
          krakenData.status === 'fed'
            ? { scale: 1, rotate: 0 }
            : krakenTitleStageAnimationMap[krakenData.status]
        }
        transition={
          krakenData.status === 'fed'
            ? { duration: 0 }
            : {
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
              }
        }
      >
        Kraken
      </motion.h1>

      <section className="px-4 py-2 sm:py-3 lg:py-4">
        {getKrakenJSX(krakenData.status)}
      </section>

      {/* 
          Only show buttons if user is logged in 
      */}
      {session.data?.user && (
        <>
          {krakenData.status === 'fed' && (
            <button
              onClick={handleStart}
              className={`bg-purple text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Kraken se probouzí...' : 'Probudit Krakena'}
            </button>
          )}
          {krakenData.status !== 'fed' && (
            <button
              onClick={handleFeed}
              className={`bg-blue text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 ${
                isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mňam Mňam...' : 'Nakrmit Krakena'}
            </button>
          )}
        </>
      )}

      {/* 
          Logging only for development purposes (utils.ts)
      */}
      {LOGGING && (
        <section className="absolute top-0 right-0 bg-black/50 px-4 py-3">
          <div className="text-xl font-medium text-white">
            <p>Current Phase: {krakenData.status}</p>
            <p>
              Remaining Time: {formatTime(krakenData.remainingTime)} (
              {krakenData.remainingTime} seconds)
            </p>
          </div>
          {krakenData.timeline && krakenData.timeline.length > 0 && (
            <div className="text-white mb-4">
              <h2 className="text-lg font-semibold">Timeline:</h2>
              <ul>
                {krakenData.timeline.map((phase, index) => (
                  <li key={index} className="my-2">
                    <strong>{phase.status}</strong> — {formatTime(phase.time)} (
                    {phase.time} seconds)
                  </li>
                ))}
              </ul>
              <p className="text-lg font-semibold">
                Total Time:{' '}
                {formatTime(
                  krakenData.timeline.reduce(
                    (total, phase) => total + phase.time,
                    0
                  )
                )}{' '}
                (
                {krakenData.timeline.reduce(
                  (total, phase) => total + phase.time,
                  0
                )}{' '}
                seconds)
              </p>
            </div>
          )}
        </section>
      )}
    </motion.div>
  )
}
