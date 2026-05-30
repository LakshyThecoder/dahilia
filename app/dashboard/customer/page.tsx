'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useToast } from '@/components/ui/Toast'
import { QRCodeSVG } from 'qrcode.react'
import { 
  Gift, 
  TrendingUp, 
  Calendar, 
  Star,
  Crown,
  Sparkles,
  LogOut,
  ChevronRight,
  Loader2,
  Zap,
  Bell
} from 'lucide-react'
import Link from 'next/link'

interface CustomerData {
  id: string
  name: string | null
  email: string
  total_points: number
  total_spent: number
  visit_count: number
  qr_token: string
}

interface Reward {
  id: string
  reward_name: string
  points_required: number
  description: string | null
}

interface Transaction {
  id: string
  amount: number
  points_earned: number
  created_at: string
}

export default function CustomerDashboard() {
  const { supabase } = useSupabase()
  const { addToast } = useToast()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [newTransactionAlert, setNewTransactionAlert] = useState<Transaction | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        await fetchCustomerData(user.id, user.email!)
      } else {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  // Real-time subscriptions with instant notifications
  useEffect(() => {
    if (!customer?.id) return

    // Subscribe to transaction changes
    const transactionSubscription = supabase
      .channel(`transactions:${customer.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `customer_id=eq.${customer.id}`
        },
        (payload) => {
          const newTransaction = payload.new as Transaction
          
          // Show instant toast notification
          addToast('success', `+${newTransaction.points_earned} points earned! 🎉`, 5000)
          
          // Show alert banner
          setNewTransactionAlert(newTransaction)
          
          // Update transactions list
          setTransactions(prev => [newTransaction, ...prev])
          
          // Refresh customer data for updated totals
          if (user) {
            fetchCustomerData(user.id, user.email)
          }
          
          // Clear alert after 5 seconds
          setTimeout(() => setNewTransactionAlert(null), 5000)
        }
      )
      .subscribe()

    return () => {
      transactionSubscription.unsubscribe()
    }
  }, [customer?.id, supabase, user, addToast])

  const fetchCustomerData = async (userId: string, email: string) => {
    try {
      // Get or create customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (customerError || !customerData) {
        // Create new customer if doesn't exist
        const { data: newCustomer, error: createError } = await supabase
          .from('customers')
          .insert({
            user_id: userId,
            email: email,
            restaurant_id: '00000000-0000-0000-0000-000000000000', // Default restaurant
            qr_token: `${userId}-${Date.now()}`,
            total_points: 0,
            total_spent: 0,
            visit_count: 0
          })
          .select()
          .single()

        if (createError) throw createError
        setCustomer(newCustomer)
      } else {
        setCustomer(customerData)
      }

      // Fetch rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('points_required', { ascending: true })

      setRewards(rewardsData || [])

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerData?.id || '')
        .order('created_at', { ascending: false })
        .limit(5)

      setTransactions(transactionsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-[#D4A574]" />
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl mb-4">Please sign in to view your dashboard</p>
          <Link href="/auth" className="inline-block bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const nextReward = rewards.find(r => (customer?.total_points || 0) < r.points_required)
  const pointsToNext = nextReward ? nextReward.points_required - (customer?.total_points || 0) : 0
  const progressPercent = nextReward 
    ? ((customer?.total_points || 0) / nextReward.points_required) * 100 
    : 100

  return (
    <div className="min-h-screen pb-20">
      {/* New Transaction Alert */}
      <AnimatePresence>
        {newTransactionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <Zap className="w-6 h-6 animate-pulse" />
            <div>
              <p className="font-bold text-lg">+{newTransactionAlert.points_earned} Points Added!</p>
              <p className="text-sm text-white/90">Purchase of ${newTransactionAlert.amount}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back{customer?.name ? `, ${customer.name}` : ''}</h1>
              <p className="text-white/80">{customer?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium bg-gradient-to-br from-italian-gold to-yellow-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <Star className="w-6 h-6 text-italian-brown" />
              <span className="font-semibold text-italian-brown">Total Points</span>
            </div>
            <p className="text-5xl font-bold text-italian-brown">
              {customer?.total_points?.toLocaleString() || 0}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-italian-green" />
              <span className="font-semibold text-gray-700">Total Spent</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              ${customer?.total_spent?.toLocaleString() || '0.00'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium"
          >
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-italian-red" />
              <span className="font-semibold text-gray-700">Visits</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {customer?.visit_count || 0}
            </p>
          </motion.div>
        </div>

        {/* QR Code Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-premium text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Loyalty QR Code</h2>
          <p className="text-gray-600 mb-6">Show this to staff when paying</p>
          
          <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl">
            <QRCodeSVG 
              value={customer?.qr_token || 'demo-qr-code'}
              size={220}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: '/logo.png',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4 text-italian-gold" />
            <span>Scan at the restaurant to earn points</span>
          </div>
        </motion.div>

        {/* Progress to Next Reward */}
        {nextReward && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-premium"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6 text-italian-red" />
                <div>
                  <p className="font-semibold text-gray-800">Next Reward</p>
                  <p className="text-sm text-gray-600">{nextReward.reward_name}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-italian-red">
                {pointsToNext} pts
              </span>
            </div>
            
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-italian-red to-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercent, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {customer?.total_points} / {nextReward.points_required} points
            </p>
          </motion.div>
        )}

        {/* Available Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-italian-red" />
            Available Rewards
          </h3>
          
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No rewards available yet</p>
            ) : (
              rewards.slice(0, 3).map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    (customer?.total_points || 0) >= reward.points_required
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{reward.reward_name}</p>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge-premium ${
                      (customer?.total_points || 0) >= reward.points_required
                        ? 'badge-green'
                        : 'badge-gold'
                    }`}>
                      {reward.points_required} pts
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card-premium"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No transactions yet. Start earning points today!
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-italian-red/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-italian-red" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Purchase</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${transaction.amount}</p>
                    <p className="text-sm text-italian-green font-medium">
                      +{transaction.points_earned} pts
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
