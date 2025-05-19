import { Test } from '@nestjs/testing';
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
} from '../../constants/injection-tokens';
import { RegisterUserUseCase } from '../register-user.use-case';
import { UserAlreadyExistsException } from '../../exceptions/auth.exception';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userRepository: any;
  let passwordHasher: any;

  beforeEach(async () => {
    userRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterUserUseCase,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: PASSWORD_HASHER,
          useValue: passwordHasher,
        },
      ],
    }).compile();

    useCase = moduleRef.get<RegisterUserUseCase>(RegisterUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const request = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: request.email,
      });

      await expect(useCase.execute(request)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordHasher.hash).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashed_password';
      userRepository.findByEmail.mockResolvedValue(null);
      passwordHasher.hash.mockResolvedValue(hashedPassword);
      userRepository.save.mockImplementation((user) => Promise.resolve(user));

      await useCase.execute(request);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(request.email);
      expect(passwordHasher.hash).toHaveBeenCalledWith(request.password);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });
});
