import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Checkout.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

type Coordinates = { latitude: number; longitude: number }

function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', line1: '', line2: '', city: '', district: '', state: 'Odisha', pincode: '',
  })

  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 2000 ? 0 : 99
  const total = subtotal + deliveryFee

  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }))

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location access.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        setLocating(false)
      },
      (geoError) => {
        setError(geoError.message || 'Location permission was not granted.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const placeOrder = async (event: FormEvent) => {
    event.preventDefault()
    if (!items.length) return navigate('/store')

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer: { name: form.name, email: form.email, phone: form.phone },
          deliveryAddress: { ...form, latitude: location?.latitude ?? null, longitude: location?.longitude ?? null },
          paymentMethod: 'Pay on Delivery',
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to place order')

      localStorage.setItem(`cloudcart-order-token:${data.order.id}`, data.trackingToken)
      localStorage.setItem(`cloudcart-order-email:${data.order.id}`, data.emailSent ? 'sent' : 'not-configured')
      clearCart()
      navigate(`/orders?order=${encodeURIComponent(data.order.id)}`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (!items.length) {
    return <main className="checkout-page"><section className="checkout-shell"><h1>Your cart is empty.</h1><button onClick={() => navigate('/store')}>Back to Store</button></section></main>
  }

  return (
    <main className="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-head"><span>CloudCart Checkout</span><h1>Where should we deliver<br /><em>your order?</em></h1><p>We do not collect online payment. Give us your contact and delivery details so we can process the order.</p></div>
        <form className="checkout-grid" onSubmit={placeOrder}>
          <section className="checkout-card">
            <div className="checkout-card-label">01 · CONTACT</div>
            <div className="checkout-fields two">
              <label>Full name<input required value={form.name} onChange={(e) => update('name', e.target.value)} /></label>
              <label>Phone number<input required inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile" /></label>
              <label className="wide">Email address<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-label">02 · DELIVERY ADDRESS</div>
            <div className="checkout-fields two">
              <label className="wide">House / Flat / Building<input required value={form.line1} onChange={(e) => update('line1', e.target.value)} /></label>
              <label className="wide">Area / Street (optional)<input value={form.line2} onChange={(e) => update('line2', e.target.value)} /></label>
              <label>City<input required value={form.city} onChange={(e) => update('city', e.target.value)} /></label>
              <label>District<input required value={form.district} onChange={(e) => update('district', e.target.value)} /></label>
              <label>State<input required value={form.state} onChange={(e) => update('state', e.target.value)} /></label>
              <label>PIN code<input required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} /></label>
            </div>
            <button className="location-button" type="button" onClick={useCurrentLocation} disabled={locating}>{locating ? 'Getting location…' : '📍 Use my current location'}</button>
            {location && <small className="location-ok">Location captured: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</small>}
            <p className="privacy-note">Location access is optional. The written delivery address is still required.</p>
          </section>

          <aside className="checkout-card summary-card">
            <div className="checkout-card-label">03 · ORDER SUMMARY</div>
            <div className="summary-items">{items.map((item) => <div key={item.id}><span>{item.name} × {item.quantity}</span><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></div>)}</div>
            <div className="summary-row"><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div>
            <div className="summary-row"><span>Delivery</span><strong>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</strong></div>
            <div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
            <div className="payment-note"><strong>Payment</strong><span>Pay on Delivery</span></div>
            <p className="delivery-note">Expected delivery: within 24 hours of placing the order.</p>
            {error && <div className="checkout-error">{error}</div>}
            <button className="place-order-button" type="submit" disabled={submitting}>{submitting ? 'Placing order…' : 'Place Order →'}</button>
          </aside>
        </form>
      </div>
    </main>
  )
}

export default Checkout

