import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "../schema/auth.schema";
import { AuthServiceService } from "../auth-service.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema }
    ])
  ],
  providers: [AuthServiceService],
  exports: [AuthServiceService],
})
export class AuthModule {}