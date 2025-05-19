import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequestDto } from '../dtos/register-user.dto';
import { User } from '../entities/user.entity';
import { UserAlreadyExistsException } from '../exceptions/auth.exception';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IPasswordHasher } from '../services/password-hasher.interface';
import {
  USER_REPOSITORY,
  PASSWORD_HASHER,
} from '../constants/injection-tokens';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(request: RegisterUserRequestDto): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await this.passwordHasher.hash(request.password);
    const user = User.create(request.email, hashedPassword);

    await this.userRepository.save(user);
  }
}
