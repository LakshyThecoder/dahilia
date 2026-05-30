'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight } from 'lucide-react'

export default function EmployeeLogin() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    // Simple PIN check - in production, validate against database
    if (pin === '1234') {
      router.push('/scanner')
    } else {
      setError('Invalid PIN')
      setTimeout(() => setError(''), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-italian-red to-italian-green flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-italian-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-italian-red" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Employee Login</h1>
          <p className="text-gray-600 mt-2">Bella Italia Staff</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter PIN Code
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              placeholder="••••"
              className="w-full px-4 py-4 text-center text-2xl tracking-widest border-2 border-gray-200 rounded-xl focus:border-italian-red focus:outline-none"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={pin.length !== 4}
            className="w-full bg-italian-red text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            Access Scanner <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo PIN: 1234
        </p>
      </div>
    </div>
  )
}
