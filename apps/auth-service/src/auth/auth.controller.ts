import { Controller, Logger } from '@nestjs/common';
import { AuthServiceService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  private readonly logger = new Logger(AuthServiceController.name);

  constructor(private readonly authService: AuthServiceService) { }

  @MessagePattern('auth.register')
  register(body: RegisterDto) {
    this.logger.log(`Registering user with email: ${body.email}`);
    return this.authService.register(body);
  }

  @MessagePattern('auth.login')
  login(body: LoginDto) {
    return this.authService.login(body);
  }

  @MessagePattern('auth.deleteUser')
  deleteUser(data: { userId: string }) {
    return this.authService.deleteUser(data.userId);
  }
}
