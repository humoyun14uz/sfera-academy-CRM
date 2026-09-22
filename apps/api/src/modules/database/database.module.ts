import { Module, Global } from '@nestjs/common'
import { createDb, getDbPool } from '@sfera/db'

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE',
      useFactory: () => {
        return createDb()
      },
    },
    {
      provide: 'DB_POOL',
      useFactory: () => {
        return getDbPool()
      },
    },
  ],
  exports: ['DATABASE', 'DB_POOL'],
})
export class DatabaseModule {}

