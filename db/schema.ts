// db/schema.ts
import { pgTable, text, integer, decimal, timestamp, boolean } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),       // 'mens', 'womens', 'electronics', 'gifts'
  occasion: text('occasion'),                  // 'casual', 'wedding', 'office', 'party'
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull().default(10),
  inStock: boolean('in_stock').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  items: text('items').notNull(),   // JSON stringified array
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('placed'),  // placed, shipped, delivered
  createdAt: timestamp('created_at').defaultNow(),
})