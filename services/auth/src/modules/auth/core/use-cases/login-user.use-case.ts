import { Inject, Injectable } from '@nestjs/common';
import { InvalidCredentialsException } from '../exceptions/auth.exception';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IPasswordHasher } from '../services/password-hasher.interface';
import { ITokenGenerator } from '../services/token-generator.interface';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
} from '../dtos/login-user.dto';
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
  TOKEN_GENERATOR,
} from '../constants/injection-tokens';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
  ) {}

  async execute(request: LoginUserRequestDto): Promise<LoginUserResponseDto> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordHasher.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    const accessToken = await this.tokenGenerator.generate({
      userId: user.id,
      email: user.email,
    });

    return new LoginUserResponseDto(accessToken);
  }
}
