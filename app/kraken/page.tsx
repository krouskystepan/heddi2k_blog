'use client'

import React, { useEffect, useState } from 'react'
import {
  krakenInitialState,
  krakenStateColors,
  generateTimeline,
  LOGGING,
  getCurrentPhase,
  getRemainingTime,
} from './utils'
import {
  feedKraken,
  getKrakenStatus,
  startKraken,
} from '@/actions/kraken.action'
import { KrakenData } from './types'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  krakenTitleStageAnimationMap,
  krakenImageStageAnimationMap,
} from './animation'
import { getKrakenJSX } from './krakenStateJSX'

export default function Kraken() {
  const [krakenData, setKrakenData] = useState<KrakenData>(krakenInitialState)
  const [isLoading, setIsLoading] = useState(true)
  const session = useSession()

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const kraken = await getKrakenStatus()

      if (LOGGING) console.log('Kraken Data:', kraken)

      setKrakenData({
        status: kraken.currentPhase,
        remainingTime: kraken.remainingTime,
        timeline: kraken.timeline,
        startTime: kraken.startTime,
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching Kraken data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Refetch data every 5 minutes (300,000ms)
  useEffect(() => {
    const interval = setInterval(fetchData, 300000)

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

  const handleStart = async () => {
    try {
      if (krakenData.status === 'fed') {
        const timeline = generateTimeline()
        console.log('Generated Timeline:', timeline)

        const startTime = Date.now()

        await startKraken(timeline, startTime)

        setKrakenData({
          status: timeline[0].status,
          remainingTime: timeline[0].time,
          timeline,
          startTime: startTime,
        })
      }
    } catch (error) {
      console.error('Error starting the Kraken:', error)
    }
  }

  const handleFeed = async () => {
    if (LOGGING) console.log('You fed the Kraken!')
    await feedKraken()
    setKrakenData(krakenInitialState)
  }

  if (isLoading) {
    return (
      <div className="bg-purple h-screen flex items-center justify-center flex-col gap-5">
        <LoaderCircle size={64} className="text-yellow animate-spin" />
        <p className="font-eater tracking-widest font-bold text-4xl md:text-5xl text-yellow">
          Načítám
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="relative h-dvh flex flex-col items-center justify-center cursor-kraken"
      animate={{ backgroundColor: krakenStateColors[krakenData.status] }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
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

      <section className="p-4">{getKrakenJSX(krakenData.status)}</section>

      {/* 
          Only show buttons if user is logged in 
      */}
      {session.data?.user && (
        <>
          {krakenData.status === 'fed' && (
            <button
              onClick={handleStart}
              className="bg-purple text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              Probudit Krakena
            </button>
          )}
          {krakenData.status !== 'fed' && (
            <button
              onClick={handleFeed}
              className="bg-blue text-white px-6 py-2 rounded font-bold text-xl transition-all duration-300 hover:scale-105"
            >
              Nakrmit Krakena
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
            <p>Remaining Time: {krakenData.remainingTime} seconds</p>
          </div>
          {krakenData.timeline && krakenData.timeline.length > 0 && (
            <div className="text-white mb-4">
              <h2 className="text-lg font-semibold">Timeline:</h2>
              <ul>
                {krakenData.timeline.map((phase, index) => (
                  <li key={index} className="my-2">
                    <strong>{phase.status}</strong> — {phase.time} seconds
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </motion.div>
  )
}
