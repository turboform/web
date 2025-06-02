import { ArrowRightIcon, PlayCircleIcon, SparklesIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsVideoLoaded(true)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    // Listen for video events
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/80 group scale-105 w-[105%] mx-auto"
      whileHover={{ scale: 1.03 }}
    >
      {/* Floating elements for visual interest */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full blur-2xl z-0"></div>
      <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-full blur-2xl z-0"></div>

      {/* Image fallback that shows until video loads */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="aspect-[16/9] w-full relative">
          <Image src="/screenshots/dashboard.png" alt="TurboForm Preview" fill className="object-cover" priority />
        </div>
      </div>

      {/* Video element with overlay that hides during playback */}
      <div className="aspect-[16/9] w-full relative z-10">
        {' '}
        {/* Added z-10 to ensure it's above other elements */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          controlsList="nodownload"
          poster="/screenshots/dashboard.png"
        >
          <source
            src="https://krleqnhlvnyqtkqoyogw.supabase.co/storage/v1/object/public/public-assets/demo-hd.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        {/* Play button overlay - only visible before video starts playing */}
        {!isPlaying && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 cursor-pointer hover:bg-black/20 z-20"
            initial={{ opacity: 1 }}
            animate={{ opacity: isPlaying ? 0 : 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play()
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary/90 p-4 rounded-full shadow-lg shadow-primary/20"
            >
              <PlayCircleIcon className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Corner highlight effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent z-10"></div>
    </motion.div>
  )
}

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Enhanced background gradient effects */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="absolute inset-x-0 top-60 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-20deg] bg-gradient-to-tr from-secondary to-primary/80 opacity-20 sm:left-[calc(50%+18rem)] sm:w-[72.1875rem]"></div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Badge className="bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary rounded-lg px-4 py-2 text-base font-semibold tracking-wide shadow-md">
                <SparklesIcon className="h-4 w-4 mr-1 inline-block animate-pulse" />
                TurboForm - Build Forms Faster
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6 leading-tight"
            >
              Beautiful Forms{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-secondary to-secondary font-extrabold">
                Before Your Coffee Cools
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-muted-foreground"
            >
              Stop wrestling with clunky form builders. Turn any idea into a polished, share-ready form in seconds with
              our AI-powered platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center gap-x-6"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-md px-6 py-6 text-base font-semibold shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('form-generator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started Free{' '}
                <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-md px-6 py-6 text-base font-semibold border-secondary/20 hover:bg-secondary/5 hover:border-secondary/30 transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </motion.div>
          </div>

          <HeroMedia />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <motion.div
          className="flex flex-col items-center text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3 py-1 text-sm font-medium text-gray-800 bg-primary rounded-full mb-4 flex items-center gap-2 shadow-md">
            <SparklesIcon className="h-4 w-4" />
            Intuitive Experience
          </span>
          <h2 className="text-3xl font-bold mb-4 relative">
            Powerful Dashboard at Your Fingertips
            <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/50 rounded-full mx-auto mt-3"></div>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage all your forms, responses, and integrations from a centralized dashboard designed for productivity.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto flow-root max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="-m-2 rounded-xl bg-card p-2 ring-1 ring-inset ring-border lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="rounded-md bg-card shadow-md ring-1 ring-border">
              <div className="aspect-[16/9] w-full rounded-t-md overflow-hidden">
                <img
                  src="/screenshots/dashboard.png"
                  alt="TurboForm Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary to-accent opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>
  )
}
