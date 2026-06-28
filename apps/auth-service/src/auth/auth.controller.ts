import { Controller, Logger } from '@nestjs/common';
import { AuthServiceService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/shared';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  private readonly logger = new Logger(AuthServiceController.name);

  constructor(private readonly authService: AuthServiceService) { }

  @GrpcMethod('AuthService', 'Register')
  async grpcRegister(data: RegisterDto) {
    this.logger.log(`[gRPC] Registering user: ${data.email}`);
    const result = await this.authService.register(data);
    return {
      token: result.token,
      message: result.message,
      user: {
        id: result.user._id.toString(),
        name: result.user.name,
        email: result.user.email,
      },
    };
  }

  @GrpcMethod('AuthService', 'Login')
  async grpcLogin(data: LoginDto) {
    this.logger.log(`[gRPC] Log in user: ${data.email}`);
    const result = await this.authService.login(data);
    return {
      token: result.token,
      message: result.message,
    };
  }

  @GrpcMethod('AuthService', 'DeleteUser')
  async grpcDeleteUser(data: { userId: string }) {
    this.logger.log(`[gRPC] Deleting user: ${data.userId}`);
    const result = await this.authService.deleteUser(data.userId);
    return {
      message: result.message,
    };
  }
}
