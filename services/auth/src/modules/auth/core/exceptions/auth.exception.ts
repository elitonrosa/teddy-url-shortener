export class AuthException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor(message: string = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}

export class UserNotFoundException extends AuthException {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

export class UserAlreadyExistsException extends AuthException {
  constructor(message: string = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}

export class InvalidTokenException extends AuthException {
  constructor(message: string = 'Invalid token') {
    super(message);
    this.name = 'InvalidTokenException';
  }
}
