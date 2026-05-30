'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useToast } from '@/components/ui/Toast'
import { 
  Send, 
  Mail, 
  Users, 
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Calendar,
  ChevronRight,
  Zap,
  Clock
} from 'lucide-react'

interface Campaign {
  id: string
  title: string
  message: string
  sent_to: number
  created_at: string
}

export default function CampaignsPage() {
  const { supabase } = useSupabase()
  const { addToast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendProgress, setSendProgress] = useState(0)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchCampaigns()
    fetchCustomers()
  }, [supabase])

  const fetchCampaigns = async () => {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    
    setCampaigns(data || [])
  }

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, email, name')
      .eq('restaurant_id', '00000000-0000-0000-0000-000000000000')
    
    setCustomers(data || [])
  }

  const sendCampaign = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSendProgress(0)
    setStatus(null)

    const startTime = Date.now()
    const totalCustomers = customers.length

    try {
      // Show initial toast
      addToast('info', `Starting campaign send to ${totalCustomers} customers...`, 3000)

      // Save campaign to database
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          restaurant_id: '00000000-0000-0000-0000-000000000000',
          title,
          message,
          target_segment: 'all',
          delivery_channel: 'email',
          status: 'sending',
          sent_at: new Date().toISOString(),
          sent_to: 0
        })
        .select()
        .single()

      if (campaignError) throw campaignError

      // Send emails in parallel batches for speed (10 at a time)
      const batchSize = 10
      const batches = []
      let sentCount = 0

      for (let i = 0; i < customers.length; i += batchSize) {
        const batch = customers.slice(i, i + batchSize)
        batches.push(batch)
      }

      // Process batches
      for (const batch of batches) {
        const batchPromises = batch.map(customer => 
          fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: customer.email,
              subject: `🥐 ${title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h1 style="color: #8B6914;">${title}</h1>
                  <p style="color: #4A3728; line-height: 1.6;">${message}</p>
                  <div style="margin-top: 30px; padding: 20px; background: #FFF8F0; border-radius: 10px;">
                    <p style="color: #8B6914; font-weight: bold;">Dahilia Oven</p>
                    <p style="color: #6B5B4F;">Artisan Bakery & Café</p>
                  </div>
                </div>
              `
            })
          }).then(res => {
            sentCount++
            setSendProgress(Math.round((sentCount / totalCustomers) * 100))
            return res
          })
        )

        await Promise.all(batchPromises)
      }

      // Update campaign with final count
      await supabase
        .from('campaigns')
        .update({ status: 'sent', sent_to: sentCount })
        .eq('id', campaign.id)

      const duration = ((Date.now() - startTime) / 1000).toFixed(1)

      // Show success toast
      addToast('success', `✅ Campaign sent to ${sentCount} customers in ${duration}s!`, 5000)

      setStatus({ 
        type: 'success', 
        message: `Campaign sent to ${sentCount} customers in ${duration} seconds!` 
      })
      
      // Reset form
      setTitle('')
      setMessage('')
      setSendProgress(0)
      fetchCampaigns()
    } catch (error: any) {
      addToast('error', `Failed to send campaign: ${error.message}`, 5000)
      setStatus({ type: 'error', message: error.message })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-dahilia-primary to-dahilia-secondary text-white p-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Email Campaigns</h1>
              <p className="text-white/80">Send updates & offers to loyalty members</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium bg-gradient-to-br from-dahilia-primary to-dahilia-secondary text-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6" />
              <span className="font-semibold">Loyalty Members</span>
            </div>
            <p className="text-4xl font-bold">{customers.length}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium"
          >
            <div className="flex items-center gap-3 mb-3">
              <Send className="w-6 h-6 text-dahilia-accent" />
              <span className="font-semibold text-gray-700">Campaigns Sent</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">{campaigns.length}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-premium"
          >
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-6 h-6 text-dahilia-secondary" />
              <span className="font-semibold text-gray-700">Total Reach</span>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {campaigns.reduce((acc, c) => acc + (c.sent_to || 0), 0)}
            </p>
          </motion.div>
        </div>

        {/* Create Campaign Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="card-premium"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-dahilia-accent" />
            Create New Campaign
          </h2>

          <form onSubmit={sendCampaign} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Campaign Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Weekend Special: Fresh Croissants!"
                className="input-premium mt-2"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message to customers..."
                className="input-premium mt-2 min-h-[120px] resize-none"
                required
                rows={4}
              />
            </div>

            {/* Progress Bar */}
            {sending && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#E07B39]" />
                    Sending emails...
                  </span>
                  <span className="font-semibold text-[#8B6914]">{sendProgress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#D4A574] to-[#8B6914]"
                    initial={{ width: 0 }}
                    animate={{ width: `${sendProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Sending {customers.length} emails in parallel batches for maximum speed
                </p>
              </div>
            )}

            {status && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  status.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{status.message}</p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={sending || customers.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 hover:shadow-xl transition-all duration-300"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending {sendProgress}%...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Campaign to {customers.length} Members</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    ~{Math.ceil(customers.length / 10)}s
                  </span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-premium"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-dahilia-secondary" />
            Recent Campaigns
          </h2>

          {campaigns.length === 0 ? (
            <div className="text-center py-12 bg-dahilia-cream/50 rounded-2xl">
              <Megaphone className="w-12 h-12 text-dahilia-primary mx-auto mb-4" />
              <p className="text-gray-600">No campaigns sent yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Create your first campaign above!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 bg-dahilia-cream/30 rounded-xl border border-dahilia-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{campaign.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {campaign.message}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {campaign.sent_to || 0} recipients
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
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
