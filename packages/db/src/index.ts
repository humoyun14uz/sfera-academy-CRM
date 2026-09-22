import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema/index.js'
import * as dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

export * from './schema/index.js'

let pool: pg.Pool | null = null

export function getDbPool(): pg.Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      'postgresql://sfera_user:sfera_password@localhost:5432/sfera_academy_crm'
    pool = new Pool({ connectionString })
  }
  return pool
}

export function createDb(customPool?: pg.Pool) {
  const p = customPool || getDbPool()
  return drizzle(p, { schema })
}

export type DbClient = ReturnType<typeof createDb>

