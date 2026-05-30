'use client'

import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CheckCircle, X, AlertCircle, RotateCcw, Gift, Sparkles } from 'lucide-react'
import { useSupabase } from '@/components/providers/SupabaseProvider'

interface Customer {
  id: string
  name: string | null
  email: string
  total_points: number
  total_spent: number
  visit_count: number
}

interface Reward {
  id: string
  reward_name: string
  points_required: number
  description: string | null
  active: boolean
}

export default function Scanner() {
  const { supabase } = useSupabase()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [amount, setAmount] = useState('')
  const [step, setStep] = useState<'scan' | 'amount' | 'confirm' | 'success'>('scan')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Sound effect for scan success
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (e) {
      // Silent fail if audio not supported
    }
  }

  useEffect(() => {
    const initScanner = async () => {
      setLoading(true)
      setError(null)
      
      try {
        scannerRef.current = new Html5Qrcode('scanner')
        
        await scannerRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 280 } },
          async (decodedText) => {
            playSuccessSound()
            setScannedData(decodedText)
            setScanning(false)
            scannerRef.current?.stop()
            
            // Fetch customer data
            setLoading(true)
            try {
              const { data: customerData, error: customerError } = await (supabase as any)
                .from('customers')
                .select('*')
                .eq('qr_token', decodedText)
                .single()

              if (customerError || !customerData) {
                setError('Customer not found')
                setStep('scan')
                setLoading(false)
                return
              }

              setCustomer(customerData)

              // Fetch rewards
              const { data: rewardsData } = await (supabase as any)
                .from('rewards')
                .select('*')
                .eq('active', true)
                .order('points_required', { ascending: true })

              setRewards(rewardsData || [])
              setStep('amount')
            } catch (err) {
              setError('Failed to fetch customer data')
              setStep('scan')
            }
            setLoading(false)
          },
          () => {}
        )
        setScanning(true)
        setLoading(false)
      } catch (err: any) {
        console.error('Scanner error:', err)
        setLoading(false)
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions.')
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please ensure your device has a camera.')
        } else {
          setError('Failed to start scanner. Please refresh and try again.')
        }
      }
    }

    if (step === 'scan' && !scannerRef.current) {
      initScanner()
    }

    return () => {
      scannerRef.current?.stop().catch(() => {})
    }
  }, [step])

  const handleAmountSubmit = () => {
    if (parseFloat(amount) > 0) {
      setStep('confirm')
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      if (customer) {
        const pointsEarned = Math.floor(parseFloat(amount))
        
        // Record transaction
        await (supabase as any).from('transactions').insert({
          customer_id: customer.id,
          restaurant_id: '00000000-0000-0000-0000-000000000000',
          amount: parseFloat(amount),
          points_earned: pointsEarned
        })

        // Update customer points
        await (supabase as any).from('customers')
          .update({
            total_points: customer.total_points + pointsEarned,
            total_spent: customer.total_spent + parseFloat(amount),
            visit_count: customer.visit_count + 1,
            last_visit_at: new Date().toISOString()
          })
          .eq('id', customer.id)
      }
      
      setStep('success')
      // Reset after showing success
      setTimeout(() => {
        setScannedData(null)
        setCustomer(null)
        setAmount('')
        setStep('scan')
        scannerRef.current = null
      }, 3000)
    } catch (e) {
      console.error('Error confirming transaction', e)
    }
    setLoading(false)
  }

  const handleNumpadPress = (key: string) => {
    if (key === 'clear') {
      setAmount('')
    } else if (key === 'backspace') {
      setAmount(amount.slice(0, -1))
    } else if (key === '.') {
      if (!amount.includes('.')) {
        setAmount(amount + key)
      }
    } else {
      // Limit to 2 decimal places
      if (amount.includes('.')) {
        const decimals = amount.split('.')[1]
        if (decimals && decimals.length >= 2) return
      }
      // Limit total length
      if (amount.length >= 8) return
      setAmount(amount + key)
    }
  }

  const handleCancel = () => {
    setScannedData(null)
    setAmount('')
    setStep('scan')
    scannerRef.current = null
  }

  if (step === 'scan') {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <header className="bg-italian-red text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Bella Italia</h1>
              <p className="text-xs text-white/70">Staff Scanner</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href = '/employee-login'}
            className="text-white/70 hover:text-white text-sm"
          >
            Exit
          </button>
        </header>

        <div className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
              <div className="w-16 h-16 border-4 border-italian-gold border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white text-lg">Starting camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-6">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-white text-lg text-center mb-6">{error}</p>
              <button
                onClick={() => { setError(null); setStep('scan'); scannerRef.current = null; }}
                className="bg-italian-red text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
            </div>
          )}

          <div id="scanner" className="w-full h-full" />
          
          {!loading && !error && (
            <>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative w-72 h-72">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-italian-gold rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-italian-gold rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-italian-gold rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-italian-gold rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-italian-gold animate-scan" />
                </div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 inline-block">
                  <p className="text-white text-lg font-medium">Scan customer loyalty QR</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  if (step === 'amount') {
    const numpadKeys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['.', '0', 'backspace']
    ]

    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <header className="bg-italian-red text-white p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <h1 className="text-lg font-bold">Enter Amount</h1>
            <button onClick={handleCancel} className="text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4">
          {/* Success header */}
          <div className="flex items-center gap-3 mb-6 text-green-600 bg-green-50 rounded-xl p-4 shadow-sm border border-green-100">
            <CheckCircle className="w-8 h-8" />
            <div>
              <p className="font-bold text-lg">{customer?.name || customer?.email}</p>
              <p className="text-sm font-medium text-green-700">Points Balance: {customer?.total_points} pts</p>
            </div>
          </div>

          {/* Available Rewards */}
          {rewards.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-italian-gold/20">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-italian-red" />
                Available Rewards
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {rewards.map(reward => {
                  const canAfford = (customer?.total_points || 0) >= reward.points_required
                  return (
                    <div 
                      key={reward.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        canAfford ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div>
                        <p className={`font-semibold text-sm ${canAfford ? 'text-green-800' : 'text-gray-600'}`}>
                          {reward.reward_name}
                        </p>
                        <p className="text-xs text-gray-500">{reward.description}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                        canAfford ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {reward.points_required} pts
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Amount display */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <p className="text-gray-500 text-sm mb-2">Bill Amount</p>
            <div className="flex items-baseline justify-center">
              <span className="text-3xl text-gray-400 mr-1">$</span>
              <span className="text-5xl font-bold text-gray-800">{amount || '0.00'}</span>
            </div>
          </div>

          {/* Numpad */}
          <div className="flex-1 grid grid-rows-4 gap-2 mb-4">
            {numpadKeys.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-3 gap-2">
                {row.map((key) => (
                  <button
                    key={key}
                    onClick={() => handleNumpadPress(key)}
                    className="bg-white rounded-xl text-2xl font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center"
                  >
                    {key === 'backspace' ? (
                      <span className="text-lg">⌫</span>
                    ) : (
                      key
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAmount('')}
              className="bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAmountSubmit}
              disabled={!amount || parseFloat(amount) <= 0}
              className="bg-italian-red text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    const points = Math.floor(parseFloat(amount))
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Transaction</h2>

          <div className="bg-stone-100 rounded-xl p-6 mb-4">
            <p className="text-gray-600 mb-2">Bill Amount</p>
            <p className="text-4xl font-bold text-gray-800">${amount}</p>
          </div>

          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-0.5 bg-gray-300" />
            <div className="mx-4 text-gray-400">→</div>
            <div className="w-12 h-0.5 bg-gray-300" />
          </div>

          <div className="bg-gradient-to-br from-italian-gold to-yellow-400 rounded-xl p-6 mb-6">
            <p className="text-italian-brown mb-2">Points to Add</p>
            <p className="text-5xl font-bold text-italian-red">+{points}</p>
            <p className="text-italian-brown/70 text-sm mt-2">1 point per $1 spent</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('amount')}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-italian-green text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
            >
              Confirm & Add Points
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    const points = Math.floor(parseFloat(amount))
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">Transaction completed</p>

          <div className="bg-gradient-to-br from-italian-gold to-yellow-400 rounded-xl p-6 mb-6">
            <p className="text-italian-brown mb-2">Points Added</p>
            <p className="text-5xl font-bold text-italian-red">+{points}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 mb-6">
            <p className="text-green-700 text-sm">
              Customer will receive a WhatsApp confirmation
            </p>
          </div>

          <p className="text-gray-400 text-sm">
            Returning to scanner in 2 seconds...
          </p>
        </div>
      </div>
    )
  }

  return null
}
