import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { contextStorage } from './context';

@Injectable()
export class RpcCorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const data = rpcContext.getData();

    let correlationId: string | undefined;

    if (data && typeof data === 'object') {
      correlationId = data._metadata?.correlationId;
      if (!correlationId && data.payload !== undefined && data._metadata) {
        correlationId = data._metadata.correlationId;
      }
      
      // Clean up metadata to keep the payload clean for validation/handling
      try {
        delete data._metadata;
      } catch (e) {
        // Ignored if object is frozen/not configurable
      }
    }

    if (!correlationId) {
      const rmqContext = rpcContext.getContext();
      if (rmqContext && typeof rmqContext.getMessage === 'function') {
        const message = rmqContext.getMessage();
        correlationId = message?.properties?.headers?.['x-correlation-id'];
      }
    }

    if (!correlationId) {
      correlationId = randomUUID();
    }

    const store = new Map<string, any>();
    store.set('correlationId', correlationId);

    return new Observable((subscriber) => {
      contextStorage.run(store, () => {
        next.handle().subscribe(subscriber);
      });
    });
  }
}
