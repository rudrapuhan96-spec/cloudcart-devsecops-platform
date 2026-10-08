import { NavLink, useNavigate } from 'react-router-dom'

import { useCart } from '../context/CartContext'

function Cart() {
  const navigate = useNavigate()

  const {
    items,
    subtotal,
    totalItems,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart()
  const deliveryFee =
    subtotal === 0
      ? 0
      : subtotal >= 2000
        ? 0
        : 99

  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    if (items.length === 0) return
    navigate('/checkout')
  }

  return (
    <div className="cart-page">
      {/* HEADER */}
      <section className="cart-header">
        <div className="container">
          <div className="section-kicker">CloudCart Cart</div>

          <div className="cart-heading">
            <div>
              <h1 className="cart-title">
                Your
                <br />
                <span>shopping bag.</span>
              </h1>

              <p className="cart-description">
                Review your selected products, adjust quantities,
                and continue to the backend order workflow.
              </p>
            </div>

            <div className="cart-count-panel">
              <span>ITEMS</span>
              <strong>{totalItems}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* EMPTY CART */}
      {items.length === 0 ? (
        <section className="section">
          <div className="container">
            <div className="cart-empty">
              <div className="cart-empty-mark">CC</div>

              <div>
                <div className="section-kicker">
                  CART STATUS
                </div>

                <h2>Your cart is empty.</h2>

                <p>
                  Add a product from the CloudCart Store and it
                  will appear here.
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
      ) : (
        <section className="section cart-content">
          <div className="container">
            <div className="cart-layout">
              {/* ITEMS */}
              <div className="cart-items-panel">
                <div className="cart-panel-header">
                  <div>
                    <span>ORDER ITEMS</span>

                    <strong>
                      {totalItems} item
                      {totalItems !== 1 ? 's' : ''}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="cart-clear-button"
                    onClick={clearCart}
                  >
                    Clear cart
                  </button>
                </div>

                <div className="cart-items">
                  {items.map((item) => (
                    <article
                      className="cart-item"
                      key={item.id}
                    >
                      <div className="cart-item-visual">
                        <span>CC</span>
                      </div>

                      <div className="cart-item-main">
                        <div className="cart-item-category">
                          {item.category}
                        </div>

                        <h2>{item.name}</h2>

                        <div className="cart-item-price">
                          â‚¹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                            )
                          }
                        >
                          âˆ’
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-total">
                        <strong>
                          â‚¹
                          {(
                            item.price * item.quantity
                          ).toLocaleString('en-IN')}
                        </strong>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* SUMMARY */}
              <aside className="cart-summary">
                <div className="cart-summary-label">
                  ORDER SUMMARY
                </div>

                <h2>Checkout summary</h2>

                <div className="cart-summary-row">
                  <span>Items</span>
                  <strong>{totalItems}</strong>
                </div>

                <div className="cart-summary-row">
                  <span>Subtotal</span>

                  <strong>
                    â‚¹{subtotal.toLocaleString('en-IN')}
                  </strong>
                </div>

                <div className="cart-summary-row">
                  <span>Delivery</span>

                  <strong>
                    {deliveryFee === 0
                      ? 'FREE'
                      : `â‚¹${deliveryFee}`}
                  </strong>
                </div>

                <div className="cart-summary-divider" />

                <div className="cart-summary-total">
                  <span>Total</span>

                  <strong>
                    â‚¹{total.toLocaleString('en-IN')}
                  </strong>
                </div>
<button
                  type="button"
                  className="cart-checkout-button"
                  onClick={handleCheckout}
                >
                  Create Order
                </button>

                <NavLink
                  to="/store"
                  className="cart-continue-link"
                >
                  â† Continue shopping
                </NavLink>

                <div className="cart-security-note">
                  <span>BACKEND ORDER FLOW</span>

                  <p>
                    Checkout sends only product IDs and quantities
                    to the CloudCart API. The backend validates the
                    request, resolves product data, calculates the
                    authoritative price, and returns the order ID.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ENGINEERING DETAIL */}
      <section className="section">
        <div className="container">
          <div className="cart-engineering">
            <div>
              <div className="section-kicker">
                Application Flow
              </div>

              <h2>
                Cart state now feeds the backend order workflow.
              </h2>

              <p>
                React Context manages the active cart, while
                checkout sends product IDs and quantities to the
                backend API. The server performs validation,
                product lookup, pricing and order creation.
              </p>
            </div>

            <div className="cart-state-flow">
              <div>
                <span>01</span>
                <strong>Store</strong>
                <small>Load products</small>
              </div>

              <div>â†’</div>

              <div>
                <span>02</span>
                <strong>Cart</strong>
                <small>Review items</small>
              </div>

              <div>â†’</div>

              <div>
                <span>03</span>
                <strong>Order API</strong>
                <small>Validate + calculate</small>
              </div>

              <div>â†’</div>

              <div>
                <span>04</span>
                <strong>Orders</strong>
                <small>Retrieve order</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NAV */}
      <section className="section">
        <div className="container">
          <div className="cart-nav">
            <NavLink
              to="/store"
              className="primary-button"
            >
              Back to Store
            </NavLink>

            <NavLink
              to="/orders"
              className="secondary-button"
            >
              Order Center
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Cart



