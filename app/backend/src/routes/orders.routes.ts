import { Router } from 'express'
import { z } from 'zod'
import type { RowDataPacket } from 'mysql2/promise'

import { products } from '../data/products'
import pool from '../config/database'

const router = Router()

type OrderRow = RowDataPacket & {
  id: string
  created_at: Date
  status: 'Processing'
  subtotal: number
  delivery_fee: number
  total: number
}

type OrderItemRow = RowDataPacket & {
  id: number
  order_id: string
  product_id: number
  product_name: string
  category: string
  price: number
  quantity: number
}

const orderItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
})

function generateOrderId() {
  const timestamp = Date.now().toString().slice(-8)

  return `CC-${new Date().getFullYear()}-${timestamp}`
}

router.post('/orders', async (req, res) => {
  const result = createOrderSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid order data',
      details: result.error.issues,
    })
  }

  const connection = await pool.getConnection()

  try {
    const orderItems = result.data.items

    const items: {
      id: number
      name: string
      category: string
      price: number
      quantity: number
    }[] = []

    for (const requestedItem of orderItems) {
      const product = products.find(
        (item) => item.id === requestedItem.id,
      )

      if (!product) {
        return res.status(400).json({
          error: `Product ${requestedItem.id} not found`,
        })
      }

      items.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: requestedItem.quantity,
      })
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    const deliveryFee = subtotal >= 2000 ? 0 : 99
    const total = subtotal + deliveryFee

    const orderId = generateOrderId()
    const createdAt = new Date()

    await connection.beginTransaction()

    await connection.execute(
      `
        INSERT INTO orders (
          id,
          created_at,
          status,
          subtotal,
          delivery_fee,
          total
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        orderId,
        createdAt,
        'Processing',
        subtotal,
        deliveryFee,
        total,
      ],
    )

    for (const item of items) {
      await connection.execute(
        `
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            category,
            price,
            quantity
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.id,
          item.name,
          item.category,
          item.price,
          item.quantity,
        ],
      )
    }

    await connection.commit()

    return res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        createdAt: createdAt.toISOString(),
        status: 'Processing',
        items,
        subtotal,
        deliveryFee,
        total,
      },
    })
  } catch (error) {
    await connection.rollback()

    console.error('Order creation failed:', error)

    return res.status(500).json({
      error: 'Unable to create order',
    })
  } finally {
    connection.release()
  }
})

router.get('/orders/:id', async (req, res) => {
  const orderId = req.params.id

  try {
    const [orderRows] = await pool.execute<OrderRow[]>(
      `
        SELECT
          id,
          created_at,
          status,
          subtotal,
          delivery_fee,
          total
        FROM orders
        WHERE id = ?
      `,
      [orderId],
    )

    if (orderRows.length === 0) {
      return res.status(404).json({
        error: 'Order not found',
      })
    }

    const orderRow = orderRows[0]

    const [itemRows] = await pool.execute<OrderItemRow[]>(
      `
        SELECT
          id,
          order_id,
          product_id,
          product_name,
          category,
          price,
          quantity
        FROM order_items
        WHERE order_id = ?
        ORDER BY id ASC
      `,
      [orderId],
    )

    const items = itemRows.map((item) => ({
      id: item.product_id,
      name: item.product_name,
      category: item.category,
      price: Number(item.price),
      quantity: item.quantity,
    }))

    return res.status(200).json({
      order: {
        id: orderRow.id,
        createdAt: new Date(
          orderRow.created_at,
        ).toISOString(),
        status: orderRow.status,
        items,
        subtotal: Number(orderRow.subtotal),
        deliveryFee: Number(orderRow.delivery_fee),
        total: Number(orderRow.total),
      },
    })
  } catch (error) {
    console.error('Order lookup failed:', error)

    return res.status(500).json({
      error: 'Unable to load order',
    })
  }
})

export default router