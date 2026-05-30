'use client'

import { useState } from 'react'
import { Users, Gift, TrendingUp, Megaphone, Plus, Send } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'offers' | 'campaigns'>('overview')

  const stats = {
    totalCustomers: 342,
    totalVisits: 1256,
    avgSpend: 45.50,
    activeOffers: 3
  }

  const recentCustomers = [
    { id: 1, name: 'Marco R.', phone: '+1 555-0123', points: 1250, lastVisit: '2 hours ago' },
    { id: 2, name: 'Lisa M.', phone: '+1 555-0456', points: 890, lastVisit: '5 hours ago' },
    { id: 3, name: 'John D.', phone: '+1 555-0789', points: 2340, lastVisit: '1 day ago' },
    { id: 4, name: 'Anna K.', phone: '+1 555-0321', points: 450, lastVisit: '2 days ago' },
  ]

  const offers = [
    { id: 1, name: 'Free Appetizer', points: 500, claimed: 23 },
    { id: 2, name: '20% Off Dinner', points: 750, claimed: 15 },
    { id: 3, name: 'Free Dinner', points: 2000, claimed: 4 },
  ]

  if (activeTab === 'overview') {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-r from-italian-red to-italian-green text-white p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bella Italia Dashboard</h1>
              <p className="opacity-90">Restaurant Owner Portal</p>
            </div>
            <div className="flex gap-2">
              {(['overview', 'customers', 'offers', 'campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-italian-red" />
                <span className="text-green-600 text-sm">+12%</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
              <p className="text-gray-600">Total Customers</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-italian-green" />
                <span className="text-green-600 text-sm">+8%</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.totalVisits}</p>
              <p className="text-gray-600">Total Visits</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-italian-gold">$</span>
                <span className="text-green-600 text-sm">+5%</span>
              </div>
              <p className="text-3xl font-bold text-gray-800">${stats.avgSpend}</p>
              <p className="text-gray-600">Avg. Spend</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <Gift className="w-8 h-8 text-italian-red" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stats.activeOffers}</p>
              <p className="text-gray-600">Active Offers</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Recent Customers</h3>
                <button
                  onClick={() => setActiveTab('customers')}
                  className="text-italian-red hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="divide-y">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-italian-red">{customer.points} pts</p>
                      <p className="text-sm text-gray-500">{customer.lastVisit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Active Offers</h3>
                <button
                  onClick={() => setActiveTab('offers')}
                  className="text-italian-red hover:underline"
                >
                  Manage
                </button>
              </div>
              <div className="divide-y">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{offer.name}</p>
                      <p className="text-sm text-gray-500">{offer.points} points required</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-italian-green">{offer.claimed} claimed</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full p-4 text-italian-red font-medium flex items-center justify-center gap-2 hover:bg-stone-50">
                <Plus className="w-4 h-4" /> Add New Offer
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (activeTab === 'customers') {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-r from-italian-red to-italian-green text-white p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bella Italia Dashboard</h1>
              <p className="opacity-90">Restaurant Owner Portal</p>
            </div>
            <div className="flex gap-2">
              {(['overview', 'customers', 'offers', 'campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold">All Customers</h2>
            </div>
            <div className="divide-y">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-italian-red/10 flex items-center justify-center text-italian-red font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-italian-red">{customer.points} pts</p>
                    <p className="text-sm text-gray-500">{customer.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (activeTab === 'offers') {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-r from-italian-red to-italian-green text-white p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bella Italia Dashboard</h1>
              <p className="opacity-90">Restaurant Owner Portal</p>
            </div>
            <div className="flex gap-2">
              {(['overview', 'customers', 'offers', 'campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Manage Offers</h2>
              <button className="bg-italian-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
                <Plus className="w-4 h-4" /> Create Offer
              </button>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{offer.name}</h3>
                    <p className="text-sm text-gray-500">{offer.points} points required</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 font-medium">{offer.claimed} claimed</span>
                    <button className="text-italian-red hover:underline">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (activeTab === 'campaigns') {
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="bg-gradient-to-r from-italian-red to-italian-green text-white p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Bella Italia Dashboard</h1>
              <p className="opacity-90">Restaurant Owner Portal</p>
            </div>
            <div className="flex gap-2">
              {(['overview', 'customers', 'offers', 'campaigns'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeTab === tab ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Marketing Campaigns</h2>
              <button className="bg-italian-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
                <Megaphone className="w-4 h-4" /> New Campaign
              </button>
            </div>

            <div className="space-y-4">
              <div className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Weekend Special</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                </div>
                <p className="text-gray-600 mb-4">Double points on all pasta dishes this weekend!</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Sent to 234 customers</span>
                  <span>•</span>
                  <span>42 redemptions</span>
                </div>
              </div>

              <div className="border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Birthday Rewards</h3>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Scheduled</span>
                </div>
                <p className="text-gray-600 mb-4">Automatic birthday rewards for all customers</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Auto-sends monthly</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return null
}
