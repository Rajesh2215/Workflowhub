import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthServiceService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthServiceController {
  constructor(private readonly authService: AuthServiceService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  
}
