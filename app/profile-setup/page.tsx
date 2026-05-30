'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useToast } from '@/components/ui/Toast'
import { 
  User,
  Phone,
  Calendar,
  Sparkles,
  Croissant,
  ArrowRight,
  Loader2
} from 'lucide-react'

export default function ProfileSetup() {
  const { supabase } = useSupabase()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birthdate: '',
    preferences: [] as string[]
  })

  const preferences = [
    { id: 'croissants', label: '🥐 Croissants', icon: '🥐' },
    { id: 'sourdough', label: '🍞 Sourdough', icon: '🍞' },
    { id: 'cakes', label: '🎂 Cakes', icon: '🎂' },
    { id: 'coffee', label: '☕ Coffee', icon: '☕' },
    { id: 'pastries', label: '🥧 Pastries', icon: '🥧' },
    { id: 'cookies', label: '🍪 Cookies', icon: '🍪' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        addToast('error', 'Please sign in first', 3000)
        return
      }

      // Update customer profile
      const { error } = await supabase
        .from('customers')
        .update({
          name: formData.name,
          phone: formData.phone,
          birthdate: formData.birthdate,
          preferences: formData.preferences,
          profile_completed: true
        })
        .eq('user_id', user.id)

      if (error) throw error

      addToast('success', 'Profile completed! Welcome to Dahilia! 🥐', 5000)
      
      // Redirect to dashboard
      window.location.href = '/dashboard/customer'
    } catch (error: any) {
      addToast('error', error.message, 3000)
    } finally {
      setLoading(false)
    }
  }

  const togglePreference = (id: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(id)
        ? prev.preferences.filter(p => p !== id)
        : [...prev.preferences, id]
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFF8F0] via-[#FFF0E0] to-[#F5E6D3]">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#D4A574]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#E07B39]/10 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-3xl shadow-2xl shadow-[#D4A574]/30 mb-4">
            <Croissant className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#4A3728] mb-2">Welcome to Dahilia!</h1>
          <p className="text-[#8B6914] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E07B39]" />
            Complete your profile to start earning rewards
            <Sparkles className="w-4 h-4 text-[#E07B39]" />
          </p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-[#D4A574]/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Name Input */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-[#4A3728] ml-1">
              Your Name *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A574]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4A574] transition-colors"
                required
              />
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-[#4A3728] ml-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A574]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4A574] transition-colors"
              />
            </div>
          </div>

          {/* Birthdate Input */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-semibold text-[#4A3728] ml-1">
              Birthday (for special treats! 🎂)
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4A574]" />
              <input
                type="date"
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#D4A574] transition-colors"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3 mb-8">
            <label className="text-sm font-semibold text-[#4A3728] ml-1">
              Your Favorites (select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {preferences.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePreference(pref.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    formData.preferences.includes(pref.id)
                      ? 'border-[#D4A574] bg-[#D4A574]/10 text-[#8B6914]'
                      : 'border-gray-100 hover:border-[#D4A574]/50 text-gray-600'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading || !formData.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white py-4 rounded-2xl font-semibold shadow-lg shadow-[#D4A574]/30 flex items-center justify-center gap-2 disabled:opacity-70 hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span>Complete Profile</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          <p className="text-center mt-4 text-sm text-gray-500">
            You can update these later in your profile settings
          </p>
        </motion.form>
      </motion.div>
    </div>
  )
}
