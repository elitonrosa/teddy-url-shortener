import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';

import { ITokenGenerator } from '../../core/services/token-generator.interface';

@Injectable()
export class JwtTokenGenerator implements ITokenGenerator {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generate(payload: { userId: string; email: string }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      privateKey: this.configService.getOrThrow<string>('jwt.privateKey'),
      algorithm: this.configService.getOrThrow<Algorithm>('jwt.algorithm'),
      expiresIn: this.configService.getOrThrow<string>('jwt.expiresIn'),
    });
  }
}
