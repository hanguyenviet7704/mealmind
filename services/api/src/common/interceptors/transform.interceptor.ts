import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown> | null;
  error: null;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has { data, meta, error } structure, pass through
        if (data && typeof data === 'object' && 'data' in data && 'error' in data) {
          return data;
        }

        // If data has { data, meta } structure (pagination)
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return {
            data: data.data,
            meta: data.meta,
            error: null,
          };
        }

        // Wrap raw data
        return {
          data,
          meta: null,
          error: null,
        };
      }),
    );
  }
}
