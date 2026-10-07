import { useEffect, useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Store.css'

type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  badge?: string
}

type ProductsResponse = {
  count: number
  products: Product[]
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

function Store() {
  const { addToCart, totalItems } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_BASE_URL}/products`)
        const data: ProductsResponse = await response.json()

        if (!response.ok) {
          throw new Error('Unable to load products')
        }

        setProducts(data.products)
      } catch (err) {
        console.error('Product loading failed:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load products',
        )
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category)),
    )

    return ['All', ...uniqueCategories]
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        category === 'All' || product.category === category

      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [products, query, category])

  return (
    <main className="store-page">
      <section className="store-header">
        <div className="store-container">
          <div className="store-top">
            <div className="store-intro">
              <div className="store-kicker">
                CLOUDCART STORE
              </div>

              <h1 className="store-title">
                Build your
                <span>cloud stack.</span>
              </h1>

              <p className="store-description">
                A small product storefront running through the
                CloudCart application stack — React frontend,
                API backend, database persistence, and Docker.
              </p>
            </div>

            <NavLink
              to="/cart"
              className="store-cart-link"
            >
              Cart
              <span>{totalItems}</span>
            </NavLink>
          </div>

          <div className="store-toolbar">
            <div className="store-search">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products..."
                aria-label="Search products"
              />
            </div>

            <div className="store-categories">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? 'store-category active'
                      : 'store-category'
                  }
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="store-products">
        <div className="store-container">
          <div className="store-results">
            <span>
              {loading
                ? 'Loading products'
                : `${filteredProducts.length} products`}
            </span>

            {!loading && (
              <span>
                {category === 'All' ? 'All categories' : category}
              </span>
            )}
          </div>

          {loading ? (
            <div className="store-state">
              <strong>Loading CloudCart products...</strong>
              <span>
                Requesting product data from the API.
              </span>
            </div>
          ) : error ? (
            <div className="store-state error">
              <strong>Unable to load products</strong>
              <span>{error}</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="store-state">
              <strong>No products found</strong>
              <span>
                Try another search term or category.
              </span>
            </div>
          ) : (
            <div className="store-grid">
              {filteredProducts.map((product) => (
                <article
                  className="store-product"
                  key={product.id}
                >
                  <div className="store-product-visual">
                    {product.badge && (
                      <div className="store-product-badge">
                        {product.badge}
                      </div>
                    )}

                    <div className="store-product-mark">
                      CC
                    </div>
                  </div>

                  <div className="store-product-content">
                    <div className="store-product-category">
                      {product.category}
                    </div>

                    <h2>{product.name}</h2>

                    <p>{product.description}</p>

                    <div className="store-product-footer">
                      <strong>
                        ₹{product.price.toLocaleString('en-IN')}
                      </strong>

                      <button
                        type="button"
                        className="store-add-button"
                        onClick={() => addToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="store-engineering">
        <div className="store-container">
          <div className="store-engineering-card">
            <div>
              <div className="store-kicker">
                ENGINEERING NOTE
              </div>

              <h2>
                This storefront is part of the CloudCart
                platform.
              </h2>

              <p>
                Products are requested from the backend API.
                Cart state is managed in React and checkout
                continues into the backend order workflow.
              </p>
            </div>

            <div className="store-flow">
              <div>
                <span>01</span>
                <strong>Store</strong>
                <small>Browse products</small>
              </div>

              <div className="store-flow-arrow">→</div>

              <div>
                <span>02</span>
                <strong>Cart</strong>
                <small>Review items</small>
              </div>

              <div className="store-flow-arrow">→</div>

              <div>
                <span>03</span>
                <strong>Order</strong>
                <small>Create order</small>
              </div>

              <div className="store-flow-arrow">→</div>

              <div>
                <span>04</span>
                <strong>Database</strong>
                <small>Persist order</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="store-navigation">
        <div className="store-container">
          <div className="store-navigation-links">
            <NavLink
              to="/overview"
              className="store-secondary-link"
            >
              ← Overview
            </NavLink>

            <NavLink
              to="/orders"
              className="store-primary-link"
            >
              Order Center →
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Store