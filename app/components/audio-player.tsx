"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface AudioPlayerProps {
  audioUrl: string
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  // Fetch audio as blob to avoid CORS/browser security issues with IPFS gateways
  useEffect(() => {
    if (!audioUrl) {
      setError('No audio URL provided')
      setIsLoading(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()

    async function fetchAudioBlob() {
      setIsLoading(true)
      setError(null)
      
      // Clean up previous blob URL
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
      }

      try {
        console.log('Fetching audio from:', audioUrl)
        const response = await fetch(audioUrl, { 
          signal: controller.signal,
          mode: 'cors',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const blob = await response.blob()
        
        if (cancelled) return
        
        const url = URL.createObjectURL(blob)
        console.log('Created blob URL:', url)
        setBlobUrl(url)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to fetch audio:', err)
        setError(err instanceof Error ? err.message : 'Failed to load audio')
        setIsLoading(false)
      }
    }

    fetchAudioBlob()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [audioUrl])

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      if (!isDragging) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    const setAudioDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
      setError(null)
    }

    const handleError = (e: Event) => {
      console.error('Audio element error:', e)
      const audioEl = e.target as HTMLAudioElement
      if (audioEl.error) {
        console.error('Audio error code:', audioEl.error.code)
        console.error('Audio error message:', audioEl.error.message)
      }
      setError('Failed to play audio')
      setIsLoading(false)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
      setError(null)
    }

    audio.addEventListener("timeupdate", updateProgress)
    audio.addEventListener("loadedmetadata", setAudioDuration)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("timeupdate", updateProgress)
      audio.removeEventListener("loadedmetadata", setAudioDuration)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [isDragging, blobUrl])

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (err) {
          console.error('Play error:', err)
          setError('Failed to play audio')
        }
      }
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const audio = audioRef.current
    const progressBar = progressBarRef.current
    if (!audio || !progressBar || !duration) return

    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * duration

    audio.currentTime = newTime
    setProgress(percentage * 100)
  }, [duration])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleSeek(e)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return
    handleSeek(e)
  }, [isDragging, handleSeek])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
    return undefined
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="border border-white/30 p-4 rounded bg-transparent">
      {blobUrl && (
        <audio 
          ref={audioRef} 
          src={blobUrl} 
          preload="metadata"
        />
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={isLoading || !!error}
          className={`w-12 h-12 flex items-center justify-center border border-white/30 transition-colors ${
            isLoading || error 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/10 hover:border-white/50'
          }`}
        >
          {isLoading ? "..." : error ? "✕" : isPlaying ? "II" : "▶"}
        </button>

        <div className="flex-1">
          <div className="flex justify-between text-xs font-mono mb-1 text-white/60">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            ref={progressBarRef}
            onMouseDown={handleMouseDown}
            className="h-2 bg-white/10 w-full relative cursor-pointer group"
          >
            <div
              className="absolute top-0 left-0 h-full bg-white/60 group-hover:bg-white/80 transition-colors"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-2 text-xs text-red-400">{error}</div>
      )}
    </div>
  )
}

