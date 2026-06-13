import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceCustom {
  constructor(private jwtService: JwtService) {}

  sign(payload: any) {
    return this.jwtService.sign(payload);
  }

  verify(token: string) {
    return this.jwtService.verify(token);
  }
}