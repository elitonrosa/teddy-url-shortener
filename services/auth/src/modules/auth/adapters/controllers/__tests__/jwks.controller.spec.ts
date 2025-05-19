import { Test } from '@nestjs/testing';
import { JwksController } from '../jwks.controller';
import { JwksService } from '../../../infrastructure/services/jwks.service';

describe('JwksController', () => {
  let controller: JwksController;
  let jwksService: any;

  beforeEach(async () => {
    jwksService = {
      getJwks: jest.fn().mockResolvedValue({
        keys: [
          {
            kid: 'auth-key-1',
            kty: 'RSA',
            alg: 'RS256',
            use: 'sig',
            n: 'mock-n',
            e: 'mock-e',
          },
        ],
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [JwksController],
      providers: [
        {
          provide: JwksService,
          useValue: jwksService,
        },
      ],
    }).compile();

    controller = moduleRef.get<JwksController>(JwksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getJwks', () => {
    it('should return JWKS with correct structure', async () => {
      const expectedResponse = {
        keys: [
          {
            kid: 'auth-key-1',
            kty: 'RSA',
            alg: 'RS256',
            use: 'sig',
            n: 'mock-n',
            e: 'mock-e',
          },
        ],
      };

      const result = await controller.getJwks();

      expect(result).toEqual(expectedResponse);
      expect(jwksService.getJwks).toHaveBeenCalled();
    });

    it('should handle errors from JwksService', async () => {
      const error = new Error('JWKS service error');
      jwksService.getJwks.mockRejectedValueOnce(error);

      await expect(controller.getJwks()).rejects.toThrow('JWKS service error');
      expect(jwksService.getJwks).toHaveBeenCalled();
    });
  });
});
