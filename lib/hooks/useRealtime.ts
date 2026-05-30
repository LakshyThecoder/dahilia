'use client'

import { useEffect, useCallback, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'

export function useRealtimeTransactions(customerId: string | null, onUpdate: (payload: any) => void) {
  const { supabase } = useSupabase()

  useEffect(() => {
    if (!customerId) return

    const channel = supabase
      .channel(`transactions:${customerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `customer_id=eq.${customerId}`,
        },
        (payload) => {
          onUpdate(payload.new)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [customerId, supabase, onUpdate])
}

export function useRealtimeCustomers(restaurantId: string, onUpdate: (payload: any) => void) {
  const { supabase } = useSupabase()

  useEffect(() => {
    const channel = supabase
      .channel(`customers:${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          onUpdate(payload)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [restaurantId, supabase, onUpdate])
}

export function useRealtimeCampaigns(restaurantId: string, onUpdate: (payload: any) => void) {
  const { supabase } = useSupabase()

  useEffect(() => {
    const channel = supabase
      .channel(`campaigns:${restaurantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaigns',
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        (payload) => {
          onUpdate(payload.new)
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [restaurantId, supabase, onUpdate])
}

// Optimistic update helper
export function useOptimisticUpdate<T>(
  initialData: T[],
  updateFn: (data: T[], update: T) => T[]
) {
  const [data, setData] = useState<T[]>(initialData)
  const [pendingUpdates, setPendingUpdates] = useState<T[]>([])

  const optimisticUpdate = useCallback((update: T) => {
    setPendingUpdates((prev) => [...prev, update])
    setData((prev) => updateFn(prev, update))
  }, [updateFn])

  const confirmUpdate = useCallback((update: T) => {
    setPendingUpdates((prev) => prev.filter((u) => u !== update))
  }, [])

  const revertUpdate = useCallback((update: T) => {
    setPendingUpdates((prev) => prev.filter((u) => u !== update))
    setData((prev) => prev.filter((item) => item !== update))
  }, [])

  return { data, setData, optimisticUpdate, confirmUpdate, revertUpdate, pendingUpdates }
}
