import { ConsoleLogger, Injectable } from '@nestjs/common';
import { getCorrelationId } from './context';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private getCorrelationIdPrefix(): string {
    const correlationId = getCorrelationId();
    return correlationId ? `[CorrelationID: ${correlationId}] ` : '';
  }

  log(message: any, context?: string) {
    super.log(`${this.getCorrelationIdPrefix()}${message}`, context);
  }

  error(message: any, stack?: string, context?: string) {
    super.error(`${this.getCorrelationIdPrefix()}${message}`, stack, context);
  }

  warn(message: any, context?: string) {
    super.warn(`${this.getCorrelationIdPrefix()}${message}`, context);
  }

  debug(message: any, context?: string) {
    super.debug(`${this.getCorrelationIdPrefix()}${message}`, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(`${this.getCorrelationIdPrefix()}${message}`, context);
  }
}
