import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthServiceService {
  getHello(): string {
    return 'Hello World from auth!';
  }

  register(body){
    return {
      message: "Registered Successfully",
      body
    }
  }
  
  login(body){
    return {
      message: "Login successful",
      token: ""
    }
  }
}
