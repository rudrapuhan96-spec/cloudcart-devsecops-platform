import crypto from 'node:crypto'

import { Router, type NextFunction, type Request, type Response } from 'express'
import { z } from 'zod'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

import pool from '../config/database'
import { products } from '../data/products'
import { sendOrderConfirmation } from '../services/email'

const router = Router()

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  }),
  deliveryAddress: z.object({
    line1: z.string().trim().min(3).max(180),
    line2: z.string().trim().max(180).optional().default(''),
    city: z.string().trim().min(2).max(80),
    district: z.string().trim().min(2).max(80),
    state: z.string().trim().min(2).max(80),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
    latitude: z.number().gte(-90).lte(90).nullable().optional(),
    longitude: z.number().gte(-180).lte(180).nullable().optional(),
  }),
  paymentMethod: z.literal('Pay on Delivery').default('Pay on Delivery'),
})

type Product = (typeof products)[number]
type OrderRow = RowDataPacket & {
  id: string
  created_at: Date
  status: string
  customer_name: string
  phone: string
  email: string
  address_line1: string
  address_line2: string
  city: string
  district: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  expected_delivery_at: Date
}

type OrderItemRow = RowDataPacket & {
  order_id: string
  product_id: number
  product_name: string
  category: string
  price: number
  quantity: number
}

function makeOrderId(): string {
  const year = new Date().getFullYear()
  const suffix = Date.now().toString().slice(-8)
  const random = crypto.randomInt(10, 99)
  return `CC-${year}-${suffix}${random}`
}

function makeTrackingToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function formatAddress(address: z.infer<typeof orderSchema>['deliveryAddress']): string {
  return [address.line1, address.line2, address.city, address.district, address.state, address.pincode]
    .filter(Boolean)
    .join(', ')
}

router.post('/orders', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid order data', details: parsed.error.flatten() })
  }

  const { items, customer, deliveryAddress, paymentMethod } = parsed.data
  const orderId = makeOrderId()
  const trackingToken = makeTrackingToken()
  const trackingTokenHash = hashToken(trackingToken)
  const createdAt = new Date()
  const expectedDeliveryAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)

  const connection = await pool.getConnection()
  let normalizedItems: { product: Product; quantity: number }[] = []
  let subtotal = 0
  let deliveryFee = 0
  let total = 0

  try {
    normalizedItems = items.map((requestedItem) => {
      const product = (products as Product[]).find((entry) => entry.id === requestedItem.id)
      if (!product) {
        throw new Error(`Unknown product: ${requestedItem.id}`)
      }
      return { product, quantity: requestedItem.quantity }
    })

    subtotal = normalizedItems.reduce(
      (sum, entry) => sum + entry.product.price * entry.quantity,
      0,
    )
    deliveryFee = subtotal >= 2000 ? 0 : 99
    total = subtotal + deliveryFee

    await connection.beginTransaction()

    await connection.execute<ResultSetHeader>(
      `INSERT INTO orders (
        id, created_at, status,
        customer_name, phone, email,
        address_line1, address_line2, city, district, state, pincode,
        latitude, longitude,
        subtotal, delivery_fee, total,
        payment_method, payment_status,
        expected_delivery_at, tracking_token_hash
      ) VALUES (?, ?, 'Processing', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
      [
        orderId,
        createdAt,
        customer.name,
        customer.phone,
        customer.email,
        deliveryAddress.line1,
        deliveryAddress.line2 ?? '',
        deliveryAddress.city,
        deliveryAddress.district,
        deliveryAddress.state,
        deliveryAddress.pincode,
        deliveryAddress.latitude ?? null,
        deliveryAddress.longitude ?? null,
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        expectedDeliveryAt,
        trackingTokenHash,
      ],
    )

    for (const entry of normalizedItems) {
      await connection.execute<ResultSetHeader>(
        `INSERT INTO order_items
          (order_id, product_id, product_name, category, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          entry.product.id,
          entry.product.name,
          entry.product.category,
          entry.product.price,
          entry.quantity,
        ],
      )
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    const message = error instanceof Error ? error.message : 'Unable to create order'
    const status = message.startsWith('Unknown product:') ? 400 : 500
    return res.status(status).json({ error: message })
  } finally {
    connection.release()
  }

  const emailSent = await sendOrderConfirmation({
    orderId,
    customerName: customer.name,
    customerEmail: customer.email,
    createdAt: createdAt.toISOString(),
    expectedDeliveryAt: expectedDeliveryAt.toISOString(),
    total,
    items: normalizedItems.map((entry) => ({
      name: entry.product.name,
      quantity: entry.quantity,
      price: entry.product.price,
    })),
    address: formatAddress(deliveryAddress),
  })

  return res.status(201).json({
    order: {
      id: orderId,
      createdAt: createdAt.toISOString(),
      expectedDeliveryAt: expectedDeliveryAt.toISOString(),
      status: 'Processing',
      customer,
      deliveryAddress,
      paymentMethod,
      paymentStatus: 'Pending',
      items: normalizedItems.map((entry) => ({
        id: entry.product.id,
        name: entry.product.name,
        category: entry.product.category,
        price: entry.product.price,
        quantity: entry.quantity,
      })),
      subtotal,
      deliveryFee,
      total,
    },
    trackingToken,
    emailSent,
  })
})

