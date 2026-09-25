import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { WsAdapter } from '@nestjs/platform-ws'
import helmet from '@fastify/helmet'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import * as dotenv from 'dotenv'

dotenv.config({ path: process.env.ENV_FILE || '../../.env' })

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true })
  )
  app.useWebSocketAdapter(new WsAdapter(app))

  // 1. Secure Headers
  // NOTE: `helmet` (from @fastify/helmet) is typed against fastify@5.11.3 while
  // @nestjs/platform-fastify pulls fastify@5.12.5, so the plugin signature is
  // nominally incompatible. The cast is a dependency-version artefact only.
  await app.register(
    helmet as unknown as Parameters<NestFastifyApplication['register']>[0],
    {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
    }
  )

  // 2. CORS Allowlist
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // 3. Global Filters and Interceptors
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  // 4. OpenAPI / Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sfera Academy CRM API')
    .setDescription(
      [
        'Multi-tenant CRM API for Sfera IT Academy.',
        '',
        'Protected endpoints use Clerk bearer authentication. Click Authorize and enter a valid Clerk access token to try them from Swagger UI.',
        '',
        'Versioned CRUD endpoints use the /api/v1 prefix. Role workspaces currently use /manager, /teacher, /tasks, and /reports.',
        '',
        'Manager, Finance, and Teacher endpoint families are documented below. Finance routes use academy-scoped database operations; some manager, teacher, and report workspace methods in this repository remain demo/TODO implementations.',
      ].join('\n')
    )
    .setVersion('2.0.0')
    .addTag('Academies', 'Academy administration and lookup')
    .addTag('Authentication & Identity', 'Current-user profile and Clerk identity synchronization')
    .addTag('Audit Logs', 'Academy-scoped audit events')
    .addTag('Attendance', 'Lesson attendance sessions and records')
    .addTag('Courses', 'Course catalog management')
    .addTag('Enrollments', 'Student enrollment workflows')
    .addTag('Finance', 'Invoices, payments, refunds, and financial summaries')
    .addTag('Grades', 'Student grades and grade history')
    .addTag('Groups', 'Class groups, teacher assignments, and enrolled students')
    .addTag('Leads', 'CRM lead and application workflows')
    .addTag('Manager', 'Manager dashboard and operational summaries')
    .addTag('Reports', 'Attendance, finance, academic, and performance reports')
    .addTag('Students', 'Student profiles and academy roster')
    .addTag('Tasks', 'Task creation, assignment, and status management')
    .addTag('Teacher', 'Teacher workspace: groups, lessons, attendance, assignments, and grades')
    .setContact(
      'Sfera IT Academy',
      'https://github.com/humoyun14uz/sfera-academy-CRM',
      'humoyunergashev86@gmail.com'
    )
    .addServer(
      process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`,
      'Current API server'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk access token',
      }
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'none',
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
    },
  })

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  const host = process.env.HOST || '0.0.0.0'

  await app.listen(port, host)
  const logger = new Logger('Bootstrap')
  logger.log(`Sfera CRM API running on http://localhost:${port}`)
  logger.log(`Swagger documentation available at http://localhost:${port}/api/docs`)
}

bootstrap().catch((err: unknown) => {
  new Logger('Bootstrap').error(
    'Failed to start API',
    err instanceof Error ? err.stack : String(err)
  )
  process.exit(1)
})
