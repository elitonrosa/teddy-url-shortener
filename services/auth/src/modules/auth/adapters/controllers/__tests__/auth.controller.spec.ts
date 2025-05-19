import { Test } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { RegisterUserUseCase } from '../../../core/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../../core/use-cases/login-user.use-case';
import { RegisterUserDto } from '../../dtos/register-user.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { UserAlreadyExistsException } from '../../../core/exceptions/auth.exception';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUserUseCase: any;
  let loginUserUseCase: any;

  beforeEach(async () => {
    registerUserUseCase = {
      execute: jest.fn(),
    };

    loginUserUseCase = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: registerUserUseCase,
        },
        {
          provide: LoginUserUseCase,
          useValue: loginUserUseCase,
        },
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await controller.register(registerDto);

      expect(registerUserUseCase.execute).toHaveBeenCalledWith(registerDto);
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      registerUserUseCase.execute.mockRejectedValueOnce(
        new UserAlreadyExistsException(),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(registerUserUseCase.execute).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login successfully and return access token', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        accessToken: 'mock-token',
      };

      loginUserUseCase.execute.mockResolvedValueOnce(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(loginUserUseCase.execute).toHaveBeenCalledWith(loginDto);
    });

    it('should throw InvalidCredentialsException when credentials are invalid', async () => {
      const loginDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      loginUserUseCase.execute.mockRejectedValueOnce(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(loginUserUseCase.execute).toHaveBeenCalledWith(loginDto);
    });
  });
});
