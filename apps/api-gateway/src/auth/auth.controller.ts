import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { RegistrationSagaService } from './registration-saga.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
    private readonly registrationSagaService: RegistrationSagaService,
  ) { }

  @Post('register')
  register(@Body() body: any) {
    return this.authClient.send('auth.register', body).pipe(
      catchError((err) => {
        console.log('🚀 ~ AuthController ~ register ~ err:', err);
        throw new HttpException(
          err.message || 'Authentication failed',
          err.statusCode || 500,
        );
      }),
    );
  }

  // Use same api for Saga pattern
  @Post('login')
  login(@Body() body: any) {
    return this.authClient.send('auth.login', body).pipe(
      catchError((err) => {
        console.log('🚀 ~ AuthController ~ login ~ err:', err);
        throw new HttpException(
          err.message || 'Authentication failed',
          err.statusCode || 500,
        );
      }),
    );
  }

  @Post('register-saga')
  registerSaga(@Body() body: any) {
    return this.registrationSagaService.executeRegistrationSaga(body);
  }
}
