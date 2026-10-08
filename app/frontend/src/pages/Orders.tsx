import { useEffect, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import './Orders.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

type Order = {
  id: string
  createdAt: string
  expectedDeliveryAt: string
  status: string
  customer: { name: string; email: string; phone: string }
  deliveryAddress: { line1: string; line2: string; city: string; district: string; state: string; pincode: string; latitude: number | null; longitude: number | null }
  paymentMethod: string
  paymentStatus: string
  items: Array<{ id: number; name: string; category: string; price: number; quantity: number }>
  subtotal: number
  deliveryFee: number
  total: number
}

function Orders() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(Boolean(orderId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) { setLoading(false); return }
    const token = localStorage.getItem(`cloudcart-order-token:${orderId}`)
    if (!token) { setError('This order cannot be opened in this browser session.'); setLoading(false); return }

    const load = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`, { headers: { 'x-order-token': token } })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Unable to load order')
        setOrder(data.order)
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load order')
      } finally { setLoading(false) }
    }
    void load()
  }, [orderId])

  if (loading) return <main className="orders-v2"><div className="orders-v2-shell"><p>Loading your order…</p></div></main>
  if (error || !order) return <main className="orders-v2"><div className="orders-v2-shell"><span className="orders-v2-kicker">CLOUDCART ORDER CENTER</span><h1>Order tracking</h1><div className="orders-v2-error">{error || 'No order selected.'}</div><NavLink className="orders-v2-button" to="/store">Back to Store</NavLink></div></main>

  const emailState = localStorage.getItem(`cloudcart-order-email:${order.id}`)

  return (
    <main className="orders-v2">
      <div className="orders-v2-shell">
        <div className="orders-v2-top"><div><span className="orders-v2-kicker">ORDER CONFIRMED</span><h1>Your order is in motion.</h1><p>No action required. We have your order details and delivery address.</p></div><div className="orders-v2-status"><span>STATUS</span><strong>{order.status}</strong></div></div>
        {emailState === 'sent' ? <div className="orders-v2-mail">✉ Confirmation email sent to <strong>{order.customer.email}</strong></div> : emailState === 'not-configured' ? <div className="orders-v2-mail warning">Order confirmed. Email delivery is not configured on this local environment yet.</div> : null}
        <section className="orders-v2-banner"><div><span>ORDER ID</span><strong>{order.id}</strong></div><div><span>ORDERED AT</span><strong>{new Date(order.createdAt).toLocaleString('en-IN')}</strong></div><div><span>EXPECTED DELIVERY</span><strong>By {new Date(order.expectedDeliveryAt).toLocaleString('en-IN')}</strong></div></section>
        <section className="orders-v2-grid">
          <div className="orders-v2-card"><span className="orders-v2-kicker">CUSTOMER</span><h2>{order.customer.name}</h2><p>{order.customer.phone}<br />{order.customer.email}</p></div>
          <div className="orders-v2-card"><span className="orders-v2-kicker">DELIVERY</span><h2>Deliver to this address</h2><p>{order.deliveryAddress.line1}{order.deliveryAddress.line2 ? `, ${order.deliveryAddress.line2}` : ''}<br />{order.deliveryAddress.city}, {order.deliveryAddress.district}<br />{order.deliveryAddress.state} — {order.deliveryAddress.pincode}</p>{order.deliveryAddress.latitude != null && order.deliveryAddress.longitude != null ? <small>GPS captured: {order.deliveryAddress.latitude.toFixed(5)}, {order.deliveryAddress.longitude.toFixed(5)}</small> : <small>GPS not provided; address is used for delivery.</small>}</div>
        </section>
        <section className="orders-v2-card"><span className="orders-v2-kicker">TRACKING</span><div className="orders-v2-timeline"><div className="done"><b>01</b><div><strong>Order placed</strong><span>{new Date(order.createdAt).toLocaleString('en-IN')}</span></div></div><div className="done"><b>02</b><div><strong>Order confirmed</strong><span>Details validated and saved</span></div></div><div className="current"><b>03</b><div><strong>Processing</strong><span>Our current order state</span></div></div><div><b>04</b><div><strong>Out for delivery</strong><span>Will appear when status changes</span></div></div><div><b>05</b><div><strong>Delivered</strong><span>Will appear when the order is completed</span></div></div></div></section>
        <section className="orders-v2-grid"><div className="orders-v2-card"><span className="orders-v2-kicker">ITEMS</span>{order.items.map((item) => <div className="orders-v2-item" key={item.id}><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></div>)}</div><div className="orders-v2-card"><span className="orders-v2-kicker">PAYMENT</span><h2>{order.paymentMethod}</h2><p>Status: {order.paymentStatus}</p><div className="orders-v2-total"><span>Total</span><strong>₹{order.total.toLocaleString('en-IN')}</strong></div></div></section>
        <NavLink className="orders-v2-button" to="/store">Continue Shopping</NavLink>
      </div>
    </main>
  )
}

export default Orders
