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
