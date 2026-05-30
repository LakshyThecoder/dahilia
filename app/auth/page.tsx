'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { 
  Mail, 
  Lock, 
  Croissant, 
  Sparkles, 
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Coffee,
  Wheat
} from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const { supabase } = useSupabase()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Welcome back to Dahilia Oven!' })
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage({ type: 'success', text: 'Check your email for confirmation link!' })
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#FFF8F0] via-[#FFF0E0] to-[#F5E6D3]">
      {/* Warm Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#D4A574]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#E07B39]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-[#8B6914]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] bg-[#B87333]/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Bakery Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#D4A574]/20"
            initial={{ 
              x: Math.random() * 1000, 
              y: Math.random() * 800,
              rotate: Math.random() * 360
            }}
            animate={{ 
              y: [null, -50, 50, -30, 0],
              rotate: [null, 15, -15, 10, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          >
            {i % 3 === 0 ? <Wheat className="w-8 h-8" /> : i % 3 === 1 ? <Coffee className="w-6 h-6" /> : <Sparkles className="w-4 h-4" />}
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4A574] to-[#8B6914] rounded-3xl shadow-2xl shadow-[#D4A574]/30 mb-4 animate-float">
            <Croissant className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#8B6914] to-[#D4A574] bg-clip-text text-transparent">Dahilia Oven</h1>
          <p className="text-[#6B5B4F] flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E07B39]" />
            Artisan Bakery & Café
            <Sparkles className="w-4 h-4 text-[#E07B39]" />
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          className="card-premium"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'bg-white text-[#8B6914] shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-white text-[#8B6914] shadow-md' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleAuth}
              className="space-y-5"
            >
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-premium pl-12 focus:border-[#D4A574]"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-premium pl-12 focus:border-[#D4A574]"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  {isLogin ? 'Enter your password' : 'Min 6 characters'}
                </p>
              </div>

              {/* Message Display */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {message.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#D4A574] to-[#8B6914] text-white py-4 rounded-xl font-semibold shadow-lg shadow-[#D4A574]/30 flex items-center justify-center gap-2 disabled:opacity-70 hover:shadow-xl hover:shadow-[#D4A574]/40 transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Quick Access */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Staff Access</p>
            <Link 
              href="/employee-login"
              className="inline-flex items-center gap-2 text-[#E07B39] hover:text-[#C45A1F] font-medium transition-colors"
            >
              <span>Employee Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-center mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  )
}
