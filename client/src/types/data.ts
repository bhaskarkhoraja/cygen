export type User = {
  id: string
  email: string
  name: string
  createdAt: string
  updatedAt: string
}

export type Order = {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  orderItems: {
    id: string
    orderId: string
    productId: string
    quantity: number
    createdAt: string
    updatedAt: string
    product: Product
  }[]
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
}
