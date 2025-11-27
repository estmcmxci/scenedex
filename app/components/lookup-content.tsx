"use client"

import { useState } from "react"
import { Search, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"

interface VerificationResult {
  basename: string
  node: string
  exists: boolean
  owner?: string
  resolver?: {
    address: string
    matchesExpected: boolean
    expectedAddress: string
  } | null
  addressRecord?: string | null
  textRecords: Record<string, {
    expected: boolean
    value: string | null
    status: string
  }>
  reverseRecord: {
    safeAddress: string
    expectedPrimaryName: string
    actualPrimaryName: string | null
    status: string
  }
  summary: {
    recordsSet: number
    totalRecords: number
    successRate: string
    allRecordsSet: boolean
  }
}

interface LookupContentProps {
  className?: string
}

export function LookupContent({ className }: LookupContentProps) {
  const [basename, setBasename] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!basename.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ basename: basename.trim() }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setResult(data.data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to verify basename'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SET':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'EMPTY':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getReverseRecordStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-400'
      case 'DIFFERENT_NAME':
        return 'text-yellow-400'
      case 'NO_REVERSE_RECORD':
      case 'EMPTY_NAME':
      case 'QUERY_FAILED':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className={`text-white ${className || ''}`}>
      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter basename (e.g., ares001.scenius.basetest.eth)"
              value={basename}
              onChange={(e) => setBasename(e.target.value)}
              className="w-full bg-black/20 border border-white/30 px-4 py-3 rounded-lg focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/50 backdrop-blur-sm pr-12"
              disabled={loading}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
          <button
            type="submit"
            disabled={loading || !basename.trim()}
            className="px-6 py-3 bg-white/10 border border-white/30 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg font-bold uppercase text-xs backdrop-blur-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Verify'
            )}
          </button>
        </div>
        <p className="text-xs text-white/60 mt-2">
          Enter a full basename to check its ENS records and verify all metadata is properly set
        </p>
      </form>

      {/* Error State */}
      {error && (
        <div className="p-6 border border-red-500/50 bg-red-500/10 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-red-400">Verification Failed</h3>
          </div>
          <p className="text-white/80">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Header */}
          <div className="border border-white/20 bg-black/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold uppercase">Verification Results</h3>
              {result.summary.allRecordsSet ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">All Records Set</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-bold">Incomplete</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Basename:</span>
                <div className="font-mono text-white">{result.basename}</div>
              </div>
              <div>
                <span className="text-white/60">Node:</span>
                <div className="font-mono text-white text-xs break-all">{result.node}</div>
              </div>
              <div>
                <span className="text-white/60">Success Rate:</span>
                <div className={`font-bold ${result.summary.allRecordsSet ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.summary.successRate} ({result.summary.recordsSet}/{result.summary.totalRecords} records)
                </div>
              </div>
              <div>
                <span className="text-white/60">Registry Status:</span>
                <div className={`font-bold ${result.exists ? 'text-green-400' : 'text-red-400'}`}>
                  {result.exists ? 'Exists' : 'Not Found'}
                </div>
              </div>
            </div>
          </div>

          {/* Registry & Resolver Info */}
          {result.exists && (
            <div className="border border-white/20 bg-black/20 rounded-lg p-6">
              <h4 className="font-bold uppercase mb-4">Registry & Resolver</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/60">Owner:</span>
                  <div className="font-mono text-white text-xs break-all mt-1">
                    {result.owner}
                  </div>
                </div>
                {result.resolver && (
                  <div>
                    <span className="text-white/60">Resolver:</span>
                    <div className="mt-1">
                      <div className="font-mono text-white text-xs break-all">
                        {result.resolver.address}
                      </div>
                      {result.resolver.matchesExpected ? (
                        <div className="text-green-400 text-xs mt-1">✓ Matches expected resolver</div>
                      ) : (
                        <div className="text-yellow-400 text-xs mt-1">
                          ⚠ Different from expected: {formatAddress(result.resolver.expectedAddress)}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {result.addressRecord && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <span className="text-white/60">Address Record:</span>
                  <div className="font-mono text-white text-xs break-all mt-1">
                    {result.addressRecord}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Records */}
          <div className="border border-white/20 bg-black/20 rounded-lg p-6">
            <h4 className="font-bold uppercase mb-4">Text Records</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(result.textRecords).map(([key, record]) => (
                <div key={key} className="border border-white/10 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-white/60">{key}</span>
                    {getStatusIcon(record.status)}
                  </div>
                  {record.value ? (
                    <div className="text-xs text-white break-all bg-black/30 p-2 rounded font-mono">
                      {record.value.length > 100 ? `${record.value.substring(0, 100)}...` : record.value}
                    </div>
                  ) : (
                    <div className="text-xs text-white/40 italic">(empty)</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reverse Record */}
          <div className="border border-white/20 bg-black/20 rounded-lg p-6">
            <h4 className="font-bold uppercase mb-4">Reverse Record (Primary Name)</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-white/60">Safe Address:</span>
                <div className="font-mono text-white text-xs break-all mt-1">
                  {result.reverseRecord.safeAddress}
                </div>
              </div>
              <div>
                <span className="text-white/60">Expected Primary Name:</span>
                <div className="font-mono text-white mt-1">
                  {result.reverseRecord.expectedPrimaryName}
                </div>
              </div>
              <div>
                <span className="text-white/60">Actual Primary Name:</span>
                <div className="mt-1">
                  {result.reverseRecord.actualPrimaryName ? (
                    <div className="font-mono text-white">
                      {result.reverseRecord.actualPrimaryName}
                    </div>
                  ) : (
                    <div className="text-white/40 italic">(not set)</div>
                  )}
                </div>
              </div>
              <div>
                <span className="text-white/60">Status:</span>
                <div className={`font-bold mt-1 ${getReverseRecordStatusColor(result.reverseRecord.status)}`}>
                  {result.reverseRecord.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !result && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/60">Enter a basename above to verify its ENS records</p>
        </div>
      )}
    </div>
  )
}
