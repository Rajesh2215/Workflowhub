import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "../schema/auth.schema";
import { AuthServiceService } from "./auth.service";
import { AuthJwtModule } from "../core/jwt.module";

@Module({
  imports: [
    AuthJwtModule,
    MongooseModule.forFeature([
      { name: Auth.name, schema: AuthSchema }
    ])
  ],
  providers: [AuthServiceService],
  exports: [AuthServiceService],
})
export class AuthModule {}