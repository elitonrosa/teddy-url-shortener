import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../core/entities/user.entity';
import { IUserRepository } from '../../core/repositories/user.repository.interface';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const userEntity = this.userRepository.create(
      UserMapper.toPersistence(user),
    );

    const savedUser = await this.userRepository.save(userEntity);
    return UserMapper.toDomain(savedUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.userRepository.save(
      UserMapper.toPersistence(user),
    );

    return UserMapper.toDomain(updatedUser);
  }
}
