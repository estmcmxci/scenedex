'use client'

import { useState } from 'react'
import { checkBasenameAvailable } from '@/lib/check-basename-available'

export function CheckAvailability() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!name) {
      setError('Please enter a name')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const isAvailable = await checkBasenameAvailable(name)
      setResult(isAvailable)
    } catch (err: any) {
      setError(err.message || 'Check failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Check Availability</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Basename (label only, e.g., "mysubname")
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mysubname"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            disabled={loading}
            onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
          />
          <p className="text-sm text-gray-500 mt-1">
            Checking: {name ? `${name}.basetest.eth` : 'name.basetest.eth'}
          </p>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result !== null && (
          <div
            className={`px-4 py-3 rounded ${
              result
                ? 'bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300'
            }`}
          >
            {result ? (
              <div>
                ✅ <strong>{name}.basetest.eth</strong> is available!
              </div>
            ) : (
              <div>
                ❌ <strong>{name}.basetest.eth</strong> is already taken
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

