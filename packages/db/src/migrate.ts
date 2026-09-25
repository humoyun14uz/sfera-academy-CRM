import * as dotenv from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { Pool } = pg
dotenv.config({ path: process.env.ENV_FILE || '../../.env' })

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required')
  }

  console.log('🔄 Running database migrations...')

  const pool = new Pool({ connectionString })
  const db = drizzle(pool)

  await migrate(db, {
    migrationsFolder: join(__dirname, '../drizzle'),
  })

  await pool.end()

  console.log('✅ Migrations completed successfully')
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
