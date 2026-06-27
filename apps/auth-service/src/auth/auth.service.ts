import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../schema/auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtServiceCustom } from '@app/auth';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,
    private jwtService: JwtServiceCustom,
  ) { }

  async register(body) {
    const { name, email, password } = body;

    const existingUser = await this.authModel.findOne({ email });
    if (existingUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.authModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });

    return {
      message: 'Registered Successfully',
      user,
      token,
    };
  }

  async login(body) {
    const { email, password } = body;
    const user = await this.authModel.findOne({ email });
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: 'User does not exists',
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }
    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });

    return {
      message: 'Login successful',
      token,
    };
  }

  async deleteUser(userId: string) {
    const user = await this.authModel.findByIdAndDelete(userId);
    if (!user) {
      throw new RpcException({
        statusCode: 404,
        message: `User with ID ${userId} not found for deletion`,
      });
    }
    return {
      message: 'User deleted successfully',
      user,
    }
  }
}
