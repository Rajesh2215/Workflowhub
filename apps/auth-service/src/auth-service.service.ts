import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './schema/auth.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
  ) {}

  register(body) {
    return {
      message: 'Registered Successfully',
      body,
    };
  }

  login(body) {
    return {
      message: 'Login successful',
      token: '',
    };
  }
}