router.get('/orders/:id', async (req, res) => {
  const token = req.header('x-order-token')
  if (!token) return res.status(401).json({ error: 'Order tracking token required' })

  try {
    const [rows] = await pool.query<OrderRow[]>(
      'SELECT * FROM orders WHERE id = ? LIMIT 1',
      [req.params.id],
    )
    const order = rows[0]
    if (!order || hashToken(token) !== order.tracking_token_hash) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const [items] = await pool.query<OrderItemRow[]>(
      'SELECT product_id, product_name, category, price, quantity FROM order_items WHERE order_id = ? ORDER BY id ASC',
      [order.id],
    )

    return res.json({
      order: {
        id: order.id,
        createdAt: new Date(order.created_at).toISOString(),
        expectedDeliveryAt: new Date(order.expected_delivery_at).toISOString(),
        status: order.status,
        customer: {
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
        },
        deliveryAddress: {
          line1: order.address_line1,
          line2: order.address_line2,
          city: order.city,
          district: order.district,
          state: order.state,
          pincode: order.pincode,
          latitude: order.latitude,
          longitude: order.longitude,
        },
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        items: items.map((item) => ({
          id: item.product_id,
          name: item.product_name,
          category: item.category,
          price: Number(item.price),
          quantity: item.quantity,
        })),
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.delivery_fee),
        total: Number(order.total),
      },
    })
  } catch (error) {
    console.error('Get order failed:', error)
    return res.status(500).json({ error: 'Unable to load order' })
  }
})

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const configuredKey = process.env.ADMIN_API_KEY
  const providedKey = req.header('x-admin-key')
  if (!configuredKey || !providedKey || providedKey !== configuredKey) {
    return res.status(401).json({ error: 'Admin authentication required' })
  }
  return next()
}

router.get('/admin/orders', requireAdmin, async (_req, res) => {
  try {
    const [orders] = await pool.query<OrderRow[]>(
      `SELECT id, created_at, status, customer_name, phone, email,
              address_line1, address_line2, city, district, state, pincode,
              latitude, longitude, subtotal, delivery_fee, total,
              payment_method, payment_status, expected_delivery_at
         FROM orders
        ORDER BY created_at DESC
        LIMIT 100`,
    )

    const [items] = await pool.query<OrderItemRow[]>(
      `SELECT order_id, product_id, product_name, category, price, quantity
         FROM order_items
        ORDER BY id ASC`,
    )

    const itemsByOrder = new Map<string, OrderItemRow[]>()
    for (const item of items) {
      const existing = itemsByOrder.get(item.order_id) ?? []
      existing.push(item)
      itemsByOrder.set(item.order_id, existing)
    }

    return res.json({
      orders: orders.map((order) => ({
        id: order.id,
        createdAt: new Date(order.created_at).toISOString(),
        expectedDeliveryAt: new Date(order.expected_delivery_at).toISOString(),
        status: order.status,
        customer: {
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
        },
        deliveryAddress: {
          line1: order.address_line1,
          line2: order.address_line2,
          city: order.city,
          district: order.district,
          state: order.state,
          pincode: order.pincode,
          latitude: order.latitude,
          longitude: order.longitude,
        },
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        items: (itemsByOrder.get(order.id) ?? []).map((item) => ({
          id: item.product_id,
          name: item.product_name,
          category: item.category,
          price: Number(item.price),
          quantity: item.quantity,
        })),
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.delivery_fee),
        total: Number(order.total),
      })),
    })
  } catch (error) {
    console.error('Admin orders failed:', error)
    return res.status(500).json({ error: 'Unable to load admin orders' })
  }
})

export default router

