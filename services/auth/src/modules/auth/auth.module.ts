import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Algorithm } from 'jsonwebtoken';

import { AuthController } from './adapters/controllers/auth.controller';
import { JwksController } from './adapters/controllers/jwks.controller';
import {
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
  USER_REPOSITORY,
} from './core/constants/injection-tokens';
import { LoginUserUseCase } from './core/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './core/use-cases/register-user.use-case';
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';
import { JwksService } from './infrastructure/services/jwks.service';
import { JwtTokenGenerator } from './infrastructure/services/jwt-token-generator';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        privateKey: configService.getOrThrow<string>('jwt.privateKey'),
        signOptions: {
          algorithm: configService.getOrThrow<Algorithm>('jwt.algorithm'),
          expiresIn: configService.getOrThrow<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, JwksController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_GENERATOR,
      useClass: JwtTokenGenerator,
    },
    JwksService,
    RegisterUserUseCase,
    LoginUserUseCase,
  ],
  exports: [USER_REPOSITORY],
})
export class AuthModule {}
