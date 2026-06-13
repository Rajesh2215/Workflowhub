import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authClient.send('auth.register', body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authClient.send('auth.login', body);
  }
}
