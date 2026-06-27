import { ClientRMQ } from '@nestjs/microservices';
import { getCorrelationId } from './context';

export class CorrelationIdClientRmq extends ClientRMQ {
  protected publish(packet: any, callback: (packet: any) => any): any {
    const correlationId = getCorrelationId();
    if (correlationId) {
      if (packet.data && typeof packet.data === 'object') {
        packet.data = {
          ...packet.data,
          _metadata: {
            ...packet.data._metadata,
            correlationId,
          },
        };
      } else {
        packet.data = {
          payload: packet.data,
          _metadata: { correlationId },
        };
      }
    }
    return super.publish(packet, callback);
  }

  protected dispatchEvent(packet: any): Promise<any> {
    const correlationId = getCorrelationId();
    if (correlationId) {
      if (packet.data && typeof packet.data === 'object') {
        packet.data = {
          ...packet.data,
          _metadata: {
            ...packet.data._metadata,
            correlationId,
          },
        };
      } else {
        packet.data = {
          payload: packet.data,
          _metadata: { correlationId },
        };
      }
    }
    return super.dispatchEvent(packet);
  }
}

