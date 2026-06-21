export function getRetryCount(headers: any, retryQueueName: string): number {
  const xDeath = headers?.['x-death'];
  if (Array.isArray(xDeath)) {
    const entry = xDeath.find((d: any) => d.queue === retryQueueName);
    return entry ? entry.count : 0;
  }
  return 0;
}
