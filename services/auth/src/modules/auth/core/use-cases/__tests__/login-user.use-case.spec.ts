import { Test } from '@nestjs/testing';
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
} from '../../constants/injection-tokens';
import { LoginUserUseCase } from '../login-user.use-case';
import { InvalidCredentialsException } from '../../exceptions/auth.exception';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: any;
  let passwordHasher: any;
  let tokenGenerator: any;

  beforeEach(async () => {
    userRepository = {
      findByEmail: jest.fn(),
    };

    passwordHasher = {
      compare: jest.fn(),
    };

    tokenGenerator = {
      generate: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: PASSWORD_HASHER,
          useValue: passwordHasher,
        },
        {
          provide: TOKEN_GENERATOR,
          useValue: tokenGenerator,
        },
      ],
    }).compile();

    useCase = moduleRef.get<LoginUserUseCase>(LoginUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      email: request.email,
      password: 'hashed_password',
    };

    it('should throw InvalidCredentialsException when user not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(useCase.execute(request)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordHasher.compare).not.toHaveBeenCalled();
      expect(tokenGenerator.generate).not.toHaveBeenCalled();
    });

    it('should throw InvalidCredentialsException when password is invalid', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      passwordHasher.compare.mockResolvedValue(false);

      await expect(useCase.execute(request)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordHasher.compare).toHaveBeenCalledWith(
        request.password,
        mockUser.password,
      );
      expect(tokenGenerator.generate).not.toHaveBeenCalled();
    });

    it('should return access token when credentials are valid', async () => {
      const accessToken = 'valid_token';
      userRepository.findByEmail.mockResolvedValue(mockUser);
      passwordHasher.compare.mockResolvedValue(true);
      tokenGenerator.generate.mockResolvedValue(accessToken);

      const result = await useCase.execute(request);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordHasher.compare).toHaveBeenCalledWith(
        request.password,
        mockUser.password,
      );
      expect(tokenGenerator.generate).toHaveBeenCalledWith({
        userId: mockUser.id,
        email: mockUser.email,
      });
      expect(result.accessToken).toBe(accessToken);
    });
  });
});
