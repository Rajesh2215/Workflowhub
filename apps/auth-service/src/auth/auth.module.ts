import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "../schema/auth.schema";
import { AuthServiceService } from "./auth.service";
import { AuthJwtModule } from "@app/auth";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema }
    ]),
    AuthJwtModule
  ],
  providers: [AuthServiceService],
  exports: [AuthServiceService],
})
export class AuthModule {}