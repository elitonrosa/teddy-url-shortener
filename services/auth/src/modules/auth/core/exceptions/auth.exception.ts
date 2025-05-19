export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('Invalid credentials');
    this.name = 'InvalidCredentialsException';
  }
}

export class UserNotFoundException extends AuthException {
  constructor() {
    super('User not found');
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends AuthException {
  constructor() {
    super('User already exists');
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidTokenException extends AuthException {
  constructor() {
    super('Invalid token');
    this.name = 'InvalidTokenException';
  }
}
