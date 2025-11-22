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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const setAudioDuration = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", setAudioDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", setAudioDuration)
    }
  }, [])

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

  return (
    <div className="border border-white p-4 bg-black">
      <audio ref={audioRef} src={audioUrl} />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center border border-white hover:bg-white hover:text-black transition-colors"
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
