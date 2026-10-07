import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export type OrderItem = {
  id: number
  name: string
  category: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  createdAt: string
  status: 'Processing' | 'Delivered'
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

type CreateOrderInput = {
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
}

type OrderContextType = {
  orders: Order[]
  createOrder: (input: CreateOrderInput) => Order
  getOrder: (orderId: string) => Order | undefined
}

const OrderContext = createContext<OrderContextType | undefined>(
  undefined,
)

const STORAGE_KEY = 'cloudcart-orders'

function generateOrderId() {
  const timestamp = Date.now().toString().slice(-8)

  return `CC-${new Date().getFullYear()}-${timestamp}`
}

export function OrderProvider({
  children,
}: {
  children: ReactNode
}) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const createOrder = ({
    items,
    subtotal,
    deliveryFee,
  }: CreateOrderInput) => {
    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    }

    setOrders((currentOrders) => [
      order,
      ...currentOrders,
    ])

    return order
  }

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId)
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)

  if (!context) {
    throw new Error(
      'useOrders must be used inside OrderProvider',
    )
  }

  return context
}