'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useToast } from '@/components/ui/Toast'
import { 
  LayoutDashboard,
  Users,
  Gift,
  Mail,
  TrendingUp,
  DollarSign,
  QrCode,
  LogOut,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Crown,
  Sparkles,
  Coffee,
  Croissant,
  Wheat,
  ArrowUpRight,
  Calendar,
  MoreHorizontal,
  Trash2,
  Edit3,
  Loader2,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  email: string
  name: string | null
  total_points: number
  total_spent: number
  visit_count: number
  created_at: string
}

interface Transaction {
  id: string
  customer_id: string
  amount: number
  points_earned: number
  created_at: string
  customers: { name: string; email: string }
}

interface Reward {
  id: string
  reward_name: string
  points_required: number
  description: string | null
  active: boolean
}

export default function AdminDashboard() {
  const { supabase } = useSupabase()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    totalPointsIssued: 0,
    avgTransaction: 0
  })
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Fetch customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .returns<Customer[]>()
      
      setCustomers(customersData || [])
      
      // Fetch transactions with customer info
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*, customers(name, email)')
        .order('created_at', { ascending: false })
        .limit(50)
        .returns<Transaction[]>()
      
      setTransactions(transactionsData || [])
      
      // Fetch rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required', { ascending: true })
        .returns<Reward[]>()
      
      setRewards(rewardsData || [])
      
      // Calculate stats
      const totalCustomers = customersData?.length || 0
      const totalRevenue = customersData?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0
      const totalPointsIssued = customersData?.reduce((sum, c) => sum + (c.total_points || 0), 0) || 0
      const avgTransaction = transactionsData && transactionsData.length > 0
        ? transactionsData.reduce((sum, t) => sum + t.amount, 0) / transactionsData.length
        : 0
      
      setStats({
        totalCustomers,
        totalRevenue,
        totalPointsIssued,
        avgTransaction
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      addToast('error', 'Failed to load dashboard data', 3000)
    } finally {
      setLoading(false)
    }
  }, [supabase, addToast])

  useEffect(() => {
    fetchData()
    
    // Real-time subscription for new customers
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => {
        fetchData()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
        addToast('success', `New transaction: $${payload.new.amount}`, 3000)
        fetchData()
      })
      .subscribe()
    
    return () => {
      channel.unsubscribe()
    }
  }, [supabase, fetchData, addToast])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const filteredCustomers = customers.filter(c => 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFF8F0] via-[#FFF0E0] to-[#F5E6D3]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-[#D4A574]" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFF0E0] to-[#F5E6D3]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-[#D4A574]/20 z-50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-2xl flex items-center justify-center shadow-lg shadow-[#D4A574]/30">
              <Croissant className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#4A3728]">Dahilia</h1>
              <p className="text-xs text-[#8B6914]">Admin Dashboard</p>
            </div>
          </Link>
          
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'rewards', icon: Gift, label: 'Rewards' },
              { id: 'campaigns', icon: Mail, label: 'Campaigns' },
              { id: 'scanner', icon: QrCode, label: 'QR Scanner', href: '/scanner' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.href ? window.location.href = item.href : setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-[#D4A574]/20 to-[#8B6914]/10 text-[#8B6914] font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#4A3728]">Welcome to Dahilia</h2>
            <p className="text-[#8B6914]">Manage your artisan bakery loyalty program</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-[#8B6914]"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link 
              href="/scanner"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <QrCode className="w-5 h-5" />
              Scan QR Code
            </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    icon: Users, 
                    label: 'Total Customers', 
                    value: stats.totalCustomers.toLocaleString(),
                    trend: '+12%',
                    color: 'from-blue-500 to-blue-600'
                  },
                  { 
                    icon: DollarSign, 
                    label: 'Total Revenue', 
                    value: `$${stats.totalRevenue.toLocaleString()}`,
                    trend: '+8%',
                    color: 'from-green-500 to-green-600'
                  },
                  { 
                    icon: Sparkles, 
                    label: 'Points Issued', 
                    value: stats.totalPointsIssued.toLocaleString(),
                    trend: '+15%',
                    color: 'from-[#D4A574] to-[#8B6914]'
                  },
                  { 
                    icon: TrendingUp, 
                    label: 'Avg Transaction', 
                    value: `$${stats.avgTransaction.toFixed(2)}`,
                    trend: '+5%',
                    color: 'from-purple-500 to-purple-600'
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A574]/10"
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-[#4A3728] mt-4">{stat.value}</p>
                    <p className="text-sm text-[#8B6914]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A574]/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#4A3728]">Recent Transactions</h3>
                  <button className="text-[#D4A574] hover:text-[#8B6914] font-medium flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-full flex items-center justify-center">
                          <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#4A3728]">{transaction.customers?.name || transaction.customers?.email}</p>
                          <p className="text-sm text-[#8B6914]">{new Date(transaction.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#4A3728]">${transaction.amount}</p>
                        <p className="text-sm text-green-600 font-medium">+{transaction.points_earned} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'customers' && (
            <motion.div
              key="customers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A574]/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#4A3728]">Customer Directory</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A574] w-64"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#D4A574]/10 text-[#8B6914] rounded-xl hover:bg-[#D4A574]/20 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#8B6914]">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#8B6914]">Points</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#8B6914]">Spent</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#8B6914]">Visits</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#8B6914]">Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-[#8B6914]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-50 hover:bg-[#FFF8F0]/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-full flex items-center justify-center text-white font-semibold">
                              {(customer.name || customer.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-[#4A3728]">{customer.name || 'Anonymous'}</p>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#D4A574]">{customer.total_points}</span>
                        </td>
                        <td className="py-4 px-4">${customer.total_spent}</td>
                        <td className="py-4 px-4">{customer.visit_count}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {new Date(customer.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#4A3728]">Rewards Program</h3>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-5 h-5" />
                  Add Reward
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward, i) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#D4A574]/10"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-2xl flex items-center justify-center">
                        <Gift className="w-7 h-7 text-white" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        reward.active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {reward.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#4A3728] mb-2">{reward.reward_name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#D4A574]" />
                        <span className="font-bold text-[#D4A574]">{reward.points_required} points</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
