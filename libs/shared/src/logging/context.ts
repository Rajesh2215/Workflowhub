import { AsyncLocalStorage } from 'async_hooks';

export const contextStorage = new AsyncLocalStorage<Map<string, any>>();

export function getCorrelationId(): string | undefined {
  const store = contextStorage.getStore();
  return store?.get('correlationId');
}

export function setCorrelationId(id: string) {
  const store = contextStorage.getStore();
  store?.set('correlationId', id);
}

// Lazy load Metadata to avoid loading gRPC if not needed
export function getGrpcMetadata() {
  const { Metadata } = require('@grpc/grpc-js');
  const metadata = new Metadata();
  const correlationId = getCorrelationId();
  if (correlationId) {
    metadata.add('x-correlation-id', correlationId);
  }
  return metadata;
}
