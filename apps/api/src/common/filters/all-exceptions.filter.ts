import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { type ApiResponseError } from '@sfera/contracts'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code: ApiResponseError['error']['code'] = 'INTERNAL_SERVER_ERROR'
    let message = 'An unexpected internal error occurred'
    let details: Record<string, string[]> | undefined

    if (exception instanceof ZodError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      code = 'VALIDATION_ERROR'
      message = 'Request validation failed'
      details = {}
      for (const issue of exception.issues) {
        const path = issue.path.join('.') || 'root'
        if (!details[path]) details[path] = []
        details[path].push(issue.message)
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse()

      switch (status) {
        case HttpStatus.BAD_REQUEST:
          code = 'BAD_REQUEST'
          break
        case HttpStatus.UNAUTHORIZED:
          code = 'UNAUTHORIZED'
          break
        case HttpStatus.FORBIDDEN:
          code = 'FORBIDDEN'
          break
        case HttpStatus.NOT_FOUND:
          code = 'NOT_FOUND'
          break
        case HttpStatus.CONFLICT:
          code = 'CONFLICT'
          break
        case HttpStatus.UNPROCESSABLE_ENTITY:
          code = 'VALIDATION_ERROR'
          break
        case HttpStatus.TOO_MANY_REQUESTS:
          code = 'TOO_MANY_REQUESTS'
          break
        default:
          code = 'INTERNAL_SERVER_ERROR'
      }

      if (typeof res === 'string') {
        message = res
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as any
        message = anyRes.message || exception.message || 'Error'
        if (Array.isArray(anyRes.message)) {
          message = anyRes.message.join(', ')
        }
        if (anyRes.details) {
          details = anyRes.details
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled exception on ${request.method} ${request.url}: ${exception.message}`, exception.stack)
      message = exception.message
    }

    const payload: ApiResponseError = {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    }

    response.status(status).send(payload)
  }
}

