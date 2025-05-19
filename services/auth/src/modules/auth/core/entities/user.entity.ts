import { v4 as uuidv4 } from 'uuid';

export class User {
  private readonly _id: string;
  private _email: string;
  private _password: string;
  private readonly _updatedAt: Date;
  private readonly _createdAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    updatedAt?: Date,
    createdAt?: Date,
  ) {
    this._id = id;
    this._email = email;
    this._password = password;
    this._updatedAt = updatedAt ?? new Date();
    this._createdAt = createdAt ?? new Date();
  }

  static create(email: string, password: string): User {
    return new User(uuidv4(), email, password);
  }

  static reconstitute(
    id: string,
    email: string,
    password: string,
    updatedAt: Date,
    createdAt: Date,
  ): User {
    return new User(id, email, password, updatedAt, createdAt);
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  updatePassword(newPassword: string): void {
    this._password = newPassword;
  }
}
