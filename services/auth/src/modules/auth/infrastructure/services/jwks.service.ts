import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPublicKey } from 'crypto';
import { exportJWK } from 'jose';

@Injectable()
export class JwksService {
  private jwk: any;

  constructor(private readonly configService: ConfigService) {
    const publicKeyPem = this.configService.getOrThrow<string>('jwt.publicKey');
    const key = createPublicKey(publicKeyPem);

    exportJWK(key).then((jwk) => {
      this.jwk = {
        ...jwk,
        kid: 'auth-key-1',
        use: 'sig',
        alg: 'RS256',
      };
    });
  }

  async getJwks() {
    return {
      keys: [this.jwk],
    };
  }
}
