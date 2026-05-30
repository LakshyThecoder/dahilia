export interface Restaurant {
  id: string
  name: string
  slug: string
  logo?: string
  whatsapp_number?: string
  subscription_plan: string
  created_at: string
}

export interface Customer {
  id: string
  restaurant_id: string
  phone_number: string
  name?: string
  qr_token: string
  total_points: number
  total_spent: number
  visit_count: number
  last_visit_at?: string
  created_at: string
}

export interface Transaction {
  id: string
  customer_id: string
  restaurant_id: string
  amount: number
  points_earned: number
  points_redeemed: number
  reward_redeemed_id?: string
  created_by_employee?: string
  created_at: string
}

export interface Reward {
  id: string
  restaurant_id: string
  reward_name: string
  description?: string
  points_required: number
  reward_type: 'discount' | 'free_item' | 'percentage_off'
  discount_value?: number
  active: boolean
  created_at: string
}

export interface Campaign {
  id: string
  restaurant_id: string
  title: string
  message: string
  target_segment?: string
  delivery_channel: string
  scheduled_at?: string
  sent_at?: string
  status: 'draft' | 'scheduled' | 'sent'
  created_at: string
}

export interface Employee {
  id: string
  restaurant_id: string
  name: string
  email?: string
  role: 'owner' | 'manager' | 'staff'
  pin_code?: string
  active: boolean
}
