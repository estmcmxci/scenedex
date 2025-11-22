interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "published"
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    published: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  }

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    published: "Published",
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
