export class ShortUrlException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShortUrlException';
  }
}

export class ShortUrlCreationFailedException extends ShortUrlException {
  constructor(message: string = 'Failed to create short URL') {
    super(message);
    this.name = 'ShortUrlCreationFailedException';
  }
}

export class ShortUrlNotFoundException extends ShortUrlException {
  constructor(message: string = 'Short URL not found') {
    super(message);
    this.name = 'ShortUrlNotFoundException';
  }
}

export class ShortCodeCollisionException extends ShortUrlException {
  constructor(shortCode: string) {
    super(`Short code '${shortCode}' is already in use`);
    this.name = 'ShortCodeCollisionException';
  }
}

export class UnauthorizedDeleteException extends ShortUrlException {
  constructor(message: string = 'Unauthorized to delete this short URL') {
    super(message);
    this.name = 'UnauthorizedDeleteException';
  }
}

export class UnauthorizedUpdateException extends ShortUrlException {
  constructor(message: string = 'Unauthorized to update this short URL') {
    super(message);
    this.name = 'UnauthorizedUpdateException';
  }
}

export class UnauthorizedListException extends ShortUrlException {
  constructor(message: string = 'Unauthorized to list short URLs') {
    super(message);
    this.name = 'UnauthorizedListException';
  }
}

export class InvalidShortUrlException extends ShortUrlException {
  constructor(message: string = 'Invalid short URL') {
    super(message);
    this.name = 'InvalidShortUrlException';
  }
}
