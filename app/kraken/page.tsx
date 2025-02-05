'use client'

import { useEffect, useRef, useState } from 'react'
import {
  krakenInitialState,
  krakenStateColors,
  generateTimeline,
  hasPermsForLogs,
  getCurrentPhase,
  getRemainingTime,
  formatTime,
  krakenStateAudio,
  KRAKEN_DOC_ID,
} from './utils'
import { feedKraken, startKraken } from '@/actions/kraken.action'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  krakenTitleStageAnimationMap,
  krakenImageStageAnimationMap,
} from './animation'
import { getKrakenJSX } from './krakenStateJSX'
import Link from 'next/link'
import { db } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import { TKraken } from '@/types'
import { LoaderCircle } from 'lucide-react'

export default function Kraken() {
  const [krakenData, setKrakenData] = useState<TKraken>(krakenInitialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isWindowClicked, setIsWindowClicked] = useState(false)
  const previousStatus = useRef<TKraken['status'] | null>(null)
  const session = useSession()

  useEffect(() => {
    const docRef = doc(db, 'kraken', KRAKEN_DOC_ID)

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()

          if (hasPermsForLogs(session))
            console.log('%cSnapchot Kraken Data:', 'color: #0BDA51;', data)

          setKrakenData({
            remainingTime: getRemainingTime(data.startTime, data.timeline),
            status: getCurrentPhase(data.startTime, data.timeline).status,
            startTime: data.startTime,
            lastFeed: data.lastFeed,
            feedCounter: data.feedCounter,
            timeline: data.timeline,
          })
          setIsLoading(false)
        } else {
          console.log('Document not found!')
          setIsLoading(false)
        }
      },
      (error) => {
        console.error('Error receiving snapshot:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [session])

  useEffect(() => {
    if (krakenData.status === 'very_angry') return

    if (krakenData.status !== 'fed' && krakenData.timeline.length > 0) {
      const interval = setInterval(() => {
        setKrakenData((prevValues) => ({
          ...prevValues,
          remainingTime: getRemainingTime(
            krakenData.startTime,
            krakenData.timeline
          ),
          status: getCurrentPhase(krakenData.startTime, krakenData.timeline)
            .status,
        }))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [krakenData])

  useEffect(() => {
    if (krakenData.status !== previousStatus.current && isWindowClicked) {
      const status = krakenData.status as keyof typeof krakenStateAudio

      if (!krakenStateAudio[status]) {
        if (hasPermsForLogs(session))
          console.log('%cNo audio for this status', 'color: #FFC000;')
        return
      }

      if (hasPermsForLogs(session))
        console.log(
          '%cPlaying audio for:',
          'color: #FFC000;',
          krakenData.status
        )

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

      if (hasPermsForLogs(session)) {
        console.log(
          '%cGenerated Timeline:',
          'color: #0096FF;',
          timeline.map((t) => ({
            status: t.status,
            formattedTime: formatTime(t.time),
            timeInSeconds: t.time,
          }))
        )
      }

      const startTime = Date.now()

      await startKraken(timeline, startTime)
      if (hasPermsForLogs(session))
        console.log('%cYou woke up the kraken!', 'color: #FF69B4;')

      setKrakenData({
        status: timeline[0].status,
        remainingTime: timeline[0].time,
        startTime: startTime,
        lastFeed: 0,
        feedCounter: krakenData.feedCounter,
        timeline,
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
      if (hasPermsForLogs(session))
        console.log('%cYou fed the Kraken!', 'color: #FF69B4;')

      await feedKraken()

      setKrakenData((prev) => ({
        ...prev,
        status: 'fed',
        lastFeed: Date.now(),
      }))
      setIsSubmitting(false)
    } catch (error) {
      console.error('Error feeding the Kraken:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-custom_purple h-dvh flex items-center justify-center flex-col gap-5">
        <LoaderCircle size={64} className="text-custom_yellow animate-spin" />
        <p className="font-eater tracking-widest font-bold text-4xl md:text-5xl text-custom_yellow">
          Načítám
        </p>
      </div>
    )
  }

  if (!isWindowClicked) {
    return (
      <div className="bg-custom_purple h-dvh flex items-center justify-center flex-col gap-4 text-center max-w-3xl mx-auto">
        <p className="font-eater tracking-widest font-bold text-xl sm:text-3xl md:text-5xl text-custom_yellow !leading-snug rotate-3 skew-x-12 skew-y-3 bg-custom_blue p-4 rounded-sm">
          Jsi si jistý, že chceš vstoupit do těchto neprobádaných vod?
        </p>

        <button
          onClick={() => setIsWindowClicked(true)}
          className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-lg md:text-2xl skew-x-12 skew-y-6 -rotate-6 transition-all duration-200 hover:scale-105 hover:rotate-0 z-40"
        >
          PUST MĚ TAM ZMRDE
        </button>
        <button className="bg-rose-700 px-4 py-2 rounded-lg text-lg md:text-2xl -skew-x-12 -skew-y-9 rotate-6 transition-all duration-200 hover:scale-105 hover:rotate-12 z-40">
          <Link href={'/'} className="text-white">
            JDU DO PRDELE SRAČKO
          </Link>
        </button>

        <motion.div
          className="text-custom_green bg-custom_blue px-4 py-2 md:px-6 md:py-4 -skew-x-12 -skew-y-3 font-mynerve tracking-widest mt-8 sm:mt-10 space-y-2 rounded-2xl"
          animate={{ rotate: [20, 0, -20], scale: [1, 1.02, 1] }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 1,
            ease: 'linear',
          }}
        >
          <p className="text-2xl md:text-5xl">
            Kraken už žral{' '}
            <span className="text-custom_orange font-bold">
              {krakenData.feedCounter}
            </span>
            x
          </p>
        </motion.div>
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
          src={
            krakenData.status === 'very_angry'
              ? '/images/kraken.gif'
              : '/images/kraken.png'
          }
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
        {getKrakenJSX(krakenData.status, krakenData.lastFeed)}
      </section>

      {/* 
          Only show buttons if user is logged in 
      */}
      {session.data?.user && (
        <>
          {krakenData.status === 'fed' && (
            <button
              onClick={handleStart}
              className={`bg-custom_purple text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 ${
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
              className={`bg-custom_blue text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 ${
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
      {hasPermsForLogs(session) && (
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
