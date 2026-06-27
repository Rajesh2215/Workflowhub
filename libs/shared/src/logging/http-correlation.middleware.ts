import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { contextStorage } from './context';

@Injectable()
export class HttpCorrelationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'x-correlation-id';
    let correlationId = req.headers[headerName];

    if (Array.isArray(correlationId)) {
      correlationId = correlationId[0];
    }

    if (!correlationId) {
      correlationId = randomUUID();
    }

    res.setHeader(headerName, correlationId);

    const store = new Map<string, any>();
    store.set('correlationId', correlationId);

    contextStorage.run(store, () => {
      next();
    });
  }
}
