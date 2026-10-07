import { NavLink, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

type OrderItem = {
  id: number
  name: string
  category: string
  price: number
  quantity: number
}

type Order = {
  id: string
  createdAt: string
  status: 'Processing'
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:4000/api'

const trackingStages = [
  {
    number: '01',
    title: 'Order placed',
    description:
      'Order request accepted and validated by the backend.',
  },
  {
    number: '02',
    title: 'Database persistence',
    description:
      'Order and order items are persisted in MySQL.',
  },
  {
    number: '03',
    title: 'Processing',
    description:
      'Order is ready for the future event-driven workflow.',
  },
  {
    number: '04',
    title: 'Fulfillment',
    description:
      'Future worker and fulfillment services will process the order.',
  },
  {
    number: '05',
    title: 'Completed',
    description:
      'Future workflow will update the final order state.',
  },
]

function Orders() {
  const [searchParams] = useSearchParams()

  const requestedOrderId = searchParams.get('order')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(
    Boolean(requestedOrderId),
  )
  const [error, setError] = useState('')

  const loadOrder = useCallback(async () => {
    if (!requestedOrderId) {
      setOrder(null)
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${encodeURIComponent(
          requestedOrderId,
        )}`,
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to load order',
        )
      }

      setOrder(data.order)
    } catch (requestError) {
      console.error('Order loading failed:', requestError)

      setOrder(null)

      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to load order',
      )
    } finally {
      setLoading(false)
    }
  }, [requestedOrderId])

  useEffect(() => {
    loadOrder()
  }, [loadOrder])

  const activeStageIndex =
    order?.status === 'Processing' ? 2 : 0

  return (
    <div className="orders-page">
      {/* HERO */}
      <section className="section orders-hero">
        <div className="container">
          <div className="orders-hero-grid">
            <div>
              <div className="section-kicker">
                Order Center
              </div>

              <h1 className="orders-title">
                Track the
                <br />
                <span>complete order flow.</span>
              </h1>

              <p className="section-description orders-description">
                Orders created through the CloudCart checkout flow
                are validated by the backend and persisted in MySQL.
                The next phases will add asynchronous processing,
                notifications, authentication and AWS deployment.
              </p>

              <div className="hero-actions">
                <NavLink
                  to="/store"
                  className="primary-button"
                >
                  Continue Shopping
                </NavLink>

                <NavLink
                  to="/cart"
                  className="secondary-button"
                >
                  View Cart
                </NavLink>
              </div>
            </div>

            {loading ? (
              <div className="order-id-card">
                <span>ORDER CENTER</span>

                <strong>Loading...</strong>

                <div className="order-card-total">
                  <small>API</small>

                  <strong>CONNECTING</strong>
                </div>
              </div>
            ) : order ? (
              <div className="order-id-card">
                <span>SELECTED ORDER</span>

                <strong>{order.id}</strong>

                <div className="order-card-status">
                  <i />
                  {order.status}
                </div>

                <div className="order-card-total">
                  <small>ORDER TOTAL</small>

                  <strong>
                    ₹{order.total.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="order-id-card">
                <span>ORDER CENTER</span>

                <strong>
                  {requestedOrderId
                    ? 'Order unavailable'
                    : 'No order selected'}
                </strong>

                <div className="order-card-total">
                  <small>STATUS</small>

                  <strong>
                    {requestedOrderId
                      ? 'FAILED'
                      : 'READY'}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <section className="section">
          <div className="container">
            <div className="cart-empty">
              <div className="cart-empty-mark">
                CC
              </div>

              <div>
                <div className="section-kicker">
                  ORDER LOOKUP
                </div>

                <h2>Loading your order...</h2>

                <p>
                  CloudCart is requesting the selected order
                  from the backend API.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="section">
          <div className="container">
            <div className="cart-empty">
              <div className="cart-empty-mark">
                !
              </div>

              <div>
                <div className="section-kicker">
                  ORDER LOOKUP FAILED
                </div>

                <h2>Unable to load this order.</h2>

                <p>{error}</p>

                <div className="hero-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={loadOrder}
                  >
                    Retry
                  </button>

                  <NavLink
                    to="/store"
                    className="secondary-button"
                  >
                    Browse Store
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* NO ORDER SELECTED */}
      {!loading &&
        !error &&
        !order &&
        !requestedOrderId && (
          <section className="section">
            <div className="container">
              <div className="cart-empty">
                <div className="cart-empty-mark">
                  CC
                </div>

                <div>
                  <div className="section-kicker">
                    ORDER CENTER
                  </div>

                  <h2>No order selected.</h2>

                  <p>
                    Create an order from your cart. Checkout
                    will return the generated order ID and
                    this page will retrieve the order from
                    the backend.
                  </p>

                  <NavLink
                    to="/store"
                    className="primary-button"
                  >
                    Browse Store
                  </NavLink>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* SELECTED ORDER */}
      {!loading && !error && order && (
        <>
          <section className="section">
            <div className="container">
              <div className="order-section-heading">
                <div>
                  <div className="section-kicker">
                    Current Order
                  </div>

                  <h2 className="section-title">
                    {order.id}
                  </h2>
                </div>

                <div className="order-meta">
                  <span>
                    {new Date(
                      order.createdAt,
                    ).toLocaleString('en-IN')}
                  </span>

                  <strong>{order.status}</strong>
                </div>
              </div>

              <div className="order-overview">
                <div className="order-items">
                  {order.items.map((item) => (
                    <article
                      className="order-item"
                      key={`${order.id}-${item.id}`}
                    >
                      <div className="order-item-visual">
                        <span>CC</span>
                      </div>

                      <div className="order-item-info">
                        <div>{item.name}</div>

                        <small>
                          {item.category} · Quantity:{' '}
                          {item.quantity}
                        </small>
                      </div>

                      <strong>
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString('en-IN')}
                      </strong>
                    </article>
                  ))}
                </div>

                <div className="order-summary">
                  <span>ORDER VALUE</span>

                  <strong>
                    ₹
                    {order.total.toLocaleString(
                      'en-IN',
                    )}
                  </strong>

                  <small>
                    Subtotal: ₹
                    {order.subtotal.toLocaleString(
                      'en-IN',
                    )}
                    <br />
                    Delivery:{' '}
                    {order.deliveryFee === 0
                      ? 'FREE'
                      : `₹${order.deliveryFee}`}
                  </small>
                </div>
              </div>
            </div>
          </section>

          {/* TRACKING TIMELINE */}
          <section className="section">
            <div className="container">
              <div className="order-section-heading">
                <div>
                  <div className="section-kicker">
                    Order Lifecycle
                  </div>

                  <h2 className="section-title">
                    Processing pipeline
                  </h2>
                </div>

                <p className="section-description">
                  The current backend persists the order and
                  returns its processing state. Event-driven
                  fulfillment will be added in a later phase.
                </p>
              </div>

              <div className="order-timeline">
                {trackingStages.map(
                  (stage, index) => {
                    const isActive =
                      index <= activeStageIndex

                    return (
                      <div
                        className={
                          isActive
                            ? 'order-timeline-step active'
                            : 'order-timeline-step'
                        }
                        key={stage.number}
                      >
                        <div className="timeline-marker">
                          {stage.number}
                        </div>

                        <div className="timeline-content">
                          <strong>
                            {stage.title}
                          </strong>

                          <span>
                            {stage.description}
                          </span>
                        </div>

                        {index <
                          trackingStages.length -
                            1 && (
                          <div
                            className={
                              index <
                              activeStageIndex
                                ? 'timeline-connector active'
                                : 'timeline-connector'
                            }
                          />
                        )}
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </section>

          {/* DATABASE DETAILS */}
          <section className="section">
            <div className="container">
              <div className="order-engineering-note">
                <div>
                  <div className="section-kicker">
                    Persistence Layer
                  </div>

                  <h2>
                    The order now has durable backend
                    storage.
                  </h2>

                  <p>
                    Checkout sends product IDs and
                    quantities to the CloudCart API. The
                    backend validates the request, resolves
                    authoritative product prices, calculates
                    the totals, writes the order and its
                    line items to MySQL, and returns the
                    generated order ID.
                  </p>
                </div>

                <div className="order-roadmap">
                  <div>
                    <span>DONE</span>
                    <strong>React Cart</strong>
                  </div>

                  <div>
                    <span>DONE</span>
                    <strong>Order API</strong>
                  </div>

                  <div>
                    <span>DONE</span>
                    <strong>MySQL</strong>
                  </div>

                  <div>
                    <span>NEXT</span>
                    <strong>SQS Workflow</strong>
                  </div>

                  <div>
                    <span>FINAL</span>
                    <strong>AWS Runtime</strong>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* NAVIGATION */}
      <section className="section">
        <div className="container">
          <div className="orders-nav">
            <NavLink
              to="/store"
              className="primary-button"
            >
              Back to Store
            </NavLink>

            <NavLink
              to="/cart"
              className="secondary-button"
            >
              Open Cart
            </NavLink>

            <NavLink
              to="/docs"
              className="secondary-button"
            >
              Documentation
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Orders