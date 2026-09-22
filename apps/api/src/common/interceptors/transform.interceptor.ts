import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ApiResponseSuccess } from '@sfera/contracts'

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseSuccess<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiResponseSuccess<T>> {
    return next.handle().pipe(
      map((result) => {
        // If result already formatted with data and meta, pass through
        if (result && typeof result === 'object' && 'data' in result) {
          return result
        }

        return {
          data: result,
        }
      })
    )
  }
}

