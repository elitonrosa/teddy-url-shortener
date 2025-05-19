import { User } from '../../core/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.password,
      entity.updatedAt,
      entity.createdAt,
    );
  }

  static toPersistence(domain: User): Partial<UserEntity> {
    return {
      id: domain.id,
      email: domain.email,
      password: domain.password,
      updatedAt: domain.updatedAt,
      createdAt: domain.createdAt,
    };
  }
}
