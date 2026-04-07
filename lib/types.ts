export interface WeightPrice {
  label: string
  price: number
}

export interface Product {
  id: number
  name: string
  emoji: string
  image_url: string | null
  price: number | null
  category: 'fresco' | 'confezionato' | 'surgelato'
  origin: 'indiano' | 'africano' | 'italiano' | 'internazionale'
  description: string | null
  is_top: boolean
  available: boolean
  weight_prices: WeightPrice[] | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedWeight?: WeightPrice
}

export interface Order {
  id: string
  user_id: string | null
  customer_name: string
  customer_surname: string
  customer_email: string | null
  customer_phone: string
  address: string | null
  city: string | null
  cap: string | null
  delivery_type: 'ritiro' | 'domicilio'
  delivery_price: number
  items: CartItem[]
  total: number
  status: 'preparazione' | 'spedito' | 'consegnato' | 'annullato'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  name: string | null
  surname: string | null
  phone: string | null
  address: string | null
  city: string | null
  cap: string | null
  updated_at: string
}

export interface AdminUser {
  id: number
  email: string
  created_at: string
}
