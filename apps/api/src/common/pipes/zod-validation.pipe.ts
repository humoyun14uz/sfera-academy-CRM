import { type PipeTransform, Injectable, type ArgumentMetadata } from '@nestjs/common'
import { type ZodSchema } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    return this.schema.parse(value)
  }
}

