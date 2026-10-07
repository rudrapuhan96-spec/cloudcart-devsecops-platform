import { Router } from 'express'

import { products } from '../data/products'

const router = Router()

router.get('/products', (_req, res) => {
  res.status(200).json({
    count: products.length,
    products,
  })
})

export default router