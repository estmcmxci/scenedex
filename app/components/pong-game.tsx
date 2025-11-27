"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface PongGameProps {
  width?: number
  height?: number
  className?: string
}

export function PongGame({ width = 400, height = 300, className }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [score, setScore] = useState({ player: 0, ai: 0 })
  const [isPaused, setIsPaused] = useState(false)
  
  // Game state refs (to avoid stale closures in animation loop)
  const gameState = useRef({
    ball: { x: width / 2, y: height / 2, vx: 4, vy: 3, radius: 8 },
    playerPaddle: { y: height / 2 - 40, height: 80, width: 10, speed: 6 },
    aiPaddle: { y: height / 2 - 40, height: 80, width: 10, speed: 4 },
    keys: { up: false, down: false },
    paused: false,
  })

  const paddleX = 20
  const aiPaddleX = width - 30

  const resetBall = useCallback((direction: number = 1) => {
    const state = gameState.current
    state.ball.x = width / 2
    state.ball.y = height / 2
    state.ball.vx = 4 * direction
    state.ball.vy = (Math.random() - 0.5) * 6
  }, [width, height])

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const state = gameState.current
    
    if (!state.paused) {
      // Move player paddle
      if (state.keys.up && state.playerPaddle.y > 0) {
        state.playerPaddle.y -= state.playerPaddle.speed
      }
      if (state.keys.down && state.playerPaddle.y < height - state.playerPaddle.height) {
        state.playerPaddle.y += state.playerPaddle.speed
      }

      // AI paddle follows ball with some delay
      const aiCenter = state.aiPaddle.y + state.aiPaddle.height / 2
      const ballCenter = state.ball.y
      if (aiCenter < ballCenter - 20) {
        state.aiPaddle.y += state.aiPaddle.speed
      } else if (aiCenter > ballCenter + 20) {
        state.aiPaddle.y -= state.aiPaddle.speed
      }
      
      // Keep AI paddle in bounds
      state.aiPaddle.y = Math.max(0, Math.min(height - state.aiPaddle.height, state.aiPaddle.y))

      // Move ball
      state.ball.x += state.ball.vx
      state.ball.y += state.ball.vy

      // Ball collision with top/bottom walls
      if (state.ball.y - state.ball.radius <= 0 || state.ball.y + state.ball.radius >= height) {
        state.ball.vy *= -1
        state.ball.y = Math.max(state.ball.radius, Math.min(height - state.ball.radius, state.ball.y))
      }

      // Ball collision with player paddle
      if (
        state.ball.x - state.ball.radius <= paddleX + state.playerPaddle.width &&
        state.ball.x + state.ball.radius >= paddleX &&
        state.ball.y >= state.playerPaddle.y &&
        state.ball.y <= state.playerPaddle.y + state.playerPaddle.height
      ) {
        state.ball.vx = Math.abs(state.ball.vx) * 1.05 // Speed up slightly
        state.ball.x = paddleX + state.playerPaddle.width + state.ball.radius
        // Add spin based on where ball hits paddle
        const hitPos = (state.ball.y - state.playerPaddle.y) / state.playerPaddle.height
        state.ball.vy = (hitPos - 0.5) * 8
      }

      // Ball collision with AI paddle
      if (
        state.ball.x + state.ball.radius >= aiPaddleX &&
        state.ball.x - state.ball.radius <= aiPaddleX + state.aiPaddle.width &&
        state.ball.y >= state.aiPaddle.y &&
        state.ball.y <= state.aiPaddle.y + state.aiPaddle.height
      ) {
        state.ball.vx = -Math.abs(state.ball.vx) * 1.05
        state.ball.x = aiPaddleX - state.ball.radius
        const hitPos = (state.ball.y - state.aiPaddle.y) / state.aiPaddle.height
        state.ball.vy = (hitPos - 0.5) * 8
      }

      // Scoring
      if (state.ball.x < 0) {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }))
        resetBall(1)
      } else if (state.ball.x > width) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
        resetBall(-1)
      }
    }

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(0, 0, width, height)

    // Draw center line
    ctx.setLineDash([10, 10])
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw paddles
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.fillRect(paddleX, state.playerPaddle.y, state.playerPaddle.width, state.playerPaddle.height)
    ctx.fillRect(aiPaddleX, state.aiPaddle.y, state.aiPaddle.width, state.aiPaddle.height)

    // Draw ball
    ctx.beginPath()
    ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = "white"
    ctx.fill()

    // Draw score
    ctx.font = "bold 24px monospace"
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
    ctx.textAlign = "center"
    ctx.fillText(score.player.toString(), width / 4, 40)
    ctx.fillText(score.ai.toString(), (width / 4) * 3, 40)

    // Draw paused overlay
    if (state.paused) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, width, height)
      ctx.font = "bold 20px monospace"
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.fillText("PAUSED", width / 2, height / 2)
      ctx.font = "12px monospace"
      ctx.fillText("Press SPACE to resume", width / 2, height / 2 + 25)
    }

    animationRef.current = requestAnimationFrame(gameLoop)
  }, [width, height, paddleX, aiPaddleX, resetBall, score])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        gameState.current.keys.up = true
        e.preventDefault()
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        gameState.current.keys.down = true
        e.preventDefault()
      }
      if (e.key === " ") {
        gameState.current.paused = !gameState.current.paused
        setIsPaused(gameState.current.paused)
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        gameState.current.keys.up = false
      }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        gameState.current.keys.down = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameLoop])

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-white/30 rounded bg-black/30"
      />
      <div className="mt-2 text-xs text-white/60 text-center">
        <span className="uppercase">Controls:</span> ↑↓ or W/S to move • Space to pause
      </div>
    </div>
  )
}

