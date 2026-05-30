export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string
          name: string
          slug: string
          logo: string | null
          whatsapp_number: string | null
          subscription_plan: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo?: string | null
          whatsapp_number?: string | null
          subscription_plan?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          logo?: string | null
          whatsapp_number?: string | null
          subscription_plan?: string
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string | null
          email: string
          name: string | null
          qr_token: string
          total_points: number
          total_spent: number
          visit_count: number
          last_visit_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id?: string | null
          email: string
          name?: string | null
          qr_token: string
          total_points?: number
          total_spent?: number
          visit_count?: number
          last_visit_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string | null
          email?: string
          name?: string | null
          qr_token?: string
          total_points?: number
          total_spent?: number
          visit_count?: number
          last_visit_at?: string | null
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          customer_id: string
          restaurant_id: string
          amount: number
          points_earned: number
          points_redeemed: number
          reward_redeemed_id: string | null
          created_by_employee: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          restaurant_id: string
          amount: number
          points_earned?: number
          points_redeemed?: number
          reward_redeemed_id?: string | null
          created_by_employee?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          restaurant_id?: string
          amount?: number
          points_earned?: number
          points_redeemed?: number
          reward_redeemed_id?: string | null
          created_by_employee?: string | null
          created_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          restaurant_id: string
          reward_name: string
          description: string | null
          points_required: number
          reward_type: 'discount' | 'free_item' | 'percentage_off'
          discount_value: number | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          reward_name: string
          description?: string | null
          points_required: number
          reward_type: 'discount' | 'free_item' | 'percentage_off'
          discount_value?: number | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          reward_name?: string
          description?: string | null
          points_required?: number
          reward_type?: 'discount' | 'free_item' | 'percentage_off'
          discount_value?: number | null
          active?: boolean
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string | null
          name: string
          email: string | null
          role: 'owner' | 'manager' | 'staff'
          pin_code: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id?: string | null
          name: string
          email?: string | null
          role: 'owner' | 'manager' | 'staff'
          pin_code?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          role?: 'owner' | 'manager' | 'staff'
          pin_code?: string | null
          active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
