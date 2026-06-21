export const QUEUES = {
  NOTIFY: {
    MAIN: 'notification_queue',
    RETRY: 'notification_queue_retry',
    DLQ: 'notification_queue_dlq',
  },
};

export const EXCHANGES = {
  NOTIFY: { name: 'notification.exchange', type: 'direct' },
  RETRY:  { name: 'retry.exchange',        type: 'direct' },
  DLQ:    { name: 'dlq.exchange',          type: 'direct' },
};
