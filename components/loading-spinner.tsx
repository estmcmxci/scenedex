interface LoadingSpinnerProps {
  text?: string
}

export function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
      {text && <p className="text-gray-400">{text}</p>}
    </div>
  )
}

