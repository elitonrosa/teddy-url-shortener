import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        publicKey: configService.getOrThrow<string>('jwt.publicKey'),
        algorithm: configService.getOrThrow<Algorithm>('jwt.algorithm'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
