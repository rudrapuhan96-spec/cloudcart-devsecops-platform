import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'

import Overview from './pages/Overview'
import Architecture from './pages/Architecture'
import Security from './pages/Security'
import CICD from './pages/CICD'
import Observability from './pages/Observability'
import Evidence from './pages/Evidence'
import Docs from './pages/Docs'

import Store from './pages/Store'
import Cart from './pages/Cart'
import Orders from './pages/Orders'

const navItems = [
  { label: 'Overview', path: '/overview' },
  { label: 'Architecture', path: '/architecture' },
  { label: 'Security', path: '/security' },
  { label: 'CI/CD', path: '/cicd' },
  { label: 'Observability', path: '/observability' },
  { label: 'Evidence', path: '/evidence' },
  { label: 'Docs', path: '/docs' },
]

const shopItems = [
  { label: 'Store', path: '/store' },
  { label: 'Cart', path: '/cart' },
  { label: 'Orders', path: '/orders' },
]

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <BrowserRouter>
          <div className="app">
            <header className="header">
              <div className="container header-inner">
                <NavLink to="/overview" className="brand">
                  <div className="brand-mark">C</div>

                  <div className="brand-text">
                    <span className="brand-name">CLOUDCART</span>

                    <span className="brand-author">
                      Engineered by Rudra Shankar Puhan
                    </span>
                  </div>
                </NavLink>

                <nav
                  className="nav"
                  aria-label="Main navigation"
                >
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? 'nav-link active'
                          : 'nav-link'
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  <span className="nav-divider" />

                  {shopItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        isActive
                          ? 'nav-link shop-link active'
                          : 'nav-link shop-link'
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <a
                  className="header-button"
                  href="https://github.com/rudrapuhan96-spec"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </div>
            </header>

            <main>
              <Routes>
                <Route
                  path="/"
                  element={<Overview />}
                />

                <Route
                  path="/overview"
                  element={<Overview />}
                />

                <Route
                  path="/architecture"
                  element={<Architecture />}
                />

                <Route
                  path="/security"
                  element={<Security />}
                />

                <Route
                  path="/cicd"
                  element={<CICD />}
                />

                <Route
                  path="/observability"
                  element={<Observability />}
                />

                <Route
                  path="/evidence"
                  element={<Evidence />}
                />

                <Route
                  path="/docs"
                  element={<Docs />}
                />

                <Route
                  path="/store"
                  element={<Store />}
                />

                <Route
                  path="/cart"
                  element={<Cart />}
                />

                <Route
                  path="/orders"
                  element={<Orders />}
                />

                <Route
                  path="*"
                  element={<Overview />}
                />
              </Routes>
            </main>

            <footer className="footer">
              <div className="container footer-inner">
                <p>
                  CloudCart — Secure Cloud-Native DevSecOps Platform
                </p>

                <div className="footer-links">
                  <NavLink to="/overview">
                    Overview
                  </NavLink>

                  <NavLink to="/docs">
                    Documentation
                  </NavLink>

                  <NavLink to="/store">
                    Store
                  </NavLink>

                  <NavLink to="/cart">
                    Cart
                  </NavLink>

                  <NavLink to="/orders">
                    Orders
                  </NavLink>

                  <a
                    href="https://github.com/rudrapuhan96-spec"
                    target="_blank"
                    rel="noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </OrderProvider>
    </CartProvider>
  )
}

export default App