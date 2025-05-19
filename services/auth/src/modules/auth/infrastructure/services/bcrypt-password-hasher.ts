import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { IPasswordHasher } from '../../core/services/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  private static readonly saltRounds = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, BcryptPasswordHasher.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
