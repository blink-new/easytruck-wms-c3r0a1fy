export interface User {
  id: string
  email: string
  name: string
  role: 'manager' | 'picker' | 'controller'
  avatar?: string
}

export interface Product {
  id: string
  sku: string
  name: string
  barcode: string
  dimensions: {
    length: number
    width: number
    height: number
  }
  weight: number
  supplier: string
  category: string
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  zone: string
  aisle: string
  rack: string
  bin: string
  capacity: number
  occupied: number
  product_id?: string
}

export interface Inventory {
  id: string
  product_id: string
  location_id: string
  quantity: number
  reserved_quantity: number
  available_quantity: number
  last_counted: string
  product?: Product
  location?: Location
}

export interface PurchaseOrder {
  id: string
  po_number: string
  supplier: string
  status: 'pending' | 'receiving' | 'completed'
  expected_date: string
  created_at: string
  items: POItem[]
}

export interface POItem {
  id: string
  po_id: string
  product_id: string
  expected_quantity: number
  received_quantity: number
  product?: Product
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  status: 'pending' | 'picking' | 'packing' | 'shipped'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  picked_quantity: number
  product?: Product
}

export interface DashboardMetrics {
  orders_to_pick: number
  orders_to_ship: number
  receiving_volume: number
  inventory_value: number
  picker_accuracy: number
  fulfillment_time: number
}