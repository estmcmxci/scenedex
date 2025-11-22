import Link from "next/link"

interface ReleaseCardProps {
  ensName: string
  releaseId: string
  title: string
  coverImageUrl: string
}

export function ReleaseCard({ ensName, releaseId, title, coverImageUrl }: ReleaseCardProps) {
  return (
    <Link href={`/releases/${ensName}`}>
      <div className="group cursor-pointer">
        <div className="aspect-square rounded-xl overflow-hidden border border-purple-500/30 bg-black/50 mb-3 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500 group-hover:shadow-lg group-hover:shadow-purple-500/20">
          <img src={coverImageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="text-purple-400 text-xs font-semibold mb-1">{releaseId}</div>
        <div className="text-white font-semibold truncate group-hover:text-purple-300 transition">{title}</div>
      </div>
    </Link>
  )
}
