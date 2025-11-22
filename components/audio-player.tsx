"use client"

import { useState, useRef, useEffect } from "react"

interface AudioPlayerProps {
  audioUrl: string
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🎵 AudioPlayer received URL:', audioUrl)
    
    if (!audioUrl) {
      console.error('❌ No audioUrl provided to AudioPlayer')
      setError('No audio file available')
      return
    }

    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const setAudioDuration = () => {
      console.log('✅ Audio loaded, duration:', audio.duration)
      setDuration(audio.duration)
      setError(null)
    }

    const handleError = (e: Event) => {
      console.error('❌ Audio failed to load:', e)
      console.error('   URL:', audioUrl)
      const errorMsg = audio.error ? `Error code: ${audio.error.code}` : 'Unknown error'
      setError(`Failed to load audio: ${errorMsg}`)
    }

    const handleLoadStart = () => {
      console.log('⏳ Audio loading started...')
    }

    // Set the src and load the audio
    audio.src = audioUrl
    
    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", setAudioDuration)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadstart", handleLoadStart)

    // Explicitly load the audio
    audio.load()

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", setAudioDuration)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadstart", handleLoadStart)
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  if (!audioUrl) {
    return (
      <div className="border border-gray-700 p-4 bg-gray-900">
        <p className="text-gray-500 text-sm font-mono">No audio available</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-red-500 p-4 bg-red-500/10">
        <p className="text-red-500 text-sm font-mono mb-2">{error}</p>
        <p className="text-xs text-gray-500 break-all">URL: {audioUrl}</p>
      </div>
    )
  }

  return (
    <div className="border border-white p-4 bg-black">
      <audio ref={audioRef} preload="metadata" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={!audioUrl}
          className="w-12 h-12 flex items-center justify-center border border-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPlaying ? "II" : "▶"}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono mb-1 text-gray-400">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="h-2 bg-gray-900 w-full relative cursor-pointer group">
            <div
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-gray-300 transition-colors"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

