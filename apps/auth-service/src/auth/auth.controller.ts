import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @MessagePattern('auth.register')
  register(body: RegisterDto) {
    return this.authService.register(body);
  }
  
  @MessagePattern('auth.login')
  login(body: LoginDto) {
    return this.authService.login(body);
  }
  
}
