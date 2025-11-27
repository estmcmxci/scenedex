"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { PongGame } from "./pong-game"
import { Check, Loader2, Coins, Database, FileText, Globe } from "lucide-react"

export type PublishingStep = 
  | "preparing"
  | "pinning_ipfs"
  | "creating_split"
  | "deploying_coin"
  | "registering_ens"
  | "finalizing"
  | "complete"
  | "error"

interface PublishingModalProps {
  isOpen: boolean
  currentStep: PublishingStep
  releaseTitle: string
  artistName: string
  releaseId: string
  error?: string
  onComplete: () => void
}

const STEPS = [
  {
    key: "pinning_ipfs",
    title: "Pinning to IPFS",
    description: "Your audio and cover art are being stored on IPFS — a decentralized, permanent storage network. Once pinned, your files can never be deleted or censored.",
    icon: Database,
  },
  {
    key: "creating_split",
    title: "Creating Split Contract",
    description: "A 50/50 revenue split is being created between you and the curation team. All future earnings from your release will be automatically distributed onchain.",
    icon: FileText,
  },
  {
    key: "deploying_coin",
    title: "Deploying Creator Coin",
    description: "Your creator coin is being deployed on Zora. This coin is yours — anyone can support your work by purchasing it, and you'll earn from every trade.",
    icon: Coins,
  },
  {
    key: "registering_ens",
    title: "Registering on ENS",
    description: "Your release is being registered with a unique ENS name, making all metadata permanently queryable and verifiable onchain.",
    icon: Globe,
  },
  {
    key: "finalizing",
    title: "Finalizing",
    description: "Wrapping up and confirming all transactions...",
    icon: Check,
  },
]

function getStepStatus(stepKey: string, currentStep: PublishingStep): "pending" | "active" | "complete" {
  const stepOrder = ["preparing", "pinning_ipfs", "creating_split", "deploying_coin", "registering_ens", "finalizing", "complete"]
  const currentIndex = stepOrder.indexOf(currentStep)
  const stepIndex = stepOrder.indexOf(stepKey)
  
  if (currentStep === "complete" || currentStep === "error") {
    return stepIndex < stepOrder.indexOf("complete") ? "complete" : "pending"
  }
  
  if (stepIndex < currentIndex) return "complete"
  if (stepIndex === currentIndex) return "active"
  return "pending"
}

export function PublishingModal({
  isOpen,
  currentStep,
  releaseTitle,
  artistName,
  releaseId,
  error,
  onComplete,
}: PublishingModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const isComplete = currentStep === "complete"
  const hasError = currentStep === "error"

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 9999,
      }}
    >
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto">
        <div className="border border-white/30 rounded-2xl bg-black/40 backdrop-blur-xl p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-white mb-2">
              {isComplete ? "🎉 Published!" : hasError ? "❌ Error" : "Publishing Your Release"}
            </h2>
            <p className="text-white/60">
              {isComplete 
                ? `${releaseTitle} by ${artistName} is now live!`
                : hasError
                ? "Something went wrong during publishing"
                : `${releaseTitle} by ${artistName}`
              }
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Pong Game */}
            {!isComplete && !hasError && (
              <div className="flex flex-col items-center justify-center">
                <div className="text-sm uppercase text-white/60 font-bold mb-4 tracking-wider">
                  While you wait...
                </div>
                <PongGame width={380} height={280} />
              </div>
            )}

            {/* Right: Progress Steps (or full width if complete/error) */}
            <div className={isComplete || hasError ? "col-span-full" : ""}>
              {hasError ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 mx-auto mb-4">
                    <span className="text-3xl">✕</span>
                  </div>
                  <p className="text-red-400 mb-4">{error || "An unknown error occurred"}</p>
                  <button
                    onClick={onComplete}
                    className="px-6 py-3 border border-white/30 hover:bg-white/10 transition-colors rounded-lg font-bold uppercase text-sm"
                  >
                    Close
                  </button>
                </div>
              ) : isComplete ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-400" />
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                      <div className="text-sm uppercase text-white/60 mb-2">Your Release ID</div>
                      <div className="font-mono text-xl text-white">{releaseId}</div>
                    </div>

                    <div className="space-y-3 text-left">
                      <div className="flex items-start gap-3">
                        <Coins className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white">Your Creator Coin is Live</div>
                          <div className="text-sm text-white/60">
                            The creator coin is <span className="text-yellow-400 font-semibold">yours</span>. Anyone can support your work by purchasing it, and you earn from every trade.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white">Permanently Stored</div>
                          <div className="text-sm text-white/60">
                            Your music and metadata are now on IPFS — immutable and censorship-resistant forever.
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white">50/50 Split Active</div>
                          <div className="text-sm text-white/60">
                            All earnings are automatically split between you and the curation team onchain.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={onComplete}
                        className="w-full px-6 py-4 bg-white text-black hover:bg-white/90 transition-colors rounded-lg font-bold uppercase text-sm"
                      >
                        View on Releases Page →
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm uppercase text-white/60 font-bold mb-4 tracking-wider">
                    Publishing Progress
                  </div>
                  
                  {STEPS.map((step, index) => {
                    const status = getStepStatus(step.key, currentStep)
                    const Icon = step.icon
                    
                    return (
                      <div
                        key={step.key}
                        className={`flex gap-4 p-4 rounded-lg border transition-all duration-300 ${
                          status === "active"
                            ? "border-white/50 bg-white/10"
                            : status === "complete"
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-white/10 bg-white/5 opacity-50"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {status === "complete" ? (
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-400" />
                            </div>
                          ) : status === "active" ? (
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-white/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold ${status === "pending" ? "text-white/40" : "text-white"}`}>
                            {step.title}
                          </div>
                          {status === "active" && (
                            <div className="text-sm text-white/60 mt-1">
                              {step.description}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  
                  <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="text-xs uppercase text-white/40 mb-2">What's happening?</div>
                    <p className="text-sm text-white/70">
                      Your release is being permanently published onchain. This includes storing your music on IPFS, 
                      creating smart contracts for revenue sharing, and deploying your creator coin on Zora.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

