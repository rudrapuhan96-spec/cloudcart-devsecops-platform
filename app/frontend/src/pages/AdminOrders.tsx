import { useState } from 'react'
import './AdminOrders.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

type AdminOrder = {
  id: string
  createdAt: string
  expectedDeliveryAt: string
  status: string
  customer: { name: string; email: string; phone: string }
  deliveryAddress: { line1: string; line2: string; city: string; district: string; state: string; pincode: string; latitude: number | null; longitude: number | null }
  paymentMethod: string
  paymentStatus: string
  items: Array<{ id: number; name: string; quantity: number; price: number }>
  total: number
}

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [key, setKey] = useState(sessionStorage.getItem('cloudcart-admin-key') || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  const load = async (adminKey = key) => {
    setLoading(true); setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`, { headers: { 'x-admin-key': adminKey } })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to load orders')
      sessionStorage.setItem('cloudcart-admin-key', adminKey)
      setOrders(data.orders)
      setSelected(data.orders[0] ?? null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load orders')
    } finally { setLoading(false) }
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-head"><div><span>CloudCart Admin</span><h1>Order Operations</h1><p>See who ordered, when they ordered, what they bought and where it should be delivered.</p></div><button onClick={() => { sessionStorage.removeItem('cloudcart-admin-key'); setKey(''); setOrders([]); setSelected(null) }}>Clear session</button></div>
        {!key || !orders.length && !loading ? <section className="admin-login"><h2>Admin access</h2><p>Enter the local admin API key configured on the backend.</p><input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="ADMIN_API_KEY"/><button onClick={() => void load()} disabled={!key}>Open Orders</button></section> : null}
        {error && <div className="admin-error">{error}</div>}
        {loading ? <div className="admin-muted">Loading orders…</div> : null}
        {orders.length > 0 ? <div className="admin-grid"><section className="admin-list"><div className="admin-list-title">Latest orders · {orders.length}</div>{orders.map((order) => <button className={`admin-order ${selected?.id === order.id ? 'selected' : ''}`} key={order.id} onClick={() => setSelected(order)}><div><strong>{order.id}</strong><span>{new Date(order.createdAt).toLocaleString('en-IN')}</span></div><div><strong>{order.customer.name}</strong><span>{order.status} · ₹{order.total.toLocaleString('en-IN')}</span></div></button>)}</section>{selected ? <aside className="admin-detail"><div className="detail-top"><div><span>ORDER</span><h2>{selected.id}</h2></div><strong>{selected.status}</strong></div><div className="detail-cards"><div><span>Customer</span><strong>{selected.customer.name}</strong><p>{selected.customer.phone}<br />{selected.customer.email}</p></div><div><span>Ordered at</span><strong>{new Date(selected.createdAt).toLocaleString('en-IN')}</strong><p>Expected by<br />{new Date(selected.expectedDeliveryAt).toLocaleString('en-IN')}</p></div><div className="full"><span>Delivery location</span><strong>{selected.deliveryAddress.line1}{selected.deliveryAddress.line2 ? `, ${selected.deliveryAddress.line2}` : ''}</strong><p>{selected.deliveryAddress.city}, {selected.deliveryAddress.district}, {selected.deliveryAddress.state} — {selected.deliveryAddress.pincode}</p>{selected.deliveryAddress.latitude != null && selected.deliveryAddress.longitude != null ? <p>GPS: {selected.deliveryAddress.latitude.toFixed(6)}, {selected.deliveryAddress.longitude.toFixed(6)}</p> : <p>GPS: not provided</p>}</div><div className="full"><span>Items</span>{selected.items.map((item) => <p key={item.id}>{item.name} × {item.quantity} · ₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>)}</div><div><span>Payment</span><strong>{selected.paymentMethod}</strong><p>Status: {selected.paymentStatus}</p></div><div><span>Total</span><strong>₹{selected.total.toLocaleString('en-IN')}</strong></div></div></aside> : null}</div> : null}
      </div>
    </main>
  )
}

export default AdminOrders
