import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtServiceCustom } from "./jwt/jwt.service";
import { AuthJwtModule } from "./jwt.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth-service/.env',
    }),
    AuthJwtModule,
  ],
  providers: [JwtServiceCustom],
})
export class AuthConfigModule {}
