import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Dahilia Oven | Artisan Bakery Loyalty',
  description: 'Join Dahilia Oven\'s loyalty program and earn rewards with every artisan bake. Fresh pastries, exclusive offers, and warm community.',
  keywords: ['bakery', 'pastry', 'loyalty program', 'artisan bread', 'Dahilia Oven', 'café', 'rewards'],
  authors: [{ name: 'Dahilia Oven' }],
  openGraph: {
    title: 'Dahilia Oven | Artisan Bakery Loyalty Program',
    description: 'Earn points with every purchase and unlock exclusive bakery rewards.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <SupabaseProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
