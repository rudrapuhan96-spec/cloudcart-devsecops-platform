import type { Product } from '../types/product'

export const products: Product[] = [
  {
    id: 1,
    name: 'Cloud Hoodie',
    category: 'Apparel',
    price: 1499,
    description:
      'Premium everyday hoodie inspired by the CloudCart platform.',
    badge: 'Popular',
  },
  {
    id: 2,
    name: 'DevOps Backpack',
    category: 'Accessories',
    price: 1899,
    description:
      'A practical backpack for engineers, developers, and builders.',
  },
  {
    id: 3,
    name: 'Terminal Mug',
    category: 'Lifestyle',
    price: 699,
    description:
      'Minimal developer mug with a command-line inspired design.',
  },
  {
    id: 4,
    name: 'Kubernetes Tee',
    category: 'Apparel',
    price: 999,
    description:
      'Clean Kubernetes-inspired developer merchandise.',
    badge: 'New',
  },
  {
    id: 5,
    name: 'Cloud Sticker Pack',
    category: 'Accessories',
    price: 299,
    description:
      'A set of cloud and DevSecOps themed stickers.',
  },
  {
    id: 6,
    name: 'Engineer Desk Kit',
    category: 'Lifestyle',
    price: 1299,
    description:
      'A compact desk setup kit for engineering sessions.',
  },
]