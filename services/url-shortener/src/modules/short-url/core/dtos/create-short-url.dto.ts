export class CreateShortUrlRequestDto {
  originalUrl: string;
  userId?: string;

  constructor(originalUrl: string, userId?: string) {
    this.originalUrl = originalUrl;
    this.userId = userId;
  }
}

export class CreateShortUrlResponseDto {
  shortUrl: string;

  constructor(fullUrl: string) {
    this.shortUrl = fullUrl;
  }
}
