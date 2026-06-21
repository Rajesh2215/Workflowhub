import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqplib, { Channel, ChannelModel } from 'amqplib';
import { QUEUES, EXCHANGES } from './rabbitmq.constants';

@Injectable()
export class RabbitmqSetupService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqSetupService.name);

  async onModuleInit() {
    await this.setupTopology();
  }

  private async setupTopology() {
    const rabbitmqUrl = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    try {
      this.logger.log(`Connecting to RabbitMQ at ${rabbitmqUrl} for topology setup...`);
      
      let connection: ChannelModel | null = null;
      let retries = 5;
      while (retries > 0) {
        try {
          connection = await amqplib.connect(rabbitmqUrl);
          break;
        } catch (err) {
          retries--;
          this.logger.warn(`Failed to connect to RabbitMQ, retrying in 5s... (${retries} attempts left)`);
          if (retries === 0) throw err;
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      if (!connection) {
        throw new Error('Connection could not be established');
      }

      const channel: Channel = await connection.createChannel();

      // ── 1. Declare Exchanges ──────────────────────────────────────────
      for (const ex of Object.values(EXCHANGES)) {
        await channel.assertExchange(ex.name, ex.type as any, { durable: true });
        this.logger.log(`Exchange ready: ${ex.name}`);
      }

      // ── 2. Declare Queue Triplets (main / retry / dlq) ────────────────
      for (const service of Object.values(QUEUES)) {
        const { MAIN, RETRY, DLQ } = service;

        // DLQ — terminal, no further routing
        await channel.assertQueue(DLQ, { durable: true });
        await channel.bindQueue(DLQ, EXCHANGES.DLQ.name, DLQ);
        this.logger.log(`DLQ queue ready: ${DLQ}`);

        // RETRY — holds message for N ms then republishes to main exchange
        await channel.assertQueue(RETRY, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': EXCHANGES.NOTIFY.name,  // route back to main exchange
            'x-dead-letter-routing-key': MAIN,
            'x-message-ttl': 15_000,                        // wait 15s before retry
          },
        });
        await channel.bindQueue(RETRY, EXCHANGES.RETRY.name, RETRY);
        this.logger.log(`Retry queue ready: ${RETRY}`);

        // MAIN — on failure goes to retry exchange
        await channel.assertQueue(MAIN, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': EXCHANGES.RETRY.name,
            'x-dead-letter-routing-key': RETRY,
          },
        });
        await channel.bindQueue(MAIN, EXCHANGES.NOTIFY.name, MAIN);

        this.logger.log(`Queue triplet ready: ${MAIN} → ${RETRY} → ${DLQ}`);
      }

      await channel.close();
      await connection.close();
      this.logger.log('RabbitMQ topology setup completed successfully.');
    } catch (error) {
      this.logger.error(`RabbitMQ topology setup failed: ${error.message}`, error.stack);
    }
  }
}
