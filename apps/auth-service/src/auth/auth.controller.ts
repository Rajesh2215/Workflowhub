import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/shared';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) { }

  @MessagePattern('auth.register')
  register(body: RegisterDto) {
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
