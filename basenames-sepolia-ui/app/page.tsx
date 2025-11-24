'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { RegisterBasename } from '@/components/RegisterBasename'
import { QueryBasename } from '@/components/QueryBasename'
import { CheckAvailability } from '@/components/CheckAvailability'

export default function Home() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState<'register' | 'query' | 'check'>('register')

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Basenames on Base Sepolia</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Register and query basenames (basetest.eth subdomains) on Base Sepolia
        </p>

        {!isConnected && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded mb-6">
            Please connect your wallet to register basenames
          </div>
        )}

        {isConnected && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-6">
            Connected: {address}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'register'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'query'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Query
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'check'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Check Availability
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          {activeTab === 'register' && <RegisterBasename />}
          {activeTab === 'query' && <QueryBasename />}
          {activeTab === 'check' && <CheckAvailability />}
        </div>
      </div>
    </main>
  )
}

